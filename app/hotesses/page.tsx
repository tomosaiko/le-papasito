"use client"

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, Shield, Clock, MapPin, Heart, X, Check } from "lucide-react"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { QuickBookingModal } from "@/components/booking/quick-booking-modal"
import { AvailabilityNotification } from "@/components/notifications/availability-notification"

// Sample data for hostesses with availability
const hostesses = [
  {
    id: 1,
    name: "Sophia",
    age: 24,
    location: "Bruxelles",
    distance: "2.3 km",
    description: "Élégante et raffinée, je vous propose des moments de détente inoubliables.",
    isVerified: true,
    isVIP: true,
    isSafeSex: true,
    isOnline: true,
    lastSeen: "En ligne",
    rating: 4.8,
    reviews: 127,
    price: "150€",
    image: "/elegant-woman-portrait.png",
    availableTimes: ["14:00", "15:00", "16:00", "17:00", "18:00"],
    services: ["Massage", "Escort", "Dîner"],
    languages: ["Français", "Anglais", "Espagnol"]
  },
  {
    id: 2,
    name: "Isabella",
    age: 26,
    location: "Liège",
    distance: "5.1 km",
    description: "Masseuse professionnelle, je vous invite à découvrir mes techniques de relaxation.",
    isVerified: true,
    isVIP: false,
    isSafeSex: true,
    isOnline: true,
    lastSeen: "Il y a 5 min",
    rating: 4.6,
    reviews: 89,
    price: "120€",
    image: "/serene-yoga-pose.png",
    availableTimes: ["13:00", "14:00", "15:00", "16:00"],
    services: ["Massage", "Relaxation"],
    languages: ["Français", "Italien"]
  },
  {
    id: 3,
    name: "Victoria",
    age: 23,
    location: "Charleroi",
    distance: "8.7 km",
    description: "Passionnée de photographie et d'art, je saurai vous faire découvrir de nouvelles sensations.",
    isVerified: true,
    isVIP: true,
    isSafeSex: false,
    isOnline: false,
    lastSeen: "Il y a 1h",
    rating: 4.9,
    reviews: 203,
    price: "180€",
    image: "/focused-photographer.png",
    availableTimes: ["16:00", "17:00", "18:00", "19:00"],
    services: ["Escort", "Photo", "Art"],
    languages: ["Français", "Anglais", "Russe"]
  },
  {
    id: 4,
    name: "Olivia",
    age: 27,
    location: "Namur",
    distance: "12.3 km",
    description: "Sommelière de formation, je vous propose une expérience sensorielle unique.",
    isVerified: false,
    isVIP: false,
    isSafeSex: true,
    isOnline: true,
    lastSeen: "En ligne",
    rating: 4.4,
    reviews: 56,
    price: "100€",
    image: "/refined-sommelier.png",
    availableTimes: ["14:30", "15:30", "16:30", "17:30"],
    services: ["Dîner", "Dégustation"],
    languages: ["Français", "Anglais"]
  },
  {
    id: 5,
    name: "Emma",
    age: 25,
    location: "Anvers",
    distance: "15.2 km",
    description: "Designer d'intérieur, je vous accueille dans un cadre élégant et raffiné.",
    isVerified: true,
    isVIP: false,
    isSafeSex: true,
    isOnline: false,
    lastSeen: "Il y a 30 min",
    rating: 4.7,
    reviews: 142,
    price: "140€",
    image: "/confident-designer.png",
    availableTimes: ["13:00", "14:00", "15:00", "16:00", "17:00"],
    services: ["Escort", "Design"],
    languages: ["Français", "Néerlandais", "Anglais"]
  }
]

