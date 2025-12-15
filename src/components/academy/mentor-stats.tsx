"use client"

import { Users, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function MentorStats({ className }: { className?: string }) {
  const [totalStudents, setTotalStudents] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/courses?published=true')
        if (response.ok) {
          const data = await response.json()
          const courses = data.courses || []
          const students = courses.reduce((acc: number, c: any) => acc + (c.students_count || 0), 0)
          const ratings = courses.filter((c: any) => c.rating).map((c: any) => c.rating)
          const avgRating = ratings.length > 0 
            ? ratings.reduce((acc: number, r: number) => acc + r, 0) / ratings.length 
            : 0
          setTotalStudents(students)
          setAverageRating(avgRating)
        }
      } catch (error) {
        console.error("Failed to fetch course stats:", error)
      }
    }
    fetchStats()
  }, [])

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



