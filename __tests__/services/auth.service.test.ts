import { AuthService } from '../../lib/services/auth.service'
import { prisma } from '../../lib/db'
import bcrypt from 'bcrypt'

// Mock Prisma
jest.mock('../../lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

// Mock EmailService
jest.mock('../../lib/services/email.service', () => ({
  EmailService: {
    sendVerificationEmail: jest.fn(),
  },
}))

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUpWithCredentials', () => {
    it('devrait créer un utilisateur avec des données valides', async () => {
      // Mock des données utilisateur
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      }

      // Mock des réponses
      const mockHashedPassword = 'hashed-password-123'
      const mockUser = {
        id: 'user-123',
        email: userData.email,
        name: userData.name,
        role: 'USER',
        verified: false,
        verificationLevel: 0,
        createdAt: new Date(),
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword)
      ;(prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

      const result = await AuthService.signUpWithCredentials(userData)

      expect(result.success).toBe(true)
      expect(result.user).toEqual(mockUser)
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: mockHashedPassword,
          name: userData.name,
          role: 'USER',
        },
      })
    })

    it('devrait rejeter un email déjà utilisé', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: userData.email,
      })

      const result = await AuthService.signUpWithCredentials(userData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('déjà utilisé')
      expect(prisma.user.create).not.toHaveBeenCalled()
    })

    it('devrait rejeter des données invalides', async () => {
      const userData = {
        email: 'invalid-email',
        password: '123', // Trop court
        name: '',
        acceptTerms: false,
      }

      const result = await AuthService.signUpWithCredentials(userData)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'password' }),
          expect.objectContaining({ field: 'name' }),
          expect.objectContaining({ field: 'acceptTerms' }),
        ])
      )
    })
  })

  describe('signInWithCredentials', () => {
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockUser = {
        id: 'user-123',
        email: credentials.email,
        name: 'Test User',
        password: 'hashed-password',
        role: 'USER',
        verified: true,
        verificationLevel: 1,
        lastActive: new Date(),
        escortProfile: null,
        subscription: null,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        lastActive: new Date(),
      })

      const result = await AuthService.signInWithCredentials(credentials)

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe(credentials.email)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          lastActive: expect.any(Date),
        },
      })
    })

    it('devrait rejeter des identifiants incorrects', async () => {
      const credentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.signInWithCredentials(credentials)

      expect(result.success).toBe(false)
      expect(result.message).toContain('invalides')
    })

    it('devrait rejeter un mot de passe incorrect', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const mockUser = {
        id: 'user-123',
        email: credentials.email,
        password: 'hashed-password',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      const result = await AuthService.signInWithCredentials(credentials)

      expect(result.success).toBe(false)
      expect(result.message).toContain('invalides')
    })
  })

  describe('getUserStatistics', () => {
    it('devrait retourner les statistiques correctes', async () => {
      const mockStats = {
        totalUsers: 100,
        verifiedUsers: 75,
        newUsersToday: 5,
        averageVerificationTime: 3600000, // 1 heure en ms
      }

      ;(prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(mockStats.totalUsers)
        .mockResolvedValueOnce(mockStats.verifiedUsers)
        .mockResolvedValueOnce(mockStats.newUsersToday)

      ;(prisma.user.findMany as jest.Mock).mockResolvedValue([
        { emailVerified: new Date('2023-01-01T10:00:00Z'), createdAt: new Date('2023-01-01T09:00:00Z') },
        { emailVerified: new Date('2023-01-01T11:00:00Z'), createdAt: new Date('2023-01-01T09:30:00Z') },
      ])

      const result = await AuthService.getUserStatistics()

      expect(result.totalUsers).toBe(mockStats.totalUsers)
      expect(result.verifiedUsers).toBe(mockStats.verifiedUsers)
      expect(result.newUsersToday).toBe(mockStats.newUsersToday)
      expect(result.verificationRate).toBe(75) // 75/100 * 100
      expect(result.averageVerificationTime).toBeGreaterThan(0)
    })
  })

  describe('findByEmail', () => {
    it('devrait trouver un utilisateur par email', async () => {
      const email = 'test@example.com'
      const mockUser = {
        id: 'user-123',
        email: email,
        name: 'Test User',
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const result = await AuthService.findByEmail(email)

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: {
          escortProfile: true,
          subscription: true,
        },
      })
    })

    it('devrait retourner null si l\'utilisateur n\'existe pas', async () => {
      const email = 'nonexistent@example.com'

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await AuthService.findByEmail(email)

      expect(result).toBeNull()
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de base de données', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      }

      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'))

      const result = await AuthService.signUpWithCredentials(userData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('erreur')
    })

    it('devrait gérer les erreurs de hachage', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing error'))

      const result = await AuthService.signUpWithCredentials(userData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('erreur')
    })
  })
}) 