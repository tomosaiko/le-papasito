import type { Review, ReviewSummary } from "@/types"

export const reviews: Review[] = [
  {
    id: "review1",
    escortId: "escort1",
    userId: "user1",
    rating: 5,
    comment: "Sophie est incroyable! Très professionnelle et attentionnée. Je recommande vivement.",
    verified: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "review2",
    escortId: "escort1",
    userId: "user2",
    rating: 4,
    comment: "Très bonne expérience. Sophie est charmante et à l'écoute.",
    verified: true,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
  },
  {
    id: "review3",
    escortId: "escort2",
    userId: "user1",
    rating: 5,
    comment: "Léa est exceptionnelle! Un moment inoubliable.",
    verified: true,
    createdAt: new Date("2023-05-25"),
    updatedAt: new Date("2023-05-25"),
  },
  {
    id: "review4",
    escortId: "escort1",
    userId: "user3",
    rating: 3,
    comment: "Bonne prestation mais un peu pressée.",
    verified: false,
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    id: "review5",
    escortId: "escort2",
    userId: "user4",
    rating: 4,
    comment: "Très agréable et professionnelle.",
    verified: true,
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-05"),
  },
]

export function getEscortReviews(escortId: string): Review[] {
  return reviews
    .filter((review) => review.escortId === escortId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getEscortReviewSummary(escortId: string): ReviewSummary {
  const escortReviews = getEscortReviews(escortId)

  if (escortReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }
  }

  const totalRating = escortReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / escortReviews.length

  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }

  escortReviews.forEach((review) => {
    ratingDistribution[review.rating as 1 | 2 | 3 | 4 | 5]++
  })

  return {
    averageRating,
    totalReviews: escortReviews.length,
    ratingDistribution,
  }
}
