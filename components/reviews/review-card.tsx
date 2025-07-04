"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CheckCircle, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface ReviewCardProps {
  review: {
    id: string
    authorId: string
    authorName: string
    authorAvatar?: string
    rating: number
    comment: string
    date: Date
    isVerified: boolean
    isVerifiedBooking: boolean
    helpfulCount: number
    userHasMarkedHelpful: boolean
  }
  onMarkHelpful: (reviewId: string) => void
  onReportReview: (reviewId: string) => void
}

export function ReviewCard({ review, onMarkHelpful, onReportReview }: ReviewCardProps) {
  const formattedDate = formatDistanceToNow(review.date, { addSuffix: true, locale: fr })

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.authorAvatar} alt={review.authorName} />
            <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{review.authorName}</span>
              {review.isVerified && (
                <Badge variant="verified" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </Badge>
              )}
              {review.isVerifiedBooking && (
                <Badge variant="premium" className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Réservation vérifiée
                </Badge>
              )}
            </div>
            <div className="flex items-center mb-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-7.07 3.707 1.35-7.857L.587 7.11l7.897-1.147L10 0l2.516 5.963 7.897 1.147-5.693 5.325 1.35 7.857z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">{formattedDate}</span>
            </div>
            <p className="text-sm mb-2">{review.comment}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${review.userHasMarkedHelpful ? "text-green-600" : ""}`}
          onClick={() => onMarkHelpful(review.id)}
        >
          <ThumbsUp className="h-3 w-3 mr-1" />
          Utile ({review.helpfulCount})
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => onReportReview(review.id)}
        >
          <Flag className="h-3 w-3 mr-1" />
          Signaler
        </Button>
      </CardFooter>
    </Card>
  )
}
