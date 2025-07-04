"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Clock, Languages, Camera, Save, Plus, Trash2, Diamond, Star } from "lucide-react"
import Image from "next/image"

export default function ProfileDashboardPage() {
  const [profileData, setProfileData] = useState({
    name: "Sophia",
    age: 25,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Paris, France",
    languages: ["Français", "Anglais", "Espagnol"],
    services: ["Dîner", "Soirées", "Voyages", "Massage"],
    availability: {
      monday: { available: true, start: "10:00", end: "22:00" },
      tuesday: { available: true, start: "10:00", end: "22:00" },
      wednesday: { available: true, start: "10:00", end: "22:00" },
      thursday: { available: true, start: "10:00", end: "22:00" },
      friday: { available: true, start: "10:00", end: "22:00" },
      saturday: { available: true, start: "12:00", end: "00:00" },
      sunday: { available: false, start: "", end: "" },
    },
    hourlyRate: 250,
    photos: [
      "/serene-gaze.png",
      "/urban-chic.png",
      "/penthouse-cityscape.png",
      "/shimmering-emerald-gown.png",
      "/parisian-charm.png",
    ],
    isPremium: true,
    isGold: false,
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSaveProfile = () => {
    // Dans une implémentation réelle, vous enverriez ces données à votre API
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  const handleAddPhoto = () => {
    // Dans une implémentation réelle, vous ouvririez un sélecteur de fichier
    const newPhoto = "/placeholder.svg?height=600&width=400&query=new photo upload"
    setProfileData({
      ...profileData,
      photos: [...profileData.photos, newPhoto],
    })
  }

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...profileData.photos]
    updatedPhotos.splice(index, 1)
    setProfileData({
      ...profileData,
      photos: updatedPhotos,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et votre visibilité</p>
        </div>

        <div className="flex items-center gap-2">
          {profileData.isPremium && (
            <Badge className="bg-purple-500 hover:bg-purple-600">
              <Diamond className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          {profileData.isGold && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Star className="h-3 w-3 mr-1" />
              Gold
            </Badge>
          )}
          <Button
            onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            ) : (
              "Modifier le profil"
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-8">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-500" />
                Informations personnelles
              </CardTitle>
              <CardDescription>Ces informations seront affichées publiquement sur votre profil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: Number.parseInt(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  className="min-h-[150px]"
                />
                <p className="text-sm text-muted-foreground">{profileData.bio.length}/500 caractères</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Langues parlées</Label>
                <div className="flex items-center">
                  <Languages className="h-5 w-5 text-muted-foreground mr-2" />
                  <Input
                    id="languages"
                    value={profileData.languages.join(", ")}
                    onChange={(e) => setProfileData({ ...profileData, languages: e.target.value.split(", ") })}
                    disabled={!isEditing}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Séparez les langues par des virgules</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Tarif horaire (€)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={profileData.hourlyRate}
                  onChange={(e) => setProfileData({ ...profileData, hourlyRate: Number.parseInt(e.target.value) })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-500" />
                Photos
              </CardTitle>
              <CardDescription>
                Gérez les photos affichées sur votre profil (maximum 10, ou 20 avec l'option premium)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        width={300}
                        height={400}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    {index === 0 && <Badge className="absolute bottom-2 left-2 bg-blue-500">Photo principale</Badge>}
                  </div>
                ))}

                {isEditing && profileData.photos.length < (profileData.isPremium ? 20 : 10) && (
                  <button
                    onClick={handleAddPhoto}
                    className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                  >
                    <Plus className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    <span className="text-sm text-muted-foreground mt-2">Ajouter</span>
                  </button>
                )}
              </div>

              {!profileData.isPremium && profileData.photos.length >= 10 && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center">
                    <Diamond className="h-4 w-4 mr-2" />
                    Passez à l'abonnement Premium pour ajouter jusqu'à 20 photos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-500" />
                Disponibilité
              </CardTitle>
              <CardDescription>Définissez vos horaires de disponibilité pour chaque jour de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(profileData.availability).map(([day, data]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                      <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={data.available}
                        onCheckedChange={(checked) => {
                          const newAvailability = { ...profileData.availability }
                          newAvailability[day as keyof typeof profileData.availability].available = checked
                          setProfileData({ ...profileData, availability: newAvailability })
                        }}
                        disabled={!isEditing}
                      />
                      <Label>Disponible</Label>
                    </div>
                    {data.available && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Label>De</Label>
                          <Select
                            value={data.start}
                            onValueChange={(value) => {
                              const newAvailability = { ...profileData.availability }
                              newAvailability[day as keyof typeof profileData.availability].start = value
                              setProfileData({ ...profileData, availability: newAvailability })
                            }}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Début" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }).map((_, i) => (
                                <SelectItem key={i} value={`${i}:00`}>
                                  {`${i}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label>à</Label>
                          <Select
                            value={data.end}
                            onValueChange={(value) => {
                              const newAvailability = { ...profileData.availability }
                              newAvailability[day as keyof typeof profileData.availability].end = value
                              setProfileData({ ...profileData, availability: newAvailability })
                            }}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Fin" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }).map((_, i) => (
                                <SelectItem key={i} value={`${i}:00`}>
                                  {`${i}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Les clients ne pourront réserver que pendant vos heures de disponibilité
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services proposés</CardTitle>
              <CardDescription>Sélectionnez les services que vous proposez à vos clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Dîner",
                  "Soirées",
                  "Voyages",
                  "Massage",
                  "Accompagnement événements",
                  "Week-end",
                  "Nuit complète",
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Switch
                      checked={profileData.services.includes(service)}
                      onCheckedChange={(checked) => {
                        const newServices = checked
                          ? [...profileData.services, service]
                          : profileData.services.filter((s) => s !== service)
                        setProfileData({ ...profileData, services: newServices })
                      }}
                      disabled={!isEditing}
                    />
                    <Label>{service}</Label>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label>Services personnalisés (séparés par des virgules)</Label>
                <Textarea
                  value={profileData.services
                    .filter(
                      (s) =>
                        ![
                          "Dîner",
                          "Soirées",
                          "Voyages",
                          "Massage",
                          "Accompagnement événements",
                          "Week-end",
                          "Nuit complète",
                        ].includes(s),
                    )
                    .join(", ")}
                  onChange={(e) => {
                    const standardServices = profileData.services.filter((s) =>
                      [
                        "Dîner",
                        "Soirées",
                        "Voyages",
                        "Massage",
                        "Accompagnement événements",
                        "Week-end",
                        "Nuit complète",
                      ].includes(s),
                    )
                    const customServices = e.target.value.split(", ").filter(Boolean)
                    setProfileData({ ...profileData, services: [...standardServices, ...customServices] })
                  }}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
