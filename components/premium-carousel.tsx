"use client"

import type React from "react"

import { useState, useEffect, type ReactNode, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface PremiumCarouselProps {
  children: ReactNode[]
  autoPlayInterval?: number
  className?: string
}

export function PremiumCarousel({ children, autoPlayInterval = 5000, className = "" }: PremiumCarouselProps) {
  const items = Array.isArray(children) ? children : [children]
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // Calcul dynamique du nombre d'éléments par page selon la taille d'écran
  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4

  const totalPages = Math.ceil(items.length / itemsPerPage)
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const nextPage = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentPage((prevPage) => (prevPage === totalPages - 1 ? 0 : prevPage + 1))

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }

  const prevPage = () => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentPage((prevPage) => (prevPage === 0 ? totalPages - 1 : prevPage - 1))

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }

  const goToPage = (pageIndex: number) => {
    if (isTransitioning || pageIndex === currentPage) return

    setIsTransitioning(true)
    setCurrentPage(pageIndex)

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }

  useEffect(() => {
    // Auto-play functionality with pause on hover
    if (!isPaused) {
      const interval = setInterval(() => {
        nextPage()
      }, autoPlayInterval)

      return () => clearInterval(interval)
    }
  }, [autoPlayInterval, isTransitioning, isPaused])

  // Support pour les gestes tactiles
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // Seuil minimum pour considérer comme un swipe

    if (diff > threshold) {
      nextPage() // Swipe gauche
    } else if (diff < -threshold) {
      prevPage() // Swipe droit
    }
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Buttons - Cachés sur mobile, visibles sur hover sur desktop */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 bg-white/90 text-purple-700 rounded-full hover:bg-white shadow-md transition-all opacity-0 md:opacity-70 hover:opacity-100 focus:opacity-100"
        onClick={prevPage}
        disabled={isTransitioning}
        aria-label="Précédent"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 bg-white/90 text-purple-700 rounded-full hover:bg-white shadow-md transition-all opacity-0 md:opacity-70 hover:opacity-100 focus:opacity-100"
        onClick={nextPage}
        disabled={isTransitioning}
        aria-label="Suivant"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Page Indicators - Améliorés pour l'accessibilité */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentPage ? "bg-purple-600 w-4" : "bg-gray-300"
            }`}
            onClick={() => goToPage(index)}
            disabled={isTransitioning}
            aria-label={`Page ${index + 1}`}
            aria-current={index === currentPage ? "true" : "false"}
          >
            <span className="sr-only">Page {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Carousel Content - Optimisé pour différentes tailles d'écran */}
      <div
        className="transition-transform duration-500 ease-in-out flex"
        style={{
          transform: `translateX(-${currentPage * 100}%)`,
          width: `${totalPages * 100}%`,
        }}
        aria-live="polite"
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <div key={pageIndex} className="flex-shrink-0" style={{ width: `${100 / totalPages}%` }}>
            <div
              className={`grid grid-cols-1 ${
                isMobile ? "" : isTablet ? "sm:grid-cols-2" : "sm:grid-cols-2 md:grid-cols-4"
              } gap-4`}
            >
              {items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((item, itemIndex) => (
                <div key={itemIndex} className="transform transition-all duration-300 hover:scale-105">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
