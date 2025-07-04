"use client"

import { useState } from "react"
import { AdvancedFilters } from "@/components/filters/advanced-filters"
import { FilterTags } from "@/components/filters/filter-tags"
import { QuickFilters } from "@/components/filters/quick-filters"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Filter, MapPin, SearchIcon, Star, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Données de test pour les résultats de recherche
const generateSearchResults = () => {
  const results = []

  for (let i = 1; i <= 20; i++) {
    const isVerified = Math.random() > 0.3
    const isSafeSex = Math.random() > 0.5
    const rating = Math.floor(Math.random() * 2) + 4 // 4-5 étoiles

    results.push({
      id: i,
      name: ["Sophia", "Emma", "Isabella", "Olivia", "Ava", "Mia", "Charlotte", "Amelia"][
        Math.floor(Math.random() * 8)
      ],
      age: Math.floor(Math.random() * 15) + 20, // 20-35 ans
      location: ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nice", "Strasbourg"][
        Math.floor(Math.random() * 8)
      ],
      image: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153702_original.jpg-YQv55LkyBEK0tFiVykOS2hcNtuLipE.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153698_original.jpg-dKxdTJFpF6wiafozWCwq5zd6ozyglL.jpeg",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153708_original.jpg-fC3XDJapRrwlHDxdLdP12ySnQ7JTWL.jpeg",
        "https://hebbkx1anhila5yf.public.blob",
      ][Math.floor(Math.random() * 5)],
      price: Math.floor(Math.random() * 200) + 100, // 100-300€
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      isVerified: isVerified,
      isSafeSex: isSafeSex,
      rating: rating,
    })
  }

  return results
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState(generateSearchResults())
  const [activeTab, setActiveTab] = useState("grid")
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Search Results</h1>
        <Button variant="outline" onClick={() => setFiltersOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Barre de recherche */}
      <div className="relative w-full mb-4">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input type="text" placeholder="Search..." className="pl-12" />
      </div>

      {/* Quick Filters */}
      <QuickFilters />

      {/* Filter Tags */}
      <FilterTags />

      {/* Advanced Filters (Modal) */}
      <AdvancedFilters open={filtersOpen} setOpen={setFiltersOpen} />

      {/* Tabs pour l'affichage */}
      <Tabs defaultValue="grid" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="p-4">
                <Link href={`/profile/${result.id}`}>
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={result.image || "/placeholder.svg"}
                      alt={result.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {result.name}, {result.age}
                    </h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(result.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{result.location}</span>
                  </div>
                  <p className="text-sm mt-2">{result.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold">{result.price}€</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result.isVerified && (
                        <Badge variant="secondary">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {result.isSafeSex && (
                        <Badge variant="secondary">
                          <Shield className="h-4 w-4 mr-1" />
                          Safe Sex
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <ul className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="p-4">
                <Link href={`/profile/${result.id}`}>
                  <li className="flex items-center space-x-4">
                    <div className="relative w-32 h-32">
                      <Image
                        src={result.image || "/placeholder.svg"}
                        alt={result.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          {result.name}, {result.age}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {[...Array(result.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{result.location}</span>
                      </div>
                      <p className="text-sm mt-2">{result.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <span className="font-bold">{result.price}€</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.isVerified && (
                            <Badge variant="secondary">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {result.isSafeSex && (
                            <Badge variant="secondary">
                              <Shield className="h-4 w-4 mr-1" />
                              Safe Sex
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                </Link>
              </Card>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="map">
          <div>Map View (Coming Soon)</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
