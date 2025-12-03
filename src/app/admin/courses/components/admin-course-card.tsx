"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Star, Edit, MoreVertical } from "lucide-react"
import { Course } from "../data/courses"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminCourseCardProps {
  course: Course
  onEdit?: (course: Course) => void
  onBuild?: (course: Course) => void
  onViewDetails?: (course: Course) => void
  onDelete?: (course: Course) => void
  onDuplicate?: (course: Course) => void
  onTogglePublish?: (course: Course) => void
  canEdit?: boolean
  canDelete?: boolean
  canPublish?: boolean
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

export function AdminCourseCard({
  course,
  onEdit,
  onBuild,
  onViewDetails,
  onDelete,
  onDuplicate,
  onTogglePublish,
  canEdit = true,
  canDelete = true,
  canPublish = true,
}: AdminCourseCardProps) {
  const moduleCount = course.modules?.length || 0
  const chapterCount = course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0

  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(course)}>
                  View Details
                </DropdownMenuItem>
              )}
              {onBuild && (
                <DropdownMenuItem onClick={() => onBuild(course)}>
                  Build Course
                </DropdownMenuItem>
              )}
              {canEdit && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  Edit
                </DropdownMenuItem>
              )}
              {canPublish && onTogglePublish && (
                <DropdownMenuItem onClick={() => onTogglePublish(course)}>
                  {course.published ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(course)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {canDelete && onDelete && (
                <DropdownMenuItem onClick={() => onDelete(course)} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {course.featured && (
          <div className="absolute top-2 left-2">
            <Badge>Featured</Badge>
          </div>
        )}
        {!course.published && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary">Draft</Badge>
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
            <AvatarImage src={course.instructor_avatar || undefined} alt={course.instructor_name} />
            <AvatarFallback>{course.instructor_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{course.instructor_name}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {course.category && (
            <Badge variant="outline">{course.category}</Badge>
          )}
          {course.level && (
            <Badge variant="secondary">{course.level}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{moduleCount} Modules</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{chapterCount} Chapters</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{numberFormatter.format(course.students_count)}</span>
          </div>
        </div>

        {course.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {onBuild && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onBuild(course)}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Build
          </Button>
        )}
        {canEdit && onEdit && (
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onEdit(course)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

