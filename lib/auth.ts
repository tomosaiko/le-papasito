import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { AuthService } from '@/lib/services/auth.service'
import { User, UserRole } from '@prisma/client'

// Extension du type Session pour inclure nos champs personnalisés
declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    avatar?: string
    role: UserRole
    verified: boolean
    verificationLevel: number
    escortProfile?: any
    subscription?: any
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      avatar?: string
      role: UserRole
      verified: boolean
      verificationLevel: number
      escortProfile?: any
      subscription?: any
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    verified: boolean
    verificationLevel: number
    escortProfile?: any
    subscription?: any
  }
}

/**
 * Configuration NextAuth.js v5
 * Supporte Google OAuth et authentification par email/mot de passe
 */
export const authConfig: NextAuthConfig = {
  // Adaptateur Prisma pour la persistance
  adapter: PrismaAdapter(prisma),
  
  // Providers d'authentification
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    // Authentification par email/mot de passe
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Authentification via notre service
          const user = await AuthService.signInWithCredentials(
            credentials.email as string,
            credentials.password as string
          )

          if (!user) {
            return null
          }

          // Retourner l'utilisateur dans le format attendu par NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            verified: user.verified,
            verificationLevel: user.verificationLevel,
            escortProfile: user.escortProfile,
            subscription: user.subscription,
          }
        } catch (error) {
          console.error('[NextAuth] Erreur authentification:', error)
          return null
        }
      },
    }),
  ],

  // Configuration des pages personnalisées
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/login',
    verifyRequest: '/verification',
    newUser: '/new-profile',
  },

  // Configuration des sessions
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  // Callbacks pour personnaliser le comportement
  callbacks: {
    // Callback JWT - Appelé chaque fois qu'un JWT est créé/mis à jour
    async jwt({ token, user, account }) {
      // Lors de la connexion initiale
      if (account && user) {
        token.id = user.id
        token.role = user.role
        token.verified = user.verified
        token.verificationLevel = user.verificationLevel
        token.escortProfile = user.escortProfile
        token.subscription = user.subscription
      }

      // Mettre à jour les données utilisateur si nécessaire
      if (token.email && (!token.id || !token.role)) {
        const dbUser = await AuthService.findByEmailWithAuth(token.email)
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.verified = dbUser.verified
          token.verificationLevel = dbUser.verificationLevel
          token.escortProfile = dbUser.escortProfile
          token.subscription = dbUser.subscription
        }
      }

      return token
    },

    // Callback Session - Appelé chaque fois qu'une session est vérifiée
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.verified = token.verified
        session.user.verificationLevel = token.verificationLevel
        session.user.escortProfile = token.escortProfile
        session.user.subscription = token.subscription
      }

      // Mettre à jour la dernière activité
      if (session.user.id) {
        await AuthService.updateLastActive(session.user.id)
      }

      return session
    },

    // Callback SignIn - Appelé lors de la connexion
    async signIn({ user, account, profile }) {
      try {
        // Connexion OAuth (Google)
        if (account?.provider === 'google' && profile?.email) {
          await AuthService.createUserWithAuth({
            email: profile.email,
            name: profile.name || 'Utilisateur',
            avatar: profile.picture,
            role: 'USER',
            emailVerified: new Date(),
          })
        }

        return true
      } catch (error) {
        console.error('[NextAuth] Erreur callback signIn:', error)
        return false
      }
    },

    // Callback Redirect - Contrôle les redirections
    async redirect({ url, baseUrl }) {
      // Rediriger vers l'URL demandée si elle est sur le même domaine
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Rediriger vers la page d'accueil si c'est une URL externe
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },

  // Configuration des événements
  events: {
    async signIn({ user, account, profile }) {
      console.log(`[NextAuth] Connexion réussie: ${user.email} via ${account?.provider}`)
    },
    async signOut({ session }) {
      console.log(`[NextAuth] Déconnexion: ${session?.user?.email}`)
    },
    async createUser({ user }) {
      console.log(`[NextAuth] Nouvel utilisateur créé: ${user.email}`)
    },
  },

  // Configuration de sécurité
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Configuration de sécurité additionnelle
  useSecureCookies: process.env.NODE_ENV === 'production',
  trustHost: true,

  // Configuration de debug (seulement en développement)
  debug: process.env.NODE_ENV === 'development',
}

// Export de NextAuth configuré
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)

// Helpers pour l'authentification
export const getServerSession = auth

// Middleware d'authentification
export async function requireAuth() {
  const session = await auth()
  if (!session) {
    throw new Error('Non authentifié')
  }
  return session
}

// Middleware de vérification de rôle
export async function requireRole(allowedRoles: UserRole[]) {
  const session = await requireAuth()
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error('Accès refusé')
  }
  return session
}

// Middleware de vérification escort
export async function requireEscort() {
  return await requireRole(['ESCORT'])
}

// Middleware de vérification admin
export async function requireAdmin() {
  return await requireRole(['ADMIN'])
}

// Vérifier si l'utilisateur est vérifié
export async function requireVerified() {
  const session = await requireAuth()
  if (!session.user.verified) {
    throw new Error('Compte non vérifié')
  }
  return session
}

export default authConfig 