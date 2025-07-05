import { prisma } from '@/lib/db'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { UploadService } from './upload.service'

// Types d'images
export type ImageType = 'avatar' | 'gallery' | 'verification'

// Schémas de validation
const saveImageSchema = z.object({
  userId: z.string().cuid(),
  type: z.enum(['avatar', 'gallery', 'verification']),
  url: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().positive(),
  height: z.number().positive(),
  format: z.string(),
  bytes: z.number().positive(),
  position: z.number().optional(),
  isMain: z.boolean().optional(),
})

const deleteImageSchema = z.object({
  imageId: z.string().cuid(),
  userId: z.string().cuid(),
})

/**
 * Service de gestion des images en base de données
 * Synchronise avec Cloudinary et gère les références
 */
export class ImageService {
  /**
   * Sauvegarder une image en base
   */
  static async saveImage(data: {
    userId: string
    type: ImageType
    url: string
    publicId: string
    width: number
    height: number
    format: string
    bytes: number
    position?: number
    isMain?: boolean
  }) {
    try {
      // Validation
      const validatedData = saveImageSchema.parse(data)
      
      // Vérifier que l'utilisateur existe
      const user = await AuthService.getUserById(validatedData.userId)
      if (!user) {
        throw new Error('Utilisateur non trouvé')
      }

      // Si c'est un avatar, supprimer l'ancien
      if (validatedData.type === 'avatar') {
        await this.deleteUserImages(validatedData.userId, 'avatar')
      }

      // Créer l'entrée en base
      const image = await prisma.image.create({
        data: {
          userId: validatedData.userId,
          type: validatedData.type,
          url: validatedData.url,
          publicId: validatedData.publicId,
          width: validatedData.width,
          height: validatedData.height,
          format: validatedData.format,
          bytes: validatedData.bytes,
          position: validatedData.position || 0,
          isMain: validatedData.isMain || false,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        }
      })

      // Mettre à jour l'avatar de l'utilisateur si nécessaire
      if (validatedData.type === 'avatar') {
        await prisma.user.update({
          where: { id: validatedData.userId },
          data: { avatar: validatedData.url }
        })
      }

      console.log(`[ImageService] Image sauvegardée: ${image.id} (${validatedData.type})`)
      
      return image
    } catch (error) {
      console.error('[ImageService] Erreur sauvegarde image:', error)
      throw new Error(`Erreur sauvegarde image: ${error}`)
    }
  }

