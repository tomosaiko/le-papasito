import { prisma } from '@/lib/db'
import { User, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { VerificationService } from './verification.service'
import { EmailService } from './email.service'

// Types
interface SignUpData {
  email: string
  password: string
  name: string
  role?: UserRole
  phone?: string
  dateOfBirth?: string
  city?: string
}

interface AuthUserData {
  email: string
  name: string
  avatar?: string
  role?: UserRole
  emailVerified?: Date
}

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50, 'Le nom ne doit pas dépasser 50 caractères'),
  role: z.enum(['USER', 'ESCORT', 'ADMIN']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  city: z.string().optional(),
})

const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

/**
 * Service d'authentification pour NextAuth.js
 * Gère l'inscription, la connexion, et la gestion des utilisateurs
 */
export class AuthService {
  /**
   * Inscription avec email et mot de passe
   */
  static async signUpWithCredentials(data: SignUpData): Promise<User> {
    try {
      // Validation des données
      const validatedData = signUpSchema.parse(data)

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingUser) {
        throw new Error('Cet email est déjà utilisé')
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(validatedData.password, 12)

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          name: validatedData.name,
          password: hashedPassword,
          role: validatedData.role || 'USER',
          verified: false,
          verificationLevel: 0,
          // Champs optionnels pour le profil
          ...(validatedData.role === 'ESCORT' && {
            escortProfile: {
              create: {
                phone: validatedData.phone,
                city: validatedData.city,
                isActive: true,
                isAvailable: false, // Désactivé par défaut jusqu'à vérification
              }
            }
          })
        },
        include: {
          escortProfile: true
        }
      })

      // Log de l'inscription
      console.log(`[AuthService] Nouvel utilisateur créé: ${user.email} (${user.role})`)

      // Envoyer l'email de vérification automatiquement
      try {
        const verificationToken = await VerificationService.generateEmailVerificationToken(user.id)
        await EmailService.sendVerificationEmail(user, verificationToken)
        console.log(`[AuthService] Email de vérification envoyé à ${user.email}`)
      } catch (emailError) {
        console.error(`[AuthService] Erreur envoi email de vérification: ${emailError}`)
        // Ne pas faire échouer l'inscription si l'email échoue
      }

      return user
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Données invalides: ${error.errors.map(e => e.message).join(', ')}`)
      }
      throw error
    }
  }

  /**
   * Connexion avec email et mot de passe
   */
  static async signInWithCredentials(email: string, password: string): Promise<User | null> {
    try {
      // Validation
      const validatedData = signInSchema.parse({ email, password })

      // Rechercher l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email },
        include: {
          escortProfile: true,
          subscription: true
        }
      })

      if (!user || !user.password) {
        return null
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password)

      if (!isPasswordValid) {
        return null
      }

      // Mettre à jour la dernière activité
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() }
      })

      // Log de la connexion
      console.log(`[AuthService] Connexion réussie: ${user.email}`)

      return user
    } catch (error) {
      console.error('[AuthService] Erreur de connexion:', error)
      return null
    }
  }

  /**
   * Créer un utilisateur via OAuth (Google, etc.)
   */
  static async createUserWithAuth(data: AuthUserData): Promise<User> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        // Mettre à jour les informations si nécessaire
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: data.name,
            avatar: data.avatar,
            emailVerified: data.emailVerified || new Date(),
            lastActive: new Date()
          },
          include: {
            escortProfile: true
          }
        })
      }

      // Créer un nouvel utilisateur
      const user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          avatar: data.avatar,
          role: data.role || 'USER',
          emailVerified: data.emailVerified || new Date(),
          verified: false,
          verificationLevel: 1, // Niveau 1 car l'email est vérifié par OAuth
        },
        include: {
          escortProfile: true
        }
      })

      console.log(`[AuthService] Utilisateur OAuth créé: ${user.email}`)
      return user
    } catch (error) {
      console.error('[AuthService] Erreur création utilisateur OAuth:', error)
      throw error
    }
  }

  /**
   * Trouver un utilisateur par email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          escortProfile: true,
          subscription: true
        }
      })
    } catch (error) {
      console.error('[AuthService] Erreur recherche utilisateur:', error)
      return null
    }
  }

  /**
   * Trouver un utilisateur par email avec relations auth
   */
  static async findByEmailWithAuth(email: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          escortProfile: true,
          accounts: true,
          sessions: true,
          subscription: true
        }
      })
    } catch (error) {
      console.error('[AuthService] Erreur recherche utilisateur:', error)
      return null
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  static async resetPassword(email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        // Ne pas révéler si l'email existe ou non pour la sécurité
        return true
      }

      // Générer un token de reset (valide 1 heure)
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 heure

      // Sauvegarder le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })

      // TODO: Envoyer l'email de reset avec Brevo
      console.log(`[AuthService] Token de reset généré pour: ${email}`)
      console.log(`[AuthService] Token: ${resetToken}`) // À supprimer en production

      return true
    } catch (error) {
      console.error('[AuthService] Erreur reset password:', error)
      return false
    }
  }

  /**
   * Mise à jour du mot de passe avec token
   */
  static async updatePassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Validation du nouveau mot de passe
      if (newPassword.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères')
      }

      // Rechercher l'utilisateur avec ce token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date()
          }
        }
      })

      if (!user) {
        throw new Error('Token invalide ou expiré')
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Mettre à jour le mot de passe et supprimer le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        }
      })

      console.log(`[AuthService] Mot de passe mis à jour pour: ${user.email}`)
      return true
    } catch (error) {
      console.error('[AuthService] Erreur mise à jour mot de passe:', error)
      return false
    }
  }

  /**
   * Vérifier si un mot de passe est valide
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword)
    } catch (error) {
      console.error('[AuthService] Erreur vérification mot de passe:', error)
      return false
    }
  }

  /**
   * Supprimer un compte utilisateur
   */
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id: userId }
      })

      console.log(`[AuthService] Utilisateur supprimé: ${userId}`)
      return true
    } catch (error) {
      console.error('[AuthService] Erreur suppression utilisateur:', error)
      return false
    }
  }

  /**
   * Mettre à jour la dernière activité
   */
  static async updateLastActive(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastActive: new Date() }
      })
    } catch (error) {
      console.error('[AuthService] Erreur mise à jour dernière activité:', error)
    }
  }

  /**
   * Obtenir les statistiques d'authentification
   */
  static async getAuthStats() {
    try {
      const [totalUsers, usersToday, escortsCount, verifiedUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }),
        prisma.user.count({
          where: { role: 'ESCORT' }
        }),
        prisma.user.count({
          where: { verified: true }
        })
      ])

      return {
        totalUsers,
        usersToday,
        escortsCount,
        verifiedUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
      }
    } catch (error) {
      console.error('[AuthService] Erreur statistiques auth:', error)
      return {
        totalUsers: 0,
        usersToday: 0,
        escortsCount: 0,
        verifiedUsers: 0,
        verificationRate: 0
      }
    }
  }
}

export default AuthService 