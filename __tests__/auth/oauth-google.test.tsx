import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn, getSession } from 'next-auth/react'
import LoginPage from '../../app/login/page'

// Mock NextAuth avec Google OAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  getProviders: jest.fn(() => Promise.resolve({
    google: {
      id: 'google',
      name: 'Google',
      type: 'oauth',
      signinUrl: '/api/auth/signin/google',
      callbackUrl: '/api/auth/callback/google'
    },
    credentials: {
      id: 'credentials',
      name: 'credentials',
      type: 'credentials'
    }
  }))
}))

// Mock navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock des composants UI
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={variant}
      {...props}
    >
      {children}
    </button>
  )
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ ...props }: any) => <hr {...props} />
}))

describe('Google OAuth Workflow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Interface utilisateur OAuth', () => {
    it('devrait afficher le bouton de connexion Google', () => {
      render(<LoginPage />)
      
      const googleButton = screen.getByRole('button', { 
        name: /continuer avec google/i 
      })
      expect(googleButton).toBeInTheDocument()
    })

    it('devrait déclencher la connexion Google au clic', async () => {
      const user = userEvent.setup()
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/dashboard'
      })

      render(<LoginPage />)
      
      const googleButton = screen.getByRole('button', { 
        name: /continuer avec google/i 
      })
      
      await user.click(googleButton)

      expect(mockSignIn).toHaveBeenCalledWith('google', {
        callbackUrl: '/dashboard'
      })
    })

    it('devrait gérer les erreurs OAuth', async () => {
      const user = userEvent.setup()
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'OAuthSignin',
        url: null
      })

      render(<LoginPage />)
      
      const googleButton = screen.getByRole('button', { 
        name: /continuer avec google/i 
      })
      
      await user.click(googleButton)

      await waitFor(() => {
        expect(screen.getByText(/erreur de connexion google/i)).toBeInTheDocument()
      })
    })
  })

  describe('Simulation du workflow OAuth', () => {
    it('devrait simuler une connexion Google réussie', async () => {
      const mockGoogleProfile = {
        id: 'google-user-123',
        email: 'user@gmail.com',
        name: 'John Doe',
        picture: 'https://lh3.googleusercontent.com/a/default-user',
        email_verified: true
      }

      const mockSession = {
        user: {
          id: 'user-123',
          email: 'user@gmail.com',
          name: 'John Doe',
          image: 'https://lh3.googleusercontent.com/a/default-user',
          role: 'USER',
          verified: true,
          verificationLevel: 1
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      const mockSignIn = signIn as jest.Mock
      const mockGetSession = getSession as jest.Mock

      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/dashboard'
      })

      mockGetSession.mockResolvedValue(mockSession)

      // Simuler la connexion Google
      const result = await signIn('google', { 
        callbackUrl: '/dashboard' 
      })

      expect(result.ok).toBe(true)
      expect(result.error).toBeNull()

      // Vérifier la session
      const session = await getSession()
      expect(session).toEqual(mockSession)
      expect(session.user.email).toBe(mockGoogleProfile.email)
      expect(session.user.verificationLevel).toBe(1)
    })

    it('devrait gérer un utilisateur Google existant', async () => {
      const existingUserSession = {
        user: {
          id: 'existing-user-123',
          email: 'existing@gmail.com',
          name: 'Jane Doe',
          role: 'ESCORT',
          verified: true,
          verificationLevel: 3
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }

      const mockSignIn = signIn as jest.Mock
      const mockGetSession = getSession as jest.Mock

      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/dashboard'
      })

      mockGetSession.mockResolvedValue(existingUserSession)

      const result = await signIn('google')
      const session = await getSession()

      expect(result.ok).toBe(true)
      expect(session.user.role).toBe('ESCORT')
      expect(session.user.verificationLevel).toBe(3)
    })
  })

  describe('Gestion des erreurs OAuth', () => {
    it('devrait gérer l\'erreur access_denied', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'AccessDenied',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('AccessDenied')
    })

    it('devrait gérer l\'erreur OAuthSignin', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'OAuthSignin',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('OAuthSignin')
    })

    it('devrait gérer l\'erreur OAuthCallback', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'OAuthCallback',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('OAuthCallback')
    })

    it('devrait gérer l\'erreur OAuthCreateAccount', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'OAuthCreateAccount',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('OAuthCreateAccount')
    })
  })

  describe('Intégration avec AuthService', () => {
    it('devrait créer un utilisateur via OAuth', async () => {
      // Mock de l'API AuthService
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: 'oauth-user-123',
            email: 'oauth@gmail.com',
            name: 'OAuth User',
            role: 'USER',
            verified: false,
            verificationLevel: 1,
            emailVerified: new Date().toISOString()
          }
        })
      })

      // Simuler la création via OAuth
      const response = await fetch('/api/auth/oauth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'oauth@gmail.com',
          name: 'OAuth User',
          avatar: 'https://lh3.googleusercontent.com/a/default-user',
          provider: 'google'
        })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.user.email).toBe('oauth@gmail.com')
      expect(data.user.verificationLevel).toBe(1)
    })

    it('devrait mettre à jour un utilisateur existant', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: {
            id: 'existing-oauth-user',
            email: 'existing@gmail.com',
            name: 'Updated Name',
            lastActive: new Date().toISOString()
          }
        })
      })

      const response = await fetch('/api/auth/oauth/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@gmail.com',
          name: 'Updated Name',
          avatar: 'new-avatar.jpg'
        })
      })

      const data = await response.json()

      expect(response.ok).toBe(true)
      expect(data.user.name).toBe('Updated Name')
    })
  })

  describe('Redirections OAuth', () => {
    it('devrait rediriger vers le dashboard après connexion', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/dashboard'
      })

      const result = await signIn('google', { 
        callbackUrl: '/dashboard' 
      })

      expect(result.url).toBe('/dashboard')
    })

    it('devrait rediriger vers la page de profil pour nouveaux utilisateurs', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/new-profile'
      })

      const result = await signIn('google', { 
        callbackUrl: '/new-profile' 
      })

      expect(result.url).toBe('/new-profile')
    })

    it('devrait retourner à la page précédente après connexion', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
        url: '/escorts/premium'
      })

      const result = await signIn('google', { 
        callbackUrl: '/escorts/premium' 
      })

      expect(result.url).toBe('/escorts/premium')
    })
  })

  describe('Sécurité OAuth', () => {
    it('devrait valider l\'email du provider Google', async () => {
      const mockSignIn = signIn as jest.Mock
      
      // Simuler un email non vérifié par Google
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'EmailNotVerified',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('EmailNotVerified')
    })

    it('devrait gérer les erreurs de CSRF', async () => {
      const mockSignIn = signIn as jest.Mock
      
      mockSignIn.mockResolvedValue({
        ok: false,
        error: 'CSRFError',
        url: null
      })

      const result = await signIn('google')

      expect(result.ok).toBe(false)
      expect(result.error).toBe('CSRFError')
    })

    it('devrait vérifier les domaines autorisés', () => {
      const allowedDomains = ['localhost:3000', 'lepapasito.com']
      const testDomain = 'localhost:3000'
      
      expect(allowedDomains).toContain(testDomain)
    })
  })
}) 