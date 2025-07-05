import { prisma } from '@/lib/db'
import { UploadService } from './upload.service'
import { CacheService } from './cache.service'
import { AnalyticsService } from './analytics.service'
import { z } from 'zod'

// Types pour la gestion d'erreurs
interface UploadTransaction {
  id: string
  userId: string
  type: 'avatar' | 'gallery' | 'verification'
  files: Array<{
    originalFile: File | Buffer
    cloudinaryResult?: any
    dbRecord?: any
    status: 'pending' | 'uploaded' | 'saved' | 'failed'
    error?: string
  }>
  status: 'pending' | 'completed' | 'failed' | 'rolledback'
  startTime: number
  endTime?: number
  attempts: number
  maxAttempts: number
}

interface ErrorContext {
  operation: string
  userId?: string
  fileId?: string
  error: Error
  timestamp: number
  metadata?: Record<string, any>
}

interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffMultiplier: number
}

// Validation schemas
const transactionSchema = z.object({
  userId: z.string().cuid(),
  type: z.enum(['avatar', 'gallery', 'verification']),
  files: z.array(z.any()).min(1),
  maxAttempts: z.number().min(1).max(5).default(3),
})

const errorContextSchema = z.object({
  operation: z.string(),
  userId: z.string().cuid().optional(),
  fileId: z.string().optional(),
  error: z.any(),
  metadata: z.record(z.any()).optional(),
})

/**
 * Service de gestion d'erreurs avancé avec rollback automatique
 * Assure la cohérence des données et la fiabilité des uploads
 */
