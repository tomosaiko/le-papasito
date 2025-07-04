"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { OptimizedImage } from "@/components/ui/optimized-image"
import type { ImageProps } from "next/image"

interface LazyImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
  aspectRatio?: number
  wrapperClassName?: string
}

export function LazyImage({
  threshold = 0.1,
  rootMargin = "0px",
  fallback,
  aspectRatio,
  wrapperClassName,
  ...props
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className={wrapperClassName}>
      {isVisible ? (
        <OptimizedImage aspectRatio={aspectRatio} fallback={fallback} {...props} />
      ) : (
        <div
          className="bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{
            aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
            paddingBottom: !aspectRatio ? "100%" : undefined,
          }}
        />
      )}
    </div>
  )
}
