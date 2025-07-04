"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, X, CheckCircle, Shield, Star } from "lucide-react"

interface AdvancedFiltersProps {
  onApplyFilters: (filters: any) => void
  onResetFilters: () => void
  initialFilters?: any
}

export function AdvancedFilters({ onApplyFilters, onResetFilters, initialFilters = {} }: AdvancedFiltersProps) {
  const [activeTab, setActiveTab] = useState("basic")

  // Filtres de base
  const [gender, setGender] = useState(initialFilters.gender || "all")
  const [ageRange, setAgeRange] = useState(initialFilters.ageRange || [18, 50])
  const [location, setLocation] = useState(initialFilters.location || "")
  const [distance, setDistance] = useState(initialFilters.distance || "")
  const [verifiedOnly, setVerifiedOnly] = useState(initialFilters.verifiedOnly || false)
  const [safeSexOnly, setSafeSexOnly] = useState(initialFilters.safeSexOnly || false)
  const [minRating, setMinRating] = useState(initialFilters.minRating || "0")

  // Filtres physiques
  const [hairColor, setHairColor] = useState(initialFilters.hairColor || [])
  const [bodyType, setBodyType] = useState(initialFilters.bodyType || [])
  const [height, setHeight] = useState(initialFilters.height || [150, 190])
  const [cupSize, setCupSize] = useState(initialFilters.cupSize || [])

  // Filtres de services
  const [services, setServices] = useState(initialFilters.services || [])
  const [languages, setLanguages] = useState(initialFilters.languages || [])
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || [50, 500])

  // Filtres de disponibilité
  const [availability, setAvailability] = useState(initialFilters.availability || [])
  const [bookingType, setBookingType] = useState(initialFilters.bookingType || "all")

  const handleApplyFilters = () => {
    const filters = {
      // Filtres de base
      gender,
      ageRange,
      location,
      distance,
      verifiedOnly,
      safeSexOnly,
      minRating,

      // Filtres physiques
      hairColor,
      bodyType,
      height,
      cupSize,

      // Filtres de services
      services,
      languages,
      priceRange,

      // Filtres de disponibilité
      availability,
      bookingType,
    }

    onApplyFilters(filters)
  }

  const handleResetFilters = () => {
    // Réinitialiser tous les filtres
    setGender("all")
    setAgeRange([18, 50])
    setLocation("")
    setDistance("")
    setVerifiedOnly(false)
    setSafeSexOnly(false)
    setMinRating("0")

    setHairColor([])
    setBodyType([])
    setHeight([150, 190])
    setCupSize([])

    setServices([])
    setLanguages([])
    setPriceRange([50, 500])

    setAvailability([])
    setBookingType("all")

    onResetFilters()
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item]
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-500" />
            Filtres avancés
          </div>
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 gap-1">
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Général</TabsTrigger>
            <TabsTrigger value="physical">Physique</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          </TabsList>

          {/* Filtres de base */}
          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-2">
              <Label>Genre</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="gender-all" />
                  <Label htmlFor="gender-all">Tous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="gender-female" />
                  <Label htmlFor="gender-female">Femme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="gender-male" />
                  <Label htmlFor="gender-male">Homme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trans" id="gender-trans" />
                  <Label htmlFor="gender-trans">Trans</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="couple" id="gender-couple" />
                  <Label htmlFor="gender-couple">Couple</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Âge</Label>
              <div className="pt-2 px-2">
                <Slider value={ageRange} min={18} max={60} step={1} onValueChange={setAgeRange} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{ageRange[0]} ans</span>
                  <span>{ageRange[1]} ans</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  placeholder="Ville ou code postal"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance</Label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger id="distance">
                    <SelectValue placeholder="Sélectionnez une distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes distances</SelectItem>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="25">25 km</SelectItem>
                    <SelectItem value="50">50 km</SelectItem>
                    <SelectItem value="100">100 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Vérification</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                  />
                  <Label htmlFor="verified" className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Profils vérifiés uniquement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="safesex"
                    checked={safeSexOnly}
                    onCheckedChange={(checked) => setSafeSexOnly(checked as boolean)}
                  />
                  <Label htmlFor="safesex" className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Safe sex uniquement
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Note minimale</Label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Sélectionnez une note minimale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notes</SelectItem>
                  <SelectItem value="5">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      (5 étoiles)
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      (4+ étoiles)
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      (3+ étoiles)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Filtres physiques */}
          <TabsContent value="physical" className="space-y-4">
            <div className="space-y-2">
              <Label>Couleur de cheveux</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Blonde", "Brune", "Noire", "Rousse", "Châtain", "Colorée"].map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`hair-${color}`}
                      checked={hairColor.includes(color)}
                      onCheckedChange={() => setHairColor(toggleArrayItem(hairColor, color))}
                    />
                    <Label htmlFor={`hair-${color}`}>{color}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type de corps</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Mince", "Athlétique", "Normal", "Curvy", "BBW", "Musclé"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`body-${type}`}
                      checked={bodyType.includes(type)}
                      onCheckedChange={() => setBodyType(toggleArrayItem(bodyType, type))}
                    />
                    <Label htmlFor={`body-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Taille (cm)</Label>
              <div className="pt-2 px-2">
                <Slider value={height} min={140} max={200} step={1} onValueChange={setHeight} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{height[0]} cm</span>
                  <span>{height[1]} cm</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bonnet</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {["A", "B", "C", "D", "DD", "E", "F", "G+"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cup-${size}`}
                      checked={cupSize.includes(size)}
                      onCheckedChange={() => setCupSize(toggleArrayItem(cupSize, size))}
                    />
                    <Label htmlFor={`cup-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Filtres de services */}
          <TabsContent value="services" className="space-y-4">
            <div className="space-y-2">
              <Label>Services proposés</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Massage érotique",
                  "Massage tantrique",
                  "Massage nuru",
                  "Domination",
                  "Soumission",
                  "Fétichisme",
                  "BDSM",
                  "Roleplay",
                  "Couple",
                  "Trio",
                  "GFE",
                  "Anal",
                  "Striptease",
                  "Dîner",
                  "Voyages",
                  "Événements",
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={services.includes(service)}
                      onCheckedChange={() => setServices(toggleArrayItem(services, service))}
                    />
                    <Label htmlFor={`service-${service}`}>{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Langues parlées</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Français",
                  "Anglais",
                  "Espagnol",
                  "Italien",
                  "Allemand",
                  "Russe",
                  "Arabe",
                  "Portugais",
                  "Chinois",
                ].map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`lang-${language}`}
                      checked={languages.includes(language)}
                      onCheckedChange={() => setLanguages(toggleArrayItem(languages, language))}
                    />
                    <Label htmlFor={`lang-${language}`}>{language}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prix (€/heure)</Label>
              <div className="pt-2 px-2">
                <Slider value={priceRange} min={50} max={1000} step={10} onValueChange={setPriceRange} />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1]}€</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Filtres de disponibilité */}
          <TabsContent value="availability" className="space-y-4">
            <div className="space-y-2">
              <Label>Disponibilité</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  "Aujourd'hui",
                  "Ce soir",
                  "Demain",
                  "Ce week-end",
                  "Matinée",
                  "Après-midi",
                  "Soirée",
                  "Nuit",
                  "24/7",
                ].map((time) => (
                  <div key={time} className="flex items-center space-x-2">
                    <Checkbox
                      id={`avail-${time}`}
                      checked={availability.includes(time)}
                      onCheckedChange={() => setAvailability(toggleArrayItem(availability, time))}
                    />
                    <Label htmlFor={`avail-${time}`}>{time}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Type de rendez-vous</Label>
              <RadioGroup value={bookingType} onValueChange={setBookingType} className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="booking-all" />
                  <Label htmlFor="booking-all">Tous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="incall" id="booking-incall" />
                  <Label htmlFor="booking-incall">Incall (chez l'escorte)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outcall" id="booking-outcall" />
                  <Label htmlFor="booking-outcall">Outcall (à domicile/hôtel)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="both" id="booking-both" />
                  <Label htmlFor="booking-both">Les deux</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleApplyFilters} className="w-full bg-purple-600 hover:bg-purple-700">
          Appliquer les filtres
        </Button>
      </CardFooter>
    </Card>
  )
}
