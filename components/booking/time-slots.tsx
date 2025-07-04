"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface TimeSlotsProps {
  date: Date | undefined
  timeSlots: TimeSlot[]
  selectedTimeSlot: string | null
  onSelectTimeSlot: (timeSlotId: string) => void
}

export function TimeSlots({ date, timeSlots, selectedTimeSlot, onSelectTimeSlot }: TimeSlotsProps) {
  if (!date) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Horaires disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Veuillez sélectionner une date pour voir les horaires disponibles.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          Horaires disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 font-medium">{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <Button
              key={slot.id}
              variant={selectedTimeSlot === slot.id ? "default" : "outline"}
              className={`
                ${selectedTimeSlot === slot.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                ${!slot.isAvailable ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => slot.isAvailable && onSelectTimeSlot(slot.id)}
              disabled={!slot.isAvailable}
            >
              {slot.startTime} - {slot.endTime}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
