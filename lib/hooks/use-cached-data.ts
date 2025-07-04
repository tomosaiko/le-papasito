"use client"

import { useState, useEffect } from "react"

/**
 * Hook to cache data in localStorage
 */
export function useCachedData<T>(key: string, initialData: T, expiry = 3600000) {
  const [data, setData] = useState<T>(initialData)

  // Load data from cache on mount
  useEffect(() => {
    const cachedData = localStorage.getItem(key)
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData)
        const now = new Date().getTime()

        if (now - timestamp < expiry) {
          setData(data)
        } else {
          // Cache expired, remove it
          localStorage.removeItem(key)
        }
      } catch (error) {
        console.error("Error parsing cached data:", error)
        localStorage.removeItem(key)
      }
    }
  }, [key, expiry])

  // Update cache when data changes
  useEffect(() => {
    const cacheData = {
      data,
      timestamp: new Date().getTime(),
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  }, [key, data])

  return [data, setData] as const
}
