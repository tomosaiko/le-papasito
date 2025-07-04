"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AvailabilityLevel {
  type: "high" | "medium" | "low" | "none"
  label: string
  color: string
}

interface DayAvailability {
  date: Date
  level: AvailabilityLevel["type"]
  slots: number
}

interface EnhancedAvailabilityCalendarProps {
  availabilityData: DayAvailability[]
  onSelectDate: (date: Date | undefined) => void
  selectedDate: Date | undefined
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[] | ((date: Date) => boolean)
  className?: string
  locale?: Intl.LocalesArgument
}

export function EnhancedAvailabilityCalendar({
  availabilityData,
  onSelectDate,
  selectedDate,
  minDate = new Date(),
  maxDate,
  disabledDates,
  className,
  locale = "fr-FR",
}: EnhancedAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Réinitialiser l'animation lors du changement de mois
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [currentMonth])

  // Fonction pour obtenir le niveau de disponibilité d'une date
  const getAvailabilityLevel = (date: Date): AvailabilityLevel => {
    const dayData = availabilityData.find(
      (day) =>
        day.date.getDate() === date.getDate() &&
        day.date.getMonth() === date.getMonth() &&
        day.date.getFullYear() === date.getFullYear(),
    )

    if (!dayData) {
      return {
        type: "none",
        label: "Non disponible",
        color: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
      }
    }

    switch (dayData.level) {
      case "high":
        return {
          type: "high",
          label: `Très disponible (${dayData.slots} créneaux)`,
          color:
            "bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50",
        }
      case "medium":
        return {
          type: "medium",
          label: `Moyennement disponible (${dayData.slots} créneaux)`,
          color:
            "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
        }
      case "low":
        return {
          type: "low",
          label: `Peu disponible (${dayData.slots} créneaux)`,
          color:
            "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50",
        }
      default:
        return {
          type: "none",
          label: "Non disponible",
          color: "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
        }
    }
  }

  // Fonction pour naviguer au mois précédent
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Fonction pour naviguer au mois suivant
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Fonction pour naviguer au mois actuel
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date())
  }

  // Fonction pour formater le nom du mois
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" })
  }

  // Fonction pour vérifier si une date est aujourd'hui
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Fonction pour vérifier si une date est désactivée
  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return true

    if (typeof disabledDates === "function") {
      return disabledDates(date)
    }

    if (Array.isArray(disabledDates)) {
      return disabledDates.some(
        (disabledDate) =>
          disabledDate.getDate() === date.getDate() &&
          disabledDate.getMonth() === date.getMonth() &&
          disabledDate.getFullYear() === date.getFullYear(),
      )
    }

    return false
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-between border-b">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <h3 className="font-medium text-center capitalize">{formatMonth(currentMonth)}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={goToCurrentMonth} className="h-7 w-7 rounded-full">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aujourd'hui</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border-0"
            classNames={{
              day_today: "bg-purple-100 dark:bg-purple-900/30 font-bold text-purple-900 dark:text-purple-300",
              day_selected:
                "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-700 focus:text-white",
              day_disabled: "text-gray-300 dark:text-gray-600 hover:bg-transparent",
              day_range_middle: "bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300",
              day_hidden: "invisible",
              day: "h-9 w-9 text-center p-0 relative [&:has([aria-selected])]:bg-purple-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day_range_end: "bg-purple-600 text-white rounded-r-md",
              day_range_start: "bg-purple-600 text-white rounded-l-md",
              cell: "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-purple-600 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
              head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.8rem] py-1.5",
              table: "border-collapse w-full",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "flex items-center gap-1",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              row: "flex w-full",
            }}
            disabled={(date) => isDateDisabled(date)}
            modifiers={{
              available: availabilityData.map((day) => day.date),
            }}
            modifiersClassNames={{
              available: "cursor-pointer",
            }}
            components={{
              Day: ({ date, ...props }) => {
                const availability = getAvailabilityLevel(date)
                const isDisabled = isDateDisabled(date)
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear()

                return (
                  <div
                    {...props}
                    className={cn(
                      "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                      isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                      isSelected ? "bg-purple-600 text-white rounded-md" : availability.color,
                      isToday(date) && !isSelected && "border border-purple-500",
                    )}
                    onMouseEnter={() => setHoveredDate(date)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <div className="flex h-full w-full items-center justify-center">{date.getDate()}</div>

                    {availability.type !== "none" && !isSelected && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        {Array.from({
                          length: availability.type === "high" ? 3 : availability.type === "medium" ? 2 : 1,
                        }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 w-1 rounded-full",
                              availability.type === "high"
                                ? "bg-green-500"
                                : availability.type === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-orange-500",
                            )}
                          />
                        ))}
                      </div>
                    )}

                    {hoveredDate &&
                      date.getDate() === hoveredDate.getDate() &&
                      date.getMonth() === hoveredDate.getMonth() &&
                      date.getFullYear() === hoveredDate.getFullYear() &&
                      availability.type !== "none" && (
                        <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 z-10">
                          <div className="bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {availability.label}
                          </div>
                          <div className="w-2 h-2 bg-black/80 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                        </div>
                      )}
                  </div>
                )
              },
            }}
          />
        </div>

        <div className="p-4 border-t">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Info className="h-4 w-4" />
              Légende
            </h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Très disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Moyennement disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>Peu disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border border-purple-500"></div>
                <span>Aujourd'hui</span>
              </div>
            </div>
          </div>

          {selectedDate && (
            <div className="mt-3 pt-3 border-t">
              <Badge
                variant="outline"
                className="bg-purple-100 dark:bg-purple-900/20 text-purple-900 dark:text-purple-300 flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                <span>
                  {selectedDate.toLocaleDateString(locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
