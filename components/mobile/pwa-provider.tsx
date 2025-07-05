"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { Download, X, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Types
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAContextType {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  installApp: () => Promise<void>
  updateAvailable: boolean
  cacheSize: number
  clearCache: () => Promise<void>
}

// Context
const PWAContext = createContext<PWAContextType | null>(null)

export const usePWA = () => {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWA must be used within PWAProvider')
  }
  return context
}

// Components
interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isInWebApp = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebApp)
    }

    // Gérer l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setIsInstallable(true)
      
      // Afficher le prompt après un délai si pas encore installé
      if (!isInstalled) {
        setTimeout(() => setShowInstallPrompt(true), 10000)
      }
    }

    // Gérer l'installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setShowInstallPrompt(false)
      console.log('[PWA] Application installée')
    }

    // Gérer le statut en ligne/hors ligne
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Enregistrer le service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          console.log('[PWA] Service Worker enregistré')

          // Écouter les mises à jour
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        } catch (error) {
          console.error('[PWA] Erreur Service Worker:', error)
        }
      }
    }

    // Obtenir la taille du cache
    const getCacheSize = async () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'GET_CACHE_SIZE' })
      }
    }

    // Initialisation
    checkIfInstalled()
    setIsOnline(navigator.onLine)
    registerServiceWorker()
    getCacheSize()

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Service Worker messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CACHE_SIZE') {
        setCacheSize(event.data.size)
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage)
      }
    }
  }, [isInstalled])

  const installApp = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Installation acceptée')
      } else {
        console.log('[PWA] Installation refusée')
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('[PWA] Erreur installation:', error)
    }
  }

  const clearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' })
      setCacheSize(0)
    }
  }

  const contextValue: PWAContextType = {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    updateAvailable,
    cacheSize,
    clearCache,
  }

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      
      {/* Prompt d'installation */}
      {showInstallPrompt && isInstallable && !isInstalled && (
        <InstallPrompt onInstall={installApp} onDismiss={() => setShowInstallPrompt(false)} />
      )}
      
      {/* Indicateur de connexion */}
      <NetworkStatus isOnline={isOnline} />
      
      {/* Notification de mise à jour */}
      {updateAvailable && (
        <UpdateNotification onUpdate={() => window.location.reload()} />
      )}
    </PWAContext.Provider>
  )
}

// Composant Prompt d'installation
function InstallPrompt({ onInstall, onDismiss }: { onInstall: () => void; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="bg-black/95 border-[#D4AF37] text-white">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
              <Download size={16} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Installer Le Papasito</h3>
              <p className="text-xs text-gray-300 mt-1">
                Accès rapide et expérience optimisée
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={onInstall}
              className="flex-1 bg-[#D4AF37] text-black hover:bg-[#F4C430] h-8 text-xs"
            >
              Installer
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 h-8 text-xs"
            >
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant Indicateur de connexion
function NetworkStatus({ isOnline }: { isOnline: boolean }) {
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true)
    } else {
      const timer = setTimeout(() => setShowOffline(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline])

  if (!showOffline && isOnline) return null

  return (
    <div className={`fixed top-16 left-4 right-4 z-40 md:left-auto md:right-4 md:w-64 transition-all duration-300 ${
      isOnline ? 'animate-in slide-in-from-top' : ''
    }`}>
      <Card className={`${
        isOnline 
          ? 'bg-green-600/95 border-green-500 text-white' 
          : 'bg-red-600/95 border-red-500 text-white'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi size={16} />
            ) : (
              <WifiOff size={16} />
            )}
            <span className="text-sm font-medium">
              {isOnline ? 'Connexion rétablie' : 'Hors ligne'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant Notification de mise à jour
function UpdateNotification({ onUpdate }: { onUpdate: () => void }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="bg-blue-600/95 border-blue-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Download size={16} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">Mise à jour disponible</h3>
              <p className="text-xs text-blue-100 mt-1">
                Nouvelle version avec améliorations
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-blue-200 hover:text-white p-1"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={onUpdate}
              className="flex-1 bg-white text-blue-600 hover:bg-blue-50 h-8 text-xs"
            >
              Mettre à jour
            </Button>
            <Button
              onClick={() => setDismissed(true)}
              variant="outline"
              className="flex-1 border-blue-400 text-blue-100 hover:bg-blue-500 h-8 text-xs"
            >
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAProvider 