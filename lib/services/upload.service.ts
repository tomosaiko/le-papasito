import { v2 as cloudinary } from 'cloudinary'
import { z } from 'zod'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Types
interface UploadResult {
  url: string
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
}

interface UploadOptions {
  folder?: string
  transformation?: any[]
  width?: number
  height?: number
  crop?: string
  quality?: string | number
  format?: string
}

// Validation schemas
const uploadImageSchema = z.object({
  file: z.any(),
  folder: z.string().optional(),
  userId: z.string().cuid(),
  type: z.enum(['avatar', 'gallery', 'verification']),
})

const deleteImageSchema = z.object({
  publicId: z.string().min(1),
  userId: z.string().cuid(),
})

/**
 * Service d'upload d'images avec Cloudinary
 * Gère les avatars, galeries et documents de vérification
 */
export class UploadService {
  /**
   * Upload d'un avatar utilisateur
   */
  static async uploadAvatar(
    file: File | Buffer, 
    userId: string
  ): Promise<UploadResult> {
    try {
      const options: UploadOptions = {
        folder: `le-papasito/avatars/${userId}`,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto:good' },
          { format: 'webp' }
        ],
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto:good',
        format: 'webp'
      }

      const result = await this.uploadToCloudinary(file, options)
      
      console.log(`[UploadService] Avatar uploadé: ${result.secure_url} (${userId})`)
      
      return result
    } catch (error) {
      console.error('[UploadService] Erreur upload avatar:', error)
      throw new Error(`Erreur upload avatar: ${error}`)
    }
  }

  /**
   * Upload d'images pour galerie escort
   */
  static async uploadGalleryImage(
    file: File | Buffer, 
    userId: string, 
    index: number = 0
  ): Promise<UploadResult> {
    try {
      const options: UploadOptions = {
        folder: `le-papasito/gallery/${userId}`,
        transformation: [
          { width: 800, height: 600, crop: 'fill' },
          { quality: 'auto:good' },
          { format: 'webp' }
        ],
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto:good',
        format: 'webp'
      }

      const result = await this.uploadToCloudinary(file, options)
      
      console.log(`[UploadService] Image galerie uploadée: ${result.secure_url} (${userId}, index: ${index})`)
      
      return result
    } catch (error) {
      console.error('[UploadService] Erreur upload galerie:', error)
      throw new Error(`Erreur upload galerie: ${error}`)
    }
  }

  /**
   * Upload de documents de vérification
   */
  static async uploadVerificationDocument(
    file: File | Buffer, 
    userId: string, 
    documentType: string
  ): Promise<UploadResult> {
    try {
      const options: UploadOptions = {
        folder: `le-papasito/verification/${userId}`,
        transformation: [
          { width: 1200, height: 900, crop: 'limit' },
          { quality: 'auto:good' },
          { format: 'jpg' }
        ],
        quality: 'auto:good',
        format: 'jpg'
      }

      const result = await this.uploadToCloudinary(file, options)
      
      console.log(`[UploadService] Document vérification uploadé: ${result.secure_url} (${userId}, type: ${documentType})`)
      
      return result
    } catch (error) {
      console.error('[UploadService] Erreur upload vérification:', error)
      throw new Error(`Erreur upload vérification: ${error}`)
    }
  }

  /**
   * Upload multiple d'images
   */
  static async uploadMultipleImages(
    files: (File | Buffer)[], 
    userId: string, 
    type: 'gallery' | 'verification'
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        if (type === 'gallery') {
          return this.uploadGalleryImage(file, userId, index)
        } else {
          return this.uploadVerificationDocument(file, userId, `doc_${index}`)
        }
      })

      const results = await Promise.all(uploadPromises)
      
      console.log(`[UploadService] ${results.length} images uploadées pour ${userId}`)
      
      return results
    } catch (error) {
      console.error('[UploadService] Erreur upload multiple:', error)
      throw new Error(`Erreur upload multiple: ${error}`)
    }
  }

  /**
   * Supprimer une image de Cloudinary
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      
      console.log(`[UploadService] Image supprimée: ${publicId}`)
      
      return result.result === 'ok'
    } catch (error) {
      console.error('[UploadService] Erreur suppression:', error)
      throw new Error(`Erreur suppression: ${error}`)
    }
  }

  /**
   * Supprimer plusieurs images
   */
  static async deleteMultipleImages(publicIds: string[]): Promise<boolean[]> {
    try {
      const deletePromises = publicIds.map(publicId => this.deleteImage(publicId))
      const results = await Promise.all(deletePromises)
      
      console.log(`[UploadService] ${results.filter(r => r).length}/${publicIds.length} images supprimées`)
      
      return results
    } catch (error) {
      console.error('[UploadService] Erreur suppression multiple:', error)
      throw new Error(`Erreur suppression multiple: ${error}`)
    }
  }

  /**
   * Obtenir les URLs optimisées pour différentes tailles
   */
  static getOptimizedUrls(publicId: string): {
    thumbnail: string
    medium: string
    large: string
    original: string
  } {
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`
    
    return {
      thumbnail: `${baseUrl}/w_150,h_150,c_fill,f_webp,q_auto:good/${publicId}`,
      medium: `${baseUrl}/w_400,h_300,c_fill,f_webp,q_auto:good/${publicId}`,
      large: `${baseUrl}/w_800,h_600,c_fill,f_webp,q_auto:good/${publicId}`,
      original: `${baseUrl}/f_webp,q_auto:good/${publicId}`
    }
  }

  /**
   * Valider le type de fichier
   */
  static validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non supporté. Utilisez JPEG, PNG ou WebP.')
    }
    
    if (file.size > maxSize) {
      throw new Error('Fichier trop volumineux. Maximum 10MB.')
    }
    
    return true
  }

  /**
   * Convertir File en Buffer pour upload
   */
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Upload vers Cloudinary (méthode privée)
   */
  private static async uploadToCloudinary(
    file: File | Buffer, 
    options: UploadOptions
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        ...options,
        resource_type: 'image' as const,
        use_filename: false,
        unique_filename: true,
      }

      if (file instanceof File) {
        // Upload depuis File
        this.fileToBuffer(file).then(buffer => {
          cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result as UploadResult)
              }
            }
          ).end(buffer)
        })
      } else {
        // Upload depuis Buffer
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result as UploadResult)
            }
          }
        ).end(file)
      }
    })
  }

  /**
   * Obtenir les informations d'une image
   */
  static async getImageInfo(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId)
      return {
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at,
      }
    } catch (error) {
      console.error('[UploadService] Erreur info image:', error)
      throw new Error(`Erreur info image: ${error}`)
    }
  }

  /**
   * Lister les images d'un dossier
   */
  static async listUserImages(userId: string, type: 'avatar' | 'gallery' | 'verification') {
    try {
      const folder = `le-papasito/${type}/${userId}`
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 50
      })
      
      return result.resources.map((resource: any) => ({
        public_id: resource.public_id,
        url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        created_at: resource.created_at,
      }))
    } catch (error) {
      console.error('[UploadService] Erreur liste images:', error)
      throw new Error(`Erreur liste images: ${error}`)
    }
  }

  /**
   * Statistiques d'utilisation
   */
  static async getUsageStats() {
    try {
      const usage = await cloudinary.api.usage()
      return {
        credits_used: usage.credits_used,
        credits_limit: usage.credits_limit,
        transformations: usage.transformations,
        objects: usage.objects,
        bandwidth: usage.bandwidth,
        storage: usage.storage,
      }
    } catch (error) {
      console.error('[UploadService] Erreur stats:', error)
      throw new Error(`Erreur stats: ${error}`)
    }
  }
}

export default UploadService 