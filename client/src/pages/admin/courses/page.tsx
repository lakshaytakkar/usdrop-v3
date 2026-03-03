import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Trash2,
  RefreshCw,
  BookOpen,
  Eye,
  EyeOff,
  MoreVertical,
  Users,
  Edit,
  FileText,
  CheckCircle2,
} from "lucide-react"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminEmptyState,
} from "@/components/admin"
import { cn } from "@/lib/utils"
import { Course } from "./data/courses"
import { Course as APICourse } from "@/types/courses"
import { transformAPICourseToAdmin } from "./utils/transform"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"

export default function AdminCoursesPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const { hasPermission: canEdit } = useHasPermission("usdrop-academy.edit")
  const { hasPermission: canCreate } = useHasPermission("usdrop-academy.create")
  const { hasPermission: canDelete } = useHasPermission("usdrop-academy.delete")
  const { hasPermission: canPublish } = useHasPermission("usdrop-academy.edit")

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusTab, setStatusTab] = useState("all")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredCourses = useMemo(() => {
    let result = courses

    if (statusTab === "published") {
      result = result.filter(c => c.published)
    } else if (statusTab === "draft") {
      result = result.filter(c => !c.published)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
      )
    }

    return result
  }, [courses, statusTab, searchQuery])

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load courses"
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      showError("You don't have permission to create courses")
      return
    }
    router.push("/admin/courses/new/builder")
  }, [canCreate, showError, router])

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

  const publishedCount = courses.filter(c => c.published).length
  const draftCount = courses.filter(c => !c.published).length
  const totalLessons = courses.reduce((sum, c) => sum + (c.modules?.reduce((s, m) => s + (m.chapters?.length || 0), 0) || 0), 0)
  const totalStudents = courses.reduce((sum, c) => sum + c.students_count, 0)

  const stats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, description: "All courses" },
    { label: "Published", value: publishedCount, icon: CheckCircle2, badgeVariant: "success" as const, description: "Live courses" },
    { label: "Draft", value: draftCount, icon: FileText, description: "Unpublished" },
    { label: "Total Enrolled", value: totalStudents, icon: Users, description: "All students" },
  ]

  const filterTabs = [
    { value: "all", label: "All", count: courses.length },
    { value: "published", label: "Published", count: publishedCount },
    { value: "draft", label: "Draft", count: draftCount },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden gap-4" data-testid="admin-courses-page">
      <AdminPageHeader
        title="Courses"
        description="Manage mentorship courses and learning content"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Courses" },
        ]}
        actions={[
          { label: "Refresh", icon: <RefreshCw className="h-4 w-4" />, onClick: fetchCourses, variant: "outline" },
          { label: "Create Course", icon: <Plus className="h-4 w-4" />, onClick: handleCreate, disabled: !canCreate },
        ]}
      />

      <AdminStatCards stats={stats} loading={initialLoading} columns={4} />

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCourses} className="mt-2 cursor-pointer" data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <AdminFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search courses..."
        tabs={filterTabs}
        activeTab={statusTab}
        onTabChange={setStatusTab}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        {initialLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader size="sm" />
              <span>Loading courses...</span>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <AdminEmptyState
            icon={BookOpen}
            title="No courses found"
            description={searchQuery || statusTab !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first course"}
            actionLabel={!searchQuery && statusTab === "all" ? "Create Course" : undefined}
            onAction={!searchQuery && statusTab === "all" ? handleCreate : undefined}
          />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-sm">
                  <TableHead className="px-4">Course</TableHead>
                  <TableHead className="px-3">Modules</TableHead>
                  <TableHead className="px-3">Lessons</TableHead>
                  <TableHead className="px-3">Enrolled</TableHead>
                  <TableHead className="px-3">Status</TableHead>
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && !initialLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j} className="px-3">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  filteredCourses.map(course => {
                    const moduleCount = course.modules?.length || 0
                    const lessonCount = course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0

                    return (
                      <TableRow
                        key={course.id}
                        className="text-sm h-14 group cursor-pointer hover:bg-gray-50/50"
                        onClick={() => handleEdit(course)}
                        data-testid={`row-course-${course.id}`}
                      >
                        <TableCell className="px-4">
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
                        </TableCell>
                        <TableCell className="px-3">
                          <span className="text-sm" data-testid={`text-modules-${course.id}`}>{moduleCount}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className="text-sm" data-testid={`text-lessons-${course.id}`}>{lessonCount}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm" data-testid={`text-enrolled-${course.id}`}>{course.students_count}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <Badge
                            variant={course.published ? "default" : "secondary"}
                            className="text-xs"
                            data-testid={`badge-status-${course.id}`}
                          >
                            {course.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 cursor-pointer"
                                data-testid={`button-actions-${course.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(course)} className="cursor-pointer" data-testid={`action-edit-${course.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Open Builder
                              </DropdownMenuItem>
                              {canPublish && (
                                <DropdownMenuItem onClick={() => handleTogglePublish(course)} className="cursor-pointer" data-testid={`action-publish-${course.id}`}>
                                  {course.published ? (
                                    <><EyeOff className="h-4 w-4 mr-2" />Unpublish</>
                                  ) : (
                                    <><Eye className="h-4 w-4 mr-2" />Publish</>
                                  )}
                                </DropdownMenuItem>
                              )}
                              {canDelete && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDelete(course)} className="text-red-600 cursor-pointer" data-testid={`action-delete-${course.id}`}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

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
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer" data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer" data-testid="button-confirm-delete">
              {actionLoading === "delete" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