export function QuickFilterSearch() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const appearanceFilters = [
    { id: "latina", label: "LATINA", emoji: "💃" },
    { id: "blonde", label: "BLONDE", emoji: "👱‍♀️" },
    { id: "brune", label: "BRUNE", emoji: "🙎‍♀️" },
    { id: "arabe", label: "ARABE", emoji: "🧕" },
    { id: "black", label: "BLACK", emoji: "✨" },
    { id: "asiatique", label: "ASIATIQUE", emoji: "🏮" },
    { id: "skinny", label: "SKINNY", emoji: "🍸" },
    { id: "curvy", label: "CURVY", emoji: "🍑" },
    { id: "trans", label: "TRANS", emoji: "⚧️" }
  ]

  const statusFilters = [
    { id: "online", label: "EN LIGNE", emoji: "🟢" },
    { id: "verified", label: "VÉRIFIÉE", emoji: "✅" },
    { id: "vip", label: "VIP", emoji: "⭐" }
  ]

  const serviceFilters = [
    { id: "massage", label: "MASSAGE", emoji: "💆‍♀️" },
    { id: "escorte", label: "ESCORTE", emoji: "👗" }
  ]

  return (
    <div className="w-full px-4 py-2 bg-white sticky top-0 z-10 shadow-sm">
      {/* Appearance & Status Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {[...appearanceFilters, ...statusFilters].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.id
                ? "bg-purple-100 border-purple-300 text-purple-700"
                : "bg-white border-gray-200 text-gray-700 hover:border-purple-200"
            }`}
          >
            <span role="img" aria-label={filter.id}>
              {filter.emoji}
            </span>
            <span className="font-medium text-sm">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Service Type Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 pt-2">
        {serviceFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
            className={`flex items-center gap-1.5 px-6 py-2 rounded-full border whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.id
                ? "bg-gold-light border-gold text-white"
                : "bg-gradient-to-r from-purple-50 to-gold-50 border-purple-200 text-purple-700 hover:border-gold"
            }`}
          >
            <span role="img" aria-label={filter.id}>
              {filter.emoji}
            </span>
            <span className="font-medium text-sm">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative mt-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, lieu, service..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
        />
      </div>
    </div>
  )
}

export default function HostessesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProfiles, setLikedProfiles] = useState<number[]>([])
  const [rejectedProfiles, setRejectedProfiles] = useState<number[]>([])
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedHostess, setSelectedHostess] = useState<any>(null)

  const handleLike = () => {
    if (currentIndex < hostesses.length) {
      setLikedProfiles([...likedProfiles, hostesses[currentIndex].id])
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleReject = () => {
    if (currentIndex < hostesses.length) {
      setRejectedProfiles([...rejectedProfiles, hostesses[currentIndex].id])
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleBooking = (hostess: any) => {
    setSelectedHostess(hostess)
    setIsBookingModalOpen(true)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      handleLike()
    } else {
      handleReject()
    }
  }

  const currentHostess = hostesses[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <QuickFilterSearch />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Hôtesses</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Parcourez nos profils et trouvez votre hôtesse idéale en quelques swipes
          </p>
        </div>

        {/* Swipe Interface */}
        <div className="max-w-md mx-auto">
          {currentHostess ? (
            <motion.div
              key={currentHostess.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative"
            >
              <Card className="overflow-hidden border-2 shadow-xl">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={currentHostess.image || "/placeholder.svg"}
                    alt={currentHostess.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${currentHostess.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded-full">
                      {currentHostess.lastSeen}
                    </span>
                  </div>

                  {/* VIP Badge */}
                  {currentHostess.isVIP && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      VIP
                    </div>
                  )}

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 font-bold px-3 py-1 rounded-full">
                    {currentHostess.price}
                  </div>

                  {/* Availability Indicator */}
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentHostess.availableTimes.length} créneaux
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl flex items-center gap-2">
                        {currentHostess.name}
                        {currentHostess.isVerified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </h3>
                      <p className="text-gray-600">{currentHostess.age} ans • {currentHostess.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{currentHostess.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">({currentHostess.reviews} avis)</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{currentHostess.description}</p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentHostess.services.map((service: string, index: number) => (
                      <span key={index} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {currentHostess.languages.map((lang: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>

                  {/* Quick Availability */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Prochains créneaux :</p>
                    <div className="flex gap-2 overflow-x-auto">
                      {currentHostess.availableTimes.slice(0, 4).map((time: string, index: number) => (
                        <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleReject}
                      variant="outline"
                      size="lg"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Passer
                    </Button>
                    <Button
                      onClick={() => handleBooking(currentHostess)}
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Réserver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Vous avez parcouru tous les profils !</h3>
              <p className="text-gray-600 mb-6">
                {likedProfiles.length} profils vous intéressent
              </p>
              <Button
                onClick={() => {
                  setCurrentIndex(0)
                  setLikedProfiles([])
                  setRejectedProfiles([])
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Recommencer
              </Button>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        {currentHostess && (
          <div className="max-w-md mx-auto mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{currentIndex + 1} / {hostesses.length}</span>
              <span>{likedProfiles.length} intéressé(s)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / hostesses.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Booking Modal */}
      {selectedHostess && (
        <QuickBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false)
            setSelectedHostess(null)
          }}
          hostess={selectedHostess}
        />
      )}
    </div>
  )
}
