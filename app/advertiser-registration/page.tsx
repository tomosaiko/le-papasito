"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdvertiserRegistrationRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/inscription")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirection...</p>
    </div>
  )
}
