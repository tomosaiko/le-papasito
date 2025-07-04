"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Filter, Diamond, Phone } from "lucide-react"
import { PremiumCarousel } from "@/components/premium-carousel"

// Importer les données (vous pouvez utiliser les données que j'ai générées précédemment)
const premiumListings = [
  {
    id: 201,
    name: "Moka Noire",
    description: "Ma clientèle se limite aux clients de qualité...",
    phone: "0494 20 70 71",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-amber-500 to-pink-500",
  },
  {
    id: 202,
    name: "Massage Tantra",
    description: "Masseuse tantra vous propose ses services...",
    phone: "0465 77 43 77",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
  },
  {
    id: 203,
    name: "Raquel",
    description: "Élégance, Sensualité et Expérience...",
    phone: "0465 87 57 03",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-blue-500 to-teal-500",
  },
  {
    id: 204,
    name: "Mirela",
    description: "Blonde chaude une explosion de plaisir...",
    phone: "0465 79 00 90",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-red-500 to-orange-500",
  },
  {
    id: 205,
    name: "Sophia VIP",
    description: "Expérience inoubliable garantie...",
    phone: "0493 12 34 56",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-emerald-500 to-lime-500",
  },
  {
    id: 206,
    name: "Bella Italiana",
    description: "Italienne sensuelle pour moments intimes...",
    phone: "0478 98 76 54",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-rose-500 to-red-500",
  },
  {
    id: 207,
    name: "Anastasia",
    description: "Russe raffinée pour vos fantasmes...",
    phone: "0467 45 67 89",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-cyan-500 to-blue-500",
  },
  {
    id: 208,
    name: "Jade Asiatique",
    description: "Massage traditionnel et plus si affinités...",
    phone: "0489 23 45 67",
    images: ["/placeholder.svg?height=400&width=300"],
    isPremium: true,
    color: "bg-gradient-to-r from-violet-500 to-purple-500",
  },
  // Vous pouvez ajouter plus d'éléments ici
]

export default function PriveFemmesWithCarousel() {
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

        {/* Section Annonces Premium avec le nouveau carrousel */}
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

            {/* Utilisation du nouveau composant PremiumCarousel */}
            <PremiumCarousel itemsPerPage={4} autoPlayInterval={6000}>
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

        {/* Vous pouvez ajouter d'autres sections ici */}
      </div>
    </div>
  )
}
