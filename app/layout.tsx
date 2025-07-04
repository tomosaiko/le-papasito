import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/language-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import type { Viewport } from "next"
import { QuickFilterButtons } from "@/components/quick-filter-buttons"

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Optimisation pour le chargement des polices
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "HEY PAPASITO - Premium Escort Platform",
  description: "Find pleasure without limits on HEY PAPASITO, the premium escort platform.",
  // Ajout de métadonnées pour les réseaux sociaux
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://heypapasito.com",
    title: "HEY PAPASITO - Premium Escort Platform",
    description: "Find pleasure without limits on HEY PAPASITO, the premium escort platform.",
    siteName: "HEY PAPASITO",
  },
    generator: 'v0.dev'
}

// Ajout de configuration viewport pour une meilleure expérience mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <QuickFilterButtons />
              <main className="flex-1 pt-[60px] w-full overflow-x-hidden">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
