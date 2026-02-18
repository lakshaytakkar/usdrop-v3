

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  rating: number
  author: string
  text: string
  date: string
}

interface ReviewsSectionProps {
  reviews?: Review[]
}

const defaultReviews: Review[] = [
  {
    rating: 5,
    author: "John D.",
    text: "This LED helmet display is a game-changer for night riding. The visibility is incredible and the customization options are endless. Highly recommend for safety-conscious riders!",
    date: "2 weeks ago"
  },
  {
    rating: 5,
    author: "Sarah M.",
    text: "Love how easy it is to program custom messages. The installation was straightforward and the build quality feels solid. My friends are all asking where I got it!",
    date: "1 month ago"
  },
  {
    rating: 5,
    author: "Mike T.",
    text: "Best safety investment I've made for my motorcycle. The brake warning feature is particularly useful. Great product at a reasonable price.",
    date: "3 weeks ago"
  }
]

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const displayReviews = reviews && reviews.length > 0 ? reviews : defaultReviews

  return (
    <Card className="p-6 min-w-0">
      <div className="space-y-4 min-w-0">
        {displayReviews.map((review, index) => (
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


























