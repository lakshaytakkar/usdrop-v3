"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { MoreVertical, Eye, Trash2, Star } from "lucide-react"
import { Course } from "../data/courses"
import Image from "next/image"

interface CreateCoursesColumnsProps {
  onViewDetails: (course: Course) => void
  onDelete: (course: Course) => void
}

export function createCoursesColumns({
  onViewDetails,
  onDelete,
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "thumbnail",
      header: "Thumbnail",
      cell: ({ row }) => {
        const course = row.original
        return (
          <div className="relative w-16 h-16 rounded overflow-hidden bg-muted" onClick={(e) => e.stopPropagation()}>
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                sizes="64px"
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
          </div>
        )
      },
    },
  ]
}

