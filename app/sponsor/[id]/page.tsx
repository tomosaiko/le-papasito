"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Phone,
  MessageCircle,
  Video,
  MapPin,
  Calendar,
  Clock,
  Info,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Euro,
  Maximize2,
  BedDouble,
  Bath,
  Wifi,
  Tv,
  Car,
  Utensils,
} from "lucide-react"

// Types pour les sponsors
type SponsorType = "apartment" | "massage" | "escort" | "other"

interface SponsorImage {
  url: string
  alt: string
}

interface SponsorFeature {
  icon: React.ReactNode
  label: string
}

interface SponsorContact {
  phone: string
  whatsapp?: string
  facetime?: string
}

interface Sponsor {
  id: number
  type: SponsorType
  name: string
  description: string
  longDescription: string
  location: string
  price?: string
  rating: number
  images: SponsorImage[]
  features: SponsorFeature[]
  contact: SponsorContact
  availability?: string
  verified: boolean
}

// Base de données des sponsors
const sponsorsData: Record<number, Sponsor> = {
  101: {
    id: 101,
    type: "massage",
    name: "Massage Tantrique",
    description:
      "Découvrez l'art du massage tantrique pour une relaxation profonde et une expérience sensorielle unique.",
    longDescription:
      "Notre salon de massage tantrique vous propose une expérience unique de relaxation et de bien-être. Nos masseuses professionnelles vous feront découvrir les bienfaits du massage tantrique, une technique ancestrale qui combine relaxation profonde et éveil des sens. Dans une ambiance zen et apaisante, laissez-vous porter par les mains expertes de nos masseuses pour un moment de détente absolue.",
    location: "Bruxelles Centre",
    price: "À partir de 120€",
    rating: 4.8,
    images: [
      { url: "/images/sponsor/massage-relaxant.jpeg", alt: "Massage Tantrique" },
      { url: "/tranquil-massage-space.png", alt: "Salon de massage" },
      { url: "/aromatic-massage-oils.png", alt: "Huiles de massage" },
    ],
    features: [
      { icon: <Clock className="h-5 w-5" />, label: "60-90 minutes" },
      { icon: <MapPin className="h-5 w-5" />, label: "Espace privé" },
      { icon: <Info className="h-5 w-5" />, label: "Sur rendez-vous" },
    ],
    contact: {
      phone: "0492 77 79 10",
      whatsapp: "0492 77 79 10",
    },
    availability: "Tous les jours de 10h à 22h",
    verified: true,
  },
  102: {
    id: 102,
    type: "apartment",
    name: "Appartement Luxe à Charleroi",
    description: "Location d'appartement moderne avec éclairage LED et ambiance unique. Idéal pour couples.",
    longDescription:
      "Découvrez ce magnifique appartement de luxe situé au cœur de Charleroi. Entièrement rénové avec des matériaux haut de gamme, cet espace moderne offre une ambiance unique grâce à son système d'éclairage LED personnalisable. L'appartement dispose d'un salon spacieux avec télévision 4K, d'une cuisine entièrement équipée, d'une chambre confortable et d'une salle de bain design. Parfait pour les couples en quête d'intimité ou les professionnels en déplacement, cet appartement allie confort, technologie et élégance.",
    location: "Centre-ville de Charleroi",
    price: "120€ / nuit",
    rating: 4.9,
    images: [
      { url: "/images/sponsor/apartment-charleroi.png", alt: "Appartement Luxe à Charleroi" },
      { url: "/sleek-minimalist-kitchen.png", alt: "Cuisine moderne" },
      { url: "/serene-spa-retreat.png", alt: "Salle de bain luxueuse" },
      { url: "/cozy-led-bedroom.png", alt: "Chambre avec éclairage LED" },
    ],
    features: [
      { icon: <Maximize2 className="h-5 w-5" />, label: "65 m²" },
      { icon: <BedDouble className="h-5 w-5" />, label: "1 chambre" },
      { icon: <Bath className="h-5 w-5" />, label: "1 salle de bain" },
      { icon: <Wifi className="h-5 w-5" />, label: "WiFi haut débit" },
      { icon: <Tv className="h-5 w-5" />, label: "TV 4K" },
      { icon: <Car className="h-5 w-5" />, label: "Parking" },
      { icon: <Utensils className="h-5 w-5" />, label: "Cuisine équipée" },
    ],
    contact: {
      phone: "0471 23 45 67",
      whatsapp: "0471 23 45 67",
      facetime: "0471 23 45 67",
    },
    availability: "Disponible immédiatement",
    verified: true,
  },
}

