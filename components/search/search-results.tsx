"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Shield, Clock, MapPin, Filter, Search } from "lucide-react"

// Sample data for hostesses - in a real app, this would come from an API
const allHostesses = [
  {
    id: 1,
    name: "Sophia",
    age: 24,
    location: "Bruxelles",
    description: "Élégante et raffinée, je vous propose des moments de détente inoubliables.",
    isVerified: true,
    isVIP: true,
    isSafeSex: true,
    image: "/elegant-woman-portrait.png",
    availableTimes: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
    coordinates: { lat: 50.8503, lng: 4.3517 }, // Brussels
  },
  {
    id: 2,
    name: "Isabella",
    age: 26,
    location: "Liège",
    description: "Masseuse professionnelle, je vous invite à découvrir mes techniques de relaxation.",
    isVerified: true,
    isVIP: false,
    isSafeSex: true,
    image: "/serene-yoga-pose.png",
    availableTimes: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
    coordinates: { lat: 50.6326, lng: 5.5797 }, // Liège
  },
  {
    id: 3,
    name: "Victoria",
    age: 23,
    location: "Charleroi",
    description: "Passionnée de photographie et d'art, je saurai vous faire découvrir de nouvelles sensations.",
    isVerified: true,
    isVIP: true,
    isSafeSex: false,
    image: "/focused-photographer.png",
    availableTimes: ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"],
    coordinates: { lat: 50.4108, lng: 4.4446 }, // Charleroi
  },
  {
    id: 4,
    name: "Olivia",
    age: 27,
    location: "Namur",
    description: "Sommelière de formation, je vous propose une expérience sensorielle unique.",
    isVerified: false,
    isVIP: false,
    isSafeSex: true,
    image: "/refined-sommelier.png",
    availableTimes: ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"],
    coordinates: { lat: 50.4673, lng: 4.8719 }, // Namur
  },
  {
    id: 5,
    name: "Emma",
    age: 25,
    location: "Anvers",
    description: "Designer d'intérieur, je vous accueille dans un cadre élégant et raffiné.",
    isVerified: true,
    isVIP: false,
    isSafeSex: true,
    image: "/confident-designer.png",
    availableTimes: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"],
    coordinates: { lat: 51.2194, lng: 4.4025 }, // Antwerp
  },
]

// Function to calculate distance between two coordinates (in km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Mock geocoding function - in a real app, this would use a geocoding API
function getCoordinatesForLocation(location: string): { lat: number; lng: number } {
  const locationMap: Record<string, { lat: number; lng: number }> = {
    bruxelles: { lat: 50.8503, lng: 4.3517 },
    liège: { lat: 50.6326, lng: 5.5797 },
    charleroi: { lat: 50.4108, lng: 4.4446 },
    namur: { lat: 50.4673, lng: 4.8719 },
    anvers: { lat: 51.2194, lng: 4.4025 },
    gand: { lat: 51.0543, lng: 3.7174 },
    mons: { lat: 50.4542, lng: 3.9563 },
    louvain: { lat: 50.8798, lng: 4.7005 },
  }

  const normalizedLocation = location.toLowerCase().trim()
  return locationMap[normalizedLocation] || { lat: 50.8503, lng: 4.3517 } // Default to Brussels
}

interface Hostess {
  id: number
  name: string
  age: number
  location: string
  description: string
  isVerified: boolean
  isVIP: boolean
  isSafeSex: boolean
  image: string
  availableTimes: string[]
  coordinates: { lat: number; lng: number }
  distance?: number
}

export function SearchResults({ 
  time, 
  location, 
  radius, 
  date 
}: { 
  time: string; 
  location: string; 
  radius: number;
  date: string;
}) {
  const [filteredHostesses, setFilteredHostesses] = useState<Hostess[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call delay
    setIsLoading(true)

    setTimeout(() => {
      let results: Hostess[] = [...allHostesses]

      // Filter by time if provided
      if (time) {
        results = results.filter((hostess) => hostess.availableTimes.includes(time))
      }

      // Filter by location and radius if provided
      if (location) {
        const searchCoordinates = getCoordinatesForLocation(location)

        results = results.filter((hostess) => {
          const distance = calculateDistance(
            searchCoordinates.lat,
            searchCoordinates.lng,
            hostess.coordinates.lat,
            hostess.coordinates.lng,
          )

          // Add distance to hostess object for display
          hostess.distance = Math.round(distance)

          return distance <= radius
        })

        // Sort by distance
        results.sort((a, b) => (a.distance || 0) - (b.distance || 0))
      }

      setFilteredHostesses(results)
      setIsLoading(false)
    }, 1000)
  }, [time, location, radius, date])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Recherche en cours...</p>
      </div>
    )
  }

  if (filteredHostesses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 inline-flex mb-6">
          <Search className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Aucun résultat trouvé</h2>
        <p className="text-gray-600 mb-6">
          Aucune hôtesse ne correspond à vos critères de recherche.
          <br />
          Essayez de modifier vos filtres ou d'élargir votre zone de recherche.
        </p>
        <Link href="/disponibilite">
          <Button variant="outline">Modifier la recherche</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Résultats de recherche</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {date && (
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
              📅 {new Date(date).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          )}
          {time && (
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {time}
            </div>
          )}
          {location && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
          )}
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            Rayon: {radius} km
          </div>
        </div>
        <p className="text-gray-600">
          {filteredHostesses.length} {filteredHostesses.length === 1 ? "hôtesse trouvée" : "hôtesses trouvées"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredHostesses.map((hostess) => (
          <Card
            key={hostess.id}
            className="overflow-hidden border-2 hover:border-purple-300 transition-all duration-300"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={hostess.image || "/placeholder.svg"}
                alt={hostess.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {hostess.isVIP && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  VIP
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{hostess.name}</h3>
                <span className="text-sm text-gray-600">{hostess.age} ans</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{hostess.location}</p>
              {hostess.distance !== undefined && (
                <p className="text-xs text-blue-600 mb-2">
                  <MapPin className="h-3 w-3 inline mr-1" />à {hostess.distance} km
                </p>
              )}
              <p className="text-sm mb-3 line-clamp-2">{hostess.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {hostess.isVerified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Vérifiée
                  </span>
                )}
                {hostess.isSafeSex && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Safe
                  </span>
                )}
              </div>
              <Link href={`/prive/femmes/${hostess.id}`}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Voir le profil</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
