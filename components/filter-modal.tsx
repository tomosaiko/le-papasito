"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, Trash2, ChevronDown } from "lucide-react"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
}

export function FilterModal({ isOpen, onClose, onApplyFilters }: FilterModalProps) {
  const [filters, setFilters] = useState({
    location: "",
    distance: "",
    type: "",
    genre: [] as string[],
    ageFrom: "",
    ageTo: "",
    verifiedOnly: false,
    safeSexOnly: false,
  })

  const handleChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFilters({
      location: "",
      distance: "",
      type: "",
      genre: [],
      ageFrom: "",
      ageTo: "",
      verifiedOnly: false,
      safeSexOnly: false,
    })
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-gray-100">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-black">Filtrer les annonces</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Input
                placeholder="Province ou ville"
                value={filters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="pl-10 h-14 bg-white text-black"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            </div>

            <div className="relative">
              <Select value={filters.distance} onValueChange={(value) => handleChange("distance", value)}>
                <SelectTrigger className="h-14 bg-white text-black">
                  <SelectValue placeholder="Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="100">100 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Type de rencontre"
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="h-14 bg-white text-black"
            />

            {/* Utilisation de Popover au lieu de Select pour le genre */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-14 bg-white text-black w-full justify-between font-normal">
                  <span className={filters.genre.length > 0 ? "text-black" : "text-gray-500"}>
                    {filters.genre.length > 0 ? `Genre (${filters.genre.length})` : "Genre"}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-[100]" align="start" side="bottom" sideOffset={5}>
                <div className="bg-white px-4 py-2 border-b">
                  <span className="text-gray-700 font-medium">Genre</span>
                </div>
                <div className="bg-gray-100">
                  <div className="py-3 px-4 flex items-center border-b border-gray-200">
                    <Checkbox
                      id="genre-femme"
                      checked={filters.genre.includes("Femme")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Radio button behavior - uncheck others
                          setFilters((prev) => ({ ...prev, genre: ["Femme"] }))
                        } else {
                          setFilters((prev) => ({ ...prev, genre: [] }))
                        }
                      }}
                      className="h-5 w-5 rounded-none border-gray-400"
                    />
                    <Label htmlFor="genre-femme" className="ml-3 text-black font-normal">
                      Femme
                    </Label>
                  </div>
                  <div className="py-3 px-4 flex items-center border-b border-gray-200">
                    <Checkbox
                      id="genre-homme"
                      checked={filters.genre.includes("Homme")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Radio button behavior - uncheck others
                          setFilters((prev) => ({ ...prev, genre: ["Homme"] }))
                        } else {
                          setFilters((prev) => ({ ...prev, genre: [] }))
                        }
                      }}
                      className="h-5 w-5 rounded-none border-gray-400"
                    />
                    <Label htmlFor="genre-homme" className="ml-3 text-black font-normal">
                      Homme
                    </Label>
                  </div>
                  <div className="py-3 px-4 flex items-center">
                    <Checkbox
                      id="genre-trans"
                      checked={filters.genre.includes("Trans")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          // Radio button behavior - uncheck others
                          setFilters((prev) => ({ ...prev, genre: ["Trans"] }))
                        } else {
                          setFilters((prev) => ({ ...prev, genre: [] }))
                        }
                      }}
                      className="h-5 w-5 rounded-none border-gray-400"
                    />
                    <Label htmlFor="genre-trans" className="ml-3 text-black font-normal">
                      Trans
                    </Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="relative">
              <Select value={filters.ageFrom} onValueChange={(value) => handleChange("ageFrom", value)}>
                <SelectTrigger className="h-14 bg-white text-black">
                  <SelectValue placeholder="Age (de)" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 62 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} ans
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select value={filters.ageTo} onValueChange={(value) => handleChange("ageTo", value)}>
                <SelectTrigger className="h-14 bg-white text-black">
                  <SelectValue placeholder="Age (à)" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 62 }, (_, i) => i + 18).map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} ans
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedOnly"
                checked={filters.verifiedOnly}
                onCheckedChange={(checked) => handleChange("verifiedOnly", checked)}
              />
              <Label htmlFor="verifiedOnly" className="text-black">
                Seulement les annonces vérifiées
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="safeSexOnly"
                checked={filters.safeSexOnly}
                onCheckedChange={(checked) => handleChange("safeSexOnly", checked)}
              />
              <Label htmlFor="safeSexOnly" className="text-black">
                Seulement safe sex
              </Label>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 flex justify-between">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-red-500 hover:text-red-700 hover:bg-transparent flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              SUPPRIMER LE FILTRE
            </Button>

            <Button onClick={handleApply} className="bg-red-500 hover:bg-red-600 text-white px-6">
              AFFICHER LES ANNONCES
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