export default function SponsorPage() {
  const params = useParams()
  const sponsorId = Number(params.id)
  const sponsor = sponsorsData[sponsorId]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  if (!sponsor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Annonce non trouvée</h1>
        <p className="mb-8">L'annonce que vous recherchez n'existe pas ou a été supprimée.</p>
        <Link href="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sponsor.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? sponsor.images.length - 1 : prev - 1))
  }

  const handleCall = () => {
    window.location.href = `tel:${sponsor.contact.phone}`
  }

  const handleWhatsApp = () => {
    if (sponsor.contact.whatsapp) {
      window.open(`https://wa.me/${sponsor.contact.whatsapp.replace(/\s+/g, "")}`, "_blank")
    }
  }

  const handleFaceTime = () => {
    if (sponsor.contact.facetime) {
      window.location.href = `facetime:${sponsor.contact.facetime}`
    }
  }

  const handleSMS = () => {
    window.location.href = `sms:${sponsor.contact.phone}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Bouton retour */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Retour</span>
        </Link>

        {/* En-tête avec nom et emplacement */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sponsor.name}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{sponsor.location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full ${
                isFavorite ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500"
              } hover:bg-gray-200 transition-colors`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Galerie d'images */}
        <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-100">
          <div className="aspect-[16/9] relative">
            <Image
              src={sponsor.images[currentImageIndex].url || "/placeholder.svg"}
              alt={sponsor.images[currentImageIndex].alt}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Contrôles de la galerie */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button
              onClick={prevImage}
              className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-colors"
              aria-label="Image précédente"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-colors"
              aria-label="Image suivante"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Indicateur d'image */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/50 rounded-full px-3 py-1 text-white text-sm">
              {currentImageIndex + 1} / {sponsor.images.length}
            </div>
          </div>

          {/* Badge vérifié */}
          {sponsor.verified && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1 fill-current" />
              Vérifié
            </div>
          )}

          {/* Badge prix */}
          {sponsor.price && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              {sponsor.price}
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="md:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{sponsor.longDescription}</p>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sponsor.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">{feature.icon}</div>
                    <span className="text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilité */}
            {sponsor.availability && (
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4">Disponibilité</h2>
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{sponsor.availability}</span>
                </div>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div>
            {/* Carte de contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Contact</h2>

              {/* Boutons d'appel */}
              <div className="space-y-3">
                <AnimatedButton variant="reservation" className="w-full justify-center" onClick={handleCall}>
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler maintenant
                </AnimatedButton>

                <div className="grid grid-cols-3 gap-3">
                  {sponsor.contact.whatsapp && (
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-16 border-green-500 text-green-600 hover:bg-green-50"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="h-6 w-6 mb-1" />
                      <span className="text-xs">WhatsApp</span>
                    </Button>
                  )}

                  {sponsor.contact.facetime && (
                    <Button
                      variant="outline"
                      className="flex flex-col items-center justify-center h-16 border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={handleFaceTime}
                    >
                      <Video className="h-6 w-6 mb-1" />
                      <span className="text-xs">FaceTime</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="flex flex-col items-center justify-center h-16 border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={handleSMS}
                  >
                    <MessageCircle className="h-6 w-6 mb-1" />
                    <span className="text-xs">SMS</span>
                  </Button>
                </div>
              </div>

              {/* Numéro de téléphone */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm mb-1">Ou appelez directement</p>
                <a href={`tel:${sponsor.contact.phone}`} className="text-xl font-bold text-gray-900 hover:underline">
                  {sponsor.contact.phone}
                </a>
              </div>

              {/* Note de sécurité */}
              <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p>
                  Pour votre sécurité, mentionnez que vous avez vu cette annonce sur Le Papasito lors de votre appel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
