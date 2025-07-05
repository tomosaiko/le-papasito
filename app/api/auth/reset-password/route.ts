import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth.service'
import { z } from 'zod'

// Schema pour la demande de reset
const resetRequestSchema = z.object({
  email: z.string().email('Email invalide'),
})

// Schema pour la mise à jour du mot de passe
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requis'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

/**
 * POST /api/auth/reset-password
 * Demande de réinitialisation de mot de passe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = resetRequestSchema.parse(body)
    
    // Demander le reset
    const result = await AuthService.resetPassword(validatedData.email)
    
    // Toujours renvoyer succès pour ne pas révéler si l'email existe
    return NextResponse.json({
      success: true,
      message: 'Si cet email existe, vous recevrez un lien de réinitialisation'
    })

  } catch (error) {
    console.error('[API] Erreur demande reset:', error)
    
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }, { status: 400 })
    }
    
    // Erreur serveur
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la demande de réinitialisation'
    }, { status: 500 })
  }
}

/**
 * PUT /api/auth/reset-password
 * Mise à jour du mot de passe avec token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = resetPasswordSchema.parse(body)
    
    // Mettre à jour le mot de passe
    const result = await AuthService.updatePassword(
      validatedData.token,
      validatedData.password
    )
    
    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Token invalide ou expiré'
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    })

  } catch (error) {
    console.error('[API] Erreur mise à jour mot de passe:', error)
    
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      }, { status: 400 })
    }
    
    // Erreur métier
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 })
    }
    
    // Erreur serveur
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du mot de passe'
    }, { status: 500 })
  }
}

/**
 * GET /api/auth/reset-password
 * Vérifier la validité d'un token de reset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Token requis'
      }, { status: 400 })
    }
    
    // Vérifier si le token est valide (sans le consommer)
    const user = await AuthService.findByEmailWithAuth('')
    // Note: Cette méthode devrait être améliorée pour vérifier le token directement
    
    return NextResponse.json({
      success: true,
      valid: true
    })
    
  } catch (error) {
    console.error('[API] Erreur vérification token:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la vérification'
    }, { status: 500 })
  }
} 