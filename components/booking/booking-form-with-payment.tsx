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
import { CalendarClock, CreditCard, MessageSquare, ArrowRight } from "lucide-react"
import { PaymentMethods } from "@/components/payment/payment-methods"

interface BookingFormWithPaymentProps {
  selectedDate: Date | undefined
  selectedTimeSlot: string | null
  timeSlots: any[]
  onSubmit: (formData: any) => void
}

export function BookingFormWithPayment({
  selectedDate,
  selectedTimeSlot,
  timeSlots,
  onSubmit,
}: BookingFormWithPaymentProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [duration, setDuration] = useState("1")
  const [message, setMessage] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [step, setStep] = useState(1)
  const [bookingId, setBookingId] = useState("")
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedTimeSlot)

  // Calculer le montant en fonction de la durée
  const calculateAmount = () => {
    const baseRate = 250 // Taux horaire de base en euros
    let multiplier = 1

    switch (duration) {
      case "1":
        multiplier = 1
        break
      case "2":
        multiplier = 1.8 // Légère réduction pour 2h
        break
      case "3":
        multiplier = 2.5 // Réduction pour 3h
        break
      case "4":
        multiplier = 3.2 // Réduction pour 4h
        break
      case "overnight":
        multiplier = 5 // Forfait nuit
        break
      default:
        multiplier = 1
    }

    return baseRate * multiplier
  }

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Créer un ID de réservation temporaire
    const tempBookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Créer les détails de la réservation
    const details = {
      name,
      email,
      phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      duration,
      message,
      agreeToTerms,
    }

    setBookingId(tempBookingId)
    setBookingDetails(details)
    setStep(2)
  }

  const handleSubmitBooking = async () => {
    // Cette fonction sera appelée après un paiement réussi
    if (bookingDetails) {
      onSubmit({
        ...bookingDetails,
        bookingId,
        paymentStatus: "paid",
      })
    }
  }

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      selectedDate !== undefined &&
      selectedTimeSlot !== null &&
      duration !== "" &&
      agreeToTerms
    )
  }

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-500" />
            Détails de la réservation
          </CardTitle>
          <CardDescription>Veuillez sélectionner une date et un horaire pour continuer.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {step === 1 ? (
            <>
              <MessageSquare className="h-5 w-5 text-purple-500" />
              Détails de la réservation
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 text-purple-500" />
              Paiement de la réservation
            </>
          )}
        </CardTitle>
        <CardDescription>
          {step === 1
            ? "Complétez les informations ci-dessous pour finaliser votre réservation."
            : "Choisissez votre méthode de paiement pour confirmer votre réservation."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <form onSubmit={handleContinueToPayment} className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-purple-500" />
                Récapitulatif
              </h3>
              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {selectedSlot && (
                <p className="text-sm">
                  <strong>Horaire:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Sélectionnez une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 heure (250€)</SelectItem>
                    <SelectItem value="2">2 heures (450€)</SelectItem>
                    <SelectItem value="3">3 heures (625€)</SelectItem>
                    <SelectItem value="4">4 heures (800€)</SelectItem>
                    <SelectItem value="overnight">Nuit complète (1250€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les conditions générales et la politique de confidentialité. Je comprends que ma réservation
                est soumise à confirmation après paiement.
              </Label>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Un paiement anticipé est requis pour confirmer votre réservation. Vous serez redirigé vers notre page de
                paiement sécurisé.
              </p>
            </div>

            <Button type="submit" disabled={!isFormValid()} className="w-full bg-purple-600 hover:bg-purple-700">
              Continuer vers le paiement <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        ) : (
          <PaymentMethods amount={calculateAmount()} bookingId={bookingId} bookingDetails={bookingDetails} />
        )}
      </CardContent>
      {step === 2 && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => setStep(1)}>
            Retour aux détails
          </Button>
          <p className="text-sm text-muted-foreground">
            Montant total:{" "}
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(calculateAmount())}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
