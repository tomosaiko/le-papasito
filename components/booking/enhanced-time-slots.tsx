"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Star, Shield, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isPopular?: boolean
  isPremium?: boolean
  isLastMinute?: boolean
  discount?: number
  remainingSpots?: number
}

interface EnhancedTimeSlotsProps {
  date: Date | undefined
  timeSlots: TimeSlot[]
  selectedTimeSlot: string | null
  onSelectTimeSlot: (timeSlotId: string) => void
  className?: string
  locale?: Intl.LocalesArgument
}

export function EnhancedTimeSlots({
  date,
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
  className,
  locale = "fr-FR",
}: EnhancedTimeSlotsProps) {
  const [activeTab, setActiveTab] = useState<"morning" | "afternoon" | "evening">("morning")

  if (!date) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Horaires disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-muted-foreground">Veuillez sélectionner une date pour voir les horaires disponibles.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedDate = date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Filtrer les créneaux par période de la journée
  const morningSlots = timeSlots.filter((slot) => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour >= 6 && hour < 12
  })

  const afternoonSlots = timeSlots.filter((slot) => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour >= 12 && hour < 18
  })

  const eveningSlots = timeSlots.filter((slot) => {
    const hour = Number.parseInt(slot.startTime.split(":")[0])
    return hour >= 18 && hour < 24
  })

  // Déterminer les créneaux à afficher en fonction de l'onglet actif
  const displayedSlots =
    activeTab === "morning" ? morningSlots : activeTab === "afternoon" ? afternoonSlots : eveningSlots

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-500" />
          Horaires disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 font-medium capitalize">{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</p>

        <div className="flex border rounded-lg mb-4 overflow-hidden">
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors",
              activeTab === "morning"
                ? "bg-purple-600 text-white"
                : "bg-transparent hover:bg-purple-100 dark:hover:bg-purple-900/20",
            )}
            onClick={() => setActiveTab("morning")}
          >
            Matin
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors",
              activeTab === "afternoon"
                ? "bg-purple-600 text-white"
                : "bg-transparent hover:bg-purple-100 dark:hover:bg-purple-900/20",
            )}
            onClick={() => setActiveTab("afternoon")}
          >
            Après-midi
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-sm font-medium transition-colors",
              activeTab === "evening"
                ? "bg-purple-600 text-white"
                : "bg-transparent hover:bg-purple-100 dark:hover:bg-purple-900/20",
            )}
            onClick={() => setActiveTab("evening")}
          >
            Soir
          </button>
        </div>

        {displayedSlots.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Aucun créneau disponible pour cette période.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {displayedSlots.map((slot) => (
              <TooltipProvider key={slot.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button
                        variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                        className={cn(
                          "w-full h-auto py-3 flex flex-col items-center justify-center gap-1",
                          selectedTimeSlot === slot.id
                            ? "bg-purple-600 hover:bg-purple-700"
                            : slot.isPremium
                              ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                              : "",
                          !slot.isAvailable && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => slot.isAvailable && onSelectTimeSlot(slot.id)}
                        disabled={!slot.isAvailable}
                      >
                        <span className={cn("text-sm font-medium", selectedTimeSlot === slot.id ? "text-white" : "")}>
                          {slot.startTime} - {slot.endTime}
                        </span>

                        {slot.isLastMinute && slot.discount && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] px-1 py-0 h-4 bg-red-100 text-red-800 border-red-200",
                              selectedTimeSlot === slot.id && "bg-red-700 text-white border-red-600",
                            )}
                          >
                            -{slot.discount}%
                          </Badge>
                        )}
                      </Button>

                      {slot.isPremium && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-yellow-500 text-white text-[10px] px-1 py-0 h-4">
                            <Star className="h-2 w-2 mr-0.5" />
                            Premium
                          </Badge>
                        </div>
                      )}

                      {slot.isPopular && (
                        <div className="absolute -top-2 -left-2">
                          <Badge className="bg-purple-500 text-white text-[10px] px-1 py-0 h-4">Populaire</Badge>
                        </div>
                      )}

                      {slot.remainingSpots !== undefined && slot.remainingSpots <= 3 && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-orange-500 text-white text-[10px] px-1 py-0 h-4">
                            <Users className="h-2 w-2 mr-0.5" />
                            {slot.remainingSpots} restant
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      {slot.isPremium && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>Créneau premium</span>
                        </div>
                      )}
                      {slot.isPopular && (
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="h-3 w-3 text-purple-500" />
                          <span>Très demandé</span>
                        </div>
                      )}
                      {slot.isLastMinute && slot.discount && (
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3 text-red-500" />
                          <span>Réduction de dernière minute: {slot.discount}%</span>
                        </div>
                      )}
                      {slot.remainingSpots !== undefined && (
                        <div className="flex items-center gap-1">
                          <Info className="h-3 w-3 text-blue-500" />
                          <span>{slot.remainingSpots} place(s) restante(s)</span>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Sélectionné</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"></div>
              <span>Premium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-red-400 bg-red-50 dark:bg-red-900/10"></div>
              <span>Réduction</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full border border-gray-300 bg-gray-100 opacity-50"></div>
              <span>Non disponible</span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Shield className="h-3 w-3" />
            <span>Les créneaux premium offrent une priorité de réservation et des services exclusifs.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
