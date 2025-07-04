"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

interface ReviewFiltersProps {
  onFilterChange: (filters: {
    sortBy: string
    minRating: number
    verifiedOnly: boolean
  }) => void
}

export function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  const [sortBy, setSortBy] = useState("recent")
  const [minRating, setMinRating] = useState("0")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters(value, minRating, verifiedOnly)
  }

  const handleRatingChange = (value: string) => {
    setMinRating(value)
    applyFilters(sortBy, value, verifiedOnly)
  }

  const toggleVerifiedOnly = () => {
    const newValue = !verifiedOnly
    setVerifiedOnly(newValue)
    applyFilters(sortBy, minRating, newValue)
  }

  const applyFilters = (sort: string, rating: string, verified: boolean) => {
    onFilterChange({
      sortBy: sort,
      minRating: Number.parseInt(rating),
      verifiedOnly: verified,
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="highest">Note la plus élevée</SelectItem>
            <SelectItem value="lowest">Note la plus basse</SelectItem>
            <SelectItem value="helpful">Plus utiles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={minRating} onValueChange={handleRatingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Toutes les notes</SelectItem>
            <SelectItem value="5">5 étoiles</SelectItem>
            <SelectItem value="4">4+ étoiles</SelectItem>
            <SelectItem value="3">3+ étoiles</SelectItem>
            <SelectItem value="2">2+ étoiles</SelectItem>
            <SelectItem value="1">1+ étoile</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant={verifiedOnly ? "default" : "outline"}
        className={verifiedOnly ? "bg-purple-600 hover:bg-purple-700" : ""}
        onClick={toggleVerifiedOnly}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Avis vérifiés uniquement
      </Button>
    </div>
  )
}
