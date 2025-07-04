"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"
import { Search, Star, Filter, MapPin, ChevronRight } from "lucide-react"

// Sample data for escorts
const escortsList = [
  {
    id: 1,
    name: "Sophia",
    age: 25,
    city: "Paris",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviews: 42,
    isVip: true,
  },
  {
    id: 2,
    name: "Isabella",
    age: 27,
    city: "Lyon",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviews: 36,
    isVip: false,
  },
  {
    id: 3,
    name: "Emma",
    age: 24,
    city: "Marseille",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviews: 28,
    isPremium: true,
  },
  {
    id: 4,
    name: "Camille",
    age: 26,
    city: "Bordeaux",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviews: 31,
    isPremium: true,
  },
  {
    id: 5,
    name: "Charlotte",
    age: 23,
    city: "Nice",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviews: 24,
    isVip: false,
  },
  {
    id: 6,
    name: "Léa",
    age: 28,
    city: "Toulouse",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviews: 39,
    isPremium: true,
  },
  {
    id: 7,
    name: "Chloé",
    age: 25,
    city: "Lille",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviews: 27,
    isVip: true,
  },
  {
    id: 8,
    name: "Manon",
    age: 26,
    city: "Strasbourg",
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviews: 45,
    isPremium: true,
  },
]

export default function EscortsListing() {
  const { dictionary } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [ageRange, setAgeRange] = useState([18, 50])
  const [showFilters, setShowFilters] = useState(false)

  const filteredEscorts = escortsList.filter(
    (escort) =>
      (escort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escort.city.toLowerCase().includes(searchTerm.toLowerCase())) &&
      escort.age >= ageRange[0] &&
      escort.age <= ageRange[1],
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 gold-gradient">Escorts</h1>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={dictionary.common.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" className="md:w-auto" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            {dictionary.common.filter}
          </Button>

          <Select defaultValue="newest">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={dictionary.common.sort} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="age-asc">Age: Low to High</SelectItem>
              <SelectItem value="age-desc">Age: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Age Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={ageRange}
                      min={18}
                      max={50}
                      step={1}
                      onValueChange={setAgeRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{ageRange[0]} years</span>
                      <span>{ageRange[1]} years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Location</h3>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="lyon">Lyon</SelectItem>
                      <SelectItem value="marseille">Marseille</SelectItem>
                      <SelectItem value="bordeaux">Bordeaux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="vip">VIP Only</SelectItem>
                      <SelectItem value="premium">Premium Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Escorts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredEscorts.map((escort) => (
          <Link href={`/escorts/${escort.id}`} key={escort.id}>
            <div className="bg-secondary rounded-2xl overflow-hidden card-hover">
              <div className="relative">
                <Image
                  src={escort.image || "/placeholder.svg"}
                  alt={escort.name}
                  width={300}
                  height={400}
                  className="w-full h-80 object-cover"
                />
                {escort.isVip && (
                  <div className="absolute top-4 right-4 bg-gold-DEFAULT text-black px-3 py-1 rounded-full text-xs font-bold">
                    VIP
                  </div>
                )}
                {escort.isPremium && (
                  <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">
                    {escort.name}, {escort.age}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-gold-DEFAULT mr-1" />
                    <span className="text-sm">{escort.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{escort.city}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{escort.reviews} reviews</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEscorts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No escorts found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <Button variant="outline" size="sm" className="bg-gold-DEFAULT/10 text-gold-DEFAULT">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            4
          </Button>
          <Button variant="outline" size="sm">
            5
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
