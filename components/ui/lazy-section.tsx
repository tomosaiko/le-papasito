"use client"

import { useState, useEffect, useRef, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
  className?: string
}

export function LazySection({
  children,
  threshold = 0.1,
  rootMargin = "100px",
  placeholder,
  className,
}: LazySectionProps) {
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
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder || <div className="min-h-[100px]" />}
    </div>
  )
}
