"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AvailabilityCalendarProps {
  availableDates: Date[]
  onSelectDate: (date: Date | undefined) => void
  selectedDate: Date | undefined
}

export function AvailabilityCalendar({ availableDates, onSelectDate, selectedDate }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Fonction pour vérifier si une date est disponible
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear(),
    )
  }

  // Fonction pour naviguer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Fonction pour naviguer au mois suivant
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">
            {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </h3>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          month={currentMonth}
          className="rounded-md border"
          modifiers={{
            available: availableDates,
          }}
          modifiersClassNames={{
            available: "bg-green-100 text-green-900 hover:bg-green-200",
          }}
          disabled={(date) => {
            // Désactiver les dates passées et les dates non disponibles
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return date < today || !isDateAvailable(date)
          }}
        />
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
          <span>Dates disponibles</span>
        </div>
      </CardContent>
    </Card>
  )
}
