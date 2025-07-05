import { NextRequest, NextResponse } from 'next/server'
import { VerificationService } from '@/lib/services/verification.service'
import { z } from 'zod'

// Schema pour la vérification email
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token requis')
})

/**
 * POST /api/auth/verify-email
 * Vérifier un email avec un token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = verifyEmailSchema.parse(body)

    const result = await VerificationService.verifyEmailToken(token)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        user: result.user ? {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          verified: result.user.verified,
          verificationLevel: result.user.verificationLevel
        } : null
      })
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 })
    }

  } catch (error) {
    console.error('[API] Erreur vérification email:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Token invalide',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la vérification'
    }, { status: 500 })
  }
}

/**
 * GET /api/auth/verify-email?token=xxx
 * Vérifier un email via URL (pour les liens dans les emails)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Token manquant'
      }, { status: 400 })
    }

    const result = await VerificationService.verifyEmailToken(token)

    if (result.success) {
      // Rediriger vers une page de succès
      return NextResponse.redirect(new URL('/verification/success', request.url))
    } else {
      // Rediriger vers une page d'erreur
      return NextResponse.redirect(new URL(`/verification/error?message=${encodeURIComponent(result.message)}`, request.url))
    }

  } catch (error) {
    console.error('[API] Erreur vérification email GET:', error)
    return NextResponse.redirect(new URL('/verification/error?message=Erreur+serveur', request.url))
  }
} 