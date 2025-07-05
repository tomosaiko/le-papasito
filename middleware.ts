import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Middleware NextAuth.js pour la protection des routes
 * Gère l'authentification et les autorisations selon les rôles
 */
export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role
  const isVerified = req.auth?.user?.verified

  // Routes publiques (accessibles sans authentification)
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/api/auth',
    '/api/verification',
    '/escorts',
    '/prive',
    '/hotesses',
    '/search',
    '/sponsor',
    '/terms',
    '/verification',
    '/ui-showcase',
    '/demo',
    '/demo-upload',
  ]

  // Routes protégées nécessitant une authentification
  const protectedRoutes = [
    '/dashboard',
    '/messages',
    '/booking',
    '/profile',
    '/abonnement',
    '/referral',
    '/disponibilite',
    '/new-profile',
  ]

  // Routes réservées aux escorts
  const escortRoutes = [
    '/escort-dashboard',
    '/escort-registration',
    '/disponibilite',
  ]

  // Routes réservées aux annonceurs
  const advertiserRoutes = [
    '/advertiser-dashboard',
    '/advertiser-registration',
    '/sponsoring',
  ]

  // Routes d'administration
  const adminRoutes = [
    '/admin',
  ]

  // Routes d'authentification (à éviter si déjà connecté)
  const authRoutes = [
    '/login',
    '/signup',
  ]

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // Vérifier si c'est une route d'authentification
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // Vérifier si c'est une route escort
  const isEscortRoute = escortRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // Vérifier si c'est une route annonceur
  const isAdvertiserRoute = advertiserRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // Vérifier si c'est une route admin
  const isAdminRoute = adminRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  )

  // 1. Rediriger les utilisateurs connectés loin des pages d'authentification
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // 2. Permettre l'accès aux routes publiques
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // 3. Bloquer l'accès aux routes protégées pour les utilisateurs non connectés
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 4. Vérifier les permissions spécifiques par rôle
  if (isLoggedIn) {
    // Routes admin
    if (isAdminRoute && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }

    // Routes escort
    if (isEscortRoute && userRole !== 'ESCORT') {
      return NextResponse.redirect(new URL('/escort-registration', nextUrl))
    }

    // Routes annonceur (pour l'instant, tout le monde peut y accéder)
    if (isAdvertiserRoute) {
      // Logique spécifique aux annonceurs si nécessaire
    }

    // 5. Vérifier le niveau de vérification pour certaines routes sensibles
    const verificationRequiredRoutes = [
      '/booking',
      '/messages',
      '/escort-dashboard',
    ]

    const requiresVerification = verificationRequiredRoutes.some(route => 
      nextUrl.pathname.startsWith(route)
    )

    if (requiresVerification && !isVerified) {
      return NextResponse.redirect(new URL('/verification', nextUrl))
    }
  }

  // 6. Gestion des redirections post-inscription
  if (isLoggedIn && nextUrl.pathname === '/new-profile') {
    // Rediriger vers le dashboard approprié selon le rôle
    if (userRole === 'ESCORT') {
      return NextResponse.redirect(new URL('/escort-dashboard', nextUrl))
    } else {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  // 7. Gestion des API routes
  if (nextUrl.pathname.startsWith('/api/')) {
    // Les API routes d'authentification sont ouvertes
    if (nextUrl.pathname.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // API de demo publique pour les tests
    if (nextUrl.pathname.startsWith('/api/upload/demo')) {
      return NextResponse.next()
    }

    // Les autres API routes nécessitent une authentification
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
  }

  // Permettre l'accès par défaut
  return NextResponse.next()
})

// Configuration du matcher pour spécifier les routes à traiter
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 