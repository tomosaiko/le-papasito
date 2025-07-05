import { AuthService } from '@/lib/services/auth.service'
import { prisma } from '@/lib/db'
import { User } from '@prisma/client'

describe('OAuth Workflow E2E', () => {
  let testUser: User | null = null

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'oauth-test'
        }
      }
    })
  })

  afterEach(async () => {
    // Nettoyer après chaque test
    if (testUser) {
      await prisma.user.delete({
        where: { id: testUser.id }
      }).catch(() => {})
    }
  })

  afterAll(async () => {
    // Nettoyer complètement
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'oauth-test'
        }
      }
    })
    await prisma.$disconnect()
  })

  describe('Création d\'utilisateur OAuth', () => {
    it('devrait créer un nouvel utilisateur via Google OAuth', async () => {
      const oauthData = {
        email: 'oauth-test-create@gmail.com',
        name: 'Test OAuth User',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        role: 'USER' as const,
        emailVerified: new Date()
      }

      const user = await AuthService.createUserWithAuth(oauthData)

      expect(user).toBeTruthy()
      expect(user.email).toBe(oauthData.email)
      expect(user.name).toBe(oauthData.name)
      expect(user.avatar).toBe(oauthData.avatar)
      expect(user.role).toBe('USER')
      expect(user.verified).toBe(false)
      expect(user.verificationLevel).toBe(1) // Email vérifié par OAuth
      expect(user.emailVerified).toBeTruthy()

      testUser = user
    })

    it('devrait mettre à jour un utilisateur existant avec OAuth', async () => {
      // Créer un utilisateur existant
      const existingUser = await AuthService.signUpWithCredentials({
        email: 'oauth-test-update@gmail.com',
        name: 'Original Name',
        password: 'password123'
      })

      const oauthData = {
        email: 'oauth-test-update@gmail.com',
        name: 'Updated OAuth Name',
        avatar: 'https://lh3.googleusercontent.com/a/updated-user',
        role: 'USER' as const,
        emailVerified: new Date()
      }

      const updatedUser = await AuthService.createUserWithAuth(oauthData)

      expect(updatedUser.id).toBe(existingUser.id)
      expect(updatedUser.name).toBe('Updated OAuth Name')
      expect(updatedUser.avatar).toBe(oauthData.avatar)
      expect(updatedUser.emailVerified).toBeTruthy()

      testUser = updatedUser
    })

    it('devrait gérer les erreurs de création OAuth', async () => {
      const invalidOauthData = {
        email: 'invalid-email',
        name: '',
        avatar: 'invalid-url',
        role: 'INVALID' as any
      }

      await expect(
        AuthService.createUserWithAuth(invalidOauthData)
      ).rejects.toThrow()
    })
  })

  describe('Intégration avec la base de données', () => {
    it('devrait sauvegarder correctement les données OAuth', async () => {
      const oauthData = {
        email: 'oauth-test-db@gmail.com',
        name: 'DB Test User',
        avatar: 'https://lh3.googleusercontent.com/a/db-test',
        role: 'USER' as const,
        emailVerified: new Date()
      }

      const user = await AuthService.createUserWithAuth(oauthData)

      // Vérifier directement dans la base
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      expect(dbUser).toBeTruthy()
      expect(dbUser!.email).toBe(oauthData.email)
      expect(dbUser!.name).toBe(oauthData.name)
      expect(dbUser!.avatar).toBe(oauthData.avatar)
      expect(dbUser!.emailVerified).toBeTruthy()
      expect(dbUser!.password).toBeNull() // Pas de mot de passe pour OAuth

      testUser = user
    })

    it('devrait gérer les contraintes de base de données', async () => {
      const oauthData = {
        email: 'oauth-test-constraint@gmail.com',
        name: 'Constraint Test',
        avatar: 'https://lh3.googleusercontent.com/a/constraint-test',
        role: 'USER' as const,
        emailVerified: new Date()
      }

      // Créer le premier utilisateur
      const user1 = await AuthService.createUserWithAuth(oauthData)
      
      // Essayer de créer un second utilisateur avec le même email
      const user2 = await AuthService.createUserWithAuth(oauthData)

      // Devrait retourner le même utilisateur (mise à jour)
      expect(user1.id).toBe(user2.id)
      expect(user2.lastActive).toBeTruthy()

      testUser = user1
    })
  })

  describe('Workflow complet OAuth', () => {
    it('devrait simuler un workflow Google OAuth complet', async () => {
      // Étape 1: Simulation du callback Google
      const googleProfile = {
        id: 'google-123456',
        email: 'oauth-test-complete@gmail.com',
        name: 'Complete Test User',
        picture: 'https://lh3.googleusercontent.com/a/complete-test',
        email_verified: true
      }

      // Étape 2: Création/mise à jour de l'utilisateur
      const user = await AuthService.createUserWithAuth({
        email: googleProfile.email,
        name: googleProfile.name,
        avatar: googleProfile.picture,
        role: 'USER',
        emailVerified: new Date()
      })

      // Étape 3: Vérification du profil créé
      expect(user.email).toBe(googleProfile.email)
      expect(user.verified).toBe(false) // Pas encore vérifié au niveau métier
      expect(user.verificationLevel).toBe(1) // Email vérifié par Google

      // Étape 4: Simulation de la mise à jour de l'activité
      await AuthService.updateLastActive(user.id)

      // Étape 5: Vérification de la mise à jour
      const updatedUser = await AuthService.findByEmail(user.email)
      expect(updatedUser!.lastActive).toBeTruthy()

      testUser = user
    })

    it('devrait gérer les utilisateurs OAuth avec profils escort', async () => {
      // Créer un utilisateur OAuth qui devient escort
      const oauthData = {
        email: 'oauth-test-escort@gmail.com',
        name: 'Escort OAuth User',
        avatar: 'https://lh3.googleusercontent.com/a/escort-test',
        role: 'USER' as const,
        emailVerified: new Date()
      }

      const user = await AuthService.createUserWithAuth(oauthData)

      // Simuler la création d'un profil escort
      const escortProfile = await prisma.escortProfile.create({
        data: {
          userId: user.id,
          age: 25,
          height: 170,
          weight: 60,
          city: 'Paris',
          phone: '+33123456789',
          bio: 'Test escort profile',
          services: ['ESCORT_PREMIUM'],
          languages: ['FR', 'EN'],
          hourlyRate: 200,
          minimumHours: 2,
          isActive: true,
          isAvailable: true
        }
      })

      // Mettre à jour le rôle
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ESCORT' }
      })

      expect(updatedUser.role).toBe('ESCORT')
      expect(escortProfile.userId).toBe(user.id)

      testUser = updatedUser
    })
  })

  describe('Gestion des erreurs OAuth', () => {
    it('devrait gérer les emails invalides', async () => {
      const invalidData = {
        email: 'invalid-email-format',
        name: 'Invalid Test',
        avatar: 'test-avatar.jpg',
        role: 'USER' as const
      }

      await expect(
        AuthService.createUserWithAuth(invalidData)
      ).rejects.toThrow()
    })

    it('devrait gérer les noms vides', async () => {
      const invalidData = {
        email: 'oauth-test-empty-name@gmail.com',
        name: '',
        avatar: 'test-avatar.jpg',
        role: 'USER' as const
      }

      await expect(
        AuthService.createUserWithAuth(invalidData)
      ).rejects.toThrow()
    })

    it('devrait gérer les erreurs de base de données', async () => {
      // Simuler une erreur de connexion à la base
      const originalPrisma = prisma.user.create
      prisma.user.create = jest.fn().mockRejectedValue(new Error('Database error'))

      const oauthData = {
        email: 'oauth-test-db-error@gmail.com',
        name: 'DB Error Test',
        avatar: 'test-avatar.jpg',
        role: 'USER' as const
      }

      await expect(
        AuthService.createUserWithAuth(oauthData)
      ).rejects.toThrow('Database error')

      // Restaurer la fonction originale
      prisma.user.create = originalPrisma
    })
  })

  describe('Métriques et statistiques OAuth', () => {
    it('devrait compter les utilisateurs OAuth', async () => {
      // Créer plusieurs utilisateurs OAuth
      const oauthUsers = await Promise.all([
        AuthService.createUserWithAuth({
          email: 'oauth-test-metrics-1@gmail.com',
          name: 'Metrics Test 1',
          avatar: 'avatar1.jpg',
          role: 'USER',
          emailVerified: new Date()
        }),
        AuthService.createUserWithAuth({
          email: 'oauth-test-metrics-2@gmail.com',
          name: 'Metrics Test 2',
          avatar: 'avatar2.jpg',
          role: 'USER',
          emailVerified: new Date()
        })
      ])

      // Compter les utilisateurs avec emailVerified
      const oauthCount = await prisma.user.count({
        where: {
          emailVerified: { not: null },
          email: { contains: 'oauth-test-metrics' }
        }
      })

      expect(oauthCount).toBe(2)

      // Nettoyer
      await prisma.user.deleteMany({
        where: {
          id: { in: oauthUsers.map(u => u.id) }
        }
      })
    })

    it('devrait calculer les statistiques d\'authentification', async () => {
      const stats = await AuthService.getAuthStats()

      expect(stats).toHaveProperty('totalUsers')
      expect(stats).toHaveProperty('verifiedUsers')
      expect(stats).toHaveProperty('verificationRate')
      expect(stats).toHaveProperty('roleDistribution')
      expect(stats).toHaveProperty('recentSignups')

      expect(typeof stats.totalUsers).toBe('number')
      expect(typeof stats.verifiedUsers).toBe('number')
      expect(typeof stats.verificationRate).toBe('number')
    })
  })
}) 