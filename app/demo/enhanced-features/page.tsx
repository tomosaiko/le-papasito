"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedChatWindow } from "@/components/messaging/enhanced-chat-window"
import { EnhancedAvailabilityCalendar } from "@/components/booking/enhanced-availability-calendar"
import { EnhancedTimeSlots } from "@/components/booking/enhanced-time-slots"
import { EnhancedBookingForm } from "@/components/booking/enhanced-booking-form"
import { AdvancedImage } from "@/components/ui/advanced-image"
import { InteractiveProviderMap } from "@/components/map/interactive-provider-map"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, Map, ImageIcon } from "lucide-react"

// Données de test pour la messagerie
const generateTestMessages = () => {
  const currentUserId = "user1"
  const recipientId = "escort1"

  return [
    {
      id: "msg1",
      senderId: recipientId,
      text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      isRead: true,
      reactions: [] as any[],
    },
    {
      id: "msg2",
      senderId: currentUserId,
      text: "Bonjour ! Je suis intéressé par vos services. Êtes-vous disponible ce week-end ?",
      timestamp: new Date(Date.now() - 3600000 * 1.5),
      isRead: true,
      reactions: [] as any[],
    },
    {
      id: "msg3",
      senderId: recipientId,
      text: "Oui, je suis disponible samedi après-midi et dimanche toute la journée. Quel moment vous conviendrait le mieux ?",
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
      reactions: [] as any[],
      attachments: [
        {
          id: "att1",
          type: "image" as const,
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
          name: "photo.jpg",
        },
      ],
    },
    {
      id: "msg4",
      senderId: currentUserId,
      text: "Dimanche après-midi serait parfait pour moi. Vers 15h ?",
      timestamp: new Date(Date.now() - 1800000),
      isRead: true,
      reactions: [] as any[],
    },
    {
      id: "msg5",
      senderId: recipientId,
      text: "C'est noté pour dimanche à 15h ! Avez-vous des préférences particulières ou des questions ?",
      timestamp: new Date(Date.now() - 900000),
      isRead: false,
      reactions: [] as any[],
    },
  ]
}

// Données de test pour le calendrier
const generateAvailableDates = () => {
  const dates: { date: Date; level: "high" | "medium" | "low" | "none"; slots: number }[] = []
  const today = new Date()

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // Exclure certains jours aléatoirement
    if (Math.random() > 0.3) {
      // Déterminer le niveau de disponibilité
      let level: "high" | "medium" | "low" | "none"
      let slots: number

      const rand = Math.random()
      if (rand > 0.7) {
        level = "high"
        slots = Math.floor(Math.random() * 5) + 6 // 6-10 slots
      } else if (rand > 0.4) {
        level = "medium"
        slots = Math.floor(Math.random() * 3) + 3 // 3-5 slots
      } else {
        level = "low"
        slots = Math.floor(Math.random() * 2) + 1 // 1-2 slots
      }

      dates.push({ date, level, slots })
    }
  }

  return dates
}

// Données de test pour les créneaux horaires
const generateTimeSlots = () => {
  const slots = []
  const startHours = [10, 12, 14, 16, 18, 20, 22]

  for (let i = 0; i < startHours.length; i++) {
    const startHour = startHours[i]
    const endHour = startHour + 1
    const isAvailable = Math.random() > 0.3 // 70% de chance d'être disponible

    slots.push({
      id: `slot-${i + 1}`,
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
      isAvailable,
      isPopular: isAvailable && Math.random() > 0.7,
      isPremium: isAvailable && Math.random() > 0.8,
      isLastMinute: isAvailable && Math.random() > 0.8,
      discount: isAvailable && Math.random() > 0.8 ? Math.floor(Math.random() * 20) + 10 : undefined, // 10-30% de réduction
      remainingSpots: isAvailable ? Math.floor(Math.random() * 5) + 1 : undefined, // 1-5 places restantes
    })
  }

  return slots
}

// Données de test pour les services
const generateServices = () => [
  {
    id: "service1",
    name: "Massage relaxant (1h)",
    description: "Un massage complet du corps pour une détente profonde et une relaxation optimale.",
    duration: 60,
    price: 120,
    isPopular: true,
  },
  {
    id: "service2",
    name: "Massage sensuel (1h30)",
    description: "Une expérience sensorielle complète avec des techniques de massage érotique.",
    duration: 90,
    price: 180,
  },
  {
    id: "service3",
    name: "Massage tantrique (2h)",
    description: "Un voyage spirituel et sensuel pour éveiller votre énergie et vos sens.",
    duration: 120,
    price: 250,
  },
]

// Données de test pour les options supplémentaires
const generateAdditionalOptions = () => [
  {
    id: "option1",
    name: "Huiles essentielles premium",
    description: "Sélection d'huiles essentielles de haute qualité pour une expérience olfactive unique.",
    price: 20,
  },
  {
    id: "option2",
    name: "Ambiance musicale personnalisée",
    description: "Musique relaxante adaptée à vos préférences pour une immersion totale.",
    price: 15,
  },
  {
    id: "option3",
    name: "Bain relaxant avant le massage",
    description: "Commencez votre expérience par un bain aux sels minéraux pour préparer votre corps.",
    price: 35,
  },
]

