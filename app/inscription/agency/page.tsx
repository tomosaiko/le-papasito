"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home } from "lucide-react"

export default function AgencyRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    description: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      router.push("/agency-dashboard")
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
            <span>Agence</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12">Inscription Agence</h1>

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
                  {stepNumber === 1 ? "Informations" : stepNumber === 2 ? "Détails" : "Sécurité"}
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
              <Label htmlFor="agencyName" className="text-lg font-medium">
                Nom de l&apos;établissement
              </Label>
              <Input
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactName" className="text-lg font-medium">
                Nom du contact
              </Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="mt-1"
                required
              />
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

        {/* Step 2: Contact Details */}
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
              <Label htmlFor="phone" className="text-lg font-medium">
                Téléphone
              </Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="address" className="text-lg font-medium">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-lg font-medium">
                Description de l&apos;établissement
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1"
                rows={4}
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
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Security */}
        {step === 3 && (
          <div className="space-y-6">
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

            <div className="pt-6 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="px-8 py-2">
                Retour
              </Button>
              <Button
                onClick={handleNext}
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
