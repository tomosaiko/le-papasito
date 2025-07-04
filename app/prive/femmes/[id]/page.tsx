"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  Home,
  Phone,
  Shield,
  CheckCircle,
  Heart,
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react"

export default async function EscortProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos")
  const [favorited, setFavorited] = useState(false)

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Sample data for the escort profile
  const profile = {
    id: id,
    name: "Latina chaude, quelques jours en ville",
    location: "Escort Bruxelles",
    phone: "+351 920 111 381",
    isVerified: true,
    isSafeSex: true,
    description: {
      fr: "Bonjour, bonjour. Je suis une nouvelle Latina avec un bon corps, je suis très affectueuse, et j'aime recevoir du plaisir aussi. J'ai un endroit confortable où nous pouvons passer un bon moment. Ou je peux vous rencontrer à l'hôtel. Je vous répondrai dans la matinée.",
      en: "Hello, good afternoon. I'm a latina, new with my body up to date, I'm very affectionate, Perfumes, smelly, and I love to receive pleasure too. I have a place to receive you, comfortable for us to have a good time. Or I can meet you at a hotel. I'd love to meet you.",
    },
    images: [
      "/placeholder.svg?height=600&width=450",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    videoThumbnail: "/placeholder.svg?height=400&width=600",
    postedBy: "Sonia (29)",
    postedTime: "11:43",
    details: {
      genre: "Femme",
      age: "28 ans",
      orientation: "Bisexuel",
      nationality: "Brésil",
      ethnicity: "Amérique latine",
      languages: "Anglais, Espagnol, Portugais",
      height: "165cm",
      weight: "57kg",
      hairColor: "Brun",
      eyeColor: "Brun",
      intimateHaircut: "Rasé",
      cupSize: "C",
      tattoos: "Oui",
      piercings: "Oui",
      smoker: "Non",
    },
    services: {
      massage: ["Body to body", "Massage sensuel", "Massage", "Massage Tantra"],
      preliminaries: ["Doigter", "Fellation jusqu'à la fin", "Fellation avec préservatif", "Sucer les tétons"],
      intimate: ["Vibromasseur"],
      fetish: ["Facesitting", "Fétichisme des pieds"],
      other: ["Dîner", "Possibilités de douche", "Striptease", "Film ou photo", "Sexe virtuel", "Trio (F/F/H)"],
    },
  }

  // Premium listings
  const premiumListings = [
    {
      id: 101,
      name: "Sensora massage",
      description: "Vivez le plaisir ultime de la jouissance...",
      phone: "0486 66 63 05",
      images: ["/placeholder.svg?height=400&width=300"],
      isPremium: true,
    },
    {
      id: 102,
      name: "Ema New",
      description: "Je suis sexy Ema et je t'attends dans...",
      phone: "0494 90 83 41",
      images: ["/placeholder.svg?height=400&width=300"],
      isPremium: true,
    },
    {
      id: 103,
      name: "Megan DERNIERS JOURS",
      description: "blonde sexy et coquine. La meilleure...",
      phone: "0494 25 81 52",
      images: ["/placeholder.svg?height=400&width=300"],
      isPremium: true,
    },
    {
      id: 104,
      name: "Carol",
      description: "100% Naturel",
      phone: "0474 07 61 14",
      images: ["/placeholder.svg?height=400&width=300"],
      isPremium: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-200 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-black">
            <Link href="/" className="text-black hover:text-black">
              <Home className="h-4 w-4" />
            </Link>
            <span className="mx-2">»</span>
            <Link href="/escort" className="text-black hover:text-black">
              Escort
            </Link>
            <span className="mx-2">»</span>
            <Link href="/escort/femmes" className="text-black hover:text-black">
              Femmes
            </Link>
            <span className="mx-2">»</span>
            <span className="text-black">{profile.name}</span>
          </div>
          <Link href="/retour" className="text-red-500 hover:text-red-700">
            Retour →
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="flex flex-col md:flex-row">
                {/* Main Image */}
                <div className="md:w-2/3">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={profile.images[0] || "/placeholder.svg"}
                      alt={profile.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="md:w-1/3 p-4">
                  <h1 className="text-xl font-bold text-black text-center">{profile.name}</h1>
                  <p className="text-sm text-black mb-3 text-center">{profile.location}</p>

                  <div className="flex flex-col items-center text-center mb-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Les réservations se font uniquement via le chat interne ou la réservation en ligne
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link href={`/booking/${id}`} passHref>
                        <AnimatedButton variant="purple" className="text-sm py-1.5">
                          <Calendar className="h-4 w-4 mr-1" />
                          Réservation
                        </AnimatedButton>
                      </Link>
                      <Button className="bg-black hover:bg-gray-800 text-white text-sm py-1.5 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                    <div className="text-xs text-black mt-3">
                      par {profile.postedBy} à {profile.postedTime}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 justify-center">
                    {profile.isVerified && (
                      <div className="bg-green-700 text-white px-3 py-1 text-sm flex items-center rounded">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Vérifié
                      </div>
                    )}
                    {profile.isSafeSex && (
                      <div className="bg-blue-900 text-white px-3 py-1 text-sm flex items-center rounded">
                        <Shield className="h-4 w-4 mr-1" />
                        Safe sex
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 border-t border-gray-200">
                <p className="mb-4 text-black">{profile.description.fr}</p>
                <p className="text-black">{profile.description.en}</p>
              </div>
              <div className="px-4 pb-4 flex justify-center">
                <Link href={`/booking/${id}`} passHref>
                  <AnimatedButton variant="reservation" className="shadow-xl">
                    <Calendar className="h-6 w-6 mr-2" />
                    Réserver maintenant
                  </AnimatedButton>
                </Link>
              </div>
            </div>

            {/* Video */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="relative aspect-video">
                <Image
                  src={profile.videoThumbnail || "/placeholder.svg"}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="grid grid-cols-3 gap-1">
                {profile.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${profile.name} - ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Button */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 p-4 flex justify-between items-center">
              <div className="text-black">Est-ce que tu l'aimes?</div>
              <Button
                variant={favorited ? "default" : "outline"}
                className={favorited ? "bg-red-500 hover:bg-red-600" : ""}
                onClick={() => setFavorited(!favorited)}
              >
                FAVORI <Heart className="ml-2 h-4 w-4" fill={favorited ? "white" : "none"} />
              </Button>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="relative aspect-[16/9]">
                <Image src="/placeholder.svg?height=400&width=800" alt="Map" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full">
                    <MapPin className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Contact */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black text-center">Contact</h2>
              </div>
              <div className="p-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-black mb-2">Disponible 24/7 pour les réservations en ligne</p>
                </div>

                <div className="mb-4">
                  <div className="text-sm mb-2 text-black text-center">Vous ne voulez pas appeler?</div>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center">
                    ENVOYER MESSAGE <MessageSquare className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="mb-4">
                  <div className="text-sm mb-2 text-black text-center">Réserver un rendez-vous</div>
                  <Link href={`/booking/${id}`} passHref>
                    <AnimatedButton variant="reservation" className="w-full flex items-center justify-center">
                      RÉSERVATION <Calendar className="ml-2 h-5 w-5" />
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black text-center">Profil</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-black border-b pb-2 mb-3">Informations personnelles</h3>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-red-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-red-500"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Genre</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                        {profile.details.genre}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Âge</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">{profile.details.age}</span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-purple-500"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Orientation</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                        {profile.details.orientation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-green-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Nationalité</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                        {profile.details.nationality}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-yellow-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-500"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Ethnie</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                        {profile.details.ethnicity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <span className="bg-indigo-100 p-2 rounded-full mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-indigo-500"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-black">Langues</span>
                      </div>
                      <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
                        {profile.details.languages}
                      </span>
                    </div>
                  </div>

                  {/* Caractéristiques physiques */}
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-black border-b pb-2 mb-3">Caractéristiques physiques</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                              <path d="M2 20h20"></path>
                              <path d="M14 12v.01"></path>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Taille</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.height}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Poids</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.weight}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Cheveux</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.hairColor}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Yeux</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.eyeColor}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                              <line x1="4" y1="21" x2="20" y2="21"></line>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Coupe intime</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.intimateHaircut}</span>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center">
                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="bg-pink-100 p-1.5 rounded-full mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-pink-500"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </span>
                          <span className="text-xs font-medium text-black">Bonnet</span>
                        </div>
                        <span className="text-sm font-semibold text-black">{profile.details.cupSize}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-xs text-black">Tatouages: {profile.details.tattoos}</span>
                      </div>
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-xs text-black">Piercings: {profile.details.piercings}</span>
                      </div>
                      <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center justify-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-xs text-black">Fumeur: {profile.details.smoker}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black text-center">Possibilités</h2>
              </div>
              <div className="p-4">
                <div className="space-y-6">
                  {/* Massage */}
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-red-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-500"
                        >
                          <path d="M4 12h16"></path>
                          <path d="M4 18V6"></path>
                          <path d="M20 18V6"></path>
                          <path d="M7 9v6"></path>
                          <path d="M12 9v6"></path>
                          <path d="M17 9v6"></path>
                        </svg>
                      </span>
                      <h3 className="text-md font-medium text-black">Massage</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {profile.services.massage.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                        >
                          <span className="text-sm text-black">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Préliminaires */}
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-purple-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-500"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </span>
                      <h3 className="text-md font-medium text-black">Préliminaires</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {profile.services.preliminaries.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                        >
                          <span className="text-sm text-black">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intime */}
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-pink-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-pink-500"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                      </span>
                      <h3 className="text-md font-medium text-black">Intime</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {profile.services.intimate.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                        >
                          <span className="text-sm text-black">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fétiche */}
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-indigo-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-500"
                        >
                          <path d="M8.56 2.9A7 7 0 0 1 19 9v4"></path>
                          <path d="M19 17v.6a8 8 0 0 1-7.3 8.4"></path>
                          <path d="M3 3l18 18"></path>
                          <path d="M9 9v1"></path>
                        </svg>
                      </span>
                      <h3 className="text-md font-medium text-black">Fétiche</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {profile.services.fetish.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                        >
                          <span className="text-sm text-black">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Autres services */}
                  <div>
                    <div className="flex items-center mb-3">
                      <span className="bg-green-100 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </span>
                      <h3 className="text-md font-medium text-black">Autres services</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                      {profile.services.other.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors text-center"
                        >
                          <span className="text-sm text-black">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Abuse */}
            <div className="text-right mb-6">
              <Link href="#" className="text-red-500 hover:text-red-700 text-sm">
                Signaler un abus ⚠️
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Listings */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-black">Annonces premium</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {premiumListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-purple-600 text-white px-2 py-0.5 rounded-sm text-xs font-bold">
                    Premium
                  </div>
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1">
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-black">{listing.name}</h3>
                  <p className="text-sm text-black line-clamp-1">{listing.description}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 mr-1 text-black" />
                    <span className="text-sm text-black">{listing.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton flottant pour tous les appareils */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link href={`/booking/${id}`} passHref>
          <AnimatedButton variant="reservation" className="rounded-full p-5 shadow-xl">
            <Calendar className="h-7 w-7" />
          </AnimatedButton>
        </Link>
      </div>
    </div>
  )
}
