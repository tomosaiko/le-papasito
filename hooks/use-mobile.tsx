"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Fonction pour vérifier si l'écran est mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Vérifier au chargement
    checkMobile()

    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", checkMobile)

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [breakpoint])

  return isMobile
}
