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
import { Home, ChevronRight } from "lucide-react"

export default function EscortRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    gender: "",
    firstName: "",
    age: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Submit form and redirect to dashboard
      router.push("/escort-dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/inscription/type")
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
            <span>Escort</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12">Inscription Escort</h1>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between">
            {[1, 2, 3].map((stepNumber) => (
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
                <span className="text-xs text-muted-foreground">
                  {stepNumber === 1 ? "Informations" : stepNumber === 2 ? "Profil" : "Sécurité"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-secondary w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-[#e05d44] transition-all duration-300"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
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
                  <RadioGroupItem value="woman" id="woman" />
                  <Label htmlFor="woman">Une femme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="man" id="man" />
                  <Label htmlFor="man">Un homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trans" id="trans" />
                  <Label htmlFor="trans">Trans</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="couple" id="couple" />
                  <Label htmlFor="couple">Un couple</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="h-14"
                  required
                />
              </div>
              <div>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Âge"
                  className="h-14"
                  required
                />
              </div>
            </div>

            <div>
              <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                <SelectTrigger className="h-14">
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

            <div className="pt-6 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="px-8 py-2">
                Retour
              </Button>
              <Button
                onClick={handleNext}
                className="bg-[#e05d44] hover:bg-[#c94d37] text-white px-8 py-2"
                style={{ backgroundColor: "#e05d44" }}
              >
                Suivant <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Profile Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="h-14"
                required
              />
            </div>

            <div>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Téléphone"
                className="h-14"
                required
              />
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
                Suivant <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Security */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                className="h-14"
                required
              />
            </div>

            <div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
                className="h-14"
                required
              />
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
                Terminer <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
