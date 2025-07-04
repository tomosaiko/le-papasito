"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Filter, Star, Phone, CheckCircle, Shield, Calendar } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function PriveCouples() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")

  // Données des couples
  const couplesListings = [
    {
      id: 501,
      name: "Eva & Adam",
      age: "28/32",
      location: "Privé Bruxelles",
      description: "Couple libertin pour rencontres à trois ou échangisme.",
      phone: "0492 12 34 56",
      images: ["/placeholder.svg?height=400&width=300&query=attractive%20couple"],
      isGold: true,
      isVerified: true,
      imageCount: "1/8",
    },
    {
      id: 502,
      name: "Sophie & Thomas",
      age: "26/30",
      location: "Privé Liège",
      description: "Couple français pour moments de partage et de plaisir.",
      phone: "0493 23 45 67",
      images: ["/placeholder.svg?height=400&width=300&query=french%20couple%20model"],
      isGold: true,
      isVerified: true,
      imageCount: "1/10",
    },
    {
      id: 503,
      name: "Mia & Lucas",
      age: "24/29",
      location: "Privé Namur",
      description: "Jeune couple pour premières expériences et découvertes.",
      phone: "0494 34 56 78",
      images: ["/placeholder.svg?height=400&width=300&query=young%20couple%20model"],
      isGold: true,
      isVerified: true,
      imageCount: "1/6",
    },
    {
      id: 504,
      name: "Laura & Marc",
      age: "30/35",
      location: "Privé Charleroi",
      description: "Couple expérimenté pour libertinage et fantasmes.",
      phone: "0495 45 67 89",
      images: ["/placeholder.svg?height=400&width=300&query=mature%20couple%20model"],
      isGold: true,
      isVerified: true,
      imageCount: "1/12",
    },
    {
      id: 505,
      name: "Julie & David",
      age: "27/33",
      location: "Privé Mons",
      description: "Couple bi pour rencontres hommes, femmes ou couples.",
      phone: "0496 56 78 90",
      images: ["/placeholder.svg?height=400&width=300&query=bisexual%20couple"],
      isGold: true,
      isVerified: true,
      isSafeSex: true,
      imageCount: "1/9",
    },
    {
      id: 506,
      name: "Nadia & Kevin",
      age: "29/31",
      location: "Privé Anvers",
      description: "Couple mixte pour expériences exotiques et sensuelles.",
      phone: "0497 67 89 01",
      images: ["/placeholder.svg?height=400&width=300&query=mixed%20race%20couple"],
      isGold: true,
      isVerified: true,
      imageCount: "1/7",
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
            <span className="text-black">Couples</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white text-black">
            <Filter className="h-4 w-4" />
            Filtrer les annonces
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2 text-black">Couples</h1>
        <p className="text-black mb-6">
          Annonces de couples qui proposent leurs services pour des rencontres libertines
        </p>

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

        {/* Couples Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {couplesListings.map((couple) => (
            <div key={couple.id} className="relative group">
              <Link href={`/prive/couples/${couple.id}`}>
                <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow h-full">
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-0.5 rounded-sm text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      GOLD
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={couple.images[0] || "/placeholder.svg"}
                        alt={couple.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-black">{couple.name}</h3>
                      <span className="text-sm text-black">{couple.age}</span>
                    </div>
                    <p className="text-sm text-black">{couple.location}</p>
                    <p className="text-sm text-black line-clamp-2 mt-1">{couple.description}</p>
                    <div className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-1 text-black" />
                      <span className="text-sm text-black">{couple.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {couple.isVerified && (
                        <div className="flex items-center text-black text-xs">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          Vérifié
                        </div>
                      )}
                      {couple.isSafeSex && (
                        <div className="flex items-center text-black text-xs">
                          <Shield className="h-3 w-3 mr-1 text-blue-600" />
                          Safe sex
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/booking/${couple.id}`}>
                  <AnimatedButton variant="purple" size="sm" className="w-full">
                    <Calendar className="mr-1 h-3 w-3" /> Réserver
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