export class ErrorManagementService {
  private static transactions = new Map<string, UploadTransaction>()
  private static readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
  }

  /**
   * Démarrer une transaction d'upload sécurisée
   */
  static async startUploadTransaction(data: {
    userId: string
    type: 'avatar' | 'gallery' | 'verification'
    files: Array<File | Buffer>
    maxAttempts?: number
  }): Promise<string> {
    try {
      const validatedData = transactionSchema.parse(data)
      
      const transactionId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const transaction: UploadTransaction = {
        id: transactionId,
        userId: validatedData.userId,
        type: validatedData.type,
        files: validatedData.files.map(file => ({
          originalFile: file,
          status: 'pending',
        })),
        status: 'pending',
        startTime: Date.now(),
        attempts: 0,
        maxAttempts: validatedData.maxAttempts,
      }

      this.transactions.set(transactionId, transaction)
      
      console.log(`[ErrorManagementService] Transaction démarrée: ${transactionId}`)
      
      return transactionId
    } catch (error) {
      console.error('[ErrorManagementService] Erreur création transaction:', error)
      throw new Error(`Erreur création transaction: ${error}`)
    }
  }

  /**
   * Exécuter une transaction d'upload avec gestion d'erreurs
   */
  static async executeUploadTransaction(transactionId: string): Promise<{
    success: boolean
    results: any[]
    errors: string[]
  }> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error(`Transaction non trouvée: ${transactionId}`)
    }

    const results: any[] = []
    const errors: string[] = []

    try {
      transaction.attempts++
      
      console.log(`[ErrorManagementService] Exécution transaction ${transactionId} (tentative ${transaction.attempts})`)

      // Phase 1: Upload vers Cloudinary
      for (let i = 0; i < transaction.files.length; i++) {
        const fileData = transaction.files[i]
        
        try {
          console.log(`[ErrorManagementService] Upload fichier ${i + 1}/${transaction.files.length}`)
          
          let uploadResult
          const startTime = Date.now()
          
          if (transaction.type === 'avatar') {
            uploadResult = await UploadService.uploadAvatar(fileData.originalFile, transaction.userId)
          } else if (transaction.type === 'gallery') {
            uploadResult = await UploadService.uploadGalleryImage(fileData.originalFile, transaction.userId, i)
          } else {
            uploadResult = await UploadService.uploadVerificationDocument(fileData.originalFile, transaction.userId, `doc_${i}`)
          }

          const uploadTime = Date.now() - startTime
          
          fileData.cloudinaryResult = uploadResult
          fileData.status = 'uploaded'
          
          // Enregistrer les métriques
          await AnalyticsService.recordUploadEvent({
            userId: transaction.userId,
            type: transaction.type,
            size: uploadResult.bytes,
            format: uploadResult.format,
            uploadTime,
            success: true,
          })
          
          console.log(`[ErrorManagementService] Fichier ${i + 1} uploadé avec succès`)
          
        } catch (error) {
          console.error(`[ErrorManagementService] Erreur upload fichier ${i + 1}:`, error)
          
          fileData.status = 'failed'
          fileData.error = error instanceof Error ? error.message : 'Erreur inconnue'
          errors.push(`Fichier ${i + 1}: ${fileData.error}`)
          
          // Enregistrer l'erreur
          await this.recordError({
            operation: `upload_${transaction.type}`,
            userId: transaction.userId,
            error: error instanceof Error ? error : new Error('Erreur inconnue'),
            timestamp: Date.now(),
            metadata: {
              transactionId,
              fileIndex: i,
              attempt: transaction.attempts,
            },
          })
        }
      }

      // Phase 2: Sauvegarde en base de données
      const uploadedFiles = transaction.files.filter(file => file.status === 'uploaded')
      
      for (const fileData of uploadedFiles) {
        try {
          if (fileData.cloudinaryResult) {
            const { ImageService } = await import('./image.service')
            
            const dbRecord = await ImageService.saveImage({
              userId: transaction.userId,
              type: transaction.type,
              url: fileData.cloudinaryResult.secure_url,
              publicId: fileData.cloudinaryResult.public_id,
              width: fileData.cloudinaryResult.width,
              height: fileData.cloudinaryResult.height,
              format: fileData.cloudinaryResult.format,
              bytes: fileData.cloudinaryResult.bytes,
            })
            
            fileData.dbRecord = dbRecord
            fileData.status = 'saved'
            results.push(dbRecord)
            
            console.log(`[ErrorManagementService] Fichier sauvegardé en base: ${dbRecord.id}`)
          }
        } catch (error) {
          console.error(`[ErrorManagementService] Erreur sauvegarde base:`, error)
          
          fileData.status = 'failed'
          fileData.error = error instanceof Error ? error.message : 'Erreur sauvegarde base'
          errors.push(`Sauvegarde base: ${fileData.error}`)
          
          // Rollback Cloudinary si la sauvegarde échoue
          if (fileData.cloudinaryResult) {
            await this.rollbackCloudinaryUpload(fileData.cloudinaryResult.public_id)
          }
        }
      }

      // Vérifier le succès global
      const successCount = transaction.files.filter(file => file.status === 'saved').length
      const success = successCount > 0 && errors.length === 0

      if (success) {
        transaction.status = 'completed'
        transaction.endTime = Date.now()
        
        // Invalider le cache utilisateur
        await CacheService.invalidateUserCache(transaction.userId)
        
        console.log(`[ErrorManagementService] Transaction terminée avec succès: ${transactionId}`)
      } else {
        // Retry si possible
        if (transaction.attempts < transaction.maxAttempts && errors.length > 0) {
          console.log(`[ErrorManagementService] Retry transaction ${transactionId}`)
          
          // Nettoyer les uploads partiels
          await this.rollbackTransaction(transactionId)
          
          // Attendre avant le retry
          await this.delay(this.calculateRetryDelay(transaction.attempts))
          
          return this.executeUploadTransaction(transactionId)
        } else {
          transaction.status = 'failed'
          transaction.endTime = Date.now()
          
          // Rollback complet
          await this.rollbackTransaction(transactionId)
        }
      }

      return {
        success,
        results,
        errors,
      }
    } catch (error) {
      console.error('[ErrorManagementService] Erreur exécution transaction:', error)
      
      transaction.status = 'failed'
      transaction.endTime = Date.now()
      
      await this.rollbackTransaction(transactionId)
      
      throw error
    }
  }

  /**
   * Rollback complet d'une transaction
   */
  static async rollbackTransaction(transactionId: string): Promise<void> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      console.warn(`[ErrorManagementService] Transaction non trouvée pour rollback: ${transactionId}`)
      return
    }

    try {
      console.log(`[ErrorManagementService] Rollback transaction: ${transactionId}`)
      
      // Supprimer les images de Cloudinary
      for (const fileData of transaction.files) {
        if (fileData.cloudinaryResult) {
          await this.rollbackCloudinaryUpload(fileData.cloudinaryResult.public_id)
        }
      }

      // Supprimer les entrées de la base de données
      for (const fileData of transaction.files) {
        if (fileData.dbRecord) {
          await this.rollbackDatabaseRecord(fileData.dbRecord.id)
        }
      }

      // Invalider le cache
      await CacheService.invalidateUserCache(transaction.userId)
      
      transaction.status = 'rolledback'
      
      console.log(`[ErrorManagementService] Rollback terminé: ${transactionId}`)
    } catch (error) {
      console.error(`[ErrorManagementService] Erreur rollback:`, error)
      
      // Enregistrer l'erreur de rollback
      await this.recordError({
        operation: 'rollback_transaction',
        userId: transaction.userId,
        error: error instanceof Error ? error : new Error('Erreur rollback'),
        timestamp: Date.now(),
        metadata: { transactionId },
      })
    }
  }

  /**
   * Rollback d'un upload Cloudinary
   */
  private static async rollbackCloudinaryUpload(publicId: string): Promise<void> {
    try {
      const deleted = await UploadService.deleteImage(publicId)
      if (deleted) {
        console.log(`[ErrorManagementService] Image Cloudinary supprimée: ${publicId}`)
      }
    } catch (error) {
      console.error(`[ErrorManagementService] Erreur suppression Cloudinary:`, error)
    }
  }

  /**
   * Rollback d'un enregistrement en base
   */
  private static async rollbackDatabaseRecord(imageId: string): Promise<void> {
    try {
      await prisma.image.delete({
        where: { id: imageId },
      })
      console.log(`[ErrorManagementService] Enregistrement supprimé: ${imageId}`)
    } catch (error) {
      console.error(`[ErrorManagementService] Erreur suppression base:`, error)
    }
  }

  /**
   * Enregistrer une erreur pour monitoring
   */
  static async recordError(context: ErrorContext): Promise<void> {
    try {
      errorContextSchema.parse(context)
      
      const redis = await import('./cache.service').then(m => m.redis)
      
      // Enregistrer l'erreur dans Redis
      const errorKey = `errors:${context.operation}:${new Date().toISOString().split('T')[0]}`
      await redis.incr(errorKey)
      await redis.expire(errorKey, 86400) // 24 heures
      
      // Enregistrer les détails de l'erreur
      const errorDetailKey = `error_details:${Date.now()}`
      await redis.setex(errorDetailKey, 3600, JSON.stringify({
        ...context,
        timestamp: Date.now(),
        message: context.error.message,
        stack: context.error.stack,
      }))
      
      console.log(`[ErrorManagementService] Erreur enregistrée: ${context.operation}`)
    } catch (error) {
      console.error('[ErrorManagementService] Erreur enregistrement erreur:', error)
    }
  }

  /**
   * Obtenir les statistiques d'erreurs
   */
  static async getErrorStats(): Promise<{
    totalErrors: number
    errorsByType: Record<string, number>
    errorsByDay: Array<{ date: string; count: number }>
    topErrors: Array<{ operation: string; count: number }>
  }> {
    try {
      const redis = await import('./cache.service').then(m => m.redis)
      
      const errorKeys = await redis.keys('errors:*')
      const errorsByType: Record<string, number> = {}
      let totalErrors = 0
      
      for (const key of errorKeys) {
        const count = await redis.get(key)
        const operation = key.split(':')[1]
        const errorCount = parseInt(count || '0')
        
        errorsByType[operation] = (errorsByType[operation] || 0) + errorCount
        totalErrors += errorCount
      }
      
      const topErrors = Object.entries(errorsByType)
        .map(([operation, count]) => ({ operation, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
      
      const errorsByDay = await this.calculateErrorsByDay()
      
      return {
        totalErrors,
        errorsByType,
        errorsByDay,
        topErrors,
      }
    } catch (error) {
      console.error('[ErrorManagementService] Erreur stats erreurs:', error)
      return {
        totalErrors: 0,
        errorsByType: {},
        errorsByDay: [],
        topErrors: [],
      }
    }
  }

  /**
   * Nettoyer les transactions terminées
   */
  static async cleanup(): Promise<void> {
    try {
      const now = Date.now()
      const maxAge = 24 * 60 * 60 * 1000 // 24 heures
      
      for (const [transactionId, transaction] of this.transactions) {
        if (transaction.endTime && (now - transaction.endTime) > maxAge) {
          this.transactions.delete(transactionId)
          console.log(`[ErrorManagementService] Transaction nettoyée: ${transactionId}`)
        }
      }
    } catch (error) {
      console.error('[ErrorManagementService] Erreur nettoyage:', error)
    }
  }

  /**
   * Obtenir le statut d'une transaction
   */
  static getTransactionStatus(transactionId: string): UploadTransaction | null {
    return this.transactions.get(transactionId) || null
  }

  /**
   * Calculer le délai de retry avec backoff exponentiel
   */
  private static calculateRetryDelay(attempt: number): number {
    const { baseDelay, maxDelay, backoffMultiplier } = this.DEFAULT_RETRY_CONFIG
    const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay)
    return delay + Math.random() * 1000 // Ajouter du jitter
  }

  /**
   * Fonction utilitaire pour attendre
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Calculer les erreurs par jour
   */
  private static async calculateErrorsByDay(): Promise<Array<{ date: string; count: number }>> {
    const redis = await import('./cache.service').then(m => m.redis)
    
    const last7Days = new Array(7).fill(0).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split('T')[0],
        count: 0,
      }
    })

    for (const day of last7Days) {
      const keys = await redis.keys(`errors:*:${day.date}`)
      for (const key of keys) {
        const count = await redis.get(key)
        day.count += parseInt(count || '0')
      }
    }

    return last7Days.reverse()
  }

  /**
   * Méthode d'upload sécurisée avec gestion d'erreurs automatique
   */
  static async safeUpload(data: {
    userId: string
    type: 'avatar' | 'gallery' | 'verification'
    files: Array<File | Buffer>
    maxAttempts?: number
  }): Promise<{
    success: boolean
    results: any[]
    errors: string[]
    transactionId: string
  }> {
    const transactionId = await this.startUploadTransaction(data)
    
    try {
      const result = await this.executeUploadTransaction(transactionId)
      
      return {
        ...result,
        transactionId,
      }
    } catch (error) {
      return {
        success: false,
        results: [],
        errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
        transactionId,
      }
    }
  }
}

export type { UploadTransaction, ErrorContext, RetryConfig } 