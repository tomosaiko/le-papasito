"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface AdvancedImageProps extends Omit<ImageProps, "onLoadingComplete" | "onLoad" | "onError"> {
  fallback?: React.ReactNode
  aspectRatio?: number
  wrapperClassName?: string
  loadingStrategy?: "lazy" | "eager" | "progressive"
  placeholderColor?: string
  lowQualityPlaceholder?: string
  revealEffect?: "fade" | "zoom" | "slide" | "none"
  errorRetryCount?: number
  errorRetryInterval?: number
  preload?: boolean
  intersectionThreshold?: number
  intersectionMargin?: string
  blurAmount?: number
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void
}

export function AdvancedImage({
  src,
  alt,
  fallback,
  aspectRatio = 1,
  wrapperClassName,
  className,
  loadingStrategy = "lazy",
  placeholderColor = "#e5e7eb",
  lowQualityPlaceholder,
  revealEffect = "fade",
  errorRetryCount = 2,
  errorRetryInterval = 2000,
  preload = false,
  intersectionThreshold = 0.1,
  intersectionMargin = "100px",
  blurAmount = 10,
  onLoadingStatusChange,
  ...props
}: AdvancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(preload || loadingStrategy === "eager")
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  // Générer un placeholder de couleur
  useEffect(() => {
    // Créer un placeholder de couleur simple
    const canvas = document.createElement("canvas")
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = placeholderColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      setBlurDataURL(canvas.toDataURL())
    }
  }, [placeholderColor])

  // Observer l'intersection pour le lazy loading
  useEffect(() => {
    if (loadingStrategy === "eager" || preload) {
      setIsVisible(true)
      return
    }

    if (wrapperRef.current && !observer.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              observer.current?.disconnect()
              observer.current = null
            }
          })
        },
        {
          threshold: intersectionThreshold,
          rootMargin: intersectionMargin,
        },
      )

      observer.current.observe(wrapperRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
        observer.current = null
      }
    }
  }, [loadingStrategy, preload, intersectionThreshold, intersectionMargin])

  // Précharger l'image si nécessaire
  useEffect(() => {
    if (preload && typeof src === "string") {
      const img = new Image()
      img.src = src
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height })
      }
    }
  }, [preload, src])

  // Gérer les erreurs et les tentatives
  useEffect(() => {
    if (error && retryCount < errorRetryCount) {
      const timer = setTimeout(() => {
        setError(false)
        setRetryCount(retryCount + 1)
      }, errorRetryInterval)

      return () => clearTimeout(timer)
    }
  }, [error, retryCount, errorRetryCount, errorRetryInterval])

  // Notifier le changement de statut
  useEffect(() => {
    if (onLoadingStatusChange) {
      if (error) {
        onLoadingStatusChange("error")
      } else if (isLoading) {
        onLoadingStatusChange("loading")
      } else {
        onLoadingStatusChange("loaded")
      }
    }
  }, [isLoading, error, onLoadingStatusChange])

  // Générer un placeholder de basse qualité si fourni
  useEffect(() => {
    if (lowQualityPlaceholder) {
      setBlurDataURL(lowQualityPlaceholder)
    }
  }, [lowQualityPlaceholder])

  // Déterminer les classes CSS pour les effets de révélation
  const getRevealClasses = () => {
    if (isLoading) {
      return "opacity-0 scale-105"
    }

    switch (revealEffect) {
      case "fade":
        return "transition-opacity duration-500 opacity-100"
      case "zoom":
        return "transition-all duration-500 opacity-100 scale-100"
      case "slide":
        return "transition-all duration-500 opacity-100 translate-y-0"
      default:
        return "opacity-100"
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative overflow-hidden", isLoading && "image-skeleton", wrapperClassName)}
      style={{
        paddingBottom: aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined,
      }}
    >
      {isVisible && !error ? (
        <Image
          ref={imageRef}
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn(getRevealClasses(), className)}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
          {...props}
          style={{
            ...props.style,
            filter: isLoading && blurDataURL ? `blur(${blurAmount}px)` : "none",
          }}
        />
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          {fallback || (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 mb-2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span className="text-sm text-gray-500 dark:text-gray-400">Image non disponible</span>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  )
}
