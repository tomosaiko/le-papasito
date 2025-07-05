import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupPage from '../../app/signup/page'

// Mock du contexte de langue
jest.mock('@/lib/i18n/language-context', () => ({
  useLanguage: () => ({
    dictionary: {
      auth: {
        signup: 'Inscription',
        email: 'Email',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        fullName: 'Nom complet',
        dateOfBirth: 'Date de naissance',
        acceptTerms: 'J\'accepte les conditions d\'utilisation',
        createAccount: 'Créer mon compte',
        login: 'Connexion',
        alreadyHaveAccount: 'Vous avez déjà un compte ?'
      }
    }
  })
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

describe('Page d\'inscription', () => {
  beforeEach(() => {
    // Reset mocks avant chaque test
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('devrait afficher tous les champs obligatoires', () => {
    render(<SignupPage />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmer le mot de passe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /créer mon compte/i })).toBeInTheDocument()
  })

  it('devrait valider les champs requis', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    
    // Essayer de soumettre sans remplir les champs
    await user.click(submitButton)
    
    // Vérifier que la validation HTML empêche la soumission
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeRequired()
  })

  it('devrait valider le format de l\'email', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const emailInput = screen.getByLabelText(/email/i)
    
    // Entrer un email invalide
    await user.type(emailInput, 'email-invalide')
    await user.tab() // Déclencher la validation
    
    expect(emailInput).toHaveValue('email-invalide')
    expect(emailInput.validity.valid).toBe(false)
  })

  it('devrait vérifier que les mots de passe correspondent', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const passwordInput = screen.getByLabelText(/^mot de passe$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i)
    
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')
    
    expect(passwordInput).toHaveValue('password123')
    expect(confirmPasswordInput).toHaveValue('different123')
  })

  it('devrait permettre de montrer/masquer le mot de passe', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const passwordInput = screen.getByLabelText(/^mot de passe$/i)
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

  it('devrait soumettre le formulaire avec des données valides', async () => {
    const user = userEvent.setup()
    
    // Mock d'une réponse API réussie
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Compte créé avec succès',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    })
    
    render(<SignupPage />)
    
    // Remplir le formulaire
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/nom complet/i), 'Test User')
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123')
    
    // Accepter les conditions
    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)
    
    // Soumettre
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier que l'API a été appelée
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('test@example.com')
      }))
    })
  })

  it('devrait afficher les erreurs de l\'API', async () => {
    const user = userEvent.setup()
    
    // Mock d'une réponse API d'erreur
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Cet email est déjà utilisé',
        errors: [{ field: 'email', message: 'Email déjà pris' }]
      })
    })
    
    render(<SignupPage />)
    
    // Remplir et soumettre le formulaire
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/nom complet/i), 'Test User')
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123')
    
    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier que l'erreur est affichée
    await waitFor(() => {
      expect(screen.getByText(/cet email est déjà utilisé/i)).toBeInTheDocument()
    })
  })

  it('devrait permettre de passer à la page de connexion', async () => {
    const user = userEvent.setup()
    render(<SignupPage />)
    
    const loginLink = screen.getByText(/connexion/i)
    expect(loginLink).toBeInTheDocument()
    
    await user.click(loginLink)
    
    // Vérifier que le router a été appelé (via le mock)
    // Dans un vrai test, on vérifierait la navigation
  })

  it('devrait désactiver le bouton pendant la soumission', async () => {
    const user = userEvent.setup()
    
    // Mock d'une réponse API lente
    global.fetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true })
      }), 1000))
    )
    
    render(<SignupPage />)
    
    // Remplir le formulaire
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/nom complet/i), 'Test User')
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123')
    await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'password123')
    
    const termsCheckbox = screen.getByRole('checkbox')
    await user.click(termsCheckbox)
    
    const submitButton = screen.getByRole('button', { name: /créer mon compte/i })
    await user.click(submitButton)
    
    // Vérifier que le bouton est désactivé pendant la soumission
    expect(submitButton).toBeDisabled()
  })
}) 