  /**
   * Obtenir les images d'un utilisateur
   */
  static async getUserImages(userId: string, type?: ImageType) {
    try {
      const where: any = { userId }
      if (type) {
        where.type = type
      }

      const images = await prisma.image.findMany({
        where,
        orderBy: [
          { type: 'asc' },
          { position: 'asc' },
          { createdAt: 'asc' }
        ],
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        }
      })

      return images
    } catch (error) {
      console.error('[ImageService] Erreur récupération images:', error)
      throw new Error(`Erreur récupération images: ${error}`)
    }
  }

  /**
   * Obtenir les images de galerie d'un utilisateur
   */
  static async getUserGallery(userId: string) {
    try {
      const images = await prisma.image.findMany({
        where: { 
          userId,
          type: 'gallery'
        },
        orderBy: [
          { position: 'asc' },
          { createdAt: 'asc' }
        ]
      })

      return images.map(image => ({
        id: image.id,
        url: image.url,
        publicId: image.publicId,
        width: image.width,
        height: image.height,
        position: image.position,
        isMain: image.isMain,
        createdAt: image.createdAt,
        // URLs optimisées
        ...UploadService.getOptimizedUrls(image.publicId)
      }))
    } catch (error) {
      console.error('[ImageService] Erreur récupération galerie:', error)
      throw new Error(`Erreur récupération galerie: ${error}`)
    }
  }

  /**
   * Obtenir l'avatar d'un utilisateur
   */
  static async getUserAvatar(userId: string) {
    try {
      const avatar = await prisma.image.findFirst({
        where: { 
          userId,
          type: 'avatar'
        },
        orderBy: { createdAt: 'desc' }
      })

      if (!avatar) {
        return null
      }

      return {
        id: avatar.id,
        url: avatar.url,
        publicId: avatar.publicId,
        width: avatar.width,
        height: avatar.height,
        createdAt: avatar.createdAt,
        // URLs optimisées
        ...UploadService.getOptimizedUrls(avatar.publicId)
      }
    } catch (error) {
      console.error('[ImageService] Erreur récupération avatar:', error)
      throw new Error(`Erreur récupération avatar: ${error}`)
    }
  }

  /**
   * Supprimer une image
   */
  static async deleteImage(imageId: string, userId: string) {
    try {
      // Validation
      const validatedData = deleteImageSchema.parse({ imageId, userId })
      
      // Récupérer l'image
      const image = await prisma.image.findUnique({
        where: { id: validatedData.imageId },
        include: { user: true }
      })

      if (!image) {
        throw new Error('Image non trouvée')
      }

      // Vérifier que l'utilisateur est propriétaire
      if (image.userId !== validatedData.userId) {
        throw new Error('Accès non autorisé')
      }

      // Supprimer de Cloudinary
      await UploadService.deleteImage(image.publicId)

      // Supprimer de la base
      await prisma.image.delete({
        where: { id: validatedData.imageId }
      })

      // Si c'était l'avatar, mettre à jour l'utilisateur
      if (image.type === 'avatar') {
        await prisma.user.update({
          where: { id: validatedData.userId },
          data: { avatar: null }
        })
      }

      console.log(`[ImageService] Image supprimée: ${imageId}`)
      
      return true
    } catch (error) {
      console.error('[ImageService] Erreur suppression image:', error)
      throw new Error(`Erreur suppression image: ${error}`)
    }
  }

  /**
   * Supprimer toutes les images d'un utilisateur d'un type donné
   */
  static async deleteUserImages(userId: string, type: ImageType) {
    try {
      const images = await prisma.image.findMany({
        where: { userId, type }
      })

      if (images.length === 0) {
        return true
      }

      // Supprimer de Cloudinary
      const publicIds = images.map(img => img.publicId)
      await UploadService.deleteMultipleImages(publicIds)

      // Supprimer de la base
      await prisma.image.deleteMany({
        where: { userId, type }
      })

      // Si c'était des avatars, mettre à jour l'utilisateur
      if (type === 'avatar') {
        await prisma.user.update({
          where: { id: userId },
          data: { avatar: null }
        })
      }

      console.log(`[ImageService] ${images.length} images supprimées pour ${userId} (${type})`)
      
      return true
    } catch (error) {
      console.error('[ImageService] Erreur suppression images:', error)
      throw new Error(`Erreur suppression images: ${error}`)
    }
  }

  /**
   * Réorganiser les images de galerie
   */
  static async reorderGalleryImages(userId: string, imageIds: string[]) {
    try {
      // Vérifier que toutes les images appartiennent à l'utilisateur
      const images = await prisma.image.findMany({
        where: { 
          id: { in: imageIds },
          userId,
          type: 'gallery'
        }
      })

      if (images.length !== imageIds.length) {
        throw new Error('Certaines images n\'existent pas ou ne vous appartiennent pas')
      }

      // Mettre à jour les positions
      const updates = imageIds.map((imageId, index) => 
        prisma.image.update({
          where: { id: imageId },
          data: { position: index }
        })
      )

      await prisma.$transaction(updates)

      console.log(`[ImageService] ${imageIds.length} images réorganisées pour ${userId}`)
      
      return true
    } catch (error) {
      console.error('[ImageService] Erreur réorganisation:', error)
      throw new Error(`Erreur réorganisation: ${error}`)
    }
  }

  /**
   * Définir une image comme principale
   */
  static async setMainImage(imageId: string, userId: string) {
    try {
      // Vérifier que l'image existe et appartient à l'utilisateur
      const image = await prisma.image.findUnique({
        where: { id: imageId }
      })

      if (!image || image.userId !== userId) {
        throw new Error('Image non trouvée ou accès non autorisé')
      }

      // Désactiver toutes les images principales de ce type
      await prisma.image.updateMany({
        where: { 
          userId,
          type: image.type
        },
        data: { isMain: false }
      })

      // Activer cette image comme principale
      await prisma.image.update({
        where: { id: imageId },
        data: { isMain: true }
      })

      console.log(`[ImageService] Image principale définie: ${imageId}`)
      
      return true
    } catch (error) {
      console.error('[ImageService] Erreur image principale:', error)
      throw new Error(`Erreur image principale: ${error}`)
    }
  }

  /**
   * Obtenir les statistiques d'images
   */
  static async getImageStats(userId?: string) {
    try {
      const where = userId ? { userId } : {}
      
      const stats = await prisma.image.groupBy({
        by: ['type'],
        where,
        _count: { id: true },
        _sum: { bytes: true }
      })

      const totalImages = await prisma.image.count({ where })
      const totalSize = await prisma.image.aggregate({
        where,
        _sum: { bytes: true }
      })

      return {
        totalImages,
        totalSize: totalSize._sum.bytes || 0,
        byType: stats.reduce((acc, stat) => {
          acc[stat.type] = {
            count: stat._count.id,
            size: stat._sum.bytes || 0
          }
          return acc
        }, {} as Record<string, { count: number; size: number }>)
      }
    } catch (error) {
      console.error('[ImageService] Erreur stats images:', error)
      throw new Error(`Erreur stats images: ${error}`)
    }
  }

  /**
   * Nettoyer les images orphelines
   */
  static async cleanupOrphanedImages() {
    try {
      // Trouver les images dont l'utilisateur n'existe plus
      const orphanedImages = await prisma.image.findMany({
        where: {
          user: null
        }
      })

      if (orphanedImages.length === 0) {
        return { deleted: 0, errors: [] }
      }

      const errors: string[] = []
      let deleted = 0

      // Supprimer chaque image orpheline
      for (const image of orphanedImages) {
        try {
          await UploadService.deleteImage(image.publicId)
          await prisma.image.delete({
            where: { id: image.id }
          })
          deleted++
        } catch (error) {
          errors.push(`Erreur suppression ${image.id}: ${error}`)
        }
      }

      console.log(`[ImageService] Nettoyage terminé: ${deleted} images supprimées, ${errors.length} erreurs`)
      
      return { deleted, errors }
    } catch (error) {
      console.error('[ImageService] Erreur nettoyage:', error)
      throw new Error(`Erreur nettoyage: ${error}`)
    }
  }
}

export default ImageService 