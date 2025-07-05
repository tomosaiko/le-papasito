import { Redis } from 'ioredis'
import { z } from 'zod'

// Configuration Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

// Types
interface CacheOptions {
  ttl?: number // Time to live en secondes
  namespace?: string
  tags?: string[]
}

interface ImageCacheData {
  id: string
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
  type: string
  position: number
  isMain: boolean
  optimizedUrls: {
    thumbnail: string
    medium: string
    large: string
    original: string
  }
  createdAt: string
  updatedAt: string
}

interface UserImageStats {
  userId: string
  totalImages: number
  totalSize: number
  avatarCount: number
  galleryCount: number
  verificationCount: number
  lastUpdate: string
}

// Validation schemas
const cacheKeySchema = z.string().min(1).max(250)
const ttlSchema = z.number().positive().max(604800) // Max 7 jours

/**
 * Service de cache Redis pour optimiser les performances
 * Gère la mise en cache des images, métadonnées et statistiques
 */
export class CacheService {
  private static readonly DEFAULT_TTL = 3600 // 1 heure
  private static readonly LONG_TTL = 86400 // 24 heures
  private static readonly SHORT_TTL = 300 // 5 minutes

  // Namespaces pour organiser les clés
  private static readonly NAMESPACES = {
    IMAGES: 'images',
    GALLERY: 'gallery',
    AVATAR: 'avatar',
    STATS: 'stats',
    METADATA: 'metadata',
    USER_DATA: 'user_data',
  }

  /**
   * Générer une clé de cache
   */
  private static generateKey(namespace: string, identifier: string): string {
    const key = `le-papasito:${namespace}:${identifier}`
    cacheKeySchema.parse(key)
    return key
  }

  /**
   * Mettre en cache les images d'un utilisateur
   */
  static async cacheUserImages(
    userId: string, 
    images: ImageCacheData[], 
    type?: string
  ): Promise<void> {
    try {
      const key = type 
        ? this.generateKey(this.NAMESPACES.IMAGES, `${userId}:${type}`)
        : this.generateKey(this.NAMESPACES.IMAGES, userId)

      const pipeline = redis.pipeline()
      
      // Cache des images avec TTL long
      pipeline.setex(key, this.LONG_TTL, JSON.stringify(images))
      
      // Cache individuel pour chaque image
      images.forEach(image => {
        const imageKey = this.generateKey(this.NAMESPACES.METADATA, image.id)
        pipeline.setex(imageKey, this.LONG_TTL, JSON.stringify(image))
      })

      // Tags pour invalidation groupée
      const tagKey = this.generateKey('tags', `user:${userId}`)
      pipeline.sadd(tagKey, key)
      pipeline.expire(tagKey, this.LONG_TTL)

      await pipeline.exec()
      
      console.log(`[CacheService] Images cachées pour utilisateur ${userId}`)
    } catch (error) {
      console.error('[CacheService] Erreur cache images:', error)
      // N'interrompt pas le flux principal
    }
  }

  /**
   * Récupérer les images d'un utilisateur depuis le cache
   */
  static async getUserImages(userId: string, type?: string): Promise<ImageCacheData[] | null> {
    try {
      const key = type 
        ? this.generateKey(this.NAMESPACES.IMAGES, `${userId}:${type}`)
        : this.generateKey(this.NAMESPACES.IMAGES, userId)

      const cached = await redis.get(key)
      
      if (cached) {
        console.log(`[CacheService] Images récupérées du cache pour ${userId}`)
        return JSON.parse(cached)
      }
      
      return null
    } catch (error) {
      console.error('[CacheService] Erreur récupération cache:', error)
      return null
    }
  }

