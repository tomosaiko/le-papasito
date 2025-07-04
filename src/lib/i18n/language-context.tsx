"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { dictionaries } from "./dictionaries"

type Language = "en" | "fr" | "nl"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  dictionary: typeof dictionaries.en
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  const dictionary = dictionaries[language]

  return <LanguageContext.Provider value={{ language, setLanguage, dictionary }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
