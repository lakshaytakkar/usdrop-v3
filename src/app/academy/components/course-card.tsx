"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Book, Users, Star } from "lucide-react"
import { Course } from "../data/courses"

interface CourseCardProps {
  course: Course
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

export function CourseCard({ course }: CourseCardProps) {
  const completedModules = course.modules.filter((m) => m.completed).length
  const progress = course.modules.length > 0 ? (completedModules / course.modules.length) * 100 : 0

  return (
    <Card className="flex h-full flex-col transition-transform hover:scale-[1.02]">
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
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

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
            <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{course.instructor}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
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
          <span className="text-lg font-bold text-primary">
            {course.price === 0 ? "Free" : currencyFormatter.format(course.price)}
          </span>
        </div>

        <Button className="w-full mt-2">
          {progress > 0 ? "Continue Learning" : "Start Course"}
        </Button>
      </CardContent>
    </Card>
  )
}

