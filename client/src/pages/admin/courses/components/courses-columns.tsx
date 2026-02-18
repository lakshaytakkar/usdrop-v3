

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, Star, Edit, Copy, BookOpen, CheckCircle2, X } from "lucide-react"
import { Course } from "../data/courses"


interface CreateCoursesColumnsProps {
  onViewDetails: (course: Course) => void
  onQuickView?: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
  onBuild?: (course: Course) => void
  onDuplicate?: (course: Course) => void
  onTogglePublish?: (course: Course) => void
  canEdit?: boolean
  canDelete?: boolean
  canPublish?: boolean
}

export function createCoursesColumns({
  onViewDetails,
  onQuickView,
  onEdit,
  onDelete,
  onBuild,
  onDuplicate,
  onTogglePublish,
  canEdit = true,
  canDelete = true,
  canPublish = true,
}: CreateCoursesColumnsProps): ColumnDef<Course>[] {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return [
    {
      id: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="relative w-16 h-16 rounded overflow-hidden bg-muted" onClick={(e) => e.stopPropagation()}>
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
               
                className="object-cover"
               
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      id: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <span className="font-medium" onClick={(e) => e.stopPropagation()}>{row.original.title}</span>
      ),
    },
    {
      accessorKey: "instructor_name",
      id: "instructor",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Instructor" />,
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.instructor_avatar || undefined} />
              <AvatarFallback>{getInitials(course.instructor_name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{course.instructor_name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "category",
      id: "category",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
      cell: ({ row }) => (
        <Badge variant="outline" onClick={(e) => e.stopPropagation()}>
          {row.original.category || "—"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "level",
      id: "level",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Level" />,
      cell: ({ row }) => (
        <Badge variant="secondary" onClick={(e) => e.stopPropagation()}>
          {row.original.level || "—"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "students_count",
      id: "students",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Students" />,
      cell: ({ row }) => (
        <span className="text-sm" onClick={(e) => e.stopPropagation()}>{row.original.students_count}</span>
      ),
    },
    {
      id: "modules",
      header: "Modules",
      size: 180,
      minSize: 160,
      cell: ({ row }) => {
        const course = row.original
        const moduleCount = course.modules?.length || 0
        const chapterCount = course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {moduleCount} {moduleCount === 1 ? 'Module' : 'Modules'}
            </Badge>
            <span className="text-muted-foreground/60">•</span>
            <span className="whitespace-nowrap">{chapterCount} {chapterCount === 1 ? 'Chap' : 'Chaps'}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "published",
      id: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.published ? "default" : "secondary"} onClick={(e) => e.stopPropagation()}>
          {row.original.published ? "Published" : "Unpublished"}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (!value || value.length === 0) return true
        const isPublished = value.includes("published")
        const isUnpublished = value.includes("unpublished")
        if (isPublished && !row.original.published) return false
        if (isUnpublished && row.original.published) return false
        return true
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(course)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {onBuild && (
                  <DropdownMenuItem onClick={() => onBuild(course)}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Build Course
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(course)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canPublish && onTogglePublish && (
                  <DropdownMenuItem onClick={() => onTogglePublish(course)}>
                    {course.published ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Publish
                      </>
                    )}
                  </DropdownMenuItem>
                )}
                {onDuplicate && (
                  <DropdownMenuItem onClick={() => onDuplicate(course)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {canDelete && (
                  <DropdownMenuItem onClick={() => onDelete(course)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}

