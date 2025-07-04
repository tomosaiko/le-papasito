"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star, MapPin, Phone, Calendar, Clock, Heart } from "lucide-react"

export default async function EscortDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { dictionary } = useLanguage();
  const [activeTab, setActiveTab] = useState("photos");
  
  // Sample data for escort
  const escort = {
    id: Number.parseInt(id),
    name: "Sophia",
    age: 25,
    city: "Paris",
    rating: 4.9,
    reviews: 42,
    isVip: true,
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    services: [
      "Dinner Dates",
      "Weekend Getaways",
      "Travel Companion",
      "Events & Parties"
    ],
    languages: ["French", "English", "Spanish"],
    availability: "Monday to Sunday, 10:00 - 22:00",
    photos: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
    videos: [
      "/placeholder.svg?height=400&width=300",
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                {escort.isVip && <TabsTrigger value="videos">Videos</TabsTrigger>}
              </TabsList>
              <TabsContent value="photos" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {escort.photos.map((photo, index) => (
                    <div key={index} className={index === 0 ? "col-span-2" : ""}>
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`${escort.name} - Photo ${index + 1}`}
                        width={index === 0 ? 800 : 400}
                        height={index === 0 ? 600 : 600}
                        className="w-full rounded-lg object-cover"
                        style={{ height: index === 0 ? "500px" : "300px" }}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="videos" className="mt-4">
                <div className="grid grid-cols-1 gap-4">
                  {escort.videos.map((video, index) => (
                    <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Video {index + 1}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Info */}
          <div>
            <Card className="bg-secondary border-border mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">{escort.name}, {escort.age}</h1>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{escort.city}</span>
                    </div>
                  </div>
                  {escort.isVip && (
                    <div className="bg-gold-DEFAULT text-black px-3 py-1 rounded-full text-xs font-bold">
                      VIP
                    </div>
                  )}
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-gold-DEFAULT mr-1" />
                    <span className="font-semibold">{escort.rating}</span>
                    <span className="text-muted-foreground ml-1">({escort.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">About Me</h2>
                    <p className="text-muted-foreground">{escort.bio}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Services</h2>
                    <div className="flex flex-wrap gap-2">
                      {escort.services.map((service, index) => (
                        <span key={index} className="bg-background px-3 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                      {escort.languages.map((language, index) => (
                        <span key={index} className="bg-background px-3 py-1 rounded-full text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Availability</h2>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{escort.availability}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Button className="w-full bg-gold-DEFAULT hover:bg-gold-dark text-black">
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Button>
              
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
