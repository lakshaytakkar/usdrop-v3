"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SortingState, ColumnFiltersState } from "@tanstack/react-table"
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
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Plus, Trash2, CheckCircle2, Star, Copy, Edit, RefreshCw, Download, X, UserPlus, BookOpen } from "lucide-react"
import { AdminCourseCard } from "./components/admin-course-card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Course } from "./data/courses"
import { Course as APICourse } from "@/types/courses"
import { transformAPICourseToAdmin } from "./utils/transform"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { PageAssigneeModal } from "@/components/ui/page-assignee-modal"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import Image from "next/image"

export default function AdminCoursesPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("usdrop-academy.view")
  const { hasPermission: canEdit } = useHasPermission("usdrop-academy.edit")
  const { hasPermission: canCreate } = useHasPermission("usdrop-academy.create")
  const { hasPermission: canDelete } = useHasPermission("usdrop-academy.delete")
  const { hasPermission: canPublish } = useHasPermission("usdrop-academy.edit") // Using edit permission for publish
  
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [statusTab, setStatusTab] = useState<"all" | "published" | "draft" | "archived">("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  const categories = useMemo(() => {
    const categorySet = new Set(courses.map((c) => c.category).filter(Boolean))
    return Array.from(categorySet) as string[]
  }, [courses])

  const handleSaveAssignees = (owner: string | null, members: string[]) => {
    setAssignedOwner(owner)
    setAssignedMembers(members)
    showSuccess("Assignees updated successfully")
  }

  // Get status counts for tabs
  const getStatusCount = useCallback((tab: typeof statusTab) => {
    switch (tab) {
      case "all":
        return courses.length
      case "published":
        return courses.filter(c => c.published).length
      case "draft":
        return courses.filter(c => !c.published).length
      case "archived":
        return 0 // Placeholder for future archived feature
      default:
        return 0
    }
  }, [courses])

  // Quick filters
  const quickFilters = [
    { id: "published", label: "Published", count: 0 },
    { id: "featured", label: "Featured", count: 0 },
    { id: "draft", label: "Draft", count: 0 },
  ]

  // Filter courses based on search, filters, status tab, date range, and quick filters
  const filteredCourses = useMemo(() => {
    let result = courses

    // Status tab filter
    if (statusTab !== "all") {
      switch (statusTab) {
        case "published":
          result = result.filter(c => c.published)
          break
        case "draft":
          result = result.filter(c => !c.published)
          break
        case "archived":
          // Future implementation for archived courses
          result = []
          break
      }
    }

    // Date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((course) => {
        const courseDate = new Date(course.created_at)
        if (dateRange.from && courseDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (courseDate > toDate) return false
        }
        return true
      })
    }

    // Quick filter
    if (quickFilter) {
      switch (quickFilter) {
        case "published":
          result = result.filter(c => c.published)
          break
        case "featured":
          result = result.filter(c => c.featured)
          break
        case "draft":
          result = result.filter(c => !c.published)
          break
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter((course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        (course.instructor_name && course.instructor_name.toLowerCase().includes(searchLower)) ||
        (course.category && course.category.toLowerCase().includes(searchLower))
      )
    }

    // Column filters
    columnFilters.forEach((filter) => {
      if (!filter.value) return
      
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return

      if (filter.id === "category") {
        result = result.filter((course) => filterValues.includes(course.category || ""))
      }
      
      if (filter.id === "level") {
        result = result.filter((course) => filterValues.includes(course.level || ""))
      }

      if (filter.id === "status") {
        const isPublished = filterValues.includes("published")
        const isUnpublished = filterValues.includes("unpublished")
        if (isPublished) result = result.filter(c => c.published)
        if (isUnpublished) result = result.filter(c => !c.published)
      }
    })

    return result
  }, [courses, searchQuery, columnFilters, statusTab, quickFilter, dateRange])

  // Apply sorting
  const sortedCourses = useMemo(() => {
    if (!sorting || sorting.length === 0) {
      return filteredCourses
    }

    const sorted = [...filteredCourses]
    sorting.forEach((sort) => {
      const { id, desc } = sort
      sorted.sort((a, b) => {
        let aValue: any
        let bValue: any

        switch (id) {
          case "title":
            aValue = a.title.toLowerCase()
            bValue = b.title.toLowerCase()
            break
          case "instructor":
            aValue = a.instructor_name.toLowerCase()
            bValue = b.instructor_name.toLowerCase()
            break
          case "category":
            aValue = (a.category || "").toLowerCase()
            bValue = (b.category || "").toLowerCase()
            break
          case "level":
            aValue = (a.level || "").toLowerCase()
            bValue = (b.level || "").toLowerCase()
            break
          case "students":
            aValue = a.students_count
            bValue = b.students_count
            break
          case "rating":
            aValue = a.rating || 0
            bValue = b.rating || 0
            break
          case "price":
            aValue = a.price
            bValue = b.price
            break
          case "status":
            aValue = a.published ? 1 : 0
            bValue = b.published ? 1 : 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return desc ? 1 : -1
        if (aValue > bValue) return desc ? -1 : 1
        return 0
      })
    })

    return sorted
  }, [filteredCourses, sorting])

  // Paginate sorted courses
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedCourses.slice(start, end)
  }, [sortedCourses, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(sortedCourses.length / pageSize))
    setInitialLoading(false)
  }, [sortedCourses.length, pageSize])

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append("pageSize", "1000") // Get all courses for admin
      
      const response = await fetch(`/api/admin/courses?${params.toString()}`)
      
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
      console.error("Error fetching courses:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load courses. Please try again."
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

  const handleViewDetails = useCallback((course: Course) => {
    setSelectedCourse(course)
    setDetailDrawerOpen(true)
  }, [])

  const handleQuickView = useCallback((course: Course) => {
    setSelectedCourse(course)
    setQuickViewOpen(true)
  }, [])

  const handleBuild = useCallback((course: Course) => {
    router.push(`/admin/courses/${course.id}/builder`)
  }, [router])

  const handleEdit = useCallback((course: Course) => {
    if (!canEdit) {
      showError("You don't have permission to edit courses")
      return
    }
    // TODO: Open edit modal or navigate to builder
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
      const response = await fetch(`/api/admin/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete course')
      }
      
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setSelectedCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setDeleteConfirmOpen(false)
      const deletedCourseName = courseToDelete.title
      setCourseToDelete(null)
      showSuccess(`Course "${deletedCourseName}" deleted successfully`)
      await fetchCourses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete course"
      showError(errorMessage)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) return
    if (!canDelete) {
      showError("You don't have permission to delete courses")
      return
    }
    setBulkActionLoading("bulk-delete")
    try {
      const promises = selectedCourses.map(course =>
        fetch(`/api/admin/courses/${course.id}`, {
          method: 'DELETE',
        })
      )
      
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      
      if (failed > 0) {
        throw new Error(`${failed} course(s) failed to delete`)
      }
      
      const deletedCount = selectedCourses.length
      setSelectedCourses([])
      showSuccess(`${deletedCount} course(s) deleted successfully`)
      await fetchCourses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete courses"
      showError(errorMessage)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkPublish = async () => {
    if (selectedCourses.length === 0) return
    if (!canPublish) {
      showError("You don't have permission to publish courses")
      return
    }
    setBulkActionLoading("bulk-publish")
    try {
      const promises = selectedCourses.map(course =>
        fetch(`/api/admin/courses/${course.id}/publish`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            published: true,
          }),
        })
      )
      
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      
      if (failed > 0) {
        throw new Error(`${failed} course(s) failed to publish`)
      }
      
      setSelectedCourses([])
      showSuccess(`${selectedCourses.length} course(s) published successfully`)
      await fetchCourses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish courses"
      showError(errorMessage)
    } finally {
      setBulkActionLoading(null)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedCourses.length === 0) return
    if (!canPublish) {
      showError("You don't have permission to unpublish courses")
      return
    }
    setBulkActionLoading("bulk-unpublish")
    try {
      const promises = selectedCourses.map(course =>
        fetch(`/api/admin/courses/${course.id}/publish`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            published: false,
          }),
        })
      )
      
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      
      if (failed > 0) {
        throw new Error(`${failed} course(s) failed to unpublish`)
      }
      
      setSelectedCourses([])
      showSuccess(`${selectedCourses.length} course(s) unpublished successfully`)
      await fetchCourses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unpublish courses"
      showError(errorMessage)
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
      const response = await fetch(`/api/admin/courses/${course.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !course.published,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update course publish status')
      }
      
      showSuccess(`Course ${!course.published ? "published" : "unpublished"} successfully`)
      await fetchCourses()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update course"
      showError(errorMessage)
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
    } catch (err) {
      showError("Failed to duplicate course")
    }
  }, [showSuccess, showError, fetchCourses])

  const handleCreate = useCallback(() => {
    if (!canCreate) {
      showError("You don't have permission to create courses")
      return
    }
    // TODO: Open create modal or navigate to builder
    router.push("/admin/courses/new/builder")
  }, [canCreate, showError, router])

  const handleBulkExport = useCallback(() => {
    if (selectedCourses.length === 0) {
      showError("No courses selected for export")
      return
    }
    try {
      const csv = [
        ["Course ID", "Title", "Instructor", "Category", "Level", "Students", "Rating", "Price", "Status"],
        ...selectedCourses.map((course) => [
          course.id,
          course.title,
          course.instructor_name,
          course.category || "",
          course.level || "",
          course.students_count.toString(),
          course.rating?.toFixed(1) || "",
          course.price.toFixed(2),
          course.published ? "Published" : "Draft",
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `selected-courses-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${selectedCourses.length} course(s) to CSV`)
    } catch (err) {
      showError("Failed to export courses")
    }
  }, [selectedCourses, showSuccess, showError])

  const handleRowClick = useCallback((course: Course) => {
    setSelectedCourse(course)
    setQuickViewOpen(true)
  }, [])


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

  const secondaryButtons = useMemo(() => {
    if (selectedCourses.length > 0) {
      return [
        {
          label: bulkActionLoading === "bulk-publish" ? "Publishing..." : "Publish Selected",
          icon: bulkActionLoading === "bulk-publish" ? <Loader size="sm" className="mr-2" /> : <CheckCircle2 className="h-4 w-4" />,
          onClick: handleBulkPublish,
          variant: "outline" as const,
          disabled: !canPublish || bulkActionLoading !== null,
          tooltip: !canPublish ? "You don't have permission to publish courses" : undefined,
        },
        {
          label: bulkActionLoading === "bulk-unpublish" ? "Unpublishing..." : "Unpublish Selected",
          icon: bulkActionLoading === "bulk-unpublish" ? <Loader size="sm" className="mr-2" /> : <X className="h-4 w-4" />,
          onClick: handleBulkUnpublish,
          variant: "outline" as const,
          disabled: !canPublish || bulkActionLoading !== null,
          tooltip: !canPublish ? "You don't have permission to unpublish courses" : undefined,
        },
        {
          label: "Export Selected",
          icon: <Download className="h-4 w-4" />,
          onClick: handleBulkExport,
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "bulk-delete" ? "Deleting..." : "Delete Selected",
          icon: bulkActionLoading === "bulk-delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: handleBulkDelete,
          variant: "destructive" as const,
          disabled: !canDelete || bulkActionLoading !== null,
          tooltip: !canDelete ? "You don't have permission to delete courses" : undefined,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedCourses([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return []
    }
  }, [selectedCourses, bulkActionLoading, canPublish, canDelete, handleBulkPublish, handleBulkUnpublish, handleBulkDelete, handleBulkExport])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground leading-[1.35]">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage mentorship courses</p>
        </div>
      </div>

      {!initialLoading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Courses</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{courses.length}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">All courses in catalog</span>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Published</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{courses.filter(c => c.published).length}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Published courses</span>
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Draft</span>
              <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
                <Edit className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-1">
              <span className="text-2xl font-semibold">{courses.filter(c => !c.published).length}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">Draft courses</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader size="sm" />
            <span>Loading courses...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Status Tabs */}
          <div className="mb-3">
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
              <TabsList className="h-9">
                <TabsTrigger value="all">
                  All
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("all")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="published">
                  Published
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("published")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="draft">
                  Draft
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("draft")}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full sm:w-[140px] flex-shrink-0 text-sm"
              />
              {quickFilters.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={quickFilter ? "default" : "outline"}
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {quickFilters.map((filter) => (
                      <DropdownMenuItem
                        key={filter.id}
                        onClick={() => setQuickFilter(quickFilter === filter.id ? null : filter.id)}
                        className={cn(
                          "cursor-pointer",
                          quickFilter === filter.id && "bg-accent"
                        )}
                      >
                        <span>{filter.label}</span>
                        {quickFilter === filter.id && (
                          <Check className="h-4 w-4 ml-auto" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    {quickFilter && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setQuickFilter(null)}
                          className="cursor-pointer"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Filter
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {secondaryButtons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || "outline"}
                  size="sm"
                  onClick={button.onClick}
                  disabled={button.disabled}
                  className="h-8"
                >
                  {button.icon}
                  {button.label}
                </Button>
              ))}
              <Button
                onClick={handleCreate}
                size="sm"
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>

          {/* Grid View */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {initialLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader size="sm" />
                  <span>Loading courses...</span>
                </div>
              </div>
            ) : paginatedCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No courses found</p>
                <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedCourses.map((course) => (
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
            )}
          </div>

          {/* Pagination */}
          {!initialLoading && paginatedCourses.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, sortedCourses.length)} of {sortedCourses.length} courses
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {pageCount}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick View Modal */}
      {selectedCourse && (
        <Dialog 
          open={quickViewOpen} 
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedCourse(null)
            }
          }}
        >
          <DialogContent className="max-w-md p-4">
            <DialogHeader className="pb-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {selectedCourse.thumbnail ? (
                    <Image
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-base truncate">{selectedCourse.title}</DialogTitle>
                  <DialogDescription className="text-xs truncate">{selectedCourse.instructor_name}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Category</span>
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  {selectedCourse.category || "—"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Level</span>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {selectedCourse.level || "—"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Students</span>
                <span className="text-xs font-medium">{selectedCourse.students_count}</span>
              </div>
              {selectedCourse.rating && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{selectedCourse.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant={selectedCourse.published ? "default" : "outline"} className="text-xs px-2 py-0.5">
                  {selectedCourse.published ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Published
                    </>
                  ) : (
                    "Draft"
                  )}
                </Badge>
              </div>
            </div>
            <DialogFooter className="pt-3 border-t mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedCourse)
                }}
                className="w-full text-sm h-8"
              >
                View More Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Detail Drawer */}
      {selectedCourse && (
        <DetailDrawer
          open={detailDrawerOpen}
          onOpenChange={setDetailDrawerOpen}
          title={selectedCourse.title}
          tabs={[
            {
              value: "overview",
              label: "Overview",
              content: (
                <div className="space-y-6">
                  {selectedCourse.thumbnail && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={selectedCourse.thumbnail}
                        alt={selectedCourse.title}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedCourse.instructor_avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {selectedCourse.instructor_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{selectedCourse.instructor_name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline">{selectedCourse.category || "—"}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Level</p>
                      <Badge variant="secondary">{selectedCourse.level || "—"}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={selectedCourse.published ? "default" : "outline"}>
                        {selectedCourse.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Students</p>
                      <p className="text-lg font-semibold">{selectedCourse.students_count}</p>
                    </div>
                    {selectedCourse.rating && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-lg font-semibold">{selectedCourse.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-lg font-semibold">${selectedCourse.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="text-lg font-semibold">{selectedCourse.duration || "—"}</p>
                    </div>
                  </div>
                  {selectedCourse.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{selectedCourse.description}</p>
                    </div>
                  )}
                  {selectedCourse.learning_objectives && selectedCourse.learning_objectives.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Learning Objectives</p>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedCourse.learning_objectives.map((objective, idx) => (
                          <li key={idx} className="text-sm">{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedCourse.tags && selectedCourse.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "structure",
              label: "Structure",
              content: (
                <div className="space-y-4">
                  {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCourse.modules.map((module, moduleIdx) => (
                        <div key={module.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                              {moduleIdx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{module.title}</h3>
                              {module.description && (
                                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                              )}
                            </div>
                            {module.duration && (
                              <Badge variant="outline" className="text-xs">
                                {module.duration}
                              </Badge>
                            )}
                          </div>
                          {module.chapters && module.chapters.length > 0 && (
                            <div className="ml-11 space-y-2">
                              {module.chapters.map((chapter, chapterIdx) => (
                                <div key={chapter.id} className="flex items-center gap-2 text-sm">
                                  <span className="text-muted-foreground w-6">{chapterIdx + 1}.</span>
                                  <span className="flex-1">{chapter.title}</span>
                                  {chapter.duration && (
                                    <span className="text-xs text-muted-foreground">{chapter.duration}</span>
                                  )}
                                  {chapter.is_preview && (
                                    <Badge variant="outline" className="text-xs">Preview</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No modules added yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBuild(selectedCourse)}
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Build Course Structure
                      </Button>
                    </div>
                  )}
                </div>
              ),
            },
            {
              value: "students",
              label: "Students",
              content: (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Student management will be available here</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedCourse.students_count} Enrolled</Badge>
                  </div>
                </div>
              ),
            },
          ]}
          headerActions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleBuild(selectedCourse)}>
                <BookOpen className="h-4 w-4 mr-2" />
                Build
              </Button>
              {canDelete && (
                <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedCourse)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          }
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

      {/* Add Assignee Modal */}
      <PageAssigneeModal
        open={assigneeModalOpen}
        onOpenChange={setAssigneeModalOpen}
        internalUsers={internalUsers}
        assignedOwner={assignedOwner}
        assignedMembers={assignedMembers}
        onSave={handleSaveAssignees}
      />
    </div>
  )
}
