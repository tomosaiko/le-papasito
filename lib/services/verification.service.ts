import { prisma } from '@/lib/db'
import { User } from '@prisma/client'
import { randomUUID } from 'crypto'
import { addHours } from 'date-fns'
import { EmailService } from './email.service'

export interface VerificationResult {
  success: boolean
  message: string
  user?: User
}

export interface VerificationToken {
  id: string
  userId: string
  token: string
  type: 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | 'IDENTITY_VERIFICATION'
  expiresAt: Date
  createdAt: Date
}

/**
 * Service de vérification des comptes
 * Gère la vérification email, téléphone et identité
 */
export class VerificationService {
  /**
   * Générer un token de vérification email
   */
  static async generateEmailVerificationToken(userId: string): Promise<string> {
    const token = randomUUID()
    const expiresAt = addHours(new Date(), 24) // 24h d'expiration

    // Supprimer les anciennes vérifications email en cours
    await prisma.verification.deleteMany({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        status: 'PENDING'
      }
    })

    // Créer une nouvelle vérification
    await prisma.verification.create({
      data: {
        userId,
        type: 'EMAIL_VERIFICATION',
        status: 'PENDING',
        data: {
          token,
          expiresAt: expiresAt.toISOString()
        }
      }
    })

    return token
  }

  /**
   * Vérifier un token email
   */
  static async verifyEmailToken(token: string): Promise<VerificationResult> {
    try {
      // Rechercher toutes les vérifications pending pour trouver le bon token
      const verifications = await prisma.verification.findMany({
        where: {
          type: 'EMAIL_VERIFICATION',
          status: 'PENDING',
        },
        include: {
          user: true
        }
      })

      // Trouver la vérification avec le bon token
      const verification = verifications.find(v => {
        const verificationData = v.data as any
        return verificationData.token === token
      })

      if (!verification) {
        return {
          success: false,
          message: 'Token de vérification invalide'
        }
      }

      // Vérifier l'expiration
      const verificationData = verification.data as any
      if (new Date() > new Date(verificationData.expiresAt)) {
        return {
          success: false,
          message: 'Token de vérification expiré'
        }
      }

      // Marquer l'utilisateur comme vérifié
      const user = await prisma.user.update({
        where: {
          id: verification.userId
        },
        data: {
          emailVerified: new Date(),
          verified: true,
          verificationLevel: 1
        }
      })

      // Marquer la vérification comme vérifiée
      await prisma.verification.update({
        where: {
          id: verification.id
        },
        data: {
          status: 'VERIFIED',
          reviewedAt: new Date()
        }
      })

      return {
        success: true,
        message: 'Email vérifié avec succès',
        user
      }
    } catch (error) {
      console.error('[VerificationService] Erreur vérification email:', error)
      return {
        success: false,
        message: 'Erreur lors de la vérification'
      }
    }
  }

  /**
   * Renvoyer un email de vérification
   */
  static async resendEmailVerification(userId: string): Promise<VerificationResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé'
        }
      }

      if (user.emailVerified) {
        return {
          success: false,
          message: 'Email déjà vérifié'
        }
      }

      const token = await this.generateEmailVerificationToken(userId)

      // Envoyer l'email de vérification
      const emailResult = await EmailService.sendVerificationEmail(user, token)

      if (emailResult.success) {
        console.log(`[VerificationService] Email de vérification envoyé à ${user.email}`)
        return {
          success: true,
          message: 'Email de vérification envoyé'
        }
      } else {
        console.error(`[VerificationService] Erreur envoi email: ${emailResult.message}`)
        return {
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email'
        }
      }
    } catch (error) {
      console.error('[VerificationService] Erreur renvoi email:', error)
      return {
        success: false,
        message: 'Erreur lors de l\'envoi'
      }
    }
  }

  /**
   * Vérifier le niveau de vérification requis
   */
  static async checkVerificationLevel(userId: string, requiredLevel: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    return user ? user.verificationLevel >= requiredLevel : false
  }

  /**
   * Augmenter le niveau de vérification (pour vérification d'identité)
   */
  static async upgradeVerificationLevel(userId: string, newLevel: number): Promise<VerificationResult> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { verificationLevel: newLevel }
      })

      return {
        success: true,
        message: `Niveau de vérification mis à jour: ${newLevel}`,
        user
      }
    } catch (error) {
      console.error('[VerificationService] Erreur upgrade niveau:', error)
      return {
        success: false,
        message: 'Erreur lors de la mise à jour'
      }
    }
  }

  /**
   * Générer un token de vérification d'identité
   */
  static async generateIdentityVerificationToken(userId: string): Promise<string> {
    const token = randomUUID()
    const expiresAt = addHours(new Date(), 72) // 72h pour vérification identité

    await prisma.verification.deleteMany({
      where: {
        userId,
        type: 'IDENTITY_VERIFICATION',
        status: 'PENDING'
      }
    })

    await prisma.verification.create({
      data: {
        userId,
        type: 'IDENTITY_VERIFICATION',
        status: 'PENDING',
        data: {
          token,
          expiresAt: expiresAt.toISOString()
        }
      }
    })

    return token
  }

  /**
   * Statistiques de vérification
   */
  static async getVerificationStats() {
    const stats = await prisma.user.aggregate({
      _count: {
        _all: true,
        verified: true
      },
      where: {
        verified: true
      }
    })

    const totalUsers = await prisma.user.count()
    const verifiedUsers = stats._count.verified || 0
    const verificationRate = totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0

    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      verificationRate: Math.round(verificationRate)
    }
  }
} 