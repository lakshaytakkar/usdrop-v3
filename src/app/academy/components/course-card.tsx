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
      <CardContent className="flex flex-1 flex-col gap-2 p-2.5">
        <div>
          <h3 className="text-sm font-semibold mb-0.5 line-clamp-2 leading-tight">{course.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{course.description}</p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Book className="h-2.5 w-2.5" />
            <span>{course.lessons}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <Users className="h-2.5 w-2.5" />
            <span>{numberFormatter.format(course.students)}</span>
          </div>
        </div>

        {progress > 0 && (
          <div>
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-1.5 border-t">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{course.rating}</span>
          </div>
          <span
            className="inline-flex items-center justify-center rounded-full font-semibold px-1.5 py-0.5 text-[10px]"
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
            size="sm"
            className={cn(
              "w-full text-xs h-7 font-mono uppercase cursor-pointer relative",
              isLocked && "opacity-60"
            )}
            onClick={handleStartCourse}
            disabled={isLocked}
          >
            {progress > 0 ? (
              <>
                <PlayCircle className="h-3 w-3" />
                Continue
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                Start
              </>
            )}
          </Button>
          {isLocked && (
            <div 
              className="absolute inset-0 z-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center gap-1.5 cursor-pointer font-mono uppercase text-xs font-medium"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
              onClick={handleStartCourse}
            >
              <Lock className="h-3 w-3" />
              Locked
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

