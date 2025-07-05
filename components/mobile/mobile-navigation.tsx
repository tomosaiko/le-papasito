"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  MessageCircle, 
  User, 
  Settings,
  Heart,
  Calendar,
  CreditCard,
  LogOut,
  Shield,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavigationProps {
  isAuthenticated?: boolean
  userRole?: 'USER' | 'ESCORT' | 'ADMIN'
  userName?: string
  userAvatar?: string
  onLogout?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  roles?: ('USER' | 'ESCORT' | 'ADMIN')[]
}

const navItems: NavItem[] = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Recherche', href: '/search', icon: Search },
  { label: 'Messages', href: '/messages', icon: MessageCircle, badge: 3 },
  { label: 'Dashboard', href: '/dashboard', icon: User, roles: ['USER'] },
  { label: 'Dashboard Escort', href: '/escort-dashboard', icon: Shield, roles: ['ESCORT'] },
  { label: 'Favoris', href: '/favorites', icon: Heart },
  { label: 'Réservations', href: '/bookings', icon: Calendar },
  { label: 'Paiements', href: '/payments', icon: CreditCard },
  { label: 'Avis', href: '/reviews', icon: Star },
  { label: 'Paramètres', href: '/settings', icon: Settings },
]

export function MobileNavigation({ 
  isAuthenticated = false, 
  userRole = 'USER',
  userName = '',
  userAvatar = '',
  onLogout 
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  // Gérer le scroll pour masquer/afficher la navigation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scroll vers le bas - masquer
        setIsVisible(false)
      } else {
        // Scroll vers le haut - afficher
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Fermer le menu lors du changement de route
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Filtrer les éléments de navigation selon le rôle
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  )

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Header Mobile Fixe */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800 transition-transform duration-300 md:hidden",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">LP</span>
            </div>
            <span className="text-white font-semibold text-lg">Le Papasito</span>
          </Link>

          {/* Bouton Menu Hamburger */}
          <button
            onClick={toggleMenu}
            className="p-2 text-white hover:text-[#D4AF37] transition-colors"
            aria-label="Menu de navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu de Navigation Sliding */}
      <nav className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-lg border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header du Menu */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold text-lg">Navigation</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profil Utilisateur */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-black" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">
                    {userName || 'Utilisateur'}
                  </p>
                  <p className="text-gray-400 text-sm capitalize">
                    {userRole.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Liste de Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors relative",
                        isActive && "text-[#D4AF37] bg-[#D4AF37]/10 border-r-2 border-[#D4AF37]"
                      )}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                      
                      {/* Badge */}
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Actions du Menu */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#F4C430] transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 w-full bg-red-600/10 border border-red-600 text-red-400 py-3 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-colors"
              >
                <LogOut size={18} />
                <span>Se déconnecter</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer pour éviter que le contenu soit masqué */}
      <div className="h-14 md:hidden" />
    </>
  )
}

export default MobileNavigation 