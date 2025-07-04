"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { dictionaries, type Dictionary } from "./dictionaries"

type LanguageContextType = {
  language: string
  dictionary: Dictionary
  setLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("fr")
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaries.fr)

  useEffect(() => {
    // Detect browser language
    const browserLanguage = navigator.language.split("-")[0]
    const supportedLanguages = Object.keys(dictionaries)

    if (supportedLanguages.includes(browserLanguage)) {
      setLanguage(browserLanguage)
      setDictionary(dictionaries[browserLanguage])
    }

    // Check for stored language preference
    const storedLanguage = localStorage.getItem("language")
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      setLanguage(storedLanguage)
      setDictionary(dictionaries[storedLanguage])
    }
  }, [])

  const handleSetLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    setDictionary(dictionaries[newLanguage])
    localStorage.setItem("language", newLanguage)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        dictionary,
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
