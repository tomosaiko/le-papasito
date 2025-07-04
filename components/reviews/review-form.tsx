"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface ReviewFormProps {
  onSubmitReview: (rating: number, comment: string) => void
  isVerifiedBooking: boolean
}

export function ReviewForm({ onSubmitReview, isVerifiedBooking }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Veuillez sélectionner une note")
      return
    }

    if (comment.trim().length < 10) {
      setError("Veuillez écrire un commentaire d'au moins 10 caractères")
      return
    }

    setError(null)
    onSubmitReview(rating, comment)

    // Réinitialiser le formulaire
    setRating(0)
    setComment("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laisser un avis</CardTitle>
        <CardDescription>
          Partagez votre expérience avec cette escorte
          {isVerifiedBooking && " (Réservation vérifiée)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Votre note</Label>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className="p-1"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <svg
                  className={`h-6 w-6 ${i < (hoveredRating || rating) ? "text-yellow-500" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.07 3.707 1.35-7.857L.587 7.11l7.897-1.147L10 0l2.516 5.963 7.897 1.147-5.693 5.325 1.35 7.857z"
                  />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0 ? `${rating} étoile${rating > 1 ? "s" : ""}` : "Sélectionnez une note"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Votre commentaire</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec cette escorte..."
            className="min-h-[120px]"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
          Publier l'avis
        </Button>
      </CardFooter>
    </Card>
  )
}
