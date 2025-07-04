"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Phone, Diamond, Filter } from "lucide-react"
import { AvailabilitySearchModal } from "@/components/search/availability-search-modal"

export default function Home() {
  const { dictionary } = useLanguage()
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)

  // Utiliser useState et useEffect pour détecter la taille de l'écran de manière fiable
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Vérifier immédiatement
    checkIfMobile()

    // Ajouter un écouteur d'événement pour les changements de taille
    window.addEventListener("resize", checkIfMobile)

    // Nettoyer l'écouteur
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Définir les animations CSS personnalisées
  useEffect(() => {
    // Ajouter les animations CSS pour un défilement plus fluide
    const style = document.createElement("style")
    style.textContent = `
    @keyframes slideRight1 {
      0% { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }
    @keyframes slideRight2 {
      0% { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }
    .animate-slide-smooth-1 {
      animation: slideRight1 15s linear infinite;
    }
    .animate-slide-smooth-2 {
      animation: slideRight2 18s linear infinite;
    }
    .hover\\:scale-102:hover {
      transform: scale(1.02);
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Featured escort data
  const featuredEscort = {
    id: 101,
    name: "Massage Tantrique",
    description:
      "Découvrez l'art du massage tantrique pour une relaxation profonde et une expérience sensorielle unique.",
    phone: "0492 77 79 10",
    images: ["/images/sponsor/massage-relaxant.jpeg"],
  }

  // Sponsor appartement data
  const apartmentSponsor = {
    id: 102,
    name: "Appartement Luxe à Charleroi",
    description: "Location d'appartement moderne avec éclairage LED et ambiance unique. Idéal pour couples.",
    phone: "0471 23 45 67",
    images: ["/images/sponsor/apartment-charleroi.png"],
  }

  // Gold listings data
  const goldListings = [
    {
      id: 1,
      name: "MONICA",
      age: 28,
      location: "Privé Etterbeek",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153698_original.jpg-dKxdTJFpF6wiafozWCwq5zd6ozyglL.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/3",
    },
    {
      id: 2,
      name: "Virgnia",
      age: 24,
      location: "Privé Rochefort",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-japanese-escort-in-tokyo-11003518_original.jpg-TJvV5U93qGMv8ACCrqBKcrppB6zwvE.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/9",
    },
    {
      id: 3,
      name: "Julia",
      age: 27,
      location: "Privé Athus",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153708_original.jpg-fC3XDJapRrwlHDxdLdP12ySnQ7JTWL.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/25",
    },
    {
      id: 4,
      name: "Kelly",
      age: 28,
      location: "Privé Tournai",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153704_original.jpg-XaS5TT5dzbtkRFO3Sbuz77UmaqsWZ8.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/6",
    },
    {
      id: 5,
      name: "Luna",
      age: 25,
      location: "Privé Forest",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-F3YKtTXpGE1bZD3nYbFBv6iXRYQjkp.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/18",
    },
    {
      id: 6,
      name: "Sophia",
      age: 26,
      location: "Privé Bruxelles",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153702_original.jpg-YQv55LkyBEK0tFiVykOS2hcNtuLipE.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/12",
    },
  ]

  // Deuxième rangée de profils Gold
  const moreGoldListings = [
    {
      id: 6,
      name: "Virgnia",
      age: 24,
      location: "Privé Marche-en-Famenne",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-tObsT10ti0bBtTQp8gbQI8NSbTuaqz.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/9",
    },
    {
      id: 7,
      name: "Gabriela",
      age: 23,
      location: "Privé Chênée",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-UoFeYeEKeQPyQVAD8vDo1GMfnxEFo2.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/31",
    },
    {
      id: 8,
      name: "Ticiane",
      age: 28,
      location: "Privé Alost",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/27",
    },
    {
      id: 9,
      name: "Isabela",
      age: 28,
      location: "Privé Gand",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/24",
    },
    {
      id: 10,
      name: "Luara",
      age: 32,
      location: "Privé Colfontaine",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
      ],
      isGold: true,
      isVerified: true,
      isSafeSex: true,
      imageCount: "1/50",
    },
    {
      id: "gold6",
      name: "Sophia",
      age: 24,
      location: "Paris",
      price: "150€",
      rating: 4.8,
      images: ["/serene-gaze.png"],
      isVerified: true,
      isNew: false,
      isPremium: false,
      isGold: true,
    },
  ]

  // Annonces premium
  const premiumListings = [
    {
      id: 201,
      name: "Moka Noire",
      description: "Ma clientèle se limite aux clients de qualité...",
      phone: "0494 20 70 71",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-amber-500 to-pink-500",
    },
    {
      id: 202,
      name: "Massage Tantra",
      description: "Masseuse tantra vous propose ses services...",
      phone: "0465 77 43 77",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/-japanese-escort-in-tokyo-11003518_original.jpg-TJvV5U93qGMv8ACCrqBKcrppB6zwvE.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
    {
      id: 203,
      name: "Raquel",
      description: "Élégance, Sensualité et Expérience...",
      phone: "0465 87 57 03",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-F3YKtTXpGE1bZD3nYbFBv6iXRYQjkp.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-blue-500 to-teal-500",
    },
    {
      id: 204,
      name: "Mirela",
      description: "Blonde chaude une explosion de plaisir...",
      phone: "0465 79 00 90",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153704_original.jpg-XaS5TT5dzbtkRFO3Sbuz77UmaqsWZ8.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-red-500 to-orange-500",
    },
  ]

  // Services populaires (tous les services)
  const allPopularServices = [
    {
      id: 1,
      title: "Massage Érotique",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/massage-erotique-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-rose-100",
      headerColor: "bg-rose-800",
      url: "/services/massage-erotique",
    },
    {
      id: 2,
      title: "Escort VIP",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/escort-vip-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-amber-100",
      headerColor: "bg-amber-800",
      url: "/services/escort-vip",
    },
    {
      id: 3,
      title: "Domination",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/domination-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-purple-100",
      headerColor: "bg-purple-800",
      url: "/services/domination",
    },
    {
      id: 4,
      title: "Couples",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/couples-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-pink-100",
      headerColor: "bg-pink-800",
      url: "/services/couples",
    },
    {
      id: 5,
      title: "Striptease",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/striptease-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-red-100",
      headerColor: "bg-red-800",
      url: "/services/striptease",
    },
    {
      id: 6,
      title: "Fantasmes",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fantasmes-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-blue-100",
      headerColor: "bg-blue-800",
      url: "/services/fantasmes",
    },
    // Autres services (second lot)
    {
      id: 7,
      title: "Tantra",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tantra-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-green-100",
      headerColor: "bg-green-800",
      url: "/services/tantra",
    },
    {
      id: 8,
      title: "Body to Body",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/body-to-body-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-indigo-100",
      headerColor: "bg-indigo-800",
      url: "/services/body-to-body",
    },
    {
      id: 9,
      title: "Nuru Massage",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nuru-massage-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-teal-100",
      headerColor: "bg-teal-800",
      url: "/services/nuru-massage",
    },
    {
      id: 10,
      title: "BDSM",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bdsm-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-slate-100",
      headerColor: "bg-slate-800",
      url: "/services/bdsm",
    },
    {
      id: 11,
      title: "Roleplay",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roleplay-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-orange-100",
      headerColor: "bg-orange-800",
      url: "/services/roleplay",
    },
    {
      id: 12,
      title: "Massage 4 Mains",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/massage-4-mains-portrait-Wd9Iy9Ij9Iy9Ij9Iy9Ij.jpg",
      bgColor: "bg-cyan-100",
      headerColor: "bg-cyan-800",
      url: "/services/massage-4-mains",
    },
  ]

  // État pour gérer l'affichage des services
  const [currentPage, setCurrentPage] = useState(0)
  const servicesPerPage = 6

  // Calculer les services actuellement visibles
  const visibleServices = allPopularServices.slice(currentPage * servicesPerPage, (currentPage + 1) * servicesPerPage)

  // Fonction pour charger plus de services - maintenant utilisée uniquement pour le bouton mobile
  const loadMoreServices = () => {
    // Faire défiler horizontalement vers la droite
    const container = document.querySelector(".overflow-x-auto")
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleApplyFilters = (filters: any) => {
    console.log("Filtres appliqués:", filters)
    // Ici vous pourriez implémenter la logique de filtrage réelle
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Call-to-Action Buttons - EN HAUT DE PAGE */}
        <div className="flex sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/hotesses"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
          >
            Nos hôtesses
          </Link>
          <button
            onClick={() => setIsAvailabilityModalOpen(true)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Disponibilités
          </button>
        </div>

        {/* Annonceurs Sponsors Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg overflow-hidden mb-8 mt-4 border-2 border-yellow-400">
          <div className="relative">
            <div className="absolute top-2 right-2 z-20 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current" />
              SPONSOR
            </div>
            <div className="flex flex-col md:flex-row">
              {/* Image unique pour le sponsor */}
              <div className="w-full">
                <div className="relative aspect-video overflow-hidden">
                  <Link href={`/sponsor/${featuredEscort.id}`}>
                    <Image
                      src={featuredEscort.images[0] || "/placeholder.svg"}
                      alt="Massage Tantrique"
                      fill
                      className="object-cover"
                      priority
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <Link href={`/sponsor/${featuredEscort.id}`}>
                <h3 className="text-white text-lg font-bold mb-1">{featuredEscort.name}</h3>
                <p className="text-white text-sm mb-2">{featuredEscort.description}</p>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                  <Phone className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="text-white font-medium">{featuredEscort.phone}</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Annonces Premium Slider - NOUVELLE SECTION */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-black">Annonces premium</h2>
            <div className="ml-3 flex items-center bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
              <Diamond className="h-3 w-3 mr-1 fill-current" />
              EXCLUSIF
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out overflow-x-auto hide-scrollbar snap-x snap-mandatory"
              id="premiumSlider"
              style={{ scrollBehavior: "smooth" }}
            >
              {/* Créer des paires d'annonces pour l'affichage en 2 colonnes */}
              {Array(Math.ceil(premiumListings.length / 2))
                .fill(0)
                .map((_, pairIndex) => {
                  // Obtenir les deux annonces pour cette paire
                  const firstListing = premiumListings[pairIndex * 2]
                  const secondListing = premiumListings[pairIndex * 2 + 1]

                  return (
                    <div
                      key={`pair-${pairIndex}`}
                      className="w-full min-w-[280px] sm:min-w-[320px] md:min-w-[280px] lg:min-w-[600px] px-2 flex-shrink-0 snap-start"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {/* Première annonce de la paire */}
                        {firstListing && (
                          <Link href={`/prive/femmes/${firstListing.id}`} className="block h-full">
                            <div className="bg-white border-2 border-purple-200 rounded-lg overflow-hidden h-full flex flex-col">
                              <div className="relative">
                                <div className={`${firstListing.color} h-6 flex items-center justify-center`}>
                                  <div className="flex items-center text-white font-bold text-xs">
                                    <Diamond className="h-3 w-3 mr-1 fill-current" />
                                    Premium
                                  </div>
                                </div>
                                <div className="aspect-[3/4] relative">
                                  <Image
                                    src={firstListing.images[0] || "/placeholder.svg"}
                                    alt={firstListing.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 150px"
                                    priority
                                  />
                                </div>
                              </div>
                              <div className="p-2 bg-gradient-to-b from-white to-purple-50 flex-grow">
                                <h3 className="font-bold text-black text-sm">{firstListing.name}</h3>
                                <p className="text-xs text-black line-clamp-1 mb-1">{firstListing.description}</p>
                                <div className="flex items-center mt-1 bg-purple-100 p-1 rounded-lg">
                                  <Phone className="h-3 w-3 mr-1 text-purple-700" />
                                  <span className="text-xs font-semibold text-purple-900">{firstListing.phone}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}

                        {/* Deuxième annonce de la paire */}
                        {secondListing && (
                          <Link href={`/prive/femmes/${secondListing.id}`} className="block h-full">
                            <div className="bg-white border-2 border-purple-200 rounded-lg overflow-hidden h-full flex flex-col">
                              <div className="relative">
                                <div className={`${secondListing.color} h-6 flex items-center justify-center`}>
                                  <div className="flex items-center text-white font-bold text-xs">
                                    <Diamond className="h-3 w-3 mr-1 fill-current" />
                                    Premium
                                  </div>
                                </div>
                                <div className="aspect-[3/4] relative">
                                  <Image
                                    src={secondListing.images[0] || "/placeholder.svg"}
                                    alt={secondListing.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 150px"
                                    priority
                                  />
                                </div>
                              </div>
                              <div className="p-2 bg-gradient-to-b from-white to-purple-50 flex-grow">
                                <h3 className="font-bold text-black text-sm">{secondListing.name}</h3>
                                <p className="text-xs text-black line-clamp-1 mb-1">{secondListing.description}</p>
                                <div className="flex items-center mt-1 bg-purple-100 p-1 rounded-lg">
                                  <Phone className="h-3 w-3 mr-1 text-purple-700" />
                                  <span className="text-xs font-semibold text-purple-900">{secondListing.phone}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>

            {/* Navigation buttons */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-purple-700 rounded-full p-2 shadow-md z-10"
              onClick={() => {
                const slider = document.getElementById("premiumSlider")
                if (slider) {
                  slider.scrollBy({ left: -300, behavior: "smooth" })
                }
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-purple-700 rounded-full p-2 shadow-md z-10"
              onClick={() => {
                const slider = document.getElementById("premiumSlider")
                if (slider) {
                  slider.scrollBy({ left: 300, behavior: "smooth" })
                }
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Availability Search Modal */}
        <AvailabilitySearchModal isOpen={isAvailabilityModalOpen} onClose={() => setIsAvailabilityModalOpen(false)} />

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-100 py-2 z-50">
          <div className="h-10 flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-3 bg-white text-black border border-gray-200 rounded-l-md rounded-r-none flex items-center gap-1.5 text-sm"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-4 w-4" />
              <span>Filtrer</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}