  /**
   * Mettre en cache la galerie d'un utilisateur
   */
  static async cacheUserGallery(userId: string, gallery: ImageCacheData[]): Promise<void> {
    try {
      const key = this.generateKey(this.NAMESPACES.GALLERY, userId)
      
      const pipeline = redis.pipeline()
      
      // Cache de la galerie complète
      pipeline.setex(key, this.LONG_TTL, JSON.stringify(gallery))
      
      // Cache des URLs optimisées pour chaque image
      gallery.forEach(image => {
        const urlKey = this.generateKey('optimized_urls', image.publicId)
        pipeline.setex(urlKey, this.LONG_TTL, JSON.stringify(image.optimizedUrls))
      })

      await pipeline.exec()
      
      console.log(`[CacheService] Galerie cachée pour utilisateur ${userId}`)
    } catch (error) {
      console.error('[CacheService] Erreur cache galerie:', error)
    }
  }

  /**
   * Récupérer la galerie d'un utilisateur depuis le cache
   */
  static async getUserGallery(userId: string): Promise<ImageCacheData[] | null> {
    try {
      const key = this.generateKey(this.NAMESPACES.GALLERY, userId)
      const cached = await redis.get(key)
      
      if (cached) {
        console.log(`[CacheService] Galerie récupérée du cache pour ${userId}`)
        return JSON.parse(cached)
      }
      
      return null
    } catch (error) {
      console.error('[CacheService] Erreur récupération galerie:', error)
      return null
    }
  }

  /**
   * Mettre en cache l'avatar d'un utilisateur
   */
  static async cacheUserAvatar(userId: string, avatar: ImageCacheData): Promise<void> {
    try {
      const key = this.generateKey(this.NAMESPACES.AVATAR, userId)
      
      await redis.setex(key, this.LONG_TTL, JSON.stringify(avatar))
      
      console.log(`[CacheService] Avatar caché pour utilisateur ${userId}`)
    } catch (error) {
      console.error('[CacheService] Erreur cache avatar:', error)
    }
  }

  /**
   * Récupérer l'avatar d'un utilisateur depuis le cache
   */
  static async getUserAvatar(userId: string): Promise<ImageCacheData | null> {
    try {
      const key = this.generateKey(this.NAMESPACES.AVATAR, userId)
      const cached = await redis.get(key)
      
      if (cached) {
        console.log(`[CacheService] Avatar récupéré du cache pour ${userId}`)
        return JSON.parse(cached)
      }
      
      return null
    } catch (error) {
      console.error('[CacheService] Erreur récupération avatar:', error)
      return null
    }
  }

  /**
   * Mettre en cache les statistiques d'un utilisateur
   */
  static async cacheUserStats(userId: string, stats: UserImageStats): Promise<void> {
    try {
      const key = this.generateKey(this.NAMESPACES.STATS, userId)
      
      await redis.setex(key, this.SHORT_TTL, JSON.stringify(stats))
      
      console.log(`[CacheService] Stats cachées pour utilisateur ${userId}`)
    } catch (error) {
      console.error('[CacheService] Erreur cache stats:', error)
    }
  }

  /**
   * Récupérer les statistiques d'un utilisateur depuis le cache
   */
  static async getUserStats(userId: string): Promise<UserImageStats | null> {
    try {
      const key = this.generateKey(this.NAMESPACES.STATS, userId)
      const cached = await redis.get(key)
      
      if (cached) {
        console.log(`[CacheService] Stats récupérées du cache pour ${userId}`)
        return JSON.parse(cached)
      }
      
      return null
    } catch (error) {
      console.error('[CacheService] Erreur récupération stats:', error)
      return null
    }
  }

  /**
   * Invalider le cache d'un utilisateur
   */
  static async invalidateUserCache(userId: string): Promise<void> {
    try {
      const keys = [
        this.generateKey(this.NAMESPACES.IMAGES, userId),
        this.generateKey(this.NAMESPACES.GALLERY, userId),
        this.generateKey(this.NAMESPACES.AVATAR, userId),
        this.generateKey(this.NAMESPACES.STATS, userId),
      ]

      // Invalider aussi les types spécifiques
      const specificKeys = ['avatar', 'gallery', 'verification'].map(type =>
        this.generateKey(this.NAMESPACES.IMAGES, `${userId}:${type}`)
      )

      const allKeys = [...keys, ...specificKeys]
      
      if (allKeys.length > 0) {
        await redis.del(...allKeys)
        console.log(`[CacheService] Cache invalidé pour utilisateur ${userId}`)
      }
    } catch (error) {
      console.error('[CacheService] Erreur invalidation cache:', error)
    }
  }