// Données de test pour les prestataires sur la carte
const generateProviders = () => {
  const providers = []

  for (let i = 1; i <= 15; i++) {
    providers.push({
      id: `provider${i}`,
      name: `Prestataire ${i}`,
      avatar: `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0
      reviewCount: Math.floor(Math.random() * 50) + 5, // 5-55
      isVerified: Math.random() > 0.3,
      isOnline: Math.random() > 0.5,
      isPremium: Math.random() > 0.8,
      isGold: Math.random() > 0.9,
      location: {
        lat: 50.85 + (Math.random() - 0.5) * 0.1,
        lng: 4.35 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 100) + 1} Rue de Bruxelles, 1000 Bruxelles`,
      },
      services: (() => {
        const allServices = ["Massage", "Escort", "Domination", "Fétichisme", "Couple", "BDSM", "Tantrique"]
        const numServices = Math.floor(Math.random() * 3) + 1 // 1-3 services
        const shuffled = [...allServices].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, numServices)
      })(),
      distance: Math.round((Math.random() * 9 + 1) * 10) / 10, // 1.0-10.0 km
    })
  }

  return providers
}

export default function EnhancedFeaturesDemo() {
  const [activeTab, setActiveTab] = useState("messaging")
  const [messages, setMessages] = useState(generateTestMessages())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const availableDates = generateAvailableDates()
  const timeSlots = generateTimeSlots()
  const services = generateServices()
  const additionalOptions = generateAdditionalOptions()
  const providers = generateProviders()

  const handleSendMessage = (text: string, attachments?: File[], replyToMessageId?: string) => {
    const newMessage = {
      id: `msg${messages.length + 1}`,
      senderId: "user1",
      text,
      timestamp: new Date(),
      isRead: false,
      reactions: [] as any[],
      replyTo: replyToMessageId,
    }

    setMessages([...messages, newMessage])

    // Simuler une réponse après 2 secondes
    setTimeout(() => {
      const responseMessage = {
        id: `msg${messages.length + 2}`,
        senderId: "escort1",
        text: "Merci pour votre message ! Je vous réponds dès que possible.",
        timestamp: new Date(),
        isRead: false,
        reactions: [] as any[],
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((msg) => msg.id !== messageId))
  }

  const handleEditMessage = (messageId: string, newText: string) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg)))
  }

  const handleAddReaction = (messageId: string, reactionType: "like" | "love" | "dislike") => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { type: reactionType, userId: "user1", timestamp: new Date() }],
            }
          : msg,
      ),
    )
  }

  const handleBookingSubmit = (formData: any) => {
    console.log("Booking submitted:", formData)
    alert("Réservation confirmée ! Vous recevrez un email de confirmation.")
  }

  const handleSelectProvider = (provider: any) => {
    console.log("Provider selected:", provider)
  }

  const handleViewProviderProfile = (providerId: string) => {
    console.log("View profile:", providerId)
  }

  const handleBookProvider = (providerId: string) => {
    console.log("Book provider:", providerId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Fonctionnalités Améliorées</h1>
      <p className="text-muted-foreground mb-6">Démonstration des composants améliorés pour LePapasito.be</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="messaging" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messagerie</span>
          </TabsTrigger>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Réservation</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Carte</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Images</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messagerie Améliorée</CardTitle>
              <CardDescription>
                Interface de messagerie avec support pour médias enrichis, réactions, et une meilleure expérience
                utilisateur.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] border-t">
                <EnhancedChatWindow
                  recipientId="escort1"
                  recipientName="Sophia"
                  recipientAvatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg"
                  isVerified={true}
                  isOnline={true}
                  lastSeen={new Date(Date.now() - 300000)}
                  messages={messages}
                  currentUserId="user1"
                  onSendMessage={handleSendMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onEditMessage={handleEditMessage}
                  onAddReaction={handleAddReaction}
                  onTyping={() => console.log("User is typing...")}
                  onReadMessages={() => console.log("Messages marked as read")}
                  onVideoCallRequest={() => console.log("Video call requested")}
                  onAudioCallRequest={() => console.log("Audio call requested")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Système de Réservation Avancé</CardTitle>
              <CardDescription>
                Calendrier interactif, sélection de créneaux horaires et formulaire de réservation améliorés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EnhancedAvailabilityCalendar
                  availabilityData={availableDates}
                  onSelectDate={setSelectedDate}
                  selectedDate={selectedDate}
                />

                <EnhancedTimeSlots
                  date={selectedDate}
                  timeSlots={timeSlots}
                  selectedTimeSlot={selectedTimeSlot}
                  onSelectTimeSlot={setSelectedTimeSlot}
                />

                <EnhancedBookingForm
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  timeSlots={timeSlots}
                  onSubmit={handleBookingSubmit}
                  services={services}
                  additionalOptions={additionalOptions}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carte Interactive des Prestataires</CardTitle>
              <CardDescription>
                Carte interactive pour afficher les prestataires à proximité avec filtres avancés.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveProviderMap
                initialProviders={providers}
                userLocation={{ lat: 50.85, lng: 4.35 }}
                onSelectProvider={handleSelectProvider}
                onViewProviderProfile={handleViewProviderProfile}
                onBookProvider={handleBookProvider}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images Optimisées</CardTitle>
              <CardDescription>
                Composant d'image avec lazy loading avancé, préchargement intelligent et gestion des erreurs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Image standard</h3>
                  <AdvancedImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg"
                    alt="Escort"
                    width={300}
                    height={400}
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Effet de zoom</h3>
                  <AdvancedImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153704_original.jpg-XaS5TT5dzbtkRFO3Sbuz77UmaqsWZ8.jpeg"
                    alt="Escort"
                    width={300}
                    height={400}
                    className="rounded-md"
                    revealEffect="zoom"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Gestion d'erreur</h3>
                  <AdvancedImage
                    src="/invalid-image-url.jpg"
                    alt="Image invalide"
                    width={300}
                    height={400}
                    className="rounded-md"
                    fallback={
                      <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-md p-4">
                        <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Image non disponible</span>
                        <Button variant="outline" size="sm" className="mt-2">
                          Réessayer
                        </Button>
                      </div>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
