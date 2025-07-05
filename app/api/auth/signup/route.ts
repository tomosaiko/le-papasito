import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/auth.service'
import { z } from 'zod'

// Schema de validation pour l'inscription
const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  role: z.enum(['USER', 'ESCORT', 'ADMIN']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions d\'utilisation'),
})

/**
 * POST /api/auth/signup
 * Inscription d'un nouvel utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation des données
    const validatedData = signUpSchema.parse(body)
    
    // Créer l'utilisateur
    const user = await AuthService.signUpWithCredentials({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: validatedData.role || 'USER',
      phone: validatedData.phone,
      dateOfBirth: validatedData.dateOfBirth,
      city: validatedData.city,
    })

    // Réponse success (ne pas renvoyer le mot de passe)
    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
        verificationLevel: user.verificationLevel,
        createdAt: user.createdAt,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('[API] Erreur inscription:', error)
    
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
    
    // Erreur métier (email déjà utilisé, etc.)
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 409 })
    }
    
    // Erreur serveur interne
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la création du compte'
    }, { status: 500 })
  }
}

/**
 * GET /api/auth/signup
 * Vérifier la disponibilité d'un email
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email requis'
      }, { status: 400 })
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await AuthService.findByEmailWithAuth(email)
    
    return NextResponse.json({
      success: true,
      available: !existingUser
    })
    
  } catch (error) {
    console.error('[API] Erreur vérification email:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erreur serveur lors de la vérification'
    }, { status: 500 })
  }
} 