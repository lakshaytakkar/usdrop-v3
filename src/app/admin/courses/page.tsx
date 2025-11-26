"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createCoursesColumns } from "./components/courses-columns"
import { Course, sampleCourses } from "./data/courses"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminCoursesPage() {
  const [courses] = useState<Course[]>(sampleCourses)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedCourseForQuickView, setSelectedCourseForQuickView] = useState<Course | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set(courses.map((c) => c.category).filter(Boolean))
    return Array.from(categorySet) as string[]
  }, [courses])

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    let result = courses

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
        )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "category" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((course) => filterValues.includes(course.category || ""))
      }
      if (filter.id === "level" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        result = result.filter((course) => filterValues.includes(course.level || ""))
      }
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const filterValues = filter.value as string[]
        const isPublished = filterValues.includes("published")
        const isUnpublished = filterValues.includes("unpublished")
        result = result.filter((course) => {
          if (isPublished && !course.published) return false
          if (isUnpublished && course.published) return false
      return true
    })
      }
    })

    return result
  }, [courses, search, filters])

  // Paginate filtered courses
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredCourses.slice(start, end)
  }, [filteredCourses, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredCourses.length / pageSize))
    setInitialLoading(false)
  }, [filteredCourses.length, pageSize])

  const handleViewDetails = (course: Course) => {
    setSelectedCourseForQuickView(course)
    setQuickViewOpen(true)
  }

  const handleRowClick = (course: Course) => {
    setSelectedCourseForQuickView(course)
    setQuickViewOpen(true)
  }

  const handleDelete = (course: Course) => {
    setCourseToDelete(course)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!courseToDelete) return
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setDeleteConfirmOpen(false)
    setCourseToDelete(null)
  }

  const columns = useMemo(
    () =>
      createCoursesColumns({
        onViewDetails: handleViewDetails,
        onDelete: handleDelete,
      }),
    []
  )

  const categoryOptions = categories.map((cat) => ({
    label: cat,
    value: cat,
  }))

  const filterConfig = [
    {
      columnId: "category",
      title: "Category",
      options: categoryOptions,
    },
    {
      columnId: "level",
      title: "Level",
      options: [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
      ],
    },
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
      ],
    },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Courses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage courses and lessons
          </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading courses...</div>
            </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedCourses}
          pageCount={pageCount}
          onPaginationChange={(p, s) => {
            setPage(p)
            setPageSize(s)
          }}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search courses..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            // TODO: Handle add course
          }}
          addButtonText="Add Course"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={(selectedRows) => {
            // Handle bulk actions if needed
            console.log("Selected rows:", selectedRows)
          }}
          onRowClick={handleRowClick}
          />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {courseToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Course:</span> {courseToDelete.title}
              </p>
              {courseToDelete.students_count > 0 && (
                <p className="text-sm text-amber-600">
                  Warning: This course has {courseToDelete.students_count} enrolled students.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick View Modal */}
      {selectedCourseForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedCourseForQuickView.title}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Instructor</p>
              <p className="text-sm font-medium">{selectedCourseForQuickView.instructor_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{selectedCourseForQuickView.category || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Level</p>
              <p className="text-sm font-medium">{selectedCourseForQuickView.level || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Students</p>
              <p className="text-sm font-medium">{selectedCourseForQuickView.students_count}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">
                {selectedCourseForQuickView.published ? "Published" : "Unpublished"}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedCourseForQuickView)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}
    </div>
  )
}
