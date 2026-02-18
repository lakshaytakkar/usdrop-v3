


import { TopRatedBadge } from "./top-rated-badge"
import { cn } from "@/lib/utils"

export function MentorVisualCard({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[3/4] w-full", className)}>
      {/* Top Rated Badge - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <TopRatedBadge />
      </div>

      {/* Mentor Portrait Image */}
      <img
        src="/images/mentor-portrait.png"
        alt="Mr. Suprans - Head Mentor & Strategist"
       
        className="object-cover object-center rounded-xl"
       
       
      />
    </div>
  )
}

