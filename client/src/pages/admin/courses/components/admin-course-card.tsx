


import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Edit, Users, Eye, EyeOff, Trash2 } from "lucide-react"
import { Course } from "../data/courses"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

export function AdminCourseCard({
  course,
  onEdit,
  onBuild,
  onViewDetails,
  onDelete,
  onTogglePublish,
  canEdit = true,
  canDelete = true,
  canPublish = true,
}: AdminCourseCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
           
            className="object-cover"
           
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {course.featured && (
          <div className="absolute top-1.5 left-1.5">
            <Badge className="text-xs px-1.5 py-0">Featured</Badge>
          </div>
        )}
        <div className="absolute top-1.5 right-1.5">
          <Badge variant={course.published ? "default" : "secondary"} className="text-xs px-1.5 py-0">
            {course.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold line-clamp-2 leading-tight">{course.title}</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1.5 border-t">
          <Users className="h-3.5 w-3.5" />
          <span>{course.students_count} Enrolled</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-1 p-2 pt-0 border-t">
        {canPublish && onTogglePublish && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onTogglePublish(course)}
                className="h-8 w-8"
              >
                {course.published ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{course.published ? "Unpublish Course" : "Publish Course"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {canEdit && onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(course)}
                className="h-8 w-8"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Content</p>
            </TooltipContent>
          </Tooltip>
        )}
        {onViewDetails && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onViewDetails(course)}
                className="h-8 w-8"
              >
                <Users className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Enrolled Students</p>
            </TooltipContent>
          </Tooltip>
        )}
        {onBuild && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onBuild(course)}
                className="h-8 w-8"
              >
                <BookOpen className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Build Course</p>
            </TooltipContent>
          </Tooltip>
        )}
        {canDelete && onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(course)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Course</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  )
}
