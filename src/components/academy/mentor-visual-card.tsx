"use client"

import Image from "next/image"
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
      <Image
        src="/images/mentor-portrait.png"
        alt="Mr. Suprans - Head Mentor & Strategist"
        fill
        className="object-cover object-center rounded-xl"
        sizes="(max-width: 768px) 100vw, 40vw"
        priority
      />
    </div>
  )
}

