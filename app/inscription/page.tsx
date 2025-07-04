"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Home, Eye, EyeOff, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Inscription() {
  const [userType, setUserType] = useState<string | undefined>(undefined)
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [date, setDate] = useState<Date>()

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    newsletterConsent: false,
    healthEmailsConsent: false,
    termsAccepted: false,
    birthDay: "",
    birthMonth: "",
    birthYear: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setFormData((prev) => ({ ...prev, birthDate: date.toISOString() }))
    }
  }

  const updateBirthDate = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const birthDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
      if (!isNaN(birthDate.getTime())) {
        setDate(birthDate)
        setFormData((prev) => ({ ...prev, birthDate: birthDate.toISOString() }))
      }
    }
  }

  const handleNext = () => {
    if (!formData.termsAccepted) {
      alert("Vous devez accepter les conditions générales pour continuer.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.")
      return
    }

    if (!userType) {
      // Si aucun type d'utilisateur n'est sélectionné, on passe à la sélection du type
      router.push(`/inscription/type`)
    } else {
      // Sinon on continue avec le type sélectionné
      router.push(`/inscription/${userType}`)
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
            <span>Inscription</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12 text-center">Créer un compte</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
                className="h-14"
                required
              />
            </div>

            <div>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre adresse email"
                className="h-14"
                required
              />
            </div>

            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Choisissez mot de passe"
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

            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Retaper mot de passe"
                className="h-14 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div>
              <div className="mb-2">
                <span className="text-sm font-medium">
                  Date de naissance <span className="text-xs text-amber-500 font-semibold">OBLIGATOIRE 18+</span>
                </span>
              </div>
              <div className="flex gap-2">
                <Select
                  value={formData.birthDay}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, birthDay: value }))
                    updateBirthDate(value, formData.birthMonth, formData.birthYear)
                  }}
                >
                  <SelectTrigger className="h-14 flex-1">
                    <SelectValue placeholder="Jour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.birthMonth}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, birthMonth: value }))
                    updateBirthDate(formData.birthDay, value, formData.birthYear)
                  }}
                >
                  <SelectTrigger className="h-14 flex-1">
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "1", label: "Janvier" },
                      { value: "2", label: "Février" },
                      { value: "3", label: "Mars" },
                      { value: "4", label: "Avril" },
                      { value: "5", label: "Mai" },
                      { value: "6", label: "Juin" },
                      { value: "7", label: "Juillet" },
                      { value: "8", label: "Août" },
                      { value: "9", label: "Septembre" },
                      { value: "10", label: "Octobre" },
                      { value: "11", label: "Novembre" },
                      { value: "12", label: "Décembre" },
                    ].map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.birthYear}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, birthYear: value }))
                    updateBirthDate(formData.birthDay, formData.birthMonth, value)
                  }}
                >
                  <SelectTrigger className="h-14 flex-1">
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 87 }, (_, i) => 2006 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-amber-500 mt-1">
                Vous devez avoir au moins 18 ans pour vous inscrire sur notre plateforme.
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletterConsent}
                  onCheckedChange={(checked) => handleCheckboxChange("newsletterConsent", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="newsletter" className="text-base font-normal">
                  Recevez des newsletters de LE PAPASITO
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="healthEmails"
                  checked={formData.healthEmailsConsent}
                  onCheckedChange={(checked) => handleCheckboxChange("healthEmailsConsent", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="healthEmails" className="text-base font-normal">
                  Recevez des e-mails sur les soins de santé
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-base font-normal">
                  J&apos;accepte les{" "}
                  <Link href="/terms" className="text-[#e05d44] hover:underline">
                    conditions générales
                  </Link>
                </Label>
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-[#e05d44] hover:bg-[#c94d37] text-white px-6 py-6 text-lg font-medium"
              style={{ backgroundColor: "#e05d44" }}
            >
              CRÉER UN COMPTE <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="text-center">
              <Link href="/login" className="text-[#e05d44] hover:underline">
                J&apos;ai déjà un compte
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Avantages Membres */}
      <div className="mt-16 mb-12 bg-black py-10 px-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center text-white mb-10">Vos avantages membres</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 8h18" />
                <path d="M8 12h.01" />
                <path d="M12 12h.01" />
                <path d="M16 12h.01" />
                <path d="M8 16h.01" />
                <path d="M12 16h.01" />
                <path d="M16 16h.01" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">Où que vous soyez</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="2" y1="7" x2="7" y2="7" />
                <line x1="2" y1="17" x2="7" y2="17" />
                <line x1="17" y1="17" x2="22" y2="17" />
                <line x1="17" y1="7" x2="22" y2="7" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">4K ultra HD</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">Paiement discret</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">Mises à jour hebdomadaires</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">Photos HD</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-[#e05d44]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <span className="text-center text-white text-sm">Téléchargement illimité</span>
          </div>
        </div>
      </div>
    </div>
  )
}
