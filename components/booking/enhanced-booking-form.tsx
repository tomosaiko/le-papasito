"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarClock, CreditCard, MessageSquare, Shield, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface EnhancedBookingFormProps {
  selectedDate: Date | undefined
  selectedTimeSlot: string | null
  timeSlots: any[]
  onSubmit: (formData: any) => void
  services?: {
    id: string
    name: string
    description: string
    duration: number
    price: number
    isPopular?: boolean
  }[]
  additionalOptions?: {
    id: string
    name: string
    description: string
    price: number
  }[]
  className?: string
  locale?: Intl.LocalesArgument
}

export function EnhancedBookingForm({
  selectedDate,
  selectedTimeSlot,
  timeSlots,
  onSubmit,
  services = [],
  additionalOptions = [],
  className,
  locale = "fr-FR",
}: EnhancedBookingFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedService, setSelectedService] = useState<string>(services.length > 0 ? services[0].id : "")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "crypto">("cash")
  const [formErrors, setFormErrors] = useState<{
    name?: string
    email?: string
    phone?: string
    service?: string
    terms?: string
    privacy?: string
  }>({})

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedTimeSlot)
  const selectedServiceData = services.find((service) => service.id === selectedService)

  const calculateTotal = () => {
    let total = 0

    // Ajouter le prix du service
    if (selectedServiceData) {
      total += selectedServiceData.price
    }

    // Ajouter le prix des options supplémentaires
    selectedOptions.forEach((optionId) => {
      const option = additionalOptions.find((opt) => opt.id === optionId)
      if (option) {
        total += option.price
      }
    })

    // Appliquer une réduction si disponible
    if (selectedSlot && selectedSlot.isLastMinute && selectedSlot.discount) {
      total = total * (1 - selectedSlot.discount / 100)
    }

    return total
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const errors: {
      name?: string
      email?: string
      phone?: string
      service?: string
      terms?: string
      privacy?: string
    } = {}

    if (!name.trim()) {
      errors.name = "Le nom est requis"
    }

    if (!email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Format d'email invalide"
    }

    if (!phone.trim()) {
      errors.phone = "Le téléphone est requis"
    }

    if (services.length > 0 && !selectedService) {
      errors.service = "Veuillez sélectionner un service"
    }

    if (!agreeToTerms) {
      errors.terms = "Vous devez accepter les conditions générales"
    }

    if (!agreeToPrivacy) {
      errors.privacy = "Vous devez accepter la politique de confidentialité"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Réinitialiser les erreurs
    setFormErrors({})

    // Calculer le total
    const total = calculateTotal()

    // Soumettre le formulaire
    onSubmit({
      name,
      email,
      phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      service: selectedServiceData,
      additionalOptions: additionalOptions.filter((opt) => selectedOptions.includes(opt.id)),
      message,
      agreeToTerms,
      agreeToPrivacy,
      paymentMethod,
      total,
    })
  }

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      selectedDate !== undefined &&
      selectedTimeSlot !== null &&
      (services.length === 0 || selectedService !== "") &&
      agreeToTerms &&
      agreeToPrivacy
    )
  }

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-500" />
            Détails de la réservation
          </CardTitle>
          <CardDescription>Veuillez sélectionner une date et un horaire pour continuer.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">
              Sélectionnez d'abord une date et un horaire dans les sections précédentes.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-purple-500" />
          Détails de la réservation
        </CardTitle>
        <CardDescription>Complétez les informations ci-dessous pour finaliser votre réservation.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-purple-500" />
              Récapitulatif
            </h3>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {selectedDate.toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {selectedSlot && (
                <p className="text-sm">
                  <strong>Horaire:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                  {selectedSlot.isLastMinute && selectedSlot.discount && (
                    <Badge className="ml-2 bg-red-500 text-white text-[10px]">-{selectedSlot.discount}%</Badge>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
                required
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
                required
              />
              {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={formErrors.phone ? "border-red-500" : ""}
                required
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>

            {services.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="service">
                  Service <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger id="service" className={formErrors.service ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <div className="flex items-center gap-1">
                            <span>{service.price}€</span>
                            {service.isPopular && (
                              <Badge className="ml-1 bg-purple-500 text-white text-[10px]">Populaire</Badge>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.service && <p className="text-red-500 text-xs mt-1">{formErrors.service}</p>}
              </div>
            )}
          </div>

          {selectedServiceData && (
            <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-md border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{selectedServiceData.name}</h4>
                <Badge
                  variant="outline"
                  className="bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300"
                >
                  {selectedServiceData.duration} min
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{selectedServiceData.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>{selectedServiceData.duration} minutes</span>
                </div>
                <span className="font-medium">{selectedServiceData.price}€</span>
              </div>
            </div>
          )}

          {additionalOptions.length > 0 && (
            <div className="space-y-3">
              <Label>Options supplémentaires</Label>
              <div className="space-y-2">
                {additionalOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-start p-3 rounded-md border cursor-pointer transition-colors",
                      selectedOptions.includes(option.id)
                        ? "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800"
                        : "bg-background border-border hover:bg-secondary/50",
                    )}
                    onClick={() => {
                      if (selectedOptions.includes(option.id)) {
                        setSelectedOptions(selectedOptions.filter((id) => id !== option.id))
                      } else {
                        setSelectedOptions([...selectedOptions, option.id])
                      }
                    }}
                  >
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={selectedOptions.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOptions([...selectedOptions, option.id])
                        } else {
                          setSelectedOptions(selectedOptions.filter((id) => id !== option.id))
                        }
                      }}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`option-${option.id}`} className="font-medium text-sm cursor-pointer">
                        {option.name} (+{option.price}€)
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Précisez vos attentes ou demandes particulières..."
              className="min-h-[100px]"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payment">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Méthode de paiement
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Tabs defaultValue="cash" onValueChange={(value) => setPaymentMethod(value as any)}>
                  <TabsList className="grid grid-cols-3 mb-2">
                    <TabsTrigger value="cash">Espèces</TabsTrigger>
                    <TabsTrigger value="card">Carte</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cash" className="space-y-2">
                    <div className="bg-secondary/50 p-3 rounded-md text-sm">
                      <p>Paiement en espèces sur place uniquement.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="card" className="space-y-2">
                    <div className="bg-secondary/50 p-3 rounded-md text-sm">
                      <p>Paiement par carte bancaire disponible sur place.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src="/visa.svg" alt="Visa" className="h-6" />
                        <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="crypto" className="space-y-2">
                    <div className="bg-secondary/50 p-3 rounded-md text-sm">
                      <p>Paiement en crypto-monnaies accepté.</p>
                      <div className="flex items-center gap-2 mt-2">
                        <img src="/bitcoin.svg" alt="Bitcoin" className="h-6" />
                        <img src="/ethereum.svg" alt="Ethereum" className="h-6" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className={formErrors.terms ? "border-red-500" : ""}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className={cn("text-sm font-normal", formErrors.terms ? "text-red-500" : "")}>
                  J'accepte les{" "}
                  <a href="/terms" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
                    conditions générales
                  </a>{" "}
                  et je comprends que ma réservation est soumise à confirmation.
                </Label>
                {formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms}</p>}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={agreeToPrivacy}
                onCheckedChange={(checked) => setAgreeToPrivacy(checked as boolean)}
                className={formErrors.privacy ? "border-red-500" : ""}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="privacy"
                  className={cn("text-sm font-normal", formErrors.privacy ? "text-red-500" : "")}
                >
                  J'accepte la{" "}
                  <a href="/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
                    politique de confidentialité
                  </a>{" "}
                  et le traitement de mes données personnelles.
                </Label>
                {formErrors.privacy && <p className="text-red-500 text-xs">{formErrors.privacy}</p>}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-500" />
          <span>Réservation sécurisée et confidentielle</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total:</div>
            <div className="text-xl font-bold">{calculateTotal().toFixed(2)}€</div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            Confirmer la réservation
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
