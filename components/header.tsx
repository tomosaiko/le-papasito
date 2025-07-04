"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, Search, User, MoreVertical, ChevronDown, MessageSquare, Bell } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { language, setLanguage, dictionary } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true)
  const [hasNotifications, setHasNotifications] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Remplacer la fonction toggleMenu existante par celle-ci
  const openMenu = () => setIsMenuOpen(true)
  const closeMenu = () => setIsMenuOpen(false)

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Fermer le menu lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Détecter le scroll pour changer l'apparence du header
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"
      } border-b border-border`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="mr-4 md:mr-8">
              <div className="text-xl md:text-2xl font-bold text-purple-500 hover:text-purple-400 transition-colors">
                HEY PAPASITO
              </div>
            </Link>

            {/* Desktop Navigation - Optimisé pour tablettes et desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/hotesses">
                <Button
                  variant="ghost"
                  className="text-sm md:text-base hover:text-gold-light transition-colors px-2 md:px-4 py-2"
                >
                  Nos hôtesses
                </Button>
              </Link>

              <Link href="/disponibilite">
                <Button
                  variant="ghost"
                  className="text-sm md:text-base hover:text-gold-light transition-colors px-2 md:px-4 py-2"
                >
                  Disponibilité
                </Button>
              </Link>

              <Link href="/emploi">
                <Button
                  variant="ghost"
                  className="text-sm md:text-base hover:text-gold-light transition-colors px-2 md:px-4 py-2"
                >
                  Emploi
                </Button>
              </Link>
              <Link href="/abonnement">
                <Button
                  variant="ghost"
                  className="text-sm md:text-base hover:text-gold-light transition-colors px-2 md:px-4 py-2"
                >
                  Abonnement
                </Button>
              </Link>
            </nav>
          </div>

          {/* Right side icons - Optimisés pour tous les écrans */}
          <div className="flex items-center space-x-1 md:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative bg-zinc-800 rounded-full w-8 h-8 md:w-10 md:h-10 text-white hover:bg-purple-500 transition-colors"
              aria-label="Recherche"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative bg-zinc-800 rounded-full w-8 h-8 md:w-10 md:h-10 text-white hover:bg-purple-500 transition-colors"
              aria-label="Messages"
            >
              <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
              {hasUnreadMessages && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 p-0 flex items-center justify-center"
                >
                  <span className="sr-only">Messages non lus</span>
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative bg-zinc-800 rounded-full w-8 h-8 md:w-10 md:h-10 text-white hover:bg-purple-500 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {hasNotifications && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-3 w-3 md:h-4 md:w-4 p-0 flex items-center justify-center"
                >
                  <span className="sr-only">Notifications non lues</span>
                </Badge>
              )}
            </Button>

            <ThemeToggle />

            <div className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="bg-zinc-800 rounded-full w-10 h-10 text-white hover:bg-purple-500 transition-colors"
                aria-label="Plus d'options"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Sélecteur de langue - Optimisé pour tous les écrans */}
            <div className="hidden md:flex">
              <button
                onClick={() => setLanguage("en")}
                className={`w-10 h-8 flex items-center justify-center border border-white ${language === "en" ? "bg-purple-500" : "bg-black"} transition-colors`}
                aria-label="English"
                aria-pressed={language === "en"}
              >
                <span className="text-white font-medium">EN</span>
              </button>
              <button
                onClick={() => setLanguage("fr")}
                className={`w-10 h-8 flex items-center justify-center border border-white ${language === "fr" ? "bg-purple-500" : "bg-black"} transition-colors`}
                aria-label="Français"
                aria-pressed={language === "fr"}
              >
                <span className="text-white font-medium">FR</span>
              </button>
              <button
                onClick={() => setLanguage("nl")}
                className={`w-10 h-8 flex items-center justify-center border border-white ${language === "nl" ? "bg-purple-500" : "bg-black"} transition-colors`}
                aria-label="Nederlands"
                aria-pressed={language === "nl"}
              >
                <span className="text-white font-medium">NL</span>
              </button>
            </div>

            {/* Mobile Menu Button - Optimisé pour mobile */}
            <div className="md:hidden">
              {isMenuOpen ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={closeMenu}
                  className="bg-purple-500 text-white border-none rounded-full w-10 h-10 shadow-md hover:bg-purple-600 transition-all"
                  aria-label="Fermer le menu"
                  aria-expanded={true}
                >
                  <X className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={openMenu}
                  className="bg-purple-500 text-white border-none rounded-full w-10 h-10 shadow-md hover:bg-purple-600 transition-all"
                  aria-label="Ouvrir le menu"
                  aria-expanded={false}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Optimisé pour mobile avec animations */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg z-50 animate-in slide-in-from-top duration-300"
          >
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="text-foreground"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col space-y-2">
                <div className="font-medium text-lg text-purple-500">Navigation</div>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/hotesses"
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <span className="text-foreground">Nos hôtesses</span>
                  </Link>
                  <Link
                    href="/disponibilite"
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <span className="text-foreground">Disponibilité</span>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="font-medium text-lg text-purple-500">Autres</div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/emploi"
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <span className="text-foreground">Emploi</span>
                  </Link>
                  <Link
                    href="/sponsoring"
                    className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <span className="text-foreground">Sponsoring</span>
                  </Link>
                  <Link
                    href="/abonnement"
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg hover:opacity-90 transition-colors"
                  >
                    <span className="text-white font-medium">Abonnement</span>
                  </Link>
                </div>
              </div>

              {/* Sélecteur de langue mobile */}
              <div className="py-3">
                <div className="font-medium text-lg text-purple-500 mb-2">Langue</div>
                <div className="flex justify-start space-x-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`w-12 h-10 flex items-center justify-center rounded-md ${language === "en" ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-foreground"} transition-colors`}
                  >
                    <span className="font-medium">EN</span>
                  </button>
                  <button
                    onClick={() => setLanguage("fr")}
                    className={`w-12 h-10 flex items-center justify-center rounded-md ${language === "fr" ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-foreground"} transition-colors`}
                  >
                    <span className="font-medium">FR</span>
                  </button>
                  <button
                    onClick={() => setLanguage("nl")}
                    className={`w-12 h-10 flex items-center justify-center rounded-md ${language === "nl" ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-foreground"} transition-colors`}
                  >
                    <span className="font-medium">NL</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>Connexion</span>
                  </Link>
                  <Link href="/inscription">
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 h-12 rounded-lg text-base">
                      Inscription
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
