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
import { Plus, Trash2, CheckCircle2, Star, Copy, Edit, RefreshCw, Download, X, UserPlus, Search, BookOpen, AlertCircle } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createCoursesColumns } from "./components/courses-columns"
import { Course, sampleCourses } from "./data/courses"
import { QuickViewModal } from "@/components/ui/quick-view-modal"
import { DetailDrawer } from "@/components/ui/detail-drawer"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Loader } from "@/components/ui/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { sampleInternalUsers } from "@/app/admin/internal-users/data/users"
import { Input } from "@/components/ui/input"
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
  
  const [courses, setCourses] = useState<Course[]>(sampleCourses)
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
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const internalUsers = sampleInternalUsers

  const categories = useMemo(() => {
    const categorySet = new Set(courses.map((c) => c.category).filter(Boolean))
    return Array.from(categorySet) as string[]
  }, [courses])

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return internalUsers
    const searchLower = memberSearch.toLowerCase()
    return internalUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }, [memberSearch, internalUsers])
  
  // Available members (excluding owner and already selected members)
  const availableMembers = useMemo(() => {
    return filteredMembers.filter(
      (user) => user.id !== tempOwner && !tempMembers.includes(user.id)
    )
  }, [filteredMembers, tempOwner, tempMembers])

  const handleOpenAssigneeModal = () => {
    setTempOwner(assignedOwner)
    setTempMembers([...assignedMembers])
    setMemberSearch("")
    setAssigneeModalOpen(true)
  }
  
  const handleSaveAssignees = () => {
    setAssignedOwner(tempOwner)
    setAssignedMembers(tempMembers)
    setAssigneeModalOpen(false)
    showSuccess("Assignees updated successfully")
  }
  
  const handleAddMember = (memberId: string) => {
    if (!tempMembers.includes(memberId)) {
      setTempMembers([...tempMembers, memberId])
    }
    setMemberSearch("")
  }
  
  const handleRemoveMember = (memberId: string) => {
    setTempMembers(tempMembers.filter(id => id !== memberId))
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
    { id: "published", label: "Published", icon: CheckCircle2 },
    { id: "featured", label: "Featured", icon: Star },
    { id: "draft", label: "Draft", icon: AlertCircle },
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
      // TODO: Replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCourses(sampleCourses)
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setSelectedCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id))
      setDeleteConfirmOpen(false)
      const deletedCourseName = courseToDelete.title
      setCourseToDelete(null)
      showSuccess(`Course "${deletedCourseName}" deleted successfully`)
      await fetchCourses()
    } catch (err) {
      showError("Failed to delete course")
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const deletedCount = selectedCourses.length
      setCourses((prev) => prev.filter((c) => !selectedCourses.some((sc) => sc.id === c.id)))
      setSelectedCourses([])
      showSuccess(`${deletedCount} course(s) deleted successfully`)
      await fetchCourses()
    } catch (err) {
      showError("Failed to delete courses")
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCourses((prev) =>
        prev.map((c) =>
          selectedCourses.some((sc) => sc.id === c.id)
            ? { ...c, published: true, published_at: new Date().toISOString() }
            : c
        )
      )
      setSelectedCourses([])
      showSuccess(`${selectedCourses.length} course(s) published successfully`)
      await fetchCourses()
    } catch (err) {
      showError("Failed to publish courses")
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCourses((prev) =>
        prev.map((c) =>
          selectedCourses.some((sc) => sc.id === c.id)
            ? { ...c, published: false, published_at: null }
            : c
        )
      )
      setSelectedCourses([])
      showSuccess(`${selectedCourses.length} course(s) unpublished successfully`)
      await fetchCourses()
    } catch (err) {
      showError("Failed to unpublish courses")
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
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCourses((prev) =>
        prev.map((c) =>
          c.id === course.id
            ? { 
                ...c, 
                published: !c.published,
                published_at: !c.published ? new Date().toISOString() : null
              }
            : c
        )
      )
      showSuccess(`Course ${!course.published ? "published" : "unpublished"} successfully`)
      await fetchCourses()
    } catch (err) {
      showError("Failed to update course")
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

  const columns = useMemo(
    () =>
      createCoursesColumns({
        onViewDetails: handleViewDetails,
        onQuickView: handleQuickView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onBuild: handleBuild,
        onDuplicate: handleDuplicate,
        onTogglePublish: handleTogglePublish,
        canEdit,
        canDelete,
        canPublish,
      }),
    [
      handleViewDetails,
      handleQuickView,
      handleEdit,
      handleDelete,
      handleBuild,
      handleDuplicate,
      handleTogglePublish,
      canEdit,
      canDelete,
      canPublish,
    ]
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
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Courses</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage courses and curriculum
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {assignedOwner || assignedMembers.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {assignedOwner && (() => {
                  const owner = internalUsers.find(u => u.id === assignedOwner)
                  return (
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                      <AvatarFallback className="text-xs">
                        {owner?.name.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })()}
                {assignedMembers.slice(0, 3).map((memberId) => {
                  const member = internalUsers.find(u => u.id === memberId)
                  return (
                    <Avatar key={memberId} className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                      <AvatarFallback className="text-xs">
                        {member?.name.charAt(0) || "M"}
                      </AvatarFallback>
                    </Avatar>
                  )
                })}
                {assignedMembers.length > 3 && (
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">+{assignedMembers.length - 3}</span>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenAssigneeModal}
                className="whitespace-nowrap cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleOpenAssigneeModal}
              className="whitespace-nowrap cursor-pointer"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Assignee
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCourses}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading courses...</div>
        </div>
      ) : (
        <>
          {/* Status Tabs */}
          <div className="mb-3">
            <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as typeof statusTab)}>
              <TabsList className="h-9">
                <TabsTrigger value="all" className="cursor-pointer">
                  All
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("all")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="published" className="cursor-pointer">
                  Published
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("published")}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="draft" className="cursor-pointer">
                  Draft
                  <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                    {getStatusCount("draft")}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* DataTable */}
          <div className="flex-1 overflow-hidden min-h-0">
            <DataTable
              columns={columns}
              data={paginatedCourses}
              pageCount={pageCount}
              onPaginationChange={(p, s) => {
                setPage(p)
                setPageSize(s)
              }}
              onSortingChange={setSorting}
              onFilterChange={setColumnFilters}
              onSearchChange={setSearchQuery}
              loading={loading}
              initialLoading={initialLoading}
              filterConfig={filterConfig}
              searchPlaceholder="Search courses..."
              page={page}
              pageSize={pageSize}
              enableRowSelection={true}
              onRowSelectionChange={setSelectedCourses}
              onRowClick={handleRowClick}
              onDateRangeChange={setDateRange}
              quickFilters={quickFilters}
              selectedQuickFilter={quickFilter}
              onQuickFilterChange={(filterId) => setQuickFilter(quickFilter === filterId ? null : filterId)}
              secondaryButtons={secondaryButtons}
              onAdd={handleCreate}
              addButtonText="Add Course"
              addButtonIcon={<Plus className="h-4 w-4" />}
            />
          </div>
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
          <DialogContent className="max-w-xs p-4">
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
                className="w-full text-sm h-8 cursor-pointer"
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
                        className="mt-4 cursor-pointer"
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
      <Dialog open={assigneeModalOpen} onOpenChange={setAssigneeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Page Access Control</DialogTitle>
            <DialogDescription>
              Manage ownership and access for this page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Owner Section */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={tempOwner || ""} onValueChange={setTempOwner}>
                <SelectTrigger id="owner" className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {internalUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The owner is responsible for maintaining this page
              </p>
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <Label htmlFor="members">Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-start"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {memberSearch || "Search users to add..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Search users..." 
                      value={memberSearch}
                      onValueChange={setMemberSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {availableMembers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.id}
                            onSelect={() => handleAddMember(user.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                                <AvatarFallback className="text-xs">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Selected Members */}
              {tempMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tempMembers.map((memberId) => {
                    const member = internalUsers.find(u => u.id === memberId)
                    if (!member) return null
                    return (
                      <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                          <AvatarFallback className="text-xs">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                        <button
                          onClick={() => handleRemoveMember(memberId)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignees} className="cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
