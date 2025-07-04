"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Filter, Phone, ChevronLeft, ChevronRight, Diamond, Calendar } from "lucide-react"
// Importez le composant FilterModal en haut du fichier
import { FilterModal } from "@/components/filter-modal"
// Importer le nouveau composant
import { MobileOptimizedCard } from "@/components/ui/mobile-optimized-card"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function PriveFemmes() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")
  const [currentPremiumPage, setCurrentPremiumPage] = useState(0)
  // Ajoutez l'état pour gérer l'ouverture/fermeture du modal dans le composant PriveFemmes
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Remplacer les données du featured escort
  const featuredEscort = {
    id: 101,
    name: "Alona - Brésilienne",
    description:
      "bonjour, je suis une fille aux courbes généreuses, douce et séduisante. Je vous propose des moments inoubliables dans un cadre discret et confortable.",
    phone: "0492 77 79 10",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
    ],
  }

  // Remplacer les données des gold listings
  const goldListings = [
    {
      id: 1,
      name: "MONICA",
      age: 28,
      location: "Privé Etterbeek",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/18",
    },
  ]

  // Remplacer les données de la deuxième rangée de profils Gold
  const moreGoldListings = [
    {
      id: 6,
      name: "Virgnia",
      age: 24,
      location: "Privé Marche-en-Famenne",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
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
  ]

  // Remplacer les données des annonces premium
  const premiumListings = [
    {
      id: 201,
      name: "Moka Noire",
      description: "Ma clientèle se limite aux clients de qualité...",
      phone: "0494 20 70 71",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
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
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-red-500 to-orange-500",
    },
    {
      id: 205,
      name: "Sophia VIP",
      description: "Expérience inoubliable garantie...",
      phone: "0493 12 34 56",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-emerald-500 to-lime-500",
    },
    {
      id: 206,
      name: "Bella Italiana",
      description: "Italienne sensuelle pour moments intimes...",
      phone: "0478 98 76 54",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-rose-500 to-red-500",
    },
    {
      id: 207,
      name: "Anastasia",
      description: "Russe raffinée pour vos fantasmes...",
      phone: "0467 45 67 89",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500",
    },
    {
      id: 208,
      name: "Jade Asiatique",
      description: "Massage traditionnel et plus si affinités...",
      phone: "0489 23 45 67",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-violet-500 to-purple-500",
    },
    {
      id: 209,
      name: "Eva Latina",
      description: "Chaleur latine et sensualité débordante...",
      phone: "0476 34 56 78",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-yellow-500 to-amber-500",
    },
    {
      id: 210,
      name: "Chloé Française",
      description: "Française élégante pour moments de qualité...",
      phone: "0498 76 54 32",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
    },
    {
      id: 211,
      name: "Yasmine Orientale",
      description: "Douceur orientale et sensations exotiques...",
      phone: "0465 43 21 09",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-teal-500 to-emerald-500",
    },
    {
      id: 212,
      name: "Victoria Elite",
      description: "Escort de luxe pour gentlemen exigeants...",
      phone: "0487 65 43 21",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-indigo-500 to-violet-500",
    },
    {
      id: 213,
      name: "Naomi Black",
      description: "Beauté ébène pour expériences uniques...",
      phone: "0496 78 90 12",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      id: 214,
      name: "Lena Massage",
      description: "Massages sensuels et relaxation profonde...",
      phone: "0475 67 89 01",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-lime-500 to-green-500",
    },
    {
      id: 215,
      name: "Amelia VIP",
      description: "Services exclusifs et discrétion assurée...",
      phone: "0468 90 12 34",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
    },
    {
      id: 216,
      name: "Katia Ukrainienne",
      description: "Beauté slave pour moments inoubliables...",
      phone: "0499 87 65 43",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-amber-500 to-yellow-500",
    },
    {
      id: 217,
      name: "Louna Sensuelle",
      description: "Moments de détente et de plaisir intense...",
      phone: "0466 54 32 10",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-rose-500 to-pink-500",
    },
    {
      id: 218,
      name: "Alicia Caraïbes",
      description: "Exotisme et sensualité des îles...",
      phone: "0477 89 01 23",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dg2t4vr-72b1d47d-4950-498c-bc73-867e567ed707.jpg-sP3HGIOKPYKRbldmMEbmZi234Kan4L.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      id: 219,
      name: "Emma Scandinave",
      description: "Blonde nordique pour plaisirs raffinés...",
      phone: "0488 90 12 34",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-purple-500 to-violet-500",
    },
    {
      id: 220,
      name: "Leila Marocaine",
      description: "Beauté du Maghreb pour moments exquis...",
      phone: "0469 87 65 43",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isPremium: true,
      color: "bg-gradient-to-r from-red-500 to-rose-500",
    },
  ]

  // Nombre d'annonces premium à afficher à la fois
  const premiumsPerPage = 4
  const totalPremiumPages = Math.ceil(premiumListings.length / premiumsPerPage)

  // Animation automatique pour le carrousel premium
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPremiumPage((prevPage) => (prevPage + 1) % totalPremiumPages)
    }, 4000) // Toutes les 4 secondes

    return () => clearInterval(interval)
  }, [totalPremiumPages])

  // Fonction pour naviguer dans le carrousel
  const navigatePremium = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentPremiumPage((prevPage) => (prevPage === 0 ? totalPremiumPages - 1 : prevPage - 1))
    } else {
      setCurrentPremiumPage((prevPage) => (prevPage + 1) % totalPremiumPages)
    }
  }

  // Obtenir les annonces premium actuelles à afficher

  // Ajoutez une fonction pour gérer l'application des filtres
  const handleApplyFilters = (filters) => {
    console.log("Filtres appliqués:", filters)
    // Ici vous pourriez implémenter la logique de filtrage réelle
  }

  const escorts = [...goldListings, ...moreGoldListings]

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
            <Link href="/prive" className="text-black hover:text-black">
              Privé
            </Link>
            <span className="mx-2">»</span>
            <span className="text-black">Femmes</span>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white text-black"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filtrer les annonces
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2 text-black">Privé femmes</h1>
        <p className="text-black mb-6">Annonces de femmes qui reçoivent chez eux, dans une maison privée ou un club</p>

        {/* Quick Filter Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 mb-8 mt-4">
          <button
            onClick={() => console.log("Filter: LATINA")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">💃</span>
            <span className="font-medium text-sm">LATINA</span>
          </button>

          <button
            onClick={() => console.log("Filter: BLONDE")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">👱‍♀️</span>
            <span className="font-medium text-sm">BLONDE</span>
          </button>

          <button
            onClick={() => console.log("Filter: BRUNE")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">🙎‍♀️</span>
            <span className="font-medium text-sm">BRUNE</span>
          </button>

          <button
            onClick={() => console.log("Filter: ARABE")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">🧕</span>
            <span className="font-medium text-sm">ARABE</span>
          </button>

          <button
            onClick={() => console.log("Filter: BLACK")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">✨</span>
            <span className="font-medium text-sm">BLACK</span>
          </button>

          <button
            onClick={() => console.log("Filter: ASIATIQUE")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">🏮</span>
            <span className="font-medium text-sm">ASIATIQUE</span>
          </button>

          <button
            onClick={() => console.log("Filter: SKINNY")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">🍸</span>
            <span className="font-medium text-sm">SKINNY</span>
          </button>

          <button
            onClick={() => console.log("Filter: CURVY")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">🍑</span>
            <span className="font-medium text-sm">CURVY</span>
          </button>

          <button
            onClick={() => console.log("Filter: TRANS")}
            className="bg-white hover:bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-lg"
          >
            <span className="text-2xl mb-2">⚧️</span>
            <span className="font-medium text-sm">TRANS</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid")}>
            <TabsList className="bg-white border">
              <TabsTrigger value="list" className="data-[state=active]:bg-gray-200 text-black">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                    <div className="w-4 h-0.5 bg-current"></div>
                  </div>
                  LISTE
                </div>
              </TabsTrigger>
              <TabsTrigger value="grid" className="data-[state=active]:bg-gray-200 text-black">
                <div className="flex items-center gap-2">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                    <div className="w-1.5 h-1.5 bg-current"></div>
                  </div>
                  GRILLE
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Featured Escort Section */}
        <div className="bg-gray-50 rounded-lg overflow-hidden mb-8">
          <div className="relative">
            <div className="flex flex-col md:flex-row">
              {/* Images */}
              <div className="md:w-2/3 flex">
                <div className="w-1/2 relative">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={featuredEscort.images[0] || "/placeholder.svg"}
                      alt={featuredEscort.name}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="w-1/2 relative">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={featuredEscort.images[1] || "/placeholder.svg"}
                      alt={featuredEscort.name}
                      fill
                      className="object-cover"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 text-white">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="md:w-1/3 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-black mb-2">{featuredEscort.name}</h2>
                  <p className="text-black">{featuredEscort.description}</p>
                </div>
                <div className="mt-4">
                  <div className="flex items-center mb-4">
                    <Phone className="h-5 w-5 mr-2 text-black" />
                    <span className="font-semibold text-black">{featuredEscort.phone}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/prive/femmes/${featuredEscort.id}`}>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white">LIRE LA SUITE</Button>
                    </Link>
                    <Link href={`/booking/${featuredEscort.id}`}>
                      <AnimatedButton variant="purple" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" /> RÉSERVER
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Listings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
          {/* Utiliser le composant optimisé pour mobile */}
          {escorts.map((escort) => (
            <div key={escort.id} className="relative group">
              <Link href={`/prive/femmes/${escort.id}`}>
                <MobileOptimizedCard
                  id={escort.id}
                  name={escort.name}
                  age={escort.age}
                  location={escort.location}
                  images={escort.images}
                  isGold={escort.isGold}
                  isPremium={escort.isPremium}
                  isVerified={escort.isVerified}
                  isSafeSex={escort.isSafeSex}
                  imageCount={`1/${escort.images.length}`}
                />
              </Link>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/booking/${escort.id}`}>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs font-semibold flex items-center justify-center"
                  >
                    <Calendar className="mr-1 h-3 w-3" /> Réserver
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section Annonces Premium */}
        <div className="mb-8 relative mt-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-black">Annonces premium</h2>
            <div className="ml-3 flex items-center bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
              <Diamond className="h-3 w-3 mr-1 fill-current" />
              EXCLUSIF
            </div>
          </div>

          {/* Fond décoratif pour la section premium */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 p-6 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-5"></div>

            {/* Animated sliding background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-full w-[200%] h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-slide-right-1"></div>
              <div className="absolute top-0 right-full w-[200%] h-full bg-gradient-to-r from-transparent via-indigo-500/15 to-transparent animate-slide-right-2 delay-1000"></div>
            </div>

            {/* Indicateur de page */}
            <div className="flex justify-center mb-4">
              {Array.from({ length: totalPremiumPages }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentPremiumPage ? "bg-purple-600" : "bg-gray-300"
                  }`}
                ></div>
              ))}
            </div>

            {/* Flèches de navigation */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-md text-purple-700 hover:bg-white transition-all"
              onClick={() => navigatePremium("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-md text-purple-700 hover:bg-white transition-all"
              onClick={() => navigatePremium("next")}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Carrousel */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentPremiumPage * 100}%)`,
                  width: `${totalPremiumPages * 100}%`,
                }}
              >
                {Array.from({ length: totalPremiumPages }).map((_, pageIndex) => (
                  <div key={pageIndex} className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {premiumListings
                        .slice(pageIndex * premiumsPerPage, (pageIndex + 1) * premiumsPerPage)
                        .map((listing) => (
                          <div
                            key={listing.id}
                            className="transform transition-all duration-300 hover:scale-105 relative group"
                          >
                            <Link href={`/prive/femmes/${listing.id}`}>
                              <Card className="overflow-hidden bg-white hover:shadow-xl transition-shadow h-full border-2 border-purple-200">
                                <div className="relative">
                                  <div
                                    className={`absolute top-0 left-0 w-full h-8 ${listing.color} flex items-center justify-center`}
                                  >
                                    <div className="flex items-center text-white font-bold text-sm">
                                      <Diamond className="h-4 w-4 mr-1 fill-current" />
                                      Premium
                                    </div>
                                  </div>
                                  <div className="relative aspect-[3/4] overflow-hidden pt-8">
                                    <Image
                                      src={listing.images[0] || "/placeholder.svg"}
                                      alt={listing.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                                <div className="p-4 bg-gradient-to-b from-white to-purple-50">
                                  <h3 className="font-bold text-black text-lg">{listing.name}</h3>
                                  <p className="text-sm text-black line-clamp-1 mb-2">{listing.description}</p>
                                  <div className="flex items-center mt-2 bg-purple-100 p-2 rounded-lg">
                                    <Phone className="h-4 w-4 mr-2 text-purple-700" />
                                    <span className="text-sm font-semibold text-purple-900">{listing.phone}</span>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                              <Link href={`/booking/${listing.id}`}>
                                <AnimatedButton variant="glow" size="sm" className="w-full">
                                  <Calendar className="mr-1 h-3 w-3" /> Réserver
                                </AnimatedButton>
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </div>
  )
}
