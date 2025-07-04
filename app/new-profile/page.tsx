"use client"

import { useState } from "react"
import { SwipeableProfileCard } from "@/components/swipeable-profile-card/swipeable-profile-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart, X } from "lucide-react"

// Sample profiles data
const profiles = [
  {
    id: "1",
    name: "Sophie",
    age: 28,
    location: "Paris",
    bio: "Passionate about art, travel, and good food. Looking for someone to explore the city with.",
    imageUrl: "/elegant-woman-portrait.png",
    tags: ["Art", "Travel", "Foodie"],
  },
  {
    id: "2",
    name: "Emma",
    age: 25,
    location: "Lyon",
    bio: "Yoga instructor and nature lover. I enjoy hiking and meditation.",
    imageUrl: "/serene-yoga-pose.png",
    tags: ["Yoga", "Nature", "Meditation"],
  },
  {
    id: "3",
    name: "Camille",
    age: 30,
    location: "Marseille",
    bio: "Professional photographer with a passion for capturing beautiful moments. Love the beach and sunset walks.",
    imageUrl: "/focused-photographer.png",
    tags: ["Photography", "Beach", "Sunset"],
  },
  {
    id: "4",
    name: "Léa",
    age: 26,
    location: "Bordeaux",
    bio: "Wine enthusiast and sommelier. Let's share a glass and good conversation.",
    imageUrl: "/refined-sommelier.png",
    tags: ["Wine", "Food", "Culture"],
  },
  {
    id: "5",
    name: "Chloé",
    age: 29,
    location: "Nice",
    bio: "Fashion designer who loves the Mediterranean lifestyle. Passionate about swimming and sailing.",
    imageUrl: "/confident-designer.png",
    tags: ["Fashion", "Swimming", "Sailing"],
  },
]

export default function NewProfilePage() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const { toast } = useToast()

  const handleSwipeLeft = (profile: any) => {
    toast({
      title: "Profile Dismissed",
      description: `You've dismissed ${profile.name}'s profile.`,
      variant: "destructive",
    })

    // Move to next profile after animation completes
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length)
    }, 300)
  }

  const handleSwipeRight = (profile: any) => {
    setFavorites((prev) => [...prev, profile.id])

    toast({
      title: "Added to Favorites!",
      description: `You've added ${profile.name} to your favorites.`,
      variant: "default",
    })

    // Move to next profile after animation completes
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length)
    }, 300)
  }

  const handleSwipeUp = (profile: any) => {
    toast({
      title: "Super Like!",
      description: `You've super liked ${profile.name}!`,
      variant: "default",
    })

    // Move to next profile after animation completes
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length)
    }, 300)
  }

  const currentProfile = profiles[currentProfileIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Discover Profiles</h1>

        <div className="mb-6">
          <SwipeableProfileCard
            profile={currentProfile}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeUp={handleSwipeUp}
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full p-6"
            onClick={() => handleSwipeLeft(currentProfile)}
          >
            <X className="h-8 w-8 text-red-500" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full p-6"
            onClick={() => handleSwipeRight(currentProfile)}
          >
            <Heart className="h-8 w-8 text-green-500" />
          </Button>
        </div>

        {favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Your Favorites ({favorites.length})</h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map((id) => {
                const profile = profiles.find((p) => p.id === id)
                return profile ? (
                  <div key={id} className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1">
                    <img
                      src={profile.imageUrl || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm">{profile.name}</span>
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Swipe left to dismiss, right to like, or up to super like</p>
        </div>
      </div>
    </div>
  )
}
