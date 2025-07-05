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
import { MobileNavigation } from "@/components/mobile/mobile-navigation"
import { PWAProvider } from "@/components/mobile/pwa-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Le Papasito - Premium Escort Platform",
  description: "Plateforme premium d'escort avec interface mobile optimisée",
  manifest: "/manifest.json",
  themeColor: "#D4AF37",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Le Papasito",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://lepapasito.com",
    title: "Le Papasito - Premium Escort Platform",
    description: "Plateforme premium d'escort avec interface mobile optimisée",
    siteName: "Le Papasito",
  },
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
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
    <html lang="fr" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="theme-color" content="#D4AF37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Le Papasito" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <link rel="mask-icon" href="/images/logo.png" color="#D4AF37" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <PWAProvider>
              <div className="flex flex-col min-h-screen bg-gray-900">
                {/* Navigation Desktop */}
                <div className="hidden md:block">
                  <Header />
                  <QuickFilterButtons />
                </div>
                
                {/* Navigation Mobile */}
                <MobileNavigation 
                  isAuthenticated={false}
                  userRole="USER"
                  userName=""
                  userAvatar=""
                />
                
                <main className="flex-1 pt-[60px] md:pt-[60px] w-full overflow-x-hidden pb-16 md:pb-0">
                  {children}
                </main>
                
                {/* Footer Desktop */}
                <div className="hidden md:block">
                  <Footer />
                </div>
              </div>
            </PWAProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
