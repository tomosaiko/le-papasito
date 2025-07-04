"use client"

import { useState } from "react"
import { AvailabilityCalendar } from "@/components/booking/availability-calendar"
import { TimeSlots } from "@/components/booking/time-slots"
import { BookingFormWithPayment } from "@/components/booking/booking-form-with-payment"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, MapPin } from "lucide-react"
import Link from "next/link"

// Données de test pour les dates disponibles (30 jours à partir d'aujourd'hui)
const generateAvailableDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    // Exclure les dimanches (0 = dimanche, 6 = samedi)
    if (date.getDay() !== 0) {
      dates.push(date)
    }
  }
  return dates
}

// Données de test pour les créneaux horaires
const generateTimeSlots = () => {
  const slots = []
  const startHours = [10, 12, 14, 16, 18, 20, 22]

  for (let i = 0; i < startHours.length; i++) {
    const startHour = startHours[i]
    const endHour = startHour + 1

    slots.push({
      id: `slot-${i + 1}`,
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
      isAvailable: Math.random() > 0.3, // 70% de chance d'être disponible
    })
  }

  return slots
}

interface BookingPageClientProps {
  id: string
}

export function BookingPageClient({ id }: BookingPageClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  const availableDates = generateAvailableDates()
  const timeSlots = generateTimeSlots()

  // Données de test pour l'escorte
  const escort = {
    id,
    name: "Sophia",
    age: 25,
    location: "Paris, France",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
    rating: 4.9,
    reviewCount: 42,
    isVerified: true,
    hourlyRate: "250€",
  }

  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTimeSlot(null)
  }

  const handleSelectTimeSlot = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId)
  }

  const handleSubmitBooking = (formData: any) => {
    // Simuler l'envoi des données au serveur
    console.log("Booking submitted:", formData)

    // Créer un objet de réservation pour l'affichage de confirmation
    const newBooking = {
      id: formData.bookingId || `BK-${Math.floor(Math.random() * 10000)}`,
      ...formData,
    }

    setBooking(newBooking)
    setIsBookingConfirmed(true)
  }

  if (isBookingConfirmed && booking) {
    return <BookingConfirmation booking={booking} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={escort.avatar || "/placeholder.svg"} alt={escort.name} />
            <AvatarFallback>{escort.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {escort.name}, {escort.age}
              </h1>
              {escort.isVerified && (
                <Badge variant="secondary" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{escort.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>
                  {escort.rating} ({escort.reviewCount} avis)
                </span>
              </div>
              <div>
                <span className="font-medium">{escort.hourlyRate}/heure</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/escorts/${escort.id}`} className="text-purple-600 hover:underline">
            &larr; Retour au profil
          </Link>
        </div>
        <h2 className="text-xl font-semibold">Réserver un rendez-vous avec {escort.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <AvailabilityCalendar
            availableDates={availableDates}
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate}
          />
        </div>
        <div>
          <TimeSlots
            date={selectedDate}
            timeSlots={timeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        </div>
        <div className="lg:col-span-1">
          <BookingFormWithPayment
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            timeSlots={timeSlots}
            onSubmit={handleSubmitBooking}
          />
        </div>
      </div>
    </div>
  )
} 