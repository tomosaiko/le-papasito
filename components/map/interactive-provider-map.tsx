"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Search, Locate, Filter, Star, CheckCircle, ChevronLeft, Plus, Minus, Layers } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Provider {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  isVerified: boolean
  isOnline: boolean
  isPremium?: boolean
  isGold?: boolean
  location: {
    lat: number
    lng: number
    address: string
  }
  services: string[]
  distance?: number // en km
}

interface InteractiveProviderMapProps {
  initialProviders: Provider[]
  userLocation?: { lat: number; lng: number }
  onSelectProvider?: (provider: Provider) => void
  onViewProviderProfile?: (providerId: string) => void
  onBookProvider?: (providerId: string) => void
  className?: string
}

export function InteractiveProviderMap({
  initialProviders,
  userLocation,
  onSelectProvider,
  onViewProviderProfile,
  onBookProvider,
  className,
}: InteractiveProviderMapProps) {
  const [providers, setProviders] = useState<Provider[]>(initialProviders)
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(initialProviders)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(userLocation || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapZoom, setMapZoom] = useState(13)
  const [maxDistance, setMaxDistance] = useState(10) // en km
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<{
    onlineOnly: boolean
    verifiedOnly: boolean
    premiumOnly: boolean
    services: string[]
  }>({
    onlineOnly: false,
    verifiedOnly: false,
    premiumOnly: false,
    services: [],
  })

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Simuler le chargement de la carte
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return Math.round(distance * 10) / 10 // Arrondir à 1 décimale
  }, [])

  // Mettre à jour les distances lorsque la position de l'utilisateur change
  useEffect(() => {
    if (userLocation) {
      const providersWithDistance = providers.map((provider) => ({
        ...provider,
        distance: calculateDistance(userLocation.lat, userLocation.lng, provider.location.lat, provider.location.lng),
      }))

      setProviders(providersWithDistance)
    }
  }, [userLocation, calculateDistance])

  // Filtrer les prestataires en fonction des critères
  useEffect(() => {
    let filtered = [...providers]

    // Filtrer par distance
    if (userLocation) {
      filtered = filtered.filter((provider) => (provider.distance || 0) <= maxDistance)
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.services.some((service) => service.toLowerCase().includes(query)) ||
          provider.location.address.toLowerCase().includes(query),
      )
    }

    // Appliquer les filtres actifs
    if (activeFilters.onlineOnly) {
      filtered = filtered.filter((provider) => provider.isOnline)
    }

    if (activeFilters.verifiedOnly) {
      filtered = filtered.filter((provider) => provider.isVerified)
    }

    if (activeFilters.premiumOnly) {
      filtered = filtered.filter((provider) => provider.isPremium || provider.isGold)
    }

    if (activeFilters.services.length > 0) {
      filtered = filtered.filter((provider) =>
        activeFilters.services.some((service) => provider.services.includes(service)),
      )
    }

    setFilteredProviders(filtered)
  }, [providers, searchQuery, maxDistance, activeFilters, userLocation])

  // Gérer la sélection d'un prestataire
  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    setMapCenter(provider.location)

    if (onSelectProvider) {
      onSelectProvider(provider)
    }
  }

  // Gérer la recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La recherche est déjà gérée par l'effet ci-dessus
  }

  // Obtenir la position de l'utilisateur
  const getUserLocation = () => {
    setIsLoading(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          setMapCenter(userPos)
          setIsLoading(false)

          // Recalculer les distances
          const providersWithDistance = providers.map((provider) => ({
            ...provider,
            distance: calculateDistance(userPos.lat, userPos.lng, provider.location.lat, provider.location.lng),
          }))

          setProviders(providersWithDistance)
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setIsLoading(false)
        },
      )
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.")
      setIsLoading(false)
    }
  }

  // Zoom in/out
  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 10))
  }

  // Changer le type de carte
  const toggleMapType = () => {
    setMapType((prev) => (prev === "roadmap" ? "satellite" : "roadmap"))
  }

  // Réinitialiser les filtres
  const resetFilters = () => {
    setActiveFilters({
      onlineOnly: false,
      verifiedOnly: false,
      premiumOnly: false,
      services: [],
    })
    setSearchQuery("")
    setMaxDistance(10)
  }

  // Liste des services disponibles (pour les filtres)
  const availableServices = ["Massage", "Escort", "Domination", "Fétichisme", "Couple", "BDSM", "Tantrique"]

  // Gérer les filtres de service
  const toggleServiceFilter = (service: string) => {
    setActiveFilters((prev) => {
      if (prev.services.includes(service)) {
        return {
          ...prev,
          services: prev.services.filter((s) => s !== service),
        }
      } else {
        return {
          ...prev,
          services: [...prev.services, service],
        }
      }
    })
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-500" />
            Prestataires à proximité
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={getUserLocation}>
              <Locate className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, service ou lieu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9"
            />
          </div>
        </form>

        {showFilters && (
          <div className="mt-3 p-3 bg-secondary/50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Filtres</h3>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs">Distance max: {maxDistance} km</label>
                </div>
                <Slider
                  value={[maxDistance]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => setMaxDistance(value[0])}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={activeFilters.onlineOnly ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.onlineOnly ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-secondary",
                  )}
                  onClick={() => setActiveFilters((prev) => ({ ...prev, onlineOnly: !prev.onlineOnly }))}
                >
                  En ligne
                </Badge>
                <Badge
                  variant={activeFilters.verifiedOnly ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.verifiedOnly ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-secondary",
                  )}
                  onClick={() => setActiveFilters((prev) => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                >
                  Vérifié
                </Badge>
                <Badge
                  variant={activeFilters.premiumOnly ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer",
                    activeFilters.premiumOnly ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-secondary",
                  )}
                  onClick={() => setActiveFilters((prev) => ({ ...prev, premiumOnly: !prev.premiumOnly }))}
                >
                  Premium/Gold
                </Badge>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">Services</label>
                <div className="flex flex-wrap gap-2">
                  {availableServices.map((service) => (
                    <Badge
                      key={service}
                      variant={activeFilters.services.includes(service) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer",
                        activeFilters.services.includes(service)
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "hover:bg-secondary",
                      )}
                      onClick={() => toggleServiceFilter(service)}
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 mt-4">
        <Tabs defaultValue="map">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="map" className="flex-1">
              Carte
            </TabsTrigger>
            <TabsTrigger value="list" className="flex-1">
              Liste
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="m-0">
            <div className="relative">
              <div ref={mapRef} className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mb-2"></div>
                      <span className="text-sm text-muted-foreground">Chargement de la carte...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Simuler une carte avec un fond gris */}
                    <div
                      className={`absolute inset-0 ${mapType === "satellite" ? "bg-gray-700" : "bg-gray-200 dark:bg-gray-800"}`}
                    >
                      {/* Simuler des routes/bâtiments */}
                      {mapType === "roadmap" && (
                        <>
                          <div className="absolute left-[10%] top-[20%] w-[80%] h-[2px] bg-gray-400"></div>
                          <div className="absolute left-[20%] top-[10%] w-[2px] h-[80%] bg-gray-400"></div>
                          <div className="absolute left-[40%] top-[40%] w-[20%] h-[20%] border border-gray-400"></div>
                          <div className="absolute left-[70%] top-[30%] w-[15%] h-[15%] border border-gray-400"></div>
                          <div className="absolute left-[30%] top-[70%] w-[25%] h-[10%] border border-gray-400"></div>
                        </>
                      )}

                      {/* Marqueurs pour les prestataires */}
                      {filteredProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className={cn(
                            "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all",
                            selectedProvider?.id === provider.id ? "z-20 scale-125" : "z-10 hover:scale-110",
                          )}
                          style={{
                            left: `${30 + Math.random() * 40}%`,
                            top: `${30 + Math.random() * 40}%`,
                          }}
                          onClick={() => handleSelectProvider(provider)}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center rounded-full p-1",
                              provider.isPremium ? "bg-yellow-500" : provider.isGold ? "bg-amber-500" : "bg-purple-600",
                              selectedProvider?.id === provider.id && "ring-2 ring-white",
                            )}
                          >
                            <Avatar className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          {selectedProvider?.id === provider.id && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg p-2 w-48 z-30">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <h3 className="font-medium text-sm truncate">{provider.name}</h3>
                                    {provider.isVerified && (
                                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                    <span>{provider.rating}</span>
                                    <span className="mx-1">•</span>
                                    <span>{provider.distance} km</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-7 flex-1"
                                  onClick={() => onViewProviderProfile && onViewProviderProfile(provider.id)}
                                >
                                  Profil
                                </Button>
                                <Button
                                  size="sm"
                                  className="text-xs h-7 flex-1 bg-purple-600 hover:bg-purple-700"
                                  onClick={() => onBookProvider && onBookProvider(provider.id)}
                                >
                                  Réserver
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Marqueur pour l'utilisateur */}
                      {userLocation && (
                        <div
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                        >
                          <div className="h-4 w-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Contrôles de la carte */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                        onClick={handleZoomIn}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                        onClick={handleZoomOut}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white dark:bg-gray-800 shadow-md"
                        onClick={toggleMapType}
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Légende */}
                    <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
                      <div className="text-xs font-medium mb-1">Légende</div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                          <span className="text-xs">Standard</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span className="text-xs">Gold</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Premium</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-xs">Vous</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Compteur de résultats */}
              <div className="p-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {filteredProviders.length} prestataire{filteredProviders.length !== 1 ? "s" : ""} trouvé
                    {filteredProviders.length !== 1 ? "s" : ""}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <span className="mr-1">Trier par</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Distance</DropdownMenuItem>
                      <DropdownMenuItem>Note</DropdownMenuItem>
                      <DropdownMenuItem>Prix</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="m-0">
            <div className="max-h-[400px] overflow-y-auto">
              {filteredProviders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h3 className="font-medium mb-1">Aucun prestataire trouvé</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Essayez d'élargir votre recherche ou de modifier vos filtres.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className={cn(
                        "p-3 hover:bg-secondary/50 transition-colors cursor-pointer",
                        selectedProvider?.id === provider.id && "bg-secondary/50",
                      )}
                      onClick={() => handleSelectProvider(provider)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          className={cn(
                            "h-12 w-12 ring-2",
                            provider.isPremium
                              ? "ring-yellow-500"
                              : provider.isGold
                                ? "ring-amber-500"
                                : "ring-purple-600",
                          )}
                        >
                          <AvatarImage src={provider.avatar || "/placeholder.svg"} alt={provider.name} />
                          <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-medium truncate">{provider.name}</h3>
                            {provider.isVerified && <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />}
                            {provider.isPremium && (
                              <Badge className="ml-1 bg-yellow-500 text-white text-[10px] px-1 py-0 h-4">Premium</Badge>
                            )}
                            {provider.isGold && (
                              <Badge className="ml-1 bg-amber-500 text-white text-[10px] px-1 py-0 h-4">Gold</Badge>
                            )}
                          </div>

                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1" />
                              <span>{provider.rating}</span>
                              <span className="mx-1">•</span>
                              <span>{provider.reviewCount} avis</span>
                            </div>
                            {provider.distance !== undefined && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{provider.distance} km</span>
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {provider.services.map((service) => (
                              <Badge key={service} variant="outline" className="text-[10px] bg-secondary/50">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{provider.location.address}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            className="text-xs h-7 bg-purple-600 hover:bg-purple-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              onBookProvider && onBookProvider(provider.id)
                            }}
                          >
                            Réserver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewProviderProfile && onViewProviderProfile(provider.id)
                            }}
                          >
                            Profil
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {filteredProviders.length} prestataire{filteredProviders.length !== 1 ? "s" : ""} trouvé
                  {filteredProviders.length !== 1 ? "s" : ""}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <span className="mr-1">Trier par</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Distance</DropdownMenuItem>
                    <DropdownMenuItem>Note</DropdownMenuItem>
                    <DropdownMenuItem>Prix</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
