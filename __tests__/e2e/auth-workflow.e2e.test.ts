/**
 * Tests End-to-End pour le workflow d'authentification
 * Ces tests utilisent l'API réelle pour valider le processus complet
 */

import { AuthService } from '../../lib/services/auth.service'
import { VerificationService } from '../../lib/services/verification.service'
import { EmailService } from '../../lib/services/email.service'
import { prisma } from '../../lib/db'

describe('E2E Auth Workflow', () => {
  // Variables pour les tests
  let testUser: any
  let verificationToken: string
  const testEmail = `e2e-test-${Date.now()}@example.com`

  beforeAll(async () => {
    // Nettoyer les données de test existantes
    await prisma.verification.deleteMany({
      where: {
        user: {
          email: testEmail
        }
      }
    })
    
    await prisma.user.deleteMany({
      where: {
        email: testEmail
      }
    })
  })

  afterAll(async () => {
    // Nettoyer après les tests
    if (testUser) {
      await prisma.verification.deleteMany({
        where: {
          userId: testUser.id
        }
      })
      
      await prisma.user.delete({
        where: {
          id: testUser.id
        }
      })
    }
  })

  describe('Processus d\'inscription complet', () => {
    it('devrait créer un utilisateur et déclencher la vérification email', async () => {
      // Étape 1: Inscription
      const signupData = {
        email: testEmail,
        password: 'Test123!@#',
        name: 'Test E2E User',
        acceptTerms: true
      }

      const signupResult = await AuthService.signUpWithCredentials(signupData)

      expect(signupResult.success).toBe(true)
      expect(signupResult.user).toBeDefined()
      expect(signupResult.user!.email).toBe(testEmail)
      expect(signupResult.user!.verified).toBe(false)
      expect(signupResult.user!.verificationLevel).toBe(0)

      testUser = signupResult.user
    })

    it('devrait avoir créé une vérification email en attente', async () => {
      // Vérifier qu'une vérification a été créée
      const verification = await prisma.verification.findFirst({
        where: {
          userId: testUser.id,
          type: 'EMAIL_VERIFICATION',
          status: 'PENDING'
        }
      })

      expect(verification).toBeDefined()
      expect(verification!.data).toBeDefined()
      
      // Extraire le token de vérification
      const verificationData = verification!.data as any
      expect(verificationData.token).toBeDefined()
      expect(verificationData.expiresAt).toBeDefined()
      
      verificationToken = verificationData.token
    })

    it('ne devrait pas permettre de se connecter avec un email non vérifié', async () => {
      const loginResult = await AuthService.signInWithCredentials({
        email: testEmail,
        password: 'Test123!@#'
      })

      expect(loginResult.success).toBe(true)
      expect(loginResult.user!.verified).toBe(false)
      expect(loginResult.user!.verificationLevel).toBe(0)
    })
  })

  describe('Processus de vérification email', () => {
    it('devrait vérifier l\'email avec le token valide', async () => {
      const verificationResult = await VerificationService.verifyEmailToken(verificationToken)

      expect(verificationResult.success).toBe(true)
      expect(verificationResult.user).toBeDefined()
      expect(verificationResult.user!.verified).toBe(true)
      expect(verificationResult.user!.verificationLevel).toBe(1)
    })

    it('devrait marquer la vérification comme terminée', async () => {
      const verification = await prisma.verification.findFirst({
        where: {
          userId: testUser.id,
          type: 'EMAIL_VERIFICATION'
        }
      })

      expect(verification).toBeDefined()
      expect(verification!.status).toBe('VERIFIED')
      expect(verification!.reviewedAt).toBeDefined()
    })

    it('ne devrait pas permettre de réutiliser le même token', async () => {
      const verificationResult = await VerificationService.verifyEmailToken(verificationToken)

      expect(verificationResult.success).toBe(false)
      expect(verificationResult.message).toContain('invalide')
    })
  })

  describe('Processus de connexion après vérification', () => {
    it('devrait permettre la connexion avec un email vérifié', async () => {
      const loginResult = await AuthService.signInWithCredentials({
        email: testEmail,
        password: 'Test123!@#'
      })

      expect(loginResult.success).toBe(true)
      expect(loginResult.user!.verified).toBe(true)
      expect(loginResult.user!.verificationLevel).toBe(1)
      expect(loginResult.user!.lastActive).toBeDefined()
    })

    it('devrait rejeter un mauvais mot de passe', async () => {
      const loginResult = await AuthService.signInWithCredentials({
        email: testEmail,
        password: 'wrongpassword'
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.message).toContain('invalides')
    })
  })

  describe('Processus de renvoi de vérification', () => {
    let newTestUser: any
    let newVerificationToken: string
    const newTestEmail = `e2e-resend-${Date.now()}@example.com`

    beforeAll(async () => {
      // Créer un nouvel utilisateur pour tester le renvoi
      const signupResult = await AuthService.signUpWithCredentials({
        email: newTestEmail,
        password: 'Test123!@#',
        name: 'Test Resend User',
        acceptTerms: true
      })

      newTestUser = signupResult.user
    })

    afterAll(async () => {
      // Nettoyer
      if (newTestUser) {
        await prisma.verification.deleteMany({
          where: {
            userId: newTestUser.id
          }
        })
        
        await prisma.user.delete({
          where: {
            id: newTestUser.id
          }
        })
      }
    })

    it('devrait permettre de renvoyer un email de vérification', async () => {
      const resendResult = await VerificationService.sendVerificationEmail(newTestUser.id)

      expect(resendResult.success).toBe(true)
      expect(resendResult.message).toContain('envoyé')
    })

    it('devrait avoir créé une nouvelle vérification', async () => {
      const verifications = await prisma.verification.findMany({
        where: {
          userId: newTestUser.id,
          type: 'EMAIL_VERIFICATION',
          status: 'PENDING'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      expect(verifications.length).toBeGreaterThan(0)
      
      // Le token le plus récent devrait être différent
      const latestVerification = verifications[0]
      const verificationData = latestVerification.data as any
      newVerificationToken = verificationData.token
      
      expect(newVerificationToken).toBeDefined()
    })

    it('devrait vérifier avec le nouveau token', async () => {
      const verificationResult = await VerificationService.verifyEmailToken(newVerificationToken)

      expect(verificationResult.success).toBe(true)
      expect(verificationResult.user!.verified).toBe(true)
    })
  })

  describe('Statistiques et métriques', () => {
    it('devrait retourner des statistiques correctes', async () => {
      const stats = await AuthService.getUserStatistics()

      expect(stats.totalUsers).toBeGreaterThan(0)
      expect(stats.verifiedUsers).toBeGreaterThan(0)
      expect(stats.verificationRate).toBeGreaterThan(0)
      expect(stats.verificationRate).toBeLessThanOrEqual(100)
    })

    it('devrait calculer le temps de vérification', async () => {
      const stats = await AuthService.getUserStatistics()

      expect(stats.averageVerificationTime).toBeGreaterThan(0)
      expect(stats.averageVerificationTime).toBeLessThan(24 * 60 * 60 * 1000) // Moins de 24h
    })
  })

  describe('Gestion des erreurs et cas limites', () => {
    it('devrait gérer un email déjà utilisé', async () => {
      const duplicateSignup = await AuthService.signUpWithCredentials({
        email: testEmail, // Email déjà utilisé
        password: 'Test123!@#',
        name: 'Duplicate User',
        acceptTerms: true
      })

      expect(duplicateSignup.success).toBe(false)
      expect(duplicateSignup.message).toContain('déjà utilisé')
    })

    it('devrait gérer un token expiré', async () => {
      // Créer un token expiré manuellement
      const expiredUser = await prisma.user.create({
        data: {
          email: `expired-${Date.now()}@example.com`,
          password: 'hashedpassword',
          name: 'Expired User',
          role: 'USER'
        }
      })

      // Créer une vérification avec une date d'expiration passée
      const expiredVerification = await prisma.verification.create({
        data: {
          userId: expiredUser.id,
          type: 'EMAIL_VERIFICATION',
          status: 'PENDING',
          data: {
            token: 'expired-token-123',
            expiresAt: new Date(Date.now() - 1000 * 60 * 60) // 1 heure dans le passé
          }
        }
      })

      const verificationResult = await VerificationService.verifyEmailToken('expired-token-123')

      expect(verificationResult.success).toBe(false)
      expect(verificationResult.message).toContain('expiré')

      // Nettoyer
      await prisma.verification.delete({
        where: {
          id: expiredVerification.id
        }
      })
      
      await prisma.user.delete({
        where: {
          id: expiredUser.id
        }
      })
    })

    it('devrait gérer un utilisateur inexistant', async () => {
      const result = await AuthService.findByEmail('nonexistent@example.com')
      expect(result).toBeNull()
    })

    it('devrait gérer des données de signup invalides', async () => {
      const invalidSignup = await AuthService.signUpWithCredentials({
        email: 'invalid-email',
        password: '123', // Trop court
        name: '',
        acceptTerms: false
      })

      expect(invalidSignup.success).toBe(false)
      expect(invalidSignup.errors).toBeDefined()
      expect(invalidSignup.errors!.length).toBeGreaterThan(0)
    })
  })
}) 