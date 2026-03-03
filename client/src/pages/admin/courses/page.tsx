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
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Copy,
  Edit,
  RefreshCw,
  Download,
  X,
  BookOpen,
  Eye,
  EyeOff,
  MoreVertical,
  Users,
  LayoutGrid,
  List,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { AdminCourseCard } from "./components/admin-course-card"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminActionBar,
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
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusTab, setStatusTab] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [detailCourse, setDetailCourse] = useState<Course | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

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
        (c.instructor_name && c.instructor_name.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
      )
    }

    return result
  }, [courses, statusTab, searchQuery])

  const pageCount = Math.ceil(filteredCourses.length / pageSize)
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredCourses.slice(start, start + pageSize)
  }, [filteredCourses, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusTab])

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.append("pageSize", "1000")
      const response = await apiFetch(`/api/admin/courses?${params.toString()}`)
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

  const handleBuild = useCallback((course: Course) => {
    router.push(`/admin/courses/${course.id}/builder`)
  }, [router])

  const handleEdit = useCallback((course: Course) => {
    if (!canEdit) {
      showError("You don't have permission to edit courses")
      return
    }
    handleBuild(course)
  }, [canEdit, showError, handleBuild])

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
    setBulkActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete course')
      }
      setDeleteConfirmOpen(false)
      const name = courseToDelete.title
      setCourseToDelete(null)
      showSuccess(`Course "${name}" deleted successfully`)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete course")
    } finally {
      setBulkActionLoading(null)
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
        throw new Error(errorData.error || 'Failed to update course publish status')
      }
      showSuccess(`Course ${!course.published ? "published" : "unpublished"} successfully`)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update course")
    }
  }, [canPublish, showSuccess, showError, fetchCourses])

  const handleDuplicate = useCallback(async (course: Course) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const duplicatedCourse: Course = {
        ...course,
        id: `course_${Date.now()}`,
        title: `${course.title} (Copy)`,
        slug: `${course.slug}-copy-${Date.now()}`,
        published: false,
        published_at: null,
        students_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        modules: course.modules?.map(m => ({
          ...m,
          id: `module_${Date.now()}_${Math.random()}`,
          course_id: `course_${Date.now()}`,
          chapters: m.chapters?.map(ch => ({
            ...ch,
            id: `chapter_${Date.now()}_${Math.random()}`,
            module_id: `module_${Date.now()}_${Math.random()}`,
          }))
        }))
      }
      setCourses((prev) => [...prev, duplicatedCourse])
      showSuccess(`Course "${course.title}" duplicated successfully`)
      await fetchCourses()
    } catch {
      showError("Failed to duplicate course")
    }
  }, [showSuccess, showError, fetchCourses])

  const handleViewDetails = useCallback((course: Course) => {
    setDetailCourse(course)
    setDetailOpen(true)
  }, [])

  const toggleSelect = (courseId: string) => {
    setSelectedCourses(prev => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
      } else {
        next.add(courseId)
      }
      return next
    })
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(new Set(paginatedCourses.map(c => c.id)))
    } else {
      setSelectedCourses(new Set())
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCourses.size === 0 || !canDelete) return
    setBulkActionLoading("bulk-delete")
    try {
      const promises = Array.from(selectedCourses).map(id =>
        apiFetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
      )
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      if (failed > 0) throw new Error(`${failed} course(s) failed to delete`)
      const count = selectedCourses.size
      setSelectedCourses(new Set())
      showSuccess(`${count} course(s) deleted successfully`)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete courses")
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkPublish = async (publish: boolean) => {
    if (selectedCourses.size === 0 || !canPublish) return
    const actionKey = publish ? "bulk-publish" : "bulk-unpublish"
    setBulkActionLoading(actionKey)
    try {
      const promises = Array.from(selectedCourses).map(id =>
        apiFetch(`/api/admin/courses/${id}/publish`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ published: publish }),
        })
      )
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      if (failed > 0) throw new Error(`${failed} course(s) failed to ${publish ? 'publish' : 'unpublish'}`)
      const count = selectedCourses.size
      setSelectedCourses(new Set())
      showSuccess(`${count} course(s) ${publish ? 'published' : 'unpublished'} successfully`)
      await fetchCourses()
    } catch (err) {
      showError(err instanceof Error ? err.message : `Failed to ${publish ? 'publish' : 'unpublish'} courses`)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleExport = useCallback(() => {
    const toExport = selectedCourses.size > 0
      ? courses.filter(c => selectedCourses.has(c.id))
      : courses
    try {
      const csv = [
        ["ID", "Title", "Instructor", "Category", "Level", "Students", "Modules", "Chapters", "Status"],
        ...toExport.map(c => [
          c.id,
          c.title,
          c.instructor_name,
          c.category || "",
          c.level || "",
          c.students_count.toString(),
          (c.modules?.length || 0).toString(),
          (c.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0).toString(),
          c.published ? "Published" : "Draft",
        ]),
      ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `courses-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${toExport.length} course(s) to CSV`)
    } catch {
      showError("Failed to export courses")
    }
  }, [courses, selectedCourses, showSuccess, showError])

  const publishedCount = courses.filter(c => c.published).length
  const draftCount = courses.filter(c => !c.published).length
  const totalStudents = courses.reduce((sum, c) => sum + c.students_count, 0)

  const stats = [
    { label: "Total Courses", value: courses.length, icon: BookOpen, description: "All courses in catalog" },
    { label: "Published", value: publishedCount, icon: CheckCircle2, badge: publishedCount > 0 ? `${Math.round((publishedCount / Math.max(courses.length, 1)) * 100)}%` : undefined, badgeVariant: "success" as const, description: "Live courses" },
    { label: "Draft", value: draftCount, icon: FileText, description: "Unpublished courses" },
    { label: "Total Enrolled", value: totalStudents, icon: Users, description: "Students across all courses" },
  ]

  const filterTabs = [
    { value: "all", label: "All", count: courses.length },
    { value: "published", label: "Published", count: publishedCount },
    { value: "draft", label: "Draft", count: draftCount },
  ]

  const allPageSelected = paginatedCourses.length > 0 && paginatedCourses.every(c => selectedCourses.has(c.id))

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
          { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport, variant: "outline" },
          { label: "Refresh", icon: <RefreshCw className="h-4 w-4" />, onClick: fetchCourses, variant: "outline" },
          { label: "Create Course", icon: <Plus className="h-4 w-4" />, onClick: handleCreate, disabled: !canCreate },
        ]}
      />

      <AdminStatCards stats={stats} loading={initialLoading} columns={4} />

      {selectedCourses.size > 0 && (
        <AdminActionBar
          selectedCount={selectedCourses.size}
          onClearSelection={() => setSelectedCourses(new Set())}
          actions={[
            {
              label: bulkActionLoading === "bulk-publish" ? "Publishing..." : "Publish",
              icon: <CheckCircle2 className="h-4 w-4" />,
              onClick: () => handleBulkPublish(true),
              disabled: !canPublish || bulkActionLoading !== null,
            },
            {
              label: bulkActionLoading === "bulk-unpublish" ? "Unpublishing..." : "Unpublish",
              icon: <X className="h-4 w-4" />,
              onClick: () => handleBulkPublish(false),
              disabled: !canPublish || bulkActionLoading !== null,
            },
            {
              label: "Export",
              icon: <Download className="h-4 w-4" />,
              onClick: handleExport,
            },
            {
              label: bulkActionLoading === "bulk-delete" ? "Deleting..." : "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: handleBulkDelete,
              variant: "destructive",
              disabled: !canDelete || bulkActionLoading !== null,
            },
          ]}
        />
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchCourses} className="mt-2" data-testid="button-retry">
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
      >
        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            data-testid="button-view-table"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            data-testid="button-view-grid"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </AdminFilterBar>

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
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedCourses.map(course => (
              <AdminCourseCard
                key={course.id}
                course={course}
                onEdit={handleEdit}
                onBuild={handleBuild}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onTogglePublish={handleTogglePublish}
                canEdit={canEdit}
                canDelete={canDelete}
                canPublish={canPublish}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-sm">
                  <TableHead className="w-12 px-3">
                    <Checkbox
                      checked={allPageSelected}
                      onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                      aria-label="Select all"
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead className="px-3">Course</TableHead>
                  <TableHead className="px-3">Instructor</TableHead>
                  <TableHead className="px-3">Modules</TableHead>
                  <TableHead className="px-3">Chapters</TableHead>
                  <TableHead className="px-3">Status</TableHead>
                  <TableHead className="px-3">Enrolled</TableHead>
                  <TableHead className="px-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="px-3">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginatedCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCourses.map(course => {
                    const moduleCount = course.modules?.length || 0
                    const chapterCount = course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0
                    const isSelected = selectedCourses.has(course.id)

                    return (
                      <TableRow
                        key={course.id}
                        className={cn("text-sm h-16 group", isSelected && "bg-primary/5")}
                        data-testid={`row-course-${course.id}`}
                      >
                        <TableCell className="px-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleSelect(course.id)}
                            aria-label={`Select ${course.title}`}
                            data-testid={`checkbox-course-${course.id}`}
                          />
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-9 rounded-md overflow-hidden bg-muted shrink-0">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={course.instructor_avatar || undefined} />
                              <AvatarFallback className="text-xs">
                                {course.instructor_name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm truncate">{course.instructor_name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3">
                          <Badge variant="outline" className="text-xs" data-testid={`text-modules-${course.id}`}>
                            {moduleCount} {moduleCount === 1 ? 'Module' : 'Modules'}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className="text-sm text-muted-foreground" data-testid={`text-chapters-${course.id}`}>
                            {chapterCount} {chapterCount === 1 ? 'Chapter' : 'Chapters'}
                          </span>
                        </TableCell>
                        <TableCell className="px-3">
                          <Badge
                            variant={course.published ? "default" : "secondary"}
                            data-testid={`badge-status-${course.id}`}
                          >
                            {course.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm" data-testid={`text-enrolled-${course.id}`}>{course.students_count}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                data-testid={`button-actions-${course.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(course)} data-testid={`action-view-${course.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canEdit && (
                                <DropdownMenuItem onClick={() => handleEdit(course)} data-testid={`action-edit-${course.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleBuild(course)} data-testid={`action-build-${course.id}`}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Open Builder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {canPublish && (
                                <DropdownMenuItem onClick={() => handleTogglePublish(course)} data-testid={`action-publish-${course.id}`}>
                                  {course.published ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-2" />
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
                              <DropdownMenuItem onClick={() => handleDuplicate(course)} data-testid={`action-duplicate-${course.id}`}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {canDelete && (
                                <DropdownMenuItem onClick={() => handleDelete(course)} className="text-destructive" data-testid={`action-delete-${course.id}`}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
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

      {!initialLoading && filteredCourses.length > 0 && (
        <div className="shrink-0 flex items-center justify-between border-t pt-3">
          <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredCourses.length)} of {filteredCourses.length} courses
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {pageCount || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={bulkActionLoading === "delete"}
              data-testid="button-confirm-delete"
            >
              {bulkActionLoading === "delete" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {detailCourse && (
        <Dialog
          open={detailOpen}
          onOpenChange={(open) => {
            setDetailOpen(open)
            if (!open) setDetailCourse(null)
          }}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader className="pb-3 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  {detailCourse.thumbnail ? (
                    <img src={detailCourse.thumbnail} alt={detailCourse.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base" data-testid="text-detail-title">{detailCourse.title}</DialogTitle>
                  <DialogDescription className="text-xs mt-0.5">{detailCourse.instructor_name}</DialogDescription>
                </div>
                <Badge variant={detailCourse.published ? "default" : "secondary"}>
                  {detailCourse.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <span className="text-sm font-medium">{detailCourse.category || "Uncategorized"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Level</span>
                  <span className="text-sm font-medium">{detailCourse.level || "Not set"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Students Enrolled</span>
                  <span className="text-sm font-medium">{detailCourse.students_count}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Modules / Chapters</span>
                  <span className="text-sm font-medium">
                    {detailCourse.modules?.length || 0} / {detailCourse.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0}
                  </span>
                </div>
                {detailCourse.rating && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{detailCourse.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Price</span>
                  <span className="text-sm font-medium">${detailCourse.price.toFixed(2)}</span>
                </div>
              </div>
              {detailCourse.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm line-clamp-3">{detailCourse.description}</p>
                </div>
              )}
            </div>
            <DialogFooter className="pt-3 border-t gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBuild(detailCourse)} data-testid="button-detail-build">
                <BookOpen className="h-4 w-4 mr-2" />
                Open Builder
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEdit(detailCourse)} data-testid="button-detail-edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
