"use client"

import { useState } from "react"
import { ReviewSummary } from "@/components/reviews/review-summary"
import { ReviewFilters } from "@/components/reviews/review-filters"
import { ReviewCard } from "@/components/reviews/review-card"
import { ReviewForm } from "@/components/reviews/review-form"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Données de test pour les avis
const generateMockReviews = () => {
  const reviews = []
  const names = ["Jean", "Marie", "Pierre", "Sophie", "Thomas", "Julie", "Nicolas", "Emma", "Lucas", "Camille"]
  const comments = [
    "Une expérience incroyable, je recommande vivement !",
    "Très professionnelle et attentionnée, un moment agréable.",
    "Pas tout à fait ce à quoi je m'attendais, mais globalement satisfait.",
    "Excellente prestation, je reviendrai sans hésiter.",
    "Un peu déçu par rapport aux photos, mais le service était correct.",
    "Parfait du début à la fin, une vraie perle rare.",
    "Très belle rencontre, à la hauteur de mes attentes.",
    "Moment de qualité, personne très sympathique et accueillante.",
    "Prestation moyenne, pourrait faire mieux.",
    "Une rencontre exceptionnelle que je n'oublierai pas de sitôt.",
  ]

  for (let i = 0; i < 15; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomComment = comments[Math.floor(Math.random() * comments.length)]
    const randomRating = Math.floor(Math.random() * 3) + 3 // 3-5 étoiles pour être réaliste
    const randomDate = new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000) // 0-90 jours

    reviews.push({
      id: `review-${i + 1}`,
      authorId: `user-${i + 1}`,
      authorName: randomName,
      authorAvatar: undefined,
      rating: randomRating,
      comment: randomComment,
      date: randomDate,
      isVerified: Math.random() > 0.3, // 70% de chance d'être vérifié
      isVerifiedBooking: Math.random() > 0.5, // 50% de chance d'être une réservation vérifiée
      helpfulCount: Math.floor(Math.random() * 20),
      userHasMarkedHelpful: false,
    })
  }

  return reviews
}

export default function ReviewsPage({ params }: { params: { id: string } }) {
  const [reviews, setReviews] = useState(generateMockReviews())
  const [filters, setFilters] = useState({
    sortBy: "recent",
    minRating: 0,
    verifiedOnly: false,
  })

  // Données de test pour l'escorte
  const escort = {
    id: params.id,
    name: "Sophia",
    age: 25,
    location: "Paris, France",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amber-taiwanese-escort-in-osaka-11153696_original.jpg-yvmHBbYNTvuWGXdcpYJN2RKpgECY4X.jpeg",
    isVerified: true,
  }

  // Calculer les statistiques des avis
  const calculateReviewStats = () => {
    const totalReviews = reviews.length
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++
    })

    const verifiedCount = reviews.filter((review) => review.isVerified).length
    const verifiedPercentage = totalReviews > 0 ? Math.round((verifiedCount / totalReviews) * 100) : 0

    return {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
      verifiedReviewsPercentage: verifiedPercentage,
    }
  }

  const stats = calculateReviewStats()

  // Filtrer et trier les avis
  const filteredReviews = reviews
    .filter((review) => {
      if (filters.verifiedOnly && !review.isVerified) return false
      if (review.rating < filters.minRating) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "recent":
          return b.date.getTime() - a.date.getTime()
        case "oldest":
          return a.date.getTime() - b.date.getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpfulCount - a.helpfulCount
        default:
          return 0
      }
    })

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleMarkHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          const userHasMarkedHelpful = !review.userHasMarkedHelpful
          return {
            ...review,
            helpfulCount: userHasMarkedHelpful ? review.helpfulCount + 1 : review.helpfulCount - 1,
            userHasMarkedHelpful,
          }
        }
        return review
      }),
    )
  }

  const handleReportReview = (reviewId: string) => {
    console.log("Review reported:", reviewId)
    // Ici, vous implémenteriez la logique pour signaler un avis
  }

  const handleSubmitReview = (rating: number, comment: string) => {
    const newReview = {
      id: `review-${reviews.length + 1}`,
      authorId: "current-user",
      authorName: "Vous",
      authorAvatar: undefined,
      rating,
      comment,
      date: new Date(),
      isVerified: true,
      isVerifiedBooking: true,
      helpfulCount: 0,
      userHasMarkedHelpful: false,
    }

    setReviews([newReview, ...reviews])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={escort.avatar} alt={escort.name} />
            <AvatarFallback>{escort.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {escort.name}, {escort.age}
              </h1>
              {escort.isVerified && (
                <Badge variant="verified" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{escort.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span>
                  {stats.averageRating.toFixed(1)} ({stats.totalReviews} avis)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/escorts/${escort.id}`} className="text-purple-600 hover:underline flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour au profil
          </Link>
        </div>
        <h2 className="text-xl font-semibold">Avis sur {escort.name}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="space-y-6">
            <ReviewSummary
              averageRating={stats.averageRating}
              totalReviews={stats.totalReviews}
              ratingDistribution={stats.ratingDistribution}
              verifiedReviewsPercentage={stats.verifiedReviewsPercentage}
            />
            <ReviewForm onSubmitReview={handleSubmitReview} isVerifiedBooking={true} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <ReviewFilters onFilterChange={handleFilterChange} />

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-secondary rounded-lg">
              <p className="text-muted-foreground">Aucun avis ne correspond à vos critères de filtrage.</p>
              <Button
                variant="link"
                onClick={() => setFilters({ sortBy: "recent", minRating: 0, verifiedOnly: false })}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div>
              {filteredReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onMarkHelpful={handleMarkHelpful}
                  onReportReview={handleReportReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