  /**
   * Invalider le cache d'une image spécifique
   */
  static async invalidateImageCache(imageId: string, userId: string): Promise<void> {
    try {
      const imageKey = this.generateKey(this.NAMESPACES.METADATA, imageId)
      
      await redis.del(imageKey)
      
      // Invalider aussi le cache utilisateur
      await this.invalidateUserCache(userId)
      
      console.log(`[CacheService] Cache invalidé pour image ${imageId}`)
    } catch (error) {
      console.error('[CacheService] Erreur invalidation image:', error)
    }
  }

  /**
   * Obtenir les statistiques du cache Redis
   */
  static async getCacheStats(): Promise<{
    totalKeys: number
    memoryUsage: string
    hitRate: number
    connectedClients: number
  } | null> {
    try {
      const info = await redis.info('memory')
      const stats = await redis.info('stats')
      const clients = await redis.info('clients')

      const memoryMatch = info.match(/used_memory_human:(.+)/)
      const hitsMatch = stats.match(/keyspace_hits:(\d+)/)
      const missesMatch = stats.match(/keyspace_misses:(\d+)/)
      const clientsMatch = clients.match(/connected_clients:(\d+)/)

      const hits = parseInt(hitsMatch?.[1] || '0')
      const misses = parseInt(missesMatch?.[1] || '0')
      const hitRate = hits + misses > 0 ? (hits / (hits + misses)) * 100 : 0

      return {
        totalKeys: await redis.dbsize(),
        memoryUsage: memoryMatch?.[1] || '0B',
        hitRate: Math.round(hitRate * 100) / 100,
        connectedClients: parseInt(clientsMatch?.[1] || '0'),
      }
    } catch (error) {
      console.error('[CacheService] Erreur stats cache:', error)
      return null
    }
  }

  /**
   * Nettoyer le cache expiré
   */
  static async cleanup(): Promise<void> {
    try {
      const keys = await redis.keys('le-papasito:*')
      
      if (keys.length > 1000) {
        console.log(`[CacheService] Nettoyage du cache - ${keys.length} clés trouvées`)
        
        // Nettoyer par batch pour éviter de bloquer Redis
        const batchSize = 100
        for (let i = 0; i < keys.length; i += batchSize) {
          const batch = keys.slice(i, i + batchSize)
          const pipeline = redis.pipeline()
          
          batch.forEach(key => {
            pipeline.ttl(key)
          })
          
          const results = await pipeline.exec()
          const expiredKeys = batch.filter((key, index) => {
            const ttl = results?.[index]?.[1] as number
            return ttl === -1 // Clé sans TTL
          })
          
          if (expiredKeys.length > 0) {
            await redis.del(...expiredKeys)
          }
        }
      }
    } catch (error) {
      console.error('[CacheService] Erreur nettoyage cache:', error)
    }
  }

  /**
   * Précharger le cache pour un utilisateur
   */
  static async preloadUserCache(userId: string): Promise<void> {
    try {
      // Cette méthode sera appelée par ImageService
      // pour précharger les données fréquemment utilisées
      console.log(`[CacheService] Préchargement du cache pour ${userId}`)
    } catch (error) {
      console.error('[CacheService] Erreur préchargement:', error)
    }
  }

  /**
   * Vérifier la connexion Redis
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const pong = await redis.ping()
      return pong === 'PONG'
    } catch (error) {
      console.error('[CacheService] Erreur connexion Redis:', error)
      return false
    }
  }
}

// Exporter le client Redis pour usage direct si nécessaire
export { redis }

// Gestionnaire de déconnexion propre
process.on('SIGINT', async () => {
  console.log('[CacheService] Fermeture connexion Redis...')
  await redis.quit()
  process.exit(0)
}) 