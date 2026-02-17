"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  rating: number
  review: string
  createdAt: string
}

interface ReviewsTabProps {
  courseId: string
}

export function ReviewsTab({ courseId }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'date'>('date')

  // TODO: Fetch reviews from API
  // useEffect(() => {
  //   fetch(`/api/courses/${courseId}/reviews?sort=${sortBy}`)
  //     .then(res => res.json())
  //     .then(data => setReviews(data.reviews))
  // }, [courseId, sortBy])

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === 'rating' ? 'date' : 'rating')}
          >
            Sort by {sortBy === 'rating' ? 'Date' : 'Rating'}
          </Button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No reviews yet. Be the first to review this course!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar || undefined} />
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{review.userName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.review}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}







