"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Heart, X, MapPin, Star, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileCard {
  id: string
  name: string
  age: number
  location: string
  images: string[]
  rating: number
  reviews: number
  price: number
  isOnline: boolean
  distance?: string
  tags?: string[]
}

interface MobileCardStackProps {
  profiles: ProfileCard[]
  onSwipeLeft?: (profile: ProfileCard) => void
  onSwipeRight?: (profile: ProfileCard) => void
  onCardTap?: (profile: ProfileCard) => void
  className?: string
}

interface TouchPosition {
  x: number
  y: number
}

export function MobileCardStack({
  profiles,
  onSwipeLeft,
  onSwipeRight,
  onCardTap,
  className
}: MobileCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState<TouchPosition>({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState<TouchPosition>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const currentProfile = profiles[currentIndex]
  const nextProfile = profiles[currentIndex + 1]

  // Calculer la transformation de la carte
  const dragOffset = currentPos.x - startPos.x
  const maxRotation = 30
  const rotationDegree = Math.min(maxRotation, Math.max(-maxRotation, dragOffset * 0.1))

  useEffect(() => {
    if (!isDragging) {
      setRotation(0)
    }
  }, [isDragging])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setCurrentPos({ x: touch.clientX, y: touch.clientY })
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    setCurrentPos({ x: touch.clientX, y: touch.clientY })
    setRotation(rotationDegree)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const swipeThreshold = 100
    const absOffset = Math.abs(dragOffset)
    
    if (absOffset > swipeThreshold) {
      if (dragOffset > 0) {
        // Swipe Right - Like
        handleSwipeRight()
      } else {
        // Swipe Left - Pass
        handleSwipeLeft()
      }
    }
    
    setIsDragging(false)
    setCurrentPos({ x: 0, y: 0 })
    setStartPos({ x: 0, y: 0 })
    setRotation(0)
  }

  const handleSwipeLeft = () => {
    if (currentProfile) {
      onSwipeLeft?.(currentProfile)
      nextCard()
    }
  }

  const handleSwipeRight = () => {
    if (currentProfile) {
      onSwipeRight?.(currentProfile)
      nextCard()
    }
  }

  const nextCard = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleCardTap = () => {
    if (currentProfile && !isDragging) {
      onCardTap?.(currentProfile)
    }
  }

  if (!currentProfile) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <div className="text-center text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Plus de profils à découvrir</p>
          <p className="text-sm mt-2">Revenez plus tard pour de nouveaux profils</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full h-96", className)}>
      {/* Carte suivante (arrière-plan) */}
      {nextProfile && (
        <ProfileCardComponent
          profile={nextProfile}
          className="absolute inset-0 scale-95 opacity-50 z-10"
          isInteractive={false}
        />
      )}

      {/* Carte actuelle */}
      <ProfileCardComponent
        ref={cardRef}
        profile={currentProfile}
        className="absolute inset-0 z-20"
        style={{
          transform: isDragging 
            ? `translateX(${dragOffset}px) rotate(${rotation}deg)` 
            : 'translateX(0px) rotate(0deg)',
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTap={handleCardTap}
        isInteractive={true}
      />

      {/* Indicateurs de swipe */}
      {isDragging && (
        <>
          {/* Like indicator */}
          <div className={cn(
            "absolute top-8 right-8 z-30 px-4 py-2 rounded-full border-2 font-bold text-lg transition-opacity",
            dragOffset > 50 
              ? "bg-green-500 border-green-400 text-white opacity-100" 
              : "bg-green-500/20 border-green-400/50 text-green-400 opacity-50"
          )}>
            LIKE
          </div>

          {/* Pass indicator */}
          <div className={cn(
            "absolute top-8 left-8 z-30 px-4 py-2 rounded-full border-2 font-bold text-lg transition-opacity",
            dragOffset < -50 
              ? "bg-red-500 border-red-400 text-white opacity-100" 
              : "bg-red-500/20 border-red-400/50 text-red-400 opacity-50"
          )}>
            PASS
          </div>
        </>
      )}

      {/* Boutons d'action */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        <button
          onClick={handleSwipeLeft}
          className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-6 h-6 text-red-500" />
        </button>
        
        <button
          onClick={handleSwipeRight}
          className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <Heart className="w-6 h-6 text-green-500" />
        </button>
      </div>

      {/* Compteur de cartes */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {profiles.length}
      </div>
    </div>
  )
}

// Composant de carte de profil
interface ProfileCardComponentProps {
  profile: ProfileCard
  className?: string
  style?: React.CSSProperties
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: () => void
  onTap?: () => void
  isInteractive?: boolean
}

const ProfileCardComponent = React.forwardRef<HTMLDivElement, ProfileCardComponentProps>(
  ({ profile, className, style, onTouchStart, onTouchMove, onTouchEnd, onTap, isInteractive = true }, ref) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = () => {
      if (profile.images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % profile.images.length)
      }
    }

    const prevImage = () => {
      if (profile.images.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + profile.images.length) % profile.images.length)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden cursor-pointer",
          className
        )}
        style={style}
        onTouchStart={isInteractive ? onTouchStart : undefined}
        onTouchMove={isInteractive ? onTouchMove : undefined}
        onTouchEnd={isInteractive ? onTouchEnd : undefined}
        onClick={isInteractive ? onTap : undefined}
      >
        {/* Images avec navigation */}
        <div className="relative h-3/4">
          <img
            src={profile.images[currentImageIndex] || '/placeholder.jpg'}
            alt={profile.name}
            className="w-full h-full object-cover"
          />

          {/* Navigation des images */}
          {profile.images.length > 1 && isInteractive && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage() }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage() }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                ›
              </button>

              {/* Indicateurs d'images */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {profile.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Statut en ligne */}
          {profile.isOnline && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>En ligne</span>
            </div>
          )}
        </div>

        {/* Informations du profil */}
        <div className="p-4 h-1/4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {profile.name}, {profile.age}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{profile.rating}</span>
                <span className="text-sm text-gray-500">({profile.reviews})</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              {profile.distance && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{profile.distance}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {profile.tags?.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center space-x-1 text-[#D4AF37] font-bold">
              <span>{profile.price}€</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ProfileCardComponent.displayName = 'ProfileCardComponent'

export default MobileCardStack 