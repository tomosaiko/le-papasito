"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Heart, X, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  bio: string
  imageUrl: string
  tags?: string[]
}

interface SwipeableProfileCardProps {
  profile: Profile
  onSwipeLeft?: (profile: Profile) => void
  onSwipeRight?: (profile: Profile) => void
  onSwipeUp?: (profile: Profile) => void
  className?: string
}

export function SwipeableProfileCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  className,
}: SwipeableProfileCardProps) {
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | "up" | null>(null)
  const [swiped, setSwiped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Reset card position when profile changes
  useEffect(() => {
    setOffsetX(0)
    setOffsetY(0)
    setDirection(null)
    setSwiped(false)
  }, [profile])

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swiped) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - startX
    const diffY = currentY - startY

    // Determine if the swipe is more horizontal or vertical
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      setOffsetX(diffX)
      setOffsetY(0)
      setDirection(diffX > 0 ? "right" : "left")
    } else {
      // Vertical swipe (only allow upward)
      if (diffY < 0) {
        setOffsetY(diffY)
        setOffsetX(0)
        setDirection("up")
      }
    }
  }

  const handleTouchEnd = () => {
    if (swiped) return

    const threshold = cardRef.current ? cardRef.current.offsetWidth * 0.4 : 100
    const verticalThreshold = cardRef.current ? cardRef.current.offsetHeight * 0.3 : 100

    if (direction === "left" && Math.abs(offsetX) > threshold) {
      // Complete the left swipe animation
      setOffsetX(-window.innerWidth)
      setSwiped(true)
      onSwipeLeft?.(profile)
    } else if (direction === "right" && Math.abs(offsetX) > threshold) {
      // Complete the right swipe animation
      setOffsetX(window.innerWidth)
      setSwiped(true)
      onSwipeRight?.(profile)
    } else if (direction === "up" && Math.abs(offsetY) > verticalThreshold) {
      // Complete the up swipe animation
      setOffsetY(-window.innerHeight)
      setSwiped(true)
      onSwipeUp?.(profile)
    } else {
      // Reset position if threshold not reached
      setOffsetX(0)
      setOffsetY(0)
      setDirection(null)
    }
  }

  // Calculate rotation based on horizontal offset
  const rotation = offsetX * 0.1 // Adjust the multiplier to control rotation intensity

  // Calculate opacity for the action indicators
  const leftOpacity = direction === "left" ? Math.min(Math.abs(offsetX) / 100, 1) : 0
  const rightOpacity = direction === "right" ? Math.min(Math.abs(offsetX) / 100, 1) : 0
  const upOpacity = direction === "up" ? Math.min(Math.abs(offsetY) / 100, 1) : 0

  return (
    <div className={cn("relative w-full max-w-sm mx-auto h-[500px]", className)}>
      <div
        ref={cardRef}
        className="absolute inset-0 bg-background rounded-xl overflow-hidden shadow-lg transition-all duration-300 touch-manipulation"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Profile Image */}
        <div className="relative w-full h-3/4">
          <img src={profile.imageUrl || "/placeholder.svg"} alt={profile.name} className="w-full h-full object-cover" />

          {/* Action Indicators */}
          <div
            className="absolute top-6 left-6 bg-red-500 text-white rounded-full p-3 transform rotate-12 transition-opacity"
            style={{ opacity: leftOpacity }}
          >
            <X size={32} />
          </div>

          <div
            className="absolute top-6 right-6 bg-green-500 text-white rounded-full p-3 transform -rotate-12 transition-opacity"
            style={{ opacity: rightOpacity }}
          >
            <Heart size={32} />
          </div>

          <div
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-full p-3 transition-opacity"
            style={{ opacity: upOpacity }}
          >
            <Star size={32} />
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-4 bg-background">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {profile.name}, {profile.age}
            </h2>
            <span className="text-muted-foreground">{profile.location}</span>
          </div>

          <p className="mt-2 text-muted-foreground line-clamp-2">{profile.bio}</p>

          {profile.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
