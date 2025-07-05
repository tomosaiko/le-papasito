import { NextRequest, NextResponse } from 'next/server'
import { VerificationService } from '@/lib/services/verification.service'
import { auth } from '@/lib/auth'
import { z } from 'zod'

// Schema pour le renvoi d'email
const resendSchema = z.object({
  email: z.string().email('Email invalide').optional()
})

/**
 * POST /api/auth/resend-verification
 * Renvoyer un email de vérification
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { email } = resendSchema.parse(body)

    let userId: string
    let userEmail: string

    // Si l'utilisateur est connecté, utiliser ses informations
    if (session?.user) {
      userId = session.user.id
      userEmail = session.user.email
      
      // Vérifier si l'email est déjà vérifié
      if (session.user.verified) {
        return NextResponse.json({
          success: false,
          message: 'Votre email est déjà vérifié'
        }, { status: 400 })
      }
    } 
    // Sinon, utiliser l'email fourni (pour les nouveaux utilisateurs)
    else if (email) {
      const { AuthService } = await import('@/lib/services/auth.service')
      const user = await AuthService.findByEmail(email)
      
      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'Utilisateur non trouvé'
        }, { status: 404 })
      }
      
      if (user.verified) {
        return NextResponse.json({
          success: false,
          message: 'Cet email est déjà vérifié'
        }, { status: 400 })
      }
      
      userId = user.id
      userEmail = user.email
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email requis ou connexion nécessaire'
      }, { status: 400 })
    }

    const result = await VerificationService.resendEmailVerification(userId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email de vérification envoyé à ${userEmail}`
      })
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 })
    }

  } catch (error) {
    console.error('[API] Erreur renvoi vérification:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors du renvoi'
    }, { status: 500 })
  }
}

/**
 * GET /api/auth/resend-verification
 * Obtenir les informations sur l'état de vérification
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: 'Authentification requise'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        verified: session.user.verified,
        verificationLevel: session.user.verificationLevel
      },
      canResend: !session.user.verified
    })

  } catch (error) {
    console.error('[API] Erreur statut vérification:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur'
    }, { status: 500 })
  }
} 