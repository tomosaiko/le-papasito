"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  fallback?: React.ReactNode
  aspectRatio?: number
  wrapperClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  fallback,
  aspectRatio = 1,
  wrapperClassName,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined)

  // Générer un placeholder de couleur
  useEffect(() => {
    // Créer un placeholder de couleur simple
    const canvas = document.createElement("canvas")
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = "#e5e7eb" // Couleur grise claire
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      setBlurDataURL(canvas.toDataURL())
    }
  }, [])

  return (
    <div
      className={cn("relative overflow-hidden", isLoading && "image-skeleton", wrapperClassName)}
      style={{
        paddingBottom: aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined,
      }}
    >
      {!error ? (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          {fallback || <span className="text-sm text-gray-500 dark:text-gray-400">Image non disponible</span>}
        </div>
      )}
    </div>
  )
}
