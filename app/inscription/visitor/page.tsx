"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Home } from "lucide-react"

export default function VisitorRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    gender: "",
    username: "",
    age: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: [] as string[],
    termsAccepted: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => {
      const interests = [...prev.interests]
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter((i) => i !== interest) }
      } else {
        return { ...prev, interests: [...interests, interest] }
      }
    })
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      // Submit form and redirect to dashboard
      router.push("/visitor-dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/inscription")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <span className="mx-2">»</span>
            <Link href="/inscription" className="hover:text-foreground transition-colors">
              Inscription
            </Link>
            <span className="mx-2">»</span>
            <span>Visiteur</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12">Inscription Visiteur</h1>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between">
            {[1, 2].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    step > stepNumber
                      ? "bg-[#e05d44] text-white"
                      : step === stepNumber
                        ? "bg-[#e05d44]/20 text-[#e05d44] border border-[#e05d44]"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                <span className="text-xs text-muted-foreground">{stepNumber === 1 ? "Profil" : "Compte"}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-secondary w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-[#e05d44] transition-all duration-300"
              style={{ width: `${((step - 1) / 1) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Profile Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="gender" className="text-lg font-medium">
                Je suis
              </Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                className="flex flex-wrap gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="woman" id="visitor-woman" />
                  <Label htmlFor="visitor-woman">Une femme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="man" id="visitor-man" />
                  <Label htmlFor="visitor-man">Un homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="couple" id="visitor-couple" />
                  <Label htmlFor="visitor-couple">Un couple</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="username" className="text-lg font-medium">
                  Pseudo
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age" className="text-lg font-medium">
                  Âge
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="city" className="text-lg font-medium">
                Ville
              </Label>
              <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez votre ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="lyon">Lyon</SelectItem>
                  <SelectItem value="marseille">Marseille</SelectItem>
                  <SelectItem value="bordeaux">Bordeaux</SelectItem>
                  <SelectItem value="lille">Lille</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-lg font-medium">Centres d&apos;intérêt</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Rencontres", "Échangisme", "Libertinage", "Soirées", "Voyeurisme", "Exhibitionnisme"].map(
                  (interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestChange(interest)}
                      />
                      <Label htmlFor={`interest-${interest}`}>{interest}</Label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="px-8 py-2">
                Retour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[#e05d44] hover:bg-[#c94d37] text-white px-8 py-2"
                style={{ backgroundColor: "#e05d44" }}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Account Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-lg font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-lg font-medium">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div className="flex items-start space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, termsAccepted: checked as boolean }))}
              />
              <Label htmlFor="terms" className="text-sm">
                J&apos;accepte les{" "}
                <Link href="/terms" className="text-[#e05d44] hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-[#e05d44] hover:underline">
                  politique de confidentialité
                </Link>
              </Label>
            </div>

            <div className="pt-6 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="px-8 py-2">
                Retour
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.termsAccepted}
                className="bg-[#e05d44] hover:bg-[#c94d37] text-white px-8 py-2"
                style={{ backgroundColor: "#e05d44" }}
              >
                Terminer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
