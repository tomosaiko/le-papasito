"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Skeleton } from "@/components/ui/loading-skeleton"

interface ProgressivePageProps {
  children: ReactNode
  loading?: boolean
  skeleton?: ReactNode
  delay?: number
}

export function ProgressivePage({ children, loading = false, skeleton, delay = 200 }: ProgressivePageProps) {
  const [isClient, setIsClient] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Montrer le skeleton après un délai pour éviter le flash
    if (loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [loading, delay])

  // Si on est côté serveur ou si le chargement est rapide, ne pas montrer de skeleton
  if (!isClient || (loading && !showSkeleton)) {
    return null
  }

  // Si on est en chargement et qu'on doit montrer le skeleton
  if (loading && showSkeleton) {
    return (
      <div className="animate-in fade-in duration-300">
        {skeleton || (
          <div className="space-y-4">
            <Skeleton height="200px" />
            <Skeleton height="20px" width="80%" />
            <Skeleton height="20px" width="60%" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Skeleton height="150px" />
              <Skeleton height="150px" />
              <Skeleton height="150px" />
            </div>
          </div>
        )}
      </div>
    )
  }

  // Contenu normal
  return <div className="animate-in fade-in duration-300">{children}</div>
}
