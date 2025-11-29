"use client"

import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Trash2, Star, BookOpen, Users } from "lucide-react"
import { Course } from "../data/courses"

interface CoursesTableProps {
  courses: Course[]
  selectedCourses: Course[]
  onSelectCourse: (course: Course, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onViewDetails: (course: Course) => void
  onDelete: (course: Course) => void
}

export function CoursesTable({
  courses,
  selectedCourses,
  onSelectCourse,
  onSelectAll,
  onViewDetails,
  onDelete,
}: CoursesTableProps) {
  const allSelected = courses.length > 0 && selectedCourses.length === courses.length

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Thumbnail</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Instructor</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No courses found
            </TableCell>
          </TableRow>
        ) : (
          courses.map((course) => {
            const isSelected = selectedCourses.some((c) => c.id === course.id)
            return (
              <TableRow key={course.id}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => onSelectCourse(course, checked as boolean)}
                    aria-label={`Select course ${course.id}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-muted">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-xs text-muted-foreground">{course.lessons_count} lessons</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={course.instructor_avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {course.instructor_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{course.instructor_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {course.category ? (
                    <Badge variant="outline">{course.category}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {course.level ? (
                    <Badge variant="secondary">{course.level}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{course.students_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={course.published ? "default" : "outline"}>
                    {course.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(course)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(course)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}







