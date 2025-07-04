"use client"

import { useState, useEffect } from "react"

interface CacheOptions {
  key: string
  ttl?: number // Time to live in milliseconds
  staleWhileRevalidate?: boolean
}

export function useCachedData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions,
): { data: T | null; isLoading: boolean; error: Error | null; refetch: () => Promise<void> } {
  const { key, ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async (updateCache = true) => {
    try {
      const result = await fetcher()
      if (updateCache) {
        setData(result)
        // Stocker dans le localStorage avec timestamp
        if (typeof window !== "undefined") {
          localStorage.setItem(
            key,
            JSON.stringify({
              data: result,
              timestamp: Date.now(),
            }),
          )
        }
      }
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    setIsLoading(true)
    setError(null)
    await fetchData()
  }

  useEffect(() => {
    let isMounted = true

    const loadFromCacheAndFetch = async () => {
      // Essayer de charger depuis le cache
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(key)
        if (cached) {
          try {
            const { data: cachedData, timestamp } = JSON.parse(cached)
            const isExpired = Date.now() - timestamp > ttl

            if (!isExpired) {
              // Utiliser les données du cache si elles sont encore valides
              if (isMounted) {
                setData(cachedData)
                setIsLoading(false)
              }
              return
            } else if (staleWhileRevalidate) {
              // Utiliser les données périmées pendant la revalidation
              if (isMounted) {
                setData(cachedData)
              }
            }
          } catch (e) {
            // Ignorer les erreurs de parsing
            console.error("Error parsing cached data:", e)
          }
        }
      }

      // Récupérer les données fraîches
      if (isMounted) {
        try {
          await fetchData()
        } catch (err) {
          // Erreur déjà gérée dans fetchData
        }
      }
    }

    loadFromCacheAndFetch()

    return () => {
      isMounted = false
    }
  }, [key])

  return { data, isLoading, error, refetch }
}
