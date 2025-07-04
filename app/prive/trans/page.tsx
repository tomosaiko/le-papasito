"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Filter, Star, Phone, CheckCircle, Shield, Calendar } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

export default function PriveTrans() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid")

  // Données des trans
  const transListings = [
    {
      id: 401,
      name: "Valentina",
      age: 26,
      location: "Privé Bruxelles",
      description: "Trans latina sensuelle et raffinée pour moments inoubliables.",
      phone: "0492 11 22 33",
      images: ["/placeholder.svg?height=400&width=300&query=beautiful%20trans%20woman"],
      isGold: true,
      isVerified: true,
      imageCount: "1/7",
    },
    {
      id: 402,
      name: "Sophia",
      age: 24,
      location: "Privé Anvers",
      description: "Trans asiatique douce et féminine pour expériences uniques.",
      phone: "0493 22 33 44",
      images: ["/placeholder.svg?height=400&width=300&query=asian%20trans%20model"],
      isGold: true,
      isVerified: true,
      imageCount: "1/9",
    },
    {
      id: 403,
      name: "Camila",
      age: 28,
      location: "Privé Gand",
      description: "Trans brésilienne active/passive pour tous vos fantasmes.",
      phone: "0494 33 44 55",
      images: ["/placeholder.svg?height=400&width=300&query=brazilian%20trans%20woman"],
      isGold: true,
      isVerified: true,
      imageCount: "1/6",
    },
    {
      id: 404,
      name: "Natasha",
      age: 27,
      location: "Privé Liège",
      description: "Trans russe élégante et charismatique pour moments de qualité.",
      phone: "0495 44 55 66",
      images: ["/placeholder.svg?height=400&width=300&query=elegant%20trans%20woman"],
      isGold: true,
      isVerified: true,
      imageCount: "1/5",
    },
    {
      id: 405,
      name: "Alessandra",
      age: 29,
      location: "Privé Charleroi",
      description: "Trans italienne expérimentée pour plaisirs sans limites.",
      phone: "0496 55 66 77",
      images: ["/placeholder.svg?height=400&width=300&query=italian%20trans%20model"],
      isGold: true,
      isVerified: true,
      isSafeSex: true,
      imageCount: "1/8",
    },
    {
      id: 406,
      name: "Jasmine",
      age: 25,
      location: "Privé Namur",
      description: "Trans thaïlandaise pour massages et moments sensuels.",
      phone: "0497 66 77 88",
      images: ["/placeholder.svg?height=400&width=300&query=thai%20trans%20woman"],
      isGold: true,
      isVerified: true,
      imageCount: "1/10",
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
            <span className="text-black">Trans</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white text-black">
            <Filter className="h-4 w-4" />
            Filtrer les annonces
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2 text-black">Trans</h1>
        <p className="text-black mb-6">Annonces de personnes trans qui proposent leurs services dans un cadre privé</p>

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

        {/* Trans Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {transListings.map((trans) => (
            <div key={trans.id} className="relative group">
              <Link href={`/prive/trans/${trans.id}`}>
                <Card className="overflow-hidden bg-white hover:shadow-md transition-shadow h-full">
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10 bg-pink-500 text-white px-2 py-0.5 rounded-sm text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      GOLD
                    </div>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={trans.images[0] || "/placeholder.svg"}
                        alt={trans.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-black">{trans.name}</h3>
                      <span className="text-sm text-black">{trans.age}a</span>
                    </div>
                    <p className="text-sm text-black">{trans.location}</p>
                    <p className="text-sm text-black line-clamp-2 mt-1">{trans.description}</p>
                    <div className="flex items-center mt-2">
                      <Phone className="h-4 w-4 mr-1 text-black" />
                      <span className="text-sm text-black">{trans.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {trans.isVerified && (
                        <div className="flex items-center text-black text-xs">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                          Vérifié
                        </div>
                      )}
                      {trans.isSafeSex && (
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
                <Link href={`/booking/${trans.id}`}>
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
