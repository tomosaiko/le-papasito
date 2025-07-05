"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { User, ImageIcon, CreditCard, Users, Eye, Heart, Copy, Check, Upload, Trash2, Camera, Image as ImageIconLucide, Settings, Save, RefreshCw } from "lucide-react"
import AvatarUpload from "@/components/upload/avatar-upload"
import GalleryUpload from "@/components/upload/gallery-upload"

// Sample data - normalement récupéré depuis une API
const escortData = {
  name: "Sophia",
  age: 25,
  city: "Paris",
  email: "sophia@example.com",
  phone: "+33 6 12 34 56 78",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.",
  services: "Service 1, Service 2, Service 3",
  subscription: "premium",
  nextBilling: "2023-12-01",
  photos: [
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
    "/placeholder.svg?height=400&width=300",
  ],
  videos: ["/placeholder.svg?height=400&width=300"],
  stats: {
    views: 1245,
    likes: 87,
    messages: 23,
    earnings: "€1,850",
    viewsThisWeek: 245,
    likesThisWeek: 18,
  },
  referral: {
    code: "SOPHIA25",
    referrals: 3,
    earnings: "€30.00",
  },
}

// Types pour les données
interface ProfileData {
  name: string
  age: number
  city: string
  email: string
  phone: string
  bio: string
  services: string
  avatar?: string
  gallery: Array<{
    id: string
    url: string
    isMain: boolean
    position: number
  }>
}

export default function EscortDashboard() {
  const { dictionary } = useLanguage()
  const [activeTab, setActiveTab] = useState("profile")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: escortData.name,
    age: escortData.age,
    city: escortData.city,
    email: escortData.email,
    phone: escortData.phone,
    bio: escortData.bio,
    services: escortData.services,
    avatar: escortData.photos[0],
    gallery: escortData.photos.map((photo, index) => ({
      id: `img_${index}`,
      url: photo,
      isMain: index === 0,
      position: index
    }))
  })

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://lepapasito.com/ref/${escortData.referral.code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAvatarUpload = async (imageUrl: string) => {
    setIsLoading(true)
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProfileData(prev => ({
        ...prev,
        avatar: imageUrl
      }))
      
      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre avatar.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGalleryChange = async (images: Array<{ id: string; url: string; isMain: boolean; position: number }>) => {
    setIsLoading(true)
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setProfileData(prev => ({
        ...prev,
        gallery: images
      }))
      
      toast({
        title: "Galerie mise à jour",
        description: `${images.length} image(s) dans votre galerie.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre galerie.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      toast({
        title: "Profil sauvegardé",
        description: "Vos modifications ont été sauvegardées avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header avec stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-gold-DEFAULT">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="bg-gold-DEFAULT text-black text-xl">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
                <p className="text-gray-400">{profileData.city}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-gold-DEFAULT/20 text-gold-DEFAULT">
                    {escortData.subscription}
                  </Badge>
                  <Badge variant="outline">
                    {profileData.gallery.length} photos
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">Profil complété</div>
              <Progress value={85} className="w-32" />
              <div className="text-xs text-gray-500 mt-1">85%</div>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-blue-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Vues</p>
                    <p className="text-2xl font-bold text-white">{escortData.stats.views}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Likes</p>
                    <p className="text-2xl font-bold text-white">{escortData.stats.likes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Messages</p>
                    <p className="text-2xl font-bold text-white">{escortData.stats.messages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gold-DEFAULT mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Revenus</p>
                    <p className="text-2xl font-bold text-gold-DEFAULT">{escortData.stats.earnings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs améliorés */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-gray-800">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <ImageIconLucide className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <CreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <Users className="h-4 w-4" />
              Referral
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab - Amélioré */}
          <TabsContent value="profile" className="mt-6">
            <div className="space-y-8">
              {/* Section Avatar */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photo de profil
                  </CardTitle>
                  <CardDescription>
                    Uploadez une photo de profil de qualité pour attirer plus de clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="shrink-0">
                      <Avatar className="h-24 w-24 ring-2 ring-gold-DEFAULT">
                        <AvatarImage src={profileData.avatar} alt={profileData.name} />
                        <AvatarFallback className="bg-gold-DEFAULT text-black text-2xl">
                          {profileData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <AvatarUpload
                        currentAvatar={profileData.avatar}
                        userName={profileData.name}
                        onUpload={handleAvatarUpload}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Informations */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Informations personnelles
                  </CardTitle>
                  <CardDescription>
                    Complétez vos informations pour améliorer votre profil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Nom</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-gray-300">Âge</Label>
                      <Input 
                        id="age" 
                        type="number" 
                        value={profileData.age}
                        onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">Ville</Label>
                      <Input 
                        id="city" 
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                        placeholder="Décrivez-vous en quelques mots..."
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="services" className="text-gray-300">Services</Label>
                      <Textarea 
                        id="services" 
                        value={profileData.services}
                        onChange={(e) => setProfileData(prev => ({ ...prev, services: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                        placeholder="Décrivez les services que vous proposez..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isLoading}
                  className="bg-gold-DEFAULT hover:bg-gold-dark text-black px-8 py-3 text-lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab - Complètement refait */}
          <TabsContent value="gallery" className="mt-6">
            <div className="space-y-8">
              {/* Alert d'info */}
              <Alert className="bg-blue-900/20 border-blue-700">
                <ImageIconLucide className="h-4 w-4" />
                <AlertDescription className="text-blue-300">
                  Uploadez des photos de qualité professionnelle pour attirer plus de clients. 
                  Vous pouvez uploader jusqu'à 10 images et les réorganiser selon vos préférences.
                </AlertDescription>
              </Alert>

              {/* Stats galerie */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gold-DEFAULT mb-2">
                        {profileData.gallery.length}
                      </div>
                      <div className="text-sm text-gray-400">Images</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {profileData.gallery.filter(img => img.isMain).length}
                      </div>
                      <div className="text-sm text-gray-400">Image principale</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {10 - profileData.gallery.length}
                      </div>
                      <div className="text-sm text-gray-400">Places restantes</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Composant de galerie */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIconLucide className="h-5 w-5" />
                    Galerie d'images
                  </CardTitle>
                  <CardDescription>
                    Gérez votre galerie d'images avec drag & drop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GalleryUpload
                    images={profileData.gallery}
                    onImagesChange={handleGalleryChange}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Abonnement actuel</CardTitle>
                  <CardDescription>Votre plan et détails de facturation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plan:</span>
                      <span className="font-semibold capitalize text-white">{escortData.subscription}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Statut:</span>
                      <span className="font-semibold text-green-400">Actif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Prochaine facturation:</span>
                      <span className="font-semibold text-white">{escortData.nextBilling}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col md:flex-row gap-4">
                <Button className="bg-gold-DEFAULT hover:bg-gold-dark text-black">
                  Améliorer le plan
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  Mettre à jour le paiement
                </Button>
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                  Annuler l'abonnement
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Votre lien de parrainage</CardTitle>
                  <CardDescription>Partagez ce lien pour gagner des récompenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Input 
                      readOnly 
                      value={`https://lepapasito.com/ref/${escortData.referral.code}`} 
                      className="mr-2 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button onClick={copyReferralLink} variant="outline" size="icon" className="shrink-0 border-gray-700">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Parrainages</CardTitle>
                    <CardDescription>Personnes inscrites avec votre code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{escortData.referral.referrals}</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Gains</CardTitle>
                    <CardDescription>Total des gains par parrainage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gold-DEFAULT">{escortData.referral.earnings}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
