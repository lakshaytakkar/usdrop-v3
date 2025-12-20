"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Book, Users, Star, Play, PlayCircle, Lock } from "lucide-react"
import { Course } from "../data/courses"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  course: Course
  isLocked?: boolean
  onLockedClick?: () => void
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function CourseCard({ course, isLocked = false, onLockedClick }: CourseCardProps) {
  const router = useRouter()
  const completedModules = course.modules.filter((m) => m.completed).length
  const progress = course.modules.length > 0 ? (completedModules / course.modules.length) * 100 : 0

  const handleStartCourse = () => {
    if (isLocked) {
      onLockedClick?.()
      return
    }
    router.push(`/academy/${course.id}`)
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {course.featured && (
          <div className="absolute top-2 left-2">
            <Badge>Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold mb-1 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Book className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{numberFormatter.format(course.students)}</span>
          </div>
        </div>

        {progress > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{course.rating}</span>
          </div>
          <span
            className="inline-flex items-center justify-center rounded-full font-semibold px-2 py-0.5 text-xs"
            style={{
              background: "linear-gradient(135deg, #facc15 0%, #fbbf24 25%, #f59e0b 50%, #fbbf24 75%, #facc15 100%)",
              color: "#fef9c3",
              border: "1px solid rgba(253, 224, 71, 0.6)",
            }}
          >
            Included
          </span>
        </div>

        <div className="relative">
          <Button 
            className={cn(
              "w-full mt-2 font-mono uppercase cursor-pointer relative",
              isLocked && "opacity-60"
            )}
            onClick={handleStartCourse}
            disabled={isLocked}
          >
            {progress > 0 ? (
              <>
                <PlayCircle className="h-4 w-4" />
                Continue Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start Session
              </>
            )}
          </Button>
          {isLocked && (
            <div 
              className="absolute inset-0 z-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center gap-2 cursor-pointer font-mono uppercase text-sm font-medium"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              onClick={handleStartCourse}
            >
              <Lock className="h-4 w-4" />
              Locked
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

