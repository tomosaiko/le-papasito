"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, Clock, ArrowRight, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale/fr"
import { cn } from "@/lib/utils"

// Generate time slots in 30-minute intervals starting from next available slot
const generateTimeSlots = (fromCurrentTime = false) => {
  const slots = []
  let startHour = 0
  let startMinute = 0

  if (fromCurrentTime) {
    const now = new Date()
    
    // Add 1 hour minimum for preparation time
    now.setHours(now.getHours() + 1)
    
    startHour = now.getHours()
    startMinute = now.getMinutes()
    
    // Round up to next 30-minute interval
    if (startMinute === 0) {
      // Exactly on the hour, keep it
      startMinute = 0
    } else if (startMinute <= 30) {
      // Between :01 and :30, round to :30
      startMinute = 30
    } else {
      // After :30, round to next hour
      startHour += 1
      startMinute = 0
    }
    
    // If it's past midnight, start from tomorrow
    if (startHour >= 24) {
      startHour = 0
    }
  }

  for (let hour = startHour; hour < 24; hour++) {
    const startMin = (hour === startHour) ? startMinute : 0
    for (let minute = startMin; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      slots.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return slots
}

// Get next available time slot (minimum 1h after current time)
const getNextAvailableTimeSlot = () => {
  const now = new Date()
  
  // Add 1 hour minimum for preparation time
  now.setHours(now.getHours() + 1)
  
  let hour = now.getHours()
  let minute = now.getMinutes()
  
  // Round up to next 30-minute interval
  if (minute === 0) {
    // Exactly on the hour, keep it
    minute = 0
  } else if (minute <= 30) {
    // Between :01 and :30, round to :30
    minute = 30
  } else {
    // After :30, round to next hour
    hour += 1
    minute = 0
  }
  
  // If it's past midnight, start from tomorrow
  if (hour >= 24) {
    hour = 0
  }
  
  const formattedHour = hour.toString().padStart(2, "0")
  const formattedMinute = minute.toString().padStart(2, "0")
  return `${formattedHour}:${formattedMinute}`
}

export function SearchForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date>(new Date())
  const [timeSlot, setTimeSlot] = useState("")
  const [location, setLocation] = useState("")
  const [radius, setRadius] = useState(10)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  
  // Debug info
  const now = new Date()
  const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`
  const nextSlot = getNextAvailableTimeSlot()

  // Initialize with current date and next available time slot
  useEffect(() => {
    const today = new Date()
    const selectedDateIsSameAsToday = date.toDateString() === today.toDateString()
    
    if (selectedDateIsSameAsToday) {
      // If selected date is today, show slots from current time
      const slots = generateTimeSlots(true)
      setAvailableTimeSlots(slots)
      // Auto-select next available slot
      const nextSlot = getNextAvailableTimeSlot()
      setTimeSlot(nextSlot)
    } else {
      // If selected date is in the future, show all slots
      const slots = generateTimeSlots(false)
      setAvailableTimeSlots(slots)
      setTimeSlot("") // Reset time slot selection
    }
  }, [date])

  // Set initial time slot on component mount
  useEffect(() => {
    const nextSlot = getNextAvailableTimeSlot()
    setTimeSlot(nextSlot)
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Construct the search query
    const searchParams = new URLSearchParams()
    if (date) searchParams.append("date", format(date, "yyyy-MM-dd"))
    if (timeSlot) searchParams.append("time", timeSlot)
    if (location) searchParams.append("location", location)
    searchParams.append("radius", radius.toString())

    // Navigate to the search results page
    router.push(`/disponibilite/results?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      {/* Debug info - temporary */}
      <div className="bg-yellow-100 p-3 rounded text-sm">
        <strong>Debug:</strong> Il est actuellement {currentTime} → Prochain créneau calculé: {nextSlot}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date" className="font-medium flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
          Date souhaitée
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPPP", { locale: fr }) : <span>Choisir une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time-slot" className="font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2 text-purple-500" />
          Horaire souhaité
        </Label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger id="time-slot" className="w-full">
            <SelectValue placeholder="Sélectionnez un horaire" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {date.toDateString() === new Date().toDateString() && (
          <p className="text-xs text-gray-500">
            Créneaux disponibles à partir de 1h après maintenant (temps de préparation)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-purple-500" />
          Ville ou quartier
        </Label>
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
          <Label htmlFor="radius" className="font-medium">
            Rayon de recherche: {radius} km
          </Label>
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
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
      >
        Rechercher
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
