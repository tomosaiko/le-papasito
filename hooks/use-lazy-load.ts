"use client"

import { useState, useEffect } from "react"

export function useLazyLoad<T>(
  loader: () => Promise<T>,
  dependencies: any[] = [],
  delay = 0,
): { data: T | null; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    let timer: NodeJS.Timeout

    setIsLoading(true)
    setError(null)

    const load = async () => {
      try {
        const result = await loader()
        if (isMounted) {
          setData(result)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setIsLoading(false)
        }
      }
    }

    if (delay > 0) {
      timer = setTimeout(load, delay)
    } else {
      load()
    }

    return () => {
      isMounted = false
      if (timer) clearTimeout(timer)
    }
  }, dependencies)

  return { data, isLoading, error }
}
