import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { AnalyticsService } from '@/lib/services/analytics.service'
import { CacheService } from '@/lib/services/cache.service'
import { ErrorManagementService } from '@/lib/services/error-management.service'
import { z } from 'zod'

// Validation schemas
const analyticsRequestSchema = z.object({
  type: z.enum(['upload', 'system', 'errors', 'cache', 'report']).optional(),
  userId: z.string().cuid().optional(),
  period: z.enum(['1h', '24h', '7d', '30d']).optional(),
})

/**
 * API endpoint pour les analytics et métriques système
 * GET /api/analytics
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = session.user.id
    const userRole = session.user.role

    // Validation des paramètres
    const params = analyticsRequestSchema.parse({
      type: searchParams.get('type'),
      userId: searchParams.get('userId'),
      period: searchParams.get('period'),
    })

    // Vérifier les permissions
    const isAdmin = userRole === 'ADMIN'
    const requestedUserId = params.userId || userId

    // Seuls les admins peuvent voir les stats d'autres utilisateurs
    if (!isAdmin && requestedUserId !== userId) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    switch (params.type) {
      case 'upload':
        // Métriques d'upload
        if (isAdmin) {
          const uploadMetrics = await AnalyticsService.getUploadMetrics()
          return NextResponse.json({
            success: true,
            data: uploadMetrics,
            type: 'upload_global',
          })
        } else {
          const userStats = await AnalyticsService.getUserUploadStats(requestedUserId)
          return NextResponse.json({
            success: true,
            data: userStats,
            type: 'upload_user',
          })
        }

      case 'system':
        // Métriques système (admin uniquement)
        if (!isAdmin) {
          return NextResponse.json(
            { error: 'Accès admin requis' },
            { status: 403 }
          )
        }

        const systemMetrics = await AnalyticsService.getSystemPerformanceMetrics()
        return NextResponse.json({
          success: true,
          data: systemMetrics,
          type: 'system',
        })

      case 'errors':
        // Statistiques d'erreurs
        if (!isAdmin) {
          return NextResponse.json(
            { error: 'Accès admin requis' },
            { status: 403 }
          )
        }

        const errorStats = await ErrorManagementService.getErrorStats()
        return NextResponse.json({
          success: true,
          data: errorStats,
          type: 'errors',
        })

      case 'cache':
        // Statistiques de cache
        if (!isAdmin) {
          return NextResponse.json(
            { error: 'Accès admin requis' },
            { status: 403 }
          )
        }

        const cacheStats = await CacheService.getCacheStats()
        return NextResponse.json({
          success: true,
          data: cacheStats,
          type: 'cache',
        })

      case 'report':
        // Rapport complet (admin uniquement)
        if (!isAdmin) {
          return NextResponse.json(
            { error: 'Accès admin requis' },
            { status: 403 }
          )
        }

        const report = await AnalyticsService.generateAnalyticsReport()
        return NextResponse.json({
          success: true,
          data: report,
          type: 'report',
          generatedAt: new Date().toISOString(),
        })

      default:
        // Dashboard utilisateur par défaut
        const userStats = await AnalyticsService.getUserUploadStats(requestedUserId)
        
        // Ajouter des métriques supplémentaires si c'est un admin
        if (isAdmin) {
          const cacheHealthy = await CacheService.healthCheck()
          const systemMetrics = await AnalyticsService.getSystemPerformanceMetrics()
          
          return NextResponse.json({
            success: true,
            data: {
              userStats,
              systemHealth: {
                cacheHealthy,
                averageResponseTime: systemMetrics.averageResponseTime,
                activeUsers: systemMetrics.activeUsers,
              },
            },
            type: 'dashboard_admin',
          })
        }

        return NextResponse.json({
          success: true,
          data: userStats,
          type: 'dashboard_user',
        })
    }

  } catch (error) {
    console.error('[AnalyticsAPI] Erreur:', error)
    
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
 * Enregistrer des événements personnalisés
 * POST /api/analytics
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const userId = session.user.id

    // Validation des données d'événement
    const eventSchema = z.object({
      event: z.string().min(1),
      properties: z.record(z.any()).optional(),
      timestamp: z.number().optional(),
    })

    const validatedEvent = eventSchema.parse(body)

    // Enregistrer l'événement selon le type
    switch (validatedEvent.event) {
      case 'upload_started':
        await AnalyticsService.recordPerformanceMetric({
          operation: 'upload_started',
          duration: 0,
          success: true,
          userId,
        })
        break

      case 'upload_completed':
        if (validatedEvent.properties?.duration) {
          await AnalyticsService.recordPerformanceMetric({
            operation: 'upload_completed',
            duration: validatedEvent.properties.duration,
            success: true,
            userId,
          })
        }
        break

      case 'upload_failed':
        if (validatedEvent.properties?.error) {
          await ErrorManagementService.recordError({
            operation: 'upload_user_error',
            userId,
            error: new Error(validatedEvent.properties.error),
            timestamp: Date.now(),
            metadata: validatedEvent.properties,
          })
        }
        break

      case 'page_view':
        await AnalyticsService.recordPerformanceMetric({
          operation: 'page_view',
          duration: validatedEvent.properties?.loadTime || 0,
          success: true,
          userId,
        })
        break

      default:
        // Événement générique
        await AnalyticsService.recordPerformanceMetric({
          operation: validatedEvent.event,
          duration: validatedEvent.properties?.duration || 0,
          success: validatedEvent.properties?.success !== false,
          userId,
        })
    }

    return NextResponse.json({
      success: true,
      message: 'Événement enregistré',
    })

  } catch (error) {
    console.error('[AnalyticsAPI] Erreur POST:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur enregistrement événement',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
}

/**
 * Nettoyer les analytics (admin uniquement)
 * DELETE /api/analytics
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès admin requis' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    switch (action) {
      case 'cleanup_cache':
        await CacheService.cleanup()
        return NextResponse.json({
          success: true,
          message: 'Cache nettoyé',
        })

      case 'cleanup_transactions':
        await ErrorManagementService.cleanup()
        return NextResponse.json({
          success: true,
          message: 'Transactions nettoyées',
        })

      case 'cleanup_all':
        await Promise.all([
          CacheService.cleanup(),
          ErrorManagementService.cleanup(),
        ])
        return NextResponse.json({
          success: true,
          message: 'Nettoyage complet effectué',
        })

      default:
        return NextResponse.json(
          { error: 'Action non spécifiée' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('[AnalyticsAPI] Erreur DELETE:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur nettoyage',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    )
  }
} 