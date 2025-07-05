import { createMocks } from 'node-mocks-http'
import signupHandler from '../../app/api/auth/signup/route'
import verifyEmailHandler from '../../app/api/auth/verify-email/route'
import resendVerificationHandler from '../../app/api/auth/resend-verification/route'

// Mock des services
jest.mock('../../lib/services/auth.service', () => ({
  AuthService: {
    signUpWithCredentials: jest.fn(),
    findByEmail: jest.fn(),
  },
}))

jest.mock('../../lib/services/verification.service', () => ({
  VerificationService: {
    verifyEmailToken: jest.fn(),
    sendVerificationEmail: jest.fn(),
  },
}))

describe('API Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/signup', () => {
    it('devrait créer un utilisateur avec des données valides', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        acceptTerms: true,
      }

      const mockUser = {
        id: 'user-123',
        email: userData.email,
        name: userData.name,
        role: 'USER',
        verified: false,
        verificationLevel: 0,
        createdAt: new Date(),
      }

      const { AuthService } = require('../../lib/services/auth.service')
      AuthService.signUpWithCredentials.mockResolvedValue({
        success: true,
        user: mockUser,
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: userData,
      })

      await signupHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.user).toEqual(mockUser)
    })

    it('devrait rejeter des données invalides', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        name: '',
        acceptTerms: false,
      }

      const { AuthService } = require('../../lib/services/auth.service')
      AuthService.signUpWithCredentials.mockResolvedValue({
        success: false,
        message: 'Données invalides',
        errors: [
          { field: 'email', message: 'Email invalide' },
          { field: 'password', message: 'Mot de passe trop court' },
        ],
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
      })

      await signupHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(false)
      expect(data.errors).toBeDefined()
    })

    it('devrait vérifier la disponibilité d\'un email', async () => {
      const { AuthService } = require('../../lib/services/auth.service')
      AuthService.findByEmail.mockResolvedValue(null)

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'available@example.com' },
      })

      await signupHandler.GET(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.available).toBe(true)
    })

    it('devrait indiquer qu\'un email est déjà utilisé', async () => {
      const { AuthService } = require('../../lib/services/auth.service')
      AuthService.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      })

      const { req, res } = createMocks({
        method: 'GET',
        query: { email: 'existing@example.com' },
      })

      await signupHandler.GET(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.available).toBe(false)
    })
  })

  describe('POST /api/auth/verify-email', () => {
    it('devrait vérifier un token valide', async () => {
      const token = 'valid-token-123'
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        verified: true,
        verificationLevel: 1,
      }

      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.verifyEmailToken.mockResolvedValue({
        success: true,
        message: 'Email vérifié avec succès',
        user: mockUser,
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: { token },
      })

      await verifyEmailHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.user).toEqual(mockUser)
    })

    it('devrait rejeter un token invalide', async () => {
      const token = 'invalid-token'

      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.verifyEmailToken.mockResolvedValue({
        success: false,
        message: 'Token de vérification invalide',
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: { token },
      })

      await verifyEmailHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(false)
      expect(data.message).toContain('invalide')
    })

    it('devrait gérer la vérification par URL (GET)', async () => {
      const token = 'url-token-123'
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        verified: true,
      }

      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.verifyEmailToken.mockResolvedValue({
        success: true,
        message: 'Email vérifié avec succès',
        user: mockUser,
      })

      const { req, res } = createMocks({
        method: 'GET',
        query: { token },
      })

      await verifyEmailHandler.GET(req, res)

      expect(res._getStatusCode()).toBe(307) // Redirection temporaire
      expect(res._getRedirectUrl()).toBe('/verification/success')
    })

    it('devrait rediriger vers la page d\'erreur pour un token invalide', async () => {
      const token = 'invalid-token'

      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.verifyEmailToken.mockResolvedValue({
        success: false,
        message: 'Token invalide',
      })

      const { req, res } = createMocks({
        method: 'GET',
        query: { token },
      })

      await verifyEmailHandler.GET(req, res)

      expect(res._getStatusCode()).toBe(307)
      expect(res._getRedirectUrl()).toBe('/verification/error?message=Token%20invalide')
    })
  })

  describe('POST /api/auth/resend-verification', () => {
    it('devrait renvoyer un email de vérification', async () => {
      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.sendVerificationEmail.mockResolvedValue({
        success: true,
        message: 'Email de vérification envoyé',
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: { email: 'test@example.com' },
      })

      await resendVerificationHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(true)
      expect(data.message).toContain('envoyé')
    })

    it('devrait gérer les erreurs de renvoi', async () => {
      const { VerificationService } = require('../../lib/services/verification.service')
      VerificationService.sendVerificationEmail.mockResolvedValue({
        success: false,
        message: 'Erreur lors de l\'envoi',
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: { email: 'test@example.com' },
      })

      await resendVerificationHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(false)
      expect(data.message).toContain('erreur')
    })
  })

  describe('Gestion des erreurs', () => {
    it('devrait gérer les erreurs de serveur', async () => {
      const { AuthService } = require('../../lib/services/auth.service')
      AuthService.signUpWithCredentials.mockRejectedValue(new Error('Server error'))

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          acceptTerms: true,
        },
      })

      await signupHandler.POST(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.success).toBe(false)
      expect(data.message).toContain('erreur')
    })

    it('devrait rejeter les méthodes non supportées', async () => {
      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await signupHandler.DELETE(req, res)

      expect(res._getStatusCode()).toBe(405)
      const data = JSON.parse(res._getData())
      expect(data.message).toContain('méthode non autorisée')
    })
  })
}) 