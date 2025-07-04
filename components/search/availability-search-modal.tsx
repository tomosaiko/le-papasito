"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Search, ArrowRight, AlertCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Generate time slots in 30-minute intervals
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      slots.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

export function AvailabilitySearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const [timeSlot, setTimeSlot] = useState("")
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState(10)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Obtenir la date et heure actuelles
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const currentTime = now.toTimeString().slice(0, 5)

  // Validation des dates et heures
  const validateDateTime = () => {
    const newErrors: string[] = []
    
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate)
      const todayObj = new Date(today)
      
      if (selectedDateObj < todayObj) {
        newErrors.push("La date sélectionnée ne peut pas être dans le passé")
      }
      
      // Si c'est aujourd'hui, vérifier l'heure
      if (selectedDate === today && timeSlot) {
        if (timeSlot <= currentTime) {
          newErrors.push("L'heure sélectionnée ne peut pas être dans le passé")
        }
      }
    } else {
      newErrors.push("Veuillez sélectionner une date")
    }
    
    // Validation du rayon
    if (radius < 1 || radius > 50) {
      newErrors.push("Le rayon doit être entre 1 et 50 km")
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  // Synchroniser l'input time avec les boutons de créneaux
  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot)
    setTimeSlot(slot)
  }

  const handleTimeInputChange = (value: string) => {
    setTimeSlot(value)
    setSelectedTimeSlot(value)
  }

  const handleSearch = () => {
    if (!validateDateTime()) {
      return
    }

    setIsSearching(true)

    // Construct the search query
    const searchParams = new URLSearchParams()
    if (selectedDate) {
      searchParams.append("date", selectedDate)
    }
    if (timeSlot) searchParams.append("time", timeSlot)
    if (location) searchParams.append("location", location)
    searchParams.append("radius", radius.toString())

    // Navigate to the search results page
    router.push(`/disponibilite/results?${searchParams.toString()}`)
    onClose()
  }

  // Réinitialiser les erreurs quand les valeurs changent
  useEffect(() => {
    if (errors.length > 0) {
      validateDateTime()
    }
  }, [selectedDate, timeSlot])

  // Générer des créneaux intelligents selon le contexte
  const getIntelligentTimeSlots = () => {
    if (!selectedDate) {
      // Si aucune date sélectionnée, retourner les premiers créneaux
      return timeSlots.slice(0, 9)
    }

    const selectedDateObj = new Date(selectedDate)
    const todayObj = new Date(today)
    const isToday = selectedDate === today

    if (isToday) {
      // Pour aujourd'hui : commencer à partir de l'heure actuelle
      const currentHour = parseInt(currentTime.split(':')[0])
      const currentMinute = parseInt(currentTime.split(':')[1])
      
      // Trouver le premier créneau disponible après l'heure actuelle
      const availableSlots = timeSlots.filter(slot => {
        const [hour, minute] = slot.split(':').map(Number)
        return hour > currentHour || (hour === currentHour && minute > currentMinute)
      })
      
      return availableSlots.slice(0, 9)
    } else {
      // Pour les autres jours : centrer autour de l'heure sélectionnée
      if (timeSlot) {
        const selectedHour = parseInt(timeSlot.split(':')[0])
        const selectedIndex = timeSlots.findIndex(slot => slot === timeSlot)
        
        if (selectedIndex !== -1) {
          // Calculer les indices pour centrer autour de l'heure sélectionnée
          const startIndex = Math.max(0, selectedIndex - 4) // 4 créneaux avant
          const endIndex = Math.min(timeSlots.length, startIndex + 9) // 9 créneaux au total
          
          // Ajuster si on dépasse la fin
          if (endIndex === timeSlots.length) {
            const adjustedStartIndex = Math.max(0, endIndex - 9)
            return timeSlots.slice(adjustedStartIndex, endIndex)
          }
          
          return timeSlots.slice(startIndex, endIndex)
        }
      }
      
      // Si pas d'heure sélectionnée, retourner les créneaux du milieu de la journée
      const midIndex = Math.floor(timeSlots.length / 2) - 4
      return timeSlots.slice(midIndex, midIndex + 9)
    }
  }

  const intelligentTimeSlots = getIntelligentTimeSlots()

  // Use Sheet on mobile and Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-xl font-bold">Recherche de disponibilité</SheetTitle>
            <SheetDescription>Trouvez les hôtesses disponibles selon vos critères</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-4">{renderSearchForm()}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">Recherche de disponibilité</DialogTitle>
          <SheetDescription>Trouvez les hôtesses disponibles selon vos critères</SheetDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">{renderSearchForm()}</div>
      </DialogContent>
    </Dialog>
  )

  function renderSearchForm() {
    return (
      <div className="space-y-6 py-4">
        {/* Affichage des erreurs */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Veuillez corriger les erreurs suivantes :</span>
            </div>
            <ul className="space-y-1 text-sm text-red-600">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            value={selectedDate}
            min={today}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-time">Horaire souhaité</Label>
          <Input
            type="time"
            id="custom-time"
            value={timeSlot}
            min={selectedDate === today ? currentTime : undefined}
            onChange={(e) => handleTimeInputChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Créneaux rapides</Label>
          <div className="grid grid-cols-3 gap-2">
            {intelligentTimeSlots.map((slot) => {
              const isDisabled = selectedDate === today && slot <= currentTime
              return (
                <Button
                  key={slot}
                  variant={timeSlot === slot ? "default" : "outline"}
                  onClick={() => handleTimeSlotSelect(slot)}
                  disabled={isDisabled}
                  className={`w-full text-xs ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {slot}
                </Button>
              )
            })}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {!selectedDate ? (
              "💡 Sélectionnez une date pour voir les créneaux disponibles"
            ) : selectedDate === today ? (
              "🕐 Créneaux disponibles à partir de maintenant"
            ) : (
              "🎯 Créneaux centrés autour de votre sélection"
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Ville ou quartier</Label>
          <div className="relative">
            <Input
              id="location"
              placeholder="Ex: Bruxelles, Liège, Charleroi..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="radius">Rayon de recherche: {radius} km</Label>
          </div>
          <Slider
            id="radius"
            min={1}
            max={50}
            step={1}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={errors.length > 0 || isSearching}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Recherche en cours...
            </>
          ) : (
            <>
              Rechercher
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    )
  }
}
