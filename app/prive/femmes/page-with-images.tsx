"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Filter, Star, Phone, ChevronLeft, ChevronRight, Diamond, Calendar } from "lucide-react"
import { PremiumCarousel } from "@/components/premium-carousel"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function PriveFemmesWithImages() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")

  // Featured escort data
  const featuredEscort = {
    id: 101,
    name: "Alona - Brésilienne",
    description:
      "Bonjour, je suis une fille douce et séduisante. Je vous propose des moments inoubliables dans un cadre discret et confortable.",
    phone: "0492 77 79 10",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
    ],
  }

  // Gold listings data
  const goldListings = [
    {
      id: 1,
      name: "Araxie",
      age: 25,
      location: "Privé Etterbeek",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/3",
      description: "Araxie est une jeune femme charmante et discrète.",
      phone: "0477 12 34 56",
    },
    {
      id: 2,
      name: "Sophia",
      age: 24,
      location: "Privé Rochefort",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/9",
      description: "Sophia vous accueille dans son appartement privé.",
      phone: "0498 65 43 21",
    },
    {
      id: 3,
      name: "Julia",
      age: 27,
      location: "Privé Athus",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/25",
      description: "Julia, une beauté exotique à votre service.",
      phone: "0465 11 22 33",
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
      description: "Kelly, une blonde pétillante pour des moments coquins.",
      phone: "0488 99 00 11",
    },
    {
      id: 5,
      name: "Luna",
      age: 26,
      location: "Privé Forest",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783542_original.jpg-3YiXCmU7Z3tdFoXDKFLaM72887Dqj9.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/18",
      description: "Luna, douce et sensuelle, vous attend.",
      phone: "0475 55 66 77",
    },
  ]

  // Deuxième rangée de profils Gold
  const moreGoldListings = [
    {
      id: 6,
      name: "Victoria",
      age: 24,
      location: "Privé Marche-en-Famenne",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/araxie-armenian-escort-in-tokyo-11035160_original.jpg-JxyGhogrTsK8Vbgk4hfiSKKfgpiyuW.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/9",
      description: "Victoria, jeune et passionnée, pour des rencontres inoubliables.",
      phone: "0491 11 22 33",
    },
    {
      id: 7,
      name: "Gabriela",
      age: 23,
      location: "Privé Chênée",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783540_original.jpg-9BfowNufKS544E1yQOtKaqzXyGbLHv.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/31",
      description: "Gabriela, une brésilienne chaleureuse et accueillante.",
      phone: "0472 33 44 55",
    },
    {
      id: 8,
      name: "Ticiane",
      age: 28,
      location: "Privé Alost",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dh638tw-ef08f633-e1bf-4385-bf75-9833434b19ad.jpg-d3u6FGvdplhI3d18ZaoDTAbBBNIpJV.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/27",
      description: "Ticiane, une femme fatale qui saura vous séduire.",
      phone: "0466 55 66 77",
    },
    {
      id: 9,
      name: "Isabela",
      age: 28,
      location: "Privé Gand",
      images: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alona-brazilian-escort-in-osaka-10783538_original.jpg-kPFWDRAGW5exy1YpgIZAG4oyWz4l3K.jpeg",
      ],
      isGold: true,
      isVerified: true,
      imageCount: "1/24",
      description: "Isabela, une latina passionnée et pleine de surprises.",
      phone: "0489 77 88 99",
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
      description: "Luara, une femme expérimentée pour des moments intenses.",
      phone: "0477 99 00 11",
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
            <Link href="/prive" className="text-black hover:text-black">
              Privé
            </Link>
            <span className="mx-2">»</span>
            <span className="text-black">Femmes</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white text-black">
            <Filter className="h-4 w-4" />
            Filtrer les annonces
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2 text-black">Privé femmes</h1>
        <p className="text-black mb-6">Annonces de femmes qui reçoivent chez eux, dans une maison privée ou un club</p>

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
                  <Link href={`/prive/femmes/${featuredEscort.id}`}>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">LIRE LA SUITE</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {goldListings.map((escort) => (
            <Link href={`/prive/femmes/${escort.id}`} key={escort.id}>
              <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow h-full">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black px-2 py-0.5 rounded-sm text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    GOLD
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={escort.images[0] || "/placeholder.svg"}
                      alt={escort.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1">
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded">
                        {escort.imageCount}
                      </span>
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-black">{escort.name}</h3>
                  <p className="text-sm text-black line-clamp-1">{escort.description}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 mr-1 text-black" />
                    <span className="text-sm text-black">{escort.phone}</span>
                  </div>

                  <Link href={`/booking/${escort.id}`} passHref>
                    <AnimatedButton variant="purple" size="sm" className="w-full mt-2 text-xs font-semibold">
                      Réserver <Calendar className="ml-1 h-3 w-3" />
                    </AnimatedButton>
                  </Link>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Deuxième rangée de Gold Listings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 mt-8">
          {moreGoldListings.map((escort) => (
            <Link href={`/prive/femmes/${escort.id}`} key={escort.id}>
              <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow h-full">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-black px-2 py-0.5 rounded-sm text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    GOLD
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={escort.images[0] || "/placeholder.svg"}
                      alt={escort.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1">
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-white text-xs font-medium bg-black/50 px-2 py-0.5 rounded">
                        {escort.imageCount}
                      </span>
                      <button className="bg-black/30 rounded-full p-1 text-white">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-black">{escort.name}</h3>
                  <p className="text-sm text-black line-clamp-1">{escort.description}</p>
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 mr-1 text-black" />
                    <span className="text-sm text-black">{escort.phone}</span>
                  </div>

                  <Link href={`/booking/${escort.id}`} passHref>
                    <AnimatedButton variant="purple" size="sm" className="w-full mt-2 text-xs font-semibold">
                      Réserver <Calendar className="ml-1 h-3 w-3" />
                    </AnimatedButton>
                  </Link>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Section Annonces Premium */}
        <div className="mb-8 relative">
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

            {/* Utilisation du composant PremiumCarousel */}
            <PremiumCarousel autoPlayInterval={6000}>
              {premiumListings.map((listing) => (
                <Link href={`/prive/femmes/${listing.id}`} key={listing.id}>
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
              ))}
            </PremiumCarousel>
          </div>
        </div>
      </div>
    </div>
  )
}
