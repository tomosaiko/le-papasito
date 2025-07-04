"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Facebook, Eye, EyeOff, ChevronRight } from "lucide-react"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Login() {
  const { dictionary } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle authentication
    console.log("Login attempt with:", { email, password })
  }

  const handleGoogleSignIn = async () => {
    try {
      // Au lieu de rediriger, nous allons faire un fetch à l'API
      const response = await fetch("/api/auth/signin/google")
      const data = await response.json()

      if (data.status === "success") {
        // Simuler une connexion réussie
        console.log("Google authentication successful")
        // Rediriger vers la page d'accueil
        router.push("/?auth=google-success")
      }
    } catch (error) {
      console.error("Error during Google authentication:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <Card className="bg-secondary border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{dictionary.auth.login}</CardTitle>
            <CardDescription className="text-center">
              Entrez votre email et mot de passe pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{dictionary.auth.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{dictionary.auth.password}</Label>
                  <Link href="/forgot-password" className="text-xs text-[#e05d44] hover:underline">
                    {dictionary.auth.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#e05d44] hover:bg-[#c94d37] text-white h-14"
                style={{ backgroundColor: "#e05d44" }}
              >
                {dictionary.auth.login} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-secondary px-2 text-muted-foreground">{dictionary.auth.orContinueWith}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              {dictionary.auth.dontHaveAccount}{" "}
              <Link href="/inscription" className="text-[#e05d44] hover:underline">
                {dictionary.auth.signup}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
