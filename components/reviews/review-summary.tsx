import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  verifiedReviewsPercentage: number
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  verifiedReviewsPercentage,
}: ReviewSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avis clients</CardTitle>
        <CardDescription>
          Basé sur {totalReviews} avis, dont {verifiedReviewsPercentage}% vérifiés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}`}
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
            <p className="text-sm text-muted-foreground">{totalReviews} avis au total</p>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage =
              totalReviews > 0
                ? Math.round((ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100)
                : 0

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="w-12 text-sm">{rating} étoiles</div>
                <Progress value={percentage} className="h-2 flex-1" />
                <div className="w-8 text-sm text-right">{percentage}%</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
