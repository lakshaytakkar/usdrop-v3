import { apiFetch } from '@/lib/supabase'
import { useState, useCallback, useEffect } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Eye, EyeOff, Trash2, Users } from "lucide-react"
import { PageShell, PageHeader, DataTable, StatusBadge, type Column, type RowAction } from "@/components/admin-shared"
import { Course } from "./data/courses"
import { Course as APICourse } from "@/types/courses"
import { transformAPICourseToAdmin } from "./utils/transform"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminCoursesPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const { hasPermission: canCreate } = useHasPermission("usdrop-academy.create")
  const { hasPermission: canDelete } = useHasPermission("usdrop-academy.delete")
  const { hasPermission: canPublish } = useHasPermission("usdrop-academy.edit")

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/courses?pageSize=1000`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch courses')
      }
      const data = await response.json()
      const transformedCourses = data.courses.map((apiCourse: APICourse) =>
        transformAPICourseToAdmin(apiCourse)
      )
      setCourses(transformedCourses)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleEdit = useCallback((course: Course) => {
    router.push(`/admin/courses/${course.id}/builder`)
  }, [router])

  const handleDelete = useCallback((course: Course) => {
    if (!canDelete) {
      showError("You don't have permission to delete courses")
      return
    }
    setCourseToDelete(course)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!courseToDelete) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete course')
      }
      setDeleteConfirmOpen(false)
      showSuccess(`Course "${courseToDelete.title}" deleted`)
      setCourseToDelete(null)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete course")
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublish = useCallback(async (course: Course) => {
    if (!canPublish) {
      showError("You don't have permission to publish/unpublish courses")
      return
    }
    try {
      const response = await apiFetch(`/api/admin/courses/${course.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !course.published }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update course')
      }
      showSuccess(`Course ${!course.published ? "published" : "unpublished"}`)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update course")
    }
  }, [canPublish, showSuccess, showError, fetchCourses])

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Course",
      sortable: true,
      render: (course) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-7 rounded overflow-hidden bg-muted shrink-0">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate" data-testid={`text-course-title-${course.id}`}>{course.title}</p>
            {course.category && (
              <p className="text-xs text-muted-foreground">{course.category}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "level",
      header: "Level",
      sortable: true,
      render: (course) => (
        <span className="text-sm text-muted-foreground">{course.level || "—"}</span>
      ),
    },
    {
      key: "lessons_count",
      header: "Lessons",
      sortable: true,
      render: (course) => {
        const lessonCount = course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0
        return <span className="text-sm" data-testid={`text-lessons-${course.id}`}>{lessonCount}</span>
      },
    },
    {
      key: "duration",
      header: "Duration",
      render: (course) => (
        <span className="text-sm text-muted-foreground">{course.duration || "—"}</span>
      ),
    },
    {
      key: "students_count",
      header: "Enrolled",
      sortable: true,
      render: (course) => (
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm" data-testid={`text-enrolled-${course.id}`}>{course.students_count}</span>
        </div>
      ),
    },
    {
      key: "published",
      header: "Status",
      render: (course) => (
        <StatusBadge status={course.published ? "Published" : "Draft"} />
      ),
    },
  ]

  const rowActions: RowAction<Course>[] = [
    {
      label: "Open Builder",
      onClick: handleEdit,
    },
    {
      label: "Toggle Publish",
      onClick: (course) => handleTogglePublish(course),
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Courses"
        subtitle="Manage mentorship courses and learning content"
        actions={
          <Button onClick={() => router.push("/admin/courses/new/builder")} disabled={!canCreate} data-testid="button-create-course">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        }
      />

      <DataTable
        data={courses}
        columns={columns}
        searchPlaceholder="Search courses..."
        searchKey="title"
        rowActions={rowActions}
        onRowClick={handleEdit}
        isLoading={loading}
        emptyTitle="No courses found"
        emptyDescription="Get started by creating your first course"
        filters={[
          {
            label: "Status",
            key: "published",
            options: ["true", "false"],
          },
        ]}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>This will permanently delete this course and all its content. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {courseToDelete && (
            <div className="py-2">
              <p className="text-sm"><span className="font-medium">Course:</span> {courseToDelete.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {courseToDelete.modules?.length || 0} modules, {courseToDelete.modules?.reduce((s, m) => s + (m.chapters?.length || 0), 0) || 0} lessons
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} data-testid="button-confirm-delete">
              {actionLoading === "delete" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
