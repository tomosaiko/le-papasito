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
import { CalendarClock, CreditCard, MessageSquare } from "lucide-react"

interface BookingFormProps {
  selectedDate: Date | undefined
  selectedTimeSlot: string | null
  timeSlots: any[]
  onSubmit: (formData: any) => void
}

export function BookingForm({ selectedDate, selectedTimeSlot, timeSlots, onSubmit }: BookingFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [duration, setDuration] = useState("1")
  const [message, setMessage] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const selectedSlot = timeSlots.find((slot) => slot.id === selectedTimeSlot)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      email,
      phone,
      date: selectedDate,
      timeSlot: selectedSlot,
      duration,
      message,
      agreeToTerms,
    })
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
                  <SelectItem value="1">1 heure</SelectItem>
                  <SelectItem value="2">2 heures</SelectItem>
                  <SelectItem value="3">3 heures</SelectItem>
                  <SelectItem value="4">4 heures</SelectItem>
                  <SelectItem value="overnight">Nuit complète</SelectItem>
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
              J'accepte les conditions générales et la politique de confidentialité. Je comprends que ma réservation est
              soumise à confirmation.
            </Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          Paiement sur place uniquement
        </div>
        <Button onClick={handleSubmit} disabled={!isFormValid()} className="bg-purple-600 hover:bg-purple-700">
          Confirmer la réservation
        </Button>
      </CardFooter>
    </Card>
  )
}
