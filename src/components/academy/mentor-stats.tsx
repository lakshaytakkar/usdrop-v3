"use client"

import { Users, Star } from "lucide-react"
import { sampleCourses } from "@/app/academy/data/courses"
import { cn } from "@/lib/utils"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function MentorStats({ className }: { className?: string }) {
  const totalStudents = sampleCourses.reduce((acc, c) => acc + c.students, 0)
  const averageRating = sampleCourses.reduce((acc, c) => acc + c.rating, 0) / sampleCourses.length

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Student Count */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Users className="h-4 w-4 text-white" />
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">
          {numberFormatter.format(totalStudents)}+ Students
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <Star className="h-4 w-4 text-white fill-white" />
          </div>
        </div>
        <span className="text-sm font-medium text-slate-600">
          Rated {averageRating.toFixed(1)}/5
        </span>
      </div>
    </div>
  )
}

