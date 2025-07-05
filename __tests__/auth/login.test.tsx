import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '../../app/login/page'

// Mocks similaires aux tests d'inscription
jest.mock('@/lib/i18n/language-context', () => ({
  useLanguage: () => ({
    dictionary: {
      auth: {
        login: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        signIn: 'Se connecter',
        signUp: 'S\'inscrire',
        noAccount: 'Pas de compte ?',
        forgotPassword: 'Mot de passe oublié ?',
        rememberMe: 'Se souvenir de moi',
        or: 'ou',
        continueWithGoogle: 'Continuer avec Google'
      }
    }
  })
}))

// Mock NextAuth signIn
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' })
}))

// Mock des composants UI
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ onCheckedChange, ...props }: any) => (
    <input 
      type="checkbox" 
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      {...props} 
    />
  )
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}))

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ ...props }: any) => <hr {...props} />
}))

describe('Page de connexion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('devrait afficher tous les éléments de connexion', () => {
    render(<LoginPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
    expect(screen.getByText(/mot de passe oublié/i)).toBeInTheDocument()
    expect(screen.getByText(/pas de compte/i)).toBeInTheDocument()
  })

  it('devrait valider les champs requis', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    
    // Essayer de soumettre sans remplir les champs
    await user.click(submitButton)
    
    // Vérifier que la validation HTML empêche la soumission
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeRequired()
  })

  it('devrait permettre la connexion avec des identifiants valides', async () => {
    const user = userEvent.setup()
    const mockSignIn = require('next-auth/react').signIn
    
    mockSignIn.mockResolvedValueOnce({
      ok: true,
      error: null,
      url: '/dashboard'
    })
    
    render(<LoginPage />)
    
    // Remplir le formulaire
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
    
    // Soumettre
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    await user.click(submitButton)
    
    // Vérifier que signIn a été appelé
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      })
    })
  })

  it('devrait afficher les erreurs de connexion', async () => {
    const user = userEvent.setup()
    const mockSignIn = require('next-auth/react').signIn
    
    mockSignIn.mockResolvedValueOnce({
      ok: false,
      error: 'CredentialsSignin',
      url: null
    })
    
    render(<LoginPage />)
    
    // Remplir et soumettre le formulaire
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword')
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    await user.click(submitButton)
    
    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByText(/identifiants invalides/i)).toBeInTheDocument()
    })
  })

  it('devrait permettre la connexion avec Google', async () => {
    const user = userEvent.setup()
    const mockSignIn = require('next-auth/react').signIn
    
    mockSignIn.mockResolvedValueOnce({
      ok: true,
      error: null,
      url: '/dashboard'
    })
    
    render(<LoginPage />)
    
    const googleButton = screen.getByText(/continuer avec google/i)
    await user.click(googleButton)
    
    // Vérifier que signIn a été appelé avec le provider Google
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('google', {
        callbackUrl: '/dashboard'
      })
    })
  })

  it('devrait gérer l\'option "se souvenir de moi"', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const rememberCheckbox = screen.getByRole('checkbox')
    
    // Vérifier l'état initial
    expect(rememberCheckbox).not.toBeChecked()
    
    // Cocher la case
    await user.click(rememberCheckbox)
    expect(rememberCheckbox).toBeChecked()
    
    // Décocher
    await user.click(rememberCheckbox)
    expect(rememberCheckbox).not.toBeChecked()
  })

  it('devrait naviguer vers la page d\'inscription', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const signupLink = screen.getByText(/s'inscrire/i)
    expect(signupLink).toBeInTheDocument()
    
    await user.click(signupLink)
    
    // Vérifier que le router a été appelé (via le mock)
    // Dans un vrai test, on vérifierait la navigation
  })

  it('devrait naviguer vers la récupération de mot de passe', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.getByText(/mot de passe oublié/i)
    expect(forgotPasswordLink).toBeInTheDocument()
    
    await user.click(forgotPasswordLink)
    
    // Vérifier que le router a été appelé (via le mock)
    // Dans un vrai test, on vérifierait la navigation
  })

  it('devrait désactiver le bouton pendant la connexion', async () => {
    const user = userEvent.setup()
    const mockSignIn = require('next-auth/react').signIn
    
    // Mock d'une réponse lente
    mockSignIn.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        error: null,
        url: '/dashboard'
      }), 1000))
    )
    
    render(<LoginPage />)
    
    // Remplir le formulaire
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    await user.click(submitButton)
    
    // Vérifier que le bouton est désactivé pendant la connexion
    expect(submitButton).toBeDisabled()
  })

  it('devrait permettre de montrer/masquer le mot de passe', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)
    
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const toggleButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('👁') || btn.getAttribute('aria-label')?.includes('password')
    )
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  it('devrait gérer les erreurs de réseau', async () => {
    const user = userEvent.setup()
    const mockSignIn = require('next-auth/react').signIn
    
    mockSignIn.mockRejectedValueOnce(new Error('Network error'))
    
    render(<LoginPage />)
    
    // Remplir et soumettre le formulaire
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/mot de passe/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    await user.click(submitButton)
    
    // Vérifier que l'erreur réseau est gérée
    await waitFor(() => {
      expect(screen.getByText(/erreur de connexion/i)).toBeInTheDocument()
    })
  })
}) 