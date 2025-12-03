"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  rating: number
  author: string
  text: string
  date: string
}

interface ReviewsSectionProps {
  reviews: Review[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Product Reviews from Amazon.com</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="space-y-2 pb-4 border-b last:border-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{review.author}</span>
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

















