import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { ErrorManagementService } from '@/lib/services/error-management.service'
import { CacheService } from '@/lib/services/cache.service'
import { AnalyticsService } from '@/lib/services/analytics.service'
import { ImageService } from '@/lib/services/image.service'
import { z } from 'zod'

// Validation schemas
const uploadRequestSchema = z.object({
  type: z.enum(['avatar', 'gallery', 'verification']),
  maxAttempts: z.number().min(1).max(5).optional(),
})

const multipartSchema = z.object({
  files: z.array(z.any()).min(1).max(15),
  metadata: z.string().optional(),
})

/**
 * API endpoint avancé pour les uploads avec gestion d'erreurs et cache
 * POST /api/upload/advanced
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Vérifier le health check de Redis
    const cacheHealthy = await CacheService.healthCheck()
    if (!cacheHealthy) {
      console.warn('[UploadAdvancedAPI] Redis non disponible - mode dégradé')
    }

    // Parser la requête multipart
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const type = formData.get('type') as string
    const maxAttempts = parseInt(formData.get('maxAttempts') as string) || 3

    // Validation des données
    const validatedRequest = uploadRequestSchema.parse({
      type,
      maxAttempts,
    })

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Valider les fichiers
    const validationErrors: string[] = []
    const maxFileSize = 20 * 1024 * 1024 // 20MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      if (file.size > maxFileSize) {
        validationErrors.push(`Fichier ${i + 1}: taille trop grande (max 20MB)`)
      }
      
      if (!allowedTypes.includes(file.type)) {
        validationErrors.push(`Fichier ${i + 1}: type non autorisé`)
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation échouée', details: validationErrors },
        { status: 400 }
      )
    }

    // Vérifier les limites utilisateur
    const userStats = await AnalyticsService.getUserUploadStats(userId)
    const storageLimit = userStats.storageUsage.limit
    const currentUsage = userStats.storageUsage.used
    const newFilesSize = files.reduce((sum, file) => sum + file.size, 0)

    if (currentUsage + newFilesSize > storageLimit) {
      return NextResponse.json(
        { 
          error: 'Limite de stockage dépassée',
          details: {
            current: currentUsage,
            limit: storageLimit,
            requested: newFilesSize,
          }
        },
        { status: 413 }
      )
    }

    // Vérifier le cache avant l'upload
    if (cacheHealthy) {
      const cachedImages = await CacheService.getUserImages(userId, validatedRequest.type)
      if (cachedImages && validatedRequest.type === 'avatar' && cachedImages.length > 0) {
        console.log('[UploadAdvancedAPI] Avatar existant trouvé dans le cache')
      }
    }

    // Exécuter l'upload sécurisé
    console.log(`[UploadAdvancedAPI] Début upload pour ${userId}: ${files.length} fichiers (${validatedRequest.type})`)
    
    const uploadResult = await ErrorManagementService.safeUpload({
      userId,
      type: validatedRequest.type,
      files,
      maxAttempts: validatedRequest.maxAttempts,
    })

    const processingTime = Date.now() - startTime

    // Enregistrer les métriques de performance
    await AnalyticsService.recordPerformanceMetric({
      operation: 'upload_advanced',
      duration: processingTime,
      success: uploadResult.success,
      userId,
    })

    // Mettre en cache les résultats si succès
    if (uploadResult.success && cacheHealthy) {
      const imageData = uploadResult.results.map(result => ({
        id: result.id,
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        type: result.type,
        position: result.position,
        isMain: result.isMain,
        optimizedUrls: {
          thumbnail: result.url.replace('/upload/', '/upload/c_thumb,w_150,h_150/'),
          medium: result.url.replace('/upload/', '/upload/c_fill,w_400,h_400/'),
          large: result.url.replace('/upload/', '/upload/c_fill,w_800,h_600/'),
          original: result.url,
        },
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString(),
      }))

      if (validatedRequest.type === 'avatar') {
        await CacheService.cacheUserAvatar(userId, imageData[0])
      } else {
        await CacheService.cacheUserImages(userId, imageData, validatedRequest.type)
      }
    }

    // Réponse de succès
    const response = {
      success: uploadResult.success,
      message: uploadResult.success 
        ? `${uploadResult.results.length} fichier(s) uploadé(s) avec succès`
        : 'Upload échoué',
      data: {
        images: uploadResult.results,
        transactionId: uploadResult.transactionId,
        processingTime,
        type: validatedRequest.type,
        userId,
      },
      errors: uploadResult.errors,
      metadata: {
        totalFiles: files.length,
        totalSize: newFilesSize,
        successCount: uploadResult.results.length,
        failureCount: uploadResult.errors.length,
      },
    }

    return NextResponse.json(response, { 
      status: uploadResult.success ? 200 : 207 // 207 Multi-Status pour succès partiels
    })

  } catch (error) {
    const processingTime = Date.now() - startTime
    
    console.error('[UploadAdvancedAPI] Erreur upload:', error)

    // Enregistrer l'erreur
    await AnalyticsService.recordPerformanceMetric({
      operation: 'upload_advanced',
      duration: processingTime,
      success: false,
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de l\'upload',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        processingTime,
      },
      { status: 500 }
    )
  }
}

/**
 * Obtenir les statistiques d'upload d'un utilisateur
 * GET /api/upload/advanced?stats=true
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = session.user.id

    if (searchParams.get('stats') === 'true') {
      // Retourner les statistiques utilisateur
      const stats = await AnalyticsService.getUserUploadStats(userId)
      
      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    if (searchParams.get('images') === 'true') {
      // Retourner les images avec cache
      const type = searchParams.get('type') as 'avatar' | 'gallery' | 'verification' | undefined
      
      let images
      const cacheHealthy = await CacheService.healthCheck()
      
      if (cacheHealthy) {
        images = await CacheService.getUserImages(userId, type)
        
        if (!images) {
          // Pas en cache, récupérer depuis la base
          images = await ImageService.getUserImages(userId, type)
          
          // Mettre en cache pour la prochaine fois
          if (images.length > 0) {
            const imageData = images.map(img => ({
              id: img.id,
              url: img.url,
              publicId: img.publicId,
              width: img.width,
              height: img.height,
              format: img.format,
              bytes: img.bytes,
              type: img.type,
              position: img.position,
              isMain: img.isMain,
              optimizedUrls: {
                thumbnail: img.url.replace('/upload/', '/upload/c_thumb,w_150,h_150/'),
                medium: img.url.replace('/upload/', '/upload/c_fill,w_400,h_400/'),
                large: img.url.replace('/upload/', '/upload/c_fill,w_800,h_600/'),
                original: img.url,
              },
              createdAt: img.createdAt.toISOString(),
              updatedAt: img.updatedAt.toISOString(),
            }))
            
            await CacheService.cacheUserImages(userId, imageData, type)
          }
        }
      } else {
        // Redis indisponible, utiliser la base directement
        images = await ImageService.getUserImages(userId, type)
      }

      return NextResponse.json({
        success: true,
        data: images,
        cached: cacheHealthy,
      })
    }

    if (searchParams.get('transaction')) {
      // Retourner le statut d'une transaction
      const transactionId = searchParams.get('transaction')!
      const status = ErrorManagementService.getTransactionStatus(transactionId)
      
      return NextResponse.json({
        success: true,
        data: status,
      })
    }

    return NextResponse.json(
      { error: 'Paramètre manquant' },
      { status: 400 }
    )

  } catch (error) {
    console.error('[UploadAdvancedAPI] Erreur GET:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

/**
 * Supprimer une image avec nettoyage complet
 * DELETE /api/upload/advanced
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')
    const userId = session.user.id

    if (!imageId) {
      return NextResponse.json(
        { error: 'ID d\'image manquant' },
        { status: 400 }
      )
    }

    // Supprimer l'image avec nettoyage complet
    const deleted = await ImageService.deleteImage(imageId, userId)
    
    if (deleted) {
      // Invalider le cache
      await CacheService.invalidateImageCache(imageId, userId)
      
      return NextResponse.json({
        success: true,
        message: 'Image supprimée avec succès',
      })
    } else {
      return NextResponse.json(
        { error: 'Image non trouvée ou non autorisée' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('[UploadAdvancedAPI] Erreur DELETE:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la suppression',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
} 