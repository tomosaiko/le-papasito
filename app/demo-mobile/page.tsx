"use client"

import { useState } from 'react'
import { MobileCardStack } from '@/components/mobile/mobile-card-stack'
import { usePWA } from '@/components/mobile/pwa-provider'
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Heart, 
  Settings, 
  Share2,
  RefreshCw,
  Smartphone,
  Zap,
  Star,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Données de démonstration
const demoProfiles = [
  {
    id: '1',
    name: 'Sofia',
    age: 25,
    location: 'Paris 8ème',
    images: [
      '/elegant-woman-portrait.png',
      '/flowing-elegance.png',
      '/serene-gaze.png'
    ],
    rating: 4.9,
    reviews: 127,
    price: 200,
    isOnline: true,
    distance: '1.2 km',
    tags: ['Premium', 'Massage', 'Bilingue']
  },
  {
    id: '2',
    name: 'Isabella',
    age: 28,
    location: 'Cannes',
    images: [
      '/shimmering-emerald-gown.png',
      '/urban-chic.png',
      '/parisian-charm.png'
    ],
    rating: 4.8,
    reviews: 89,
    price: 350,
    isOnline: false,
    distance: '2.5 km',
    tags: ['VIP', 'Escort', 'Événements']
  },
  {
    id: '3',
    name: 'Gabrielle',
    age: 24,
    location: 'Monaco',
    images: [
      '/confident-gaze.png',
      '/serene-spa-retreat.png',
      '/tranquil-massage-space.png'
    ],
    rating: 4.7,
    reviews: 156,
    price: 180,
    isOnline: true,
    distance: '800 m',
    tags: ['Détente', 'Spa', 'Wellness']
  },
  {
    id: '4',
    name: 'Anastasia',
    age: 26,
    location: 'Nice',
    images: [
      '/golden-flow.png',
      '/serene-yoga-pose.png',
      '/aromatic-massage-oils.png'
    ],
    rating: 4.9,
    reviews: 203,
    price: 250,
    isOnline: true,
    distance: '3.1 km',
    tags: ['Yoga', 'Relaxation', 'Premium']
  }
]

export default function DemoMobilePage() {
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [passedProfiles, setPassedProfiles] = useState<string[]>([])
  const [currentProfile, setCurrentProfile] = useState<string | null>(null)
  
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    installApp, 
    updateAvailable, 
    cacheSize,
    clearCache 
  } = usePWA()

  const handleSwipeRight = (profile: any) => {
    setLikedProfiles(prev => [...prev, profile.id])
    console.log('Profil liké:', profile.name)
  }

  const handleSwipeLeft = (profile: any) => {
    setPassedProfiles(prev => [...prev, profile.id])
    console.log('Profil passé:', profile.name)
  }

  const handleCardTap = (profile: any) => {
    setCurrentProfile(profile.id)
    console.log('Profil sélectionné:', profile.name)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Le Papasito - Demo Mobile',
          text: 'Découvrez l\'interface mobile de Le Papasito',
          url: window.location.href
        })
      } catch (error) {
        console.log('Partage annulé')
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papiers')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header Mobile */}
      <div className="pt-16 px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Interface <span className="text-[#D4AF37]">Mobile</span>
          </h1>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
              <Smartphone className="w-3 h-3 mr-1" />
              PWA
            </Badge>
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Indicateurs PWA */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Card className="bg-black/50 border-gray-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                {isInstalled ? (
                  <Zap className="w-5 h-5 text-green-500" />
                ) : (
                  <Download className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-300">
                {isInstalled ? 'Installé' : 'Web App'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-gray-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <RefreshCw className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs text-gray-300">
                {cacheSize} Cached
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-gray-700">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center mb-1">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xs text-gray-300">
                {likedProfiles.length} Likes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stack de Cartes */}
      <div className="px-4 mb-6">
        <MobileCardStack
          profiles={demoProfiles}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onCardTap={handleCardTap}
          className="mb-4"
        />
      </div>

      {/* Statistiques */}
      <div className="px-4 mb-6">
        <Card className="bg-black/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Statistiques de Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-green-500">{likedProfiles.length}</p>
                <p className="text-sm text-gray-400">Profils likés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">{passedProfiles.length}</p>
                <p className="text-sm text-gray-400">Profils passés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{demoProfiles.length}</p>
                <p className="text-sm text-gray-400">Total profils</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#D4AF37]">
                  {Math.round(((likedProfiles.length + passedProfiles.length) / demoProfiles.length) * 100)}%
                </p>
                <p className="text-sm text-gray-400">Progression</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fonctionnalités PWA */}
      <div className="px-4 mb-6">
        <Card className="bg-black/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Fonctionnalités PWA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isInstalled && isInstallable && (
              <Button
                onClick={installApp}
                className="w-full bg-[#D4AF37] text-black hover:bg-[#F4C430]"
              >
                <Download className="w-4 h-4 mr-2" />
                Installer l&apos;application
              </Button>
            )}

            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager la démo
            </Button>

            {cacheSize > 0 && (
              <Button
                onClick={clearCache}
                variant="outline"
                className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Vider le cache ({cacheSize})
              </Button>
            )}

            {updateAvailable && (
              <div className="p-3 bg-blue-600/10 border border-blue-600 rounded-lg">
                <p className="text-sm text-blue-300 mb-2">
                  Une mise à jour est disponible !
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Mettre à jour
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations Techniques */}
      <div className="px-4 pb-20">
        <Card className="bg-black/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Informations Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Statut PWA:</span>
                <span className={isInstalled ? 'text-green-400' : 'text-yellow-400'}>
                  {isInstalled ? 'Installé' : 'Web App'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Connexion:</span>
                <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cache:</span>
                <span className="text-blue-400">{cacheSize} éléments</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service Worker:</span>
                <span className="text-green-400">Actif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Partage natif:</span>
                <span className={navigator.share ? 'text-green-400' : 'text-gray-400'}>
                  {navigator.share ? 'Supporté' : 'Non supporté'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestes d'aide */}
      <div className="fixed bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
        <p className="text-xs text-gray-300 text-center">
          👆 Tapez sur une carte pour plus d&apos;infos • 👈 Swipe gauche pour passer • 👉 Swipe droite pour liker
        </p>
      </div>
    </div>
  )
} 