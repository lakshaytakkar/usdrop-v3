"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Check, Lock, Search, X, Copy, Eye, EyeOff, RefreshCw, Download, Edit, MoreVertical, UserPlus, Upload, AlertCircle } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createInternalUsersColumns } from "./components/internal-users-columns"
import { InternalUser, InternalUserRole, UserStatus } from "@/types/admin/users"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  generateSecurePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  getPasswordStrengthProgress,
} from "@/lib/utils/password"
import { Loader } from "@/components/ui/loader"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AdminInternalUsersPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()
  
  // Permission checks
  const { hasPermission: canView } = useHasPermission("internal_users.view")
  const { hasPermission: canEdit } = useHasPermission("internal_users.edit")
  const { hasPermission: canDelete } = useHasPermission("internal_users.delete")
  const { hasPermission: canSuspend } = useHasPermission("internal_users.suspend")
  const { hasPermission: canActivate } = useHasPermission("internal_users.activate")
  
  const [users, setUsers] = useState<InternalUser[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [selectedRoleTab, setSelectedRoleTab] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<InternalUser | null>(null)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [userToSuspend, setUserToSuspend] = useState<InternalUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedUserForQuickView, setSelectedUserForQuickView] = useState<InternalUser | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<InternalUser[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "executive" as InternalUserRole,
    status: "active" as UserStatus,
    phoneNumber: "",
    username: "",
    avatarUrl: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [assigneeModalOpen, setAssigneeModalOpen] = useState(false)
  const [assignedOwner, setAssignedOwner] = useState<string | null>(null)
  const [assignedMembers, setAssignedMembers] = useState<string[]>([])
  const [memberSearch, setMemberSearch] = useState("")
  const [tempOwner, setTempOwner] = useState<string | null>(null)
  const [tempMembers, setTempMembers] = useState<string[]>([])

  const roles = useMemo(() => ["superadmin", "admin", "manager", "executive"], [])
  
  const internalUsersForAssignee = users
  
  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return internalUsersForAssignee
    const searchLower = memberSearch.toLowerCase()
    return internalUsersForAssignee.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }, [memberSearch, internalUsersForAssignee])
  
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

  // Calculate role counts
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    roles.forEach((role) => {
      counts[role] = users.filter((u) => u.role === role).length
    })
    counts.all = users.length
    return counts
  }, [users, roles])

  // Filter users based on search, filters, role tab, date range, and quick filters
  const filteredUsers = useMemo(() => {
    let result = users

    // Apply role tab filter
    if (selectedRoleTab && selectedRoleTab !== "all") {
      result = result.filter((user) => user.role === selectedRoleTab)
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((user) => {
        const userDate = new Date(user.createdAt)
        if (dateRange.from && userDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (userDate > toDate) return false
        }
        return true
      })
    }

    // Apply quick filters
    if (quickFilter === "active") {
      result = result.filter((user) => user.status === "active")
    } else if (quickFilter === "inactive") {
      result = result.filter((user) => user.status === "inactive")
    } else if (quickFilter === "suspended") {
      result = result.filter((user) => user.status === "suspended")
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply column filters from TanStack table (excluding role since it's handled by tabs)
    filters.forEach((filter) => {
      if (!filter.value) return
      
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return
      
      if (filter.id === "status") {
        result = result.filter((user) => filterValues.includes(user.status))
      }
    })

    return result
  }, [users, search, filters, selectedRoleTab, dateRange, quickFilter])

  // Apply sorting to filtered users
  const sortedUsers = useMemo(() => {
    if (!sorting || sorting.length === 0) {
      return filteredUsers
    }

    const sorted = [...filteredUsers]
    sorting.forEach((sort) => {
      const { id, desc } = sort
      sorted.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number

        switch (id) {
          case "name":
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case "email":
            aValue = a.email.toLowerCase()
            bValue = b.email.toLowerCase()
            break
          case "role":
            aValue = a.role
            bValue = b.role
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          case "updatedAt":
            aValue = a.updatedAt.getTime()
            bValue = b.updatedAt.getTime()
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
  }, [filteredUsers, sorting])

  // Paginate sorted users
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedUsers.slice(start, end)
  }, [sortedUsers, page, pageSize])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/internal-users')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
      
      const data = await response.json()
      // Transform dates from strings to Date objects
      const usersWithDates = data.map((user: InternalUser & { createdAt: string; updatedAt: string }) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
      setUsers(usersWithDates)
    } catch (err) {
      console.error("Error fetching users:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load users. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError])

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    const totalPages = Math.ceil(sortedUsers.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    // Reset to page 1 if current page is out of bounds
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [sortedUsers.length, pageSize, page])

  const handleViewDetails = useCallback((user: InternalUser) => {
    router.push(`/admin/internal-users/${user.id}`)
  }, [router])

  const handleNameClick = useCallback((user: InternalUser) => {
    setSelectedUserForQuickView(user)
    setQuickViewOpen(true)
  }, [])

  const handleEdit = useCallback((user: InternalUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status || "active",
      phoneNumber: (user as any).phoneNumber || "",
      username: (user as any).username || "",
      avatarUrl: (user as any).avatarUrl || "",
    })
    setFormErrors({})
    setShowAdvancedOptions(false)
    setFormOpen(true)
  }, [])

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(16)
    setFormData({ ...formData, password: newPassword })
    setShowPassword(true)
  }

  const handleCopyPassword = async () => {
    if (formData.password) {
      await navigator.clipboard.writeText(formData.password)
      showSuccess("Password copied to clipboard")
    }
  }

  const handleDelete = useCallback((user: InternalUser) => {
    if (!canDelete) {
      showError("You don't have permission to delete users")
      return
    }
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading("delete")
    try {
      const response = await fetch(`/api/admin/internal-users/${userToDelete.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }
      
      setDeleteConfirmOpen(false)
      const deletedUserName = userToDelete.name
      setUserToDelete(null)
      showSuccess(`User "${deletedUserName}" has been deleted successfully`)
      // Refresh data after delete
      await fetchUsers()
    } catch (err) {
      console.error("Error deleting user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = useCallback((user: InternalUser) => {
    if (!canSuspend) {
      showError("You don't have permission to suspend users")
      return
    }
    setUserToSuspend(user)
    setSuspendConfirmOpen(true)
  }, [canSuspend, showError])

  const confirmSuspend = async () => {
    if (!userToSuspend) return
    setActionLoading("suspend")
    try {
      const response = await fetch(`/api/admin/internal-users/${userToSuspend.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'suspended' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to suspend user')
      }
      
      setSuspendConfirmOpen(false)
      const suspendedUserName = userToSuspend.name
      setUserToSuspend(null)
      showSuccess(`User "${suspendedUserName}" has been suspended`)
      // Refresh data after suspend
      await fetchUsers()
    } catch (err) {
      console.error("Error suspending user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to suspend user. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = useCallback(async (user: InternalUser) => {
    if (!canActivate) {
      showError("You don't have permission to activate users")
      return
    }
    setActionLoading(`activate-${user.id}`)
    try {
      const response = await fetch(`/api/admin/internal-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to activate user')
      }
      
      showSuccess(`User "${user.name}" has been activated`)
      // Refresh data after activate
      await fetchUsers()
    } catch (err) {
      console.error("Error activating user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to activate user. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers, showSuccess, showError, canActivate])

  const handleExport = useCallback(() => {
    try {
      if (sortedUsers.length === 0) {
        showError("There are no users to export")
        return
      }

      const csv = [
        ["Name", "Email", "Role", "Status", "Created At", "Last Updated"],
        ...sortedUsers.map((user) => [
          user.name,
          user.email,
          user.role,
          user.status,
          user.createdAt.toLocaleDateString("en-US"),
          user.updatedAt.toLocaleDateString("en-US"),
        ]),
      ]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `internal-users-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      showSuccess(`Exported ${sortedUsers.length} user(s) to CSV`)
    } catch (err) {
      console.error("Error exporting users:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to export users"
      showError(errorMessage)
    }
  }, [sortedUsers, showSuccess, showError])

  const handleBulkUpload = useCallback(() => {
    // Create file input
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        showInfo("No file selected")
        return
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        showError("File size exceeds 10MB limit. Please select a smaller file.")
        return
      }

      // Validate file type
      const validExtensions = [".csv", ".xlsx", ".xls"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!validExtensions.includes(fileExtension)) {
        showError("Invalid file type. Please select a CSV or Excel file (.csv, .xlsx, .xls)")
        return
      }

      try {
        setBulkActionLoading("upload")
        // TODO: Implement actual bulk upload API call
        // For now, show a message
        console.log("Bulk upload file:", file.name)
        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 1000))
        showSuccess(`Bulk upload functionality will be implemented. File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      } catch (err) {
        console.error("Error uploading file:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to upload file. Please try again."
        showError(errorMessage)
      } finally {
        setBulkActionLoading(null)
      }
    }
    input.click()
  }, [showInfo, showError, showSuccess])

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1) // Reset to first page when page size changes
    }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: InternalUser[]) => {
    setSelectedUsers(selectedRows)
  }, [])

  const handleSendEmail = useCallback((user: InternalUser) => {
    // TODO: Implement send email
    console.log("Sending email to:", user.email)
    showInfo(`Email functionality will be implemented. User: ${user.email}`)
  }, [showInfo])

  const columns = useMemo(
    () =>
      createInternalUsersColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onNameClick: handleNameClick,
        onSendEmail: handleSendEmail,
        onSuspend: handleSuspend,
        onActivate: handleActivate,
        canEdit,
        canDelete,
        canSuspend,
        canActivate,
      }),
    [handleViewDetails, handleEdit, handleDelete, handleNameClick, handleSendEmail, handleSuspend, handleActivate, canEdit, canDelete, canSuspend, canActivate]
  )

  const handleFormSubmit = async () => {
    if (!canEdit) {
      showError("You don't have permission to create or edit users")
      return
    }

    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    else {
      // Check for duplicate email (excluding current user if editing)
      const duplicateUser = users.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id
      )
      if (duplicateUser) {
        errors.email = "This email is already in use"
      }
    }
    if (!editingUser && !formData.password) errors.password = "Password is required"
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"
    
    // Validate phone number format if provided
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Invalid phone number format. Use international format (e.g., +1234567890)"
    }
    
    // Validate username uniqueness if provided
    if (formData.username) {
      const duplicateUsername = users.find(
        (u) => (u as any).username?.toLowerCase() === formData.username.toLowerCase() && u.id !== editingUser?.id
      )
      if (duplicateUsername) {
        errors.username = "This username is already in use"
      }
    }
    
    // Validate avatar URL format if provided
    if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl)) {
      errors.avatarUrl = "Invalid URL format. Must start with http:// or https://"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      let response: Response
      
      if (editingUser) {
        const updateData: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        }
        
        // Only include optional fields if they have values
        if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber
        if (formData.username) updateData.username = formData.username
        if (formData.avatarUrl) updateData.avatarUrl = formData.avatarUrl
        if (formData.password) updateData.password = formData.password // Password reset
        
        response = await fetch(`/api/admin/internal-users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        response = await fetch('/api/admin/internal-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            status: formData.status,
            phoneNumber: formData.phoneNumber || undefined,
            username: formData.username || undefined,
            avatarUrl: formData.avatarUrl || undefined,
          }),
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save user')
      }

      setFormOpen(false)
      setEditingUser(null)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "executive",
        status: "active",
        phoneNumber: "",
        username: "",
        avatarUrl: "",
      })
      setFormErrors({})
      setShowPassword(false)
      setShowAdvancedOptions(false)
      const userName = formData.name
      showSuccess(editingUser 
        ? `User "${userName}" has been updated successfully`
        : `User "${userName}" has been created successfully`)
      // Refresh data after create/edit
      await fetchUsers()
    } catch (err) {
      console.error("Error saving user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save user. Please try again."
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  useEffect(() => {
    if (formOpen && !editingUser) {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "executive",
        status: "active",
        phoneNumber: "",
        username: "",
        avatarUrl: "",
      })
      setFormErrors({})
      setShowPassword(false)
      setShowAdvancedOptions(false)
    }
  }, [formOpen, editingUser])

  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
    },
  ]

  const quickFilters = [
    { id: "active", label: "Active", count: 0 },
    { id: "inactive", label: "Inactive", count: 0 },
    { id: "suspended", label: "Suspended", count: 0 },
  ]

  // Prepare toolbar buttons based on selection
  const toolbarButtons = useMemo(() => {
    if (selectedUsers.length > 0) {
      return [
        {
          label: bulkActionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: bulkActionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: async () => {
            if (selectedUsers.length === 0) {
              showError("No users selected. Please select at least one user to delete.")
              return
            }
            setBulkActionLoading("delete")
            try {
              // Delete users one by one
              for (const user of selectedUsers) {
                const response = await fetch(`/api/admin/internal-users/${user.id}`, {
                  method: 'DELETE',
                })
                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || `Failed to delete user ${user.name}`)
                }
              }
              const deletedCount = selectedUsers.length
              setSelectedUsers([])
              showSuccess(`${deletedCount} user(s) deleted successfully`)
              // Refresh data after bulk delete
              await fetchUsers()
            } catch (err) {
              console.error("Error deleting users:", err)
              const errorMessage = err instanceof Error ? err.message : "Failed to delete users. Please try again."
              setError(errorMessage)
              showError(errorMessage)
            } finally {
              setBulkActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "suspend" ? "Suspending..." : "Suspend Selected",
          icon: bulkActionLoading === "suspend" ? <Loader size="sm" className="mr-2" /> : <Lock className="h-4 w-4" />,
          disabled: !canSuspend || bulkActionLoading !== null,
          tooltip: !canSuspend ? "You don't have permission to suspend users" : undefined,
          onClick: async () => {
            if (selectedUsers.length === 0) {
              showError("No users selected. Please select at least one user to suspend.")
              return
            }
            if (!canSuspend) {
              showError("You don't have permission to suspend users")
              return
            }
            setBulkActionLoading("suspend")
            try {
              // Suspend users one by one
              for (const user of selectedUsers) {
                const response = await fetch(`/api/admin/internal-users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'suspended' }),
                })
                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || `Failed to suspend user ${user.name}`)
                }
              }
              const suspendedCount = selectedUsers.length
              setSelectedUsers([])
              showSuccess(`${suspendedCount} user(s) suspended successfully`)
              // Refresh data after bulk suspend
              await fetchUsers()
            } catch (err) {
              console.error("Error suspending users:", err)
              const errorMessage = err instanceof Error ? err.message : "Failed to suspend users. Please try again."
              setError(errorMessage)
              showError(errorMessage)
            } finally {
              setBulkActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: bulkActionLoading === "activate" ? "Activating..." : "Activate Selected",
          icon: bulkActionLoading === "activate" ? <Loader size="sm" className="mr-2" /> : <Check className="h-4 w-4" />,
          disabled: !canActivate || bulkActionLoading !== null,
          tooltip: !canActivate ? "You don't have permission to activate users" : undefined,
          onClick: async () => {
            if (selectedUsers.length === 0) {
              showError("No users selected. Please select at least one user to activate.")
              return
            }
            if (!canActivate) {
              showError("You don't have permission to activate users")
              return
            }
            setBulkActionLoading("activate")
            try {
              // Activate users one by one
              for (const user of selectedUsers) {
                const response = await fetch(`/api/admin/internal-users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'active' }),
                })
                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || `Failed to activate user ${user.name}`)
                }
              }
              const activatedCount = selectedUsers.length
              setSelectedUsers([])
              showSuccess(`${activatedCount} user(s) activated successfully`)
              // Refresh data after bulk activate
              await fetchUsers()
            } catch (err) {
              console.error("Error activating users:", err)
              const errorMessage = err instanceof Error ? err.message : "Failed to activate users. Please try again."
              setError(errorMessage)
              showError(errorMessage)
            } finally {
              setBulkActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedUsers([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return [
        {
          label: "Bulk Upload",
          icon: <Upload className="h-4 w-4" />,
          onClick: handleBulkUpload,
          variant: "outline" as const,
        },
        {
          label: "Create User",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => {
            if (!canEdit) {
              showError("You don't have permission to create users")
              return
            }
            setEditingUser(null)
            setFormOpen(true)
          },
          variant: "default" as const,
          disabled: !canEdit,
          tooltip: !canEdit ? "You don't have permission to create users" : undefined,
        },
      ]
    }
  }, [selectedUsers, bulkActionLoading, users, handleExport, handleBulkUpload, canEdit, canDelete, canSuspend, canActivate, showError])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Internal Users</h1>
            <p className="text-xs text-white/90 mt-0.5">
              Manage internal users and their roles. Internal users have role-based access (admin, manager, executive).
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {assignedOwner || assignedMembers.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                  {assignedOwner && (() => {
                    const owner = internalUsersForAssignee.find(u => u.id === assignedOwner)
                    return (
                      <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src={getAvatarUrl(assignedOwner, owner?.email)} />
                        <AvatarFallback className="text-xs bg-white/20 text-white">
                          {owner?.name.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })()}
                  {assignedMembers.slice(0, 3).map((memberId) => {
                    const member = internalUsersForAssignee.find(u => u.id === memberId)
                    return (
                      <Avatar key={memberId} className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src={getAvatarUrl(memberId, member?.email)} />
                        <AvatarFallback className="text-xs bg-white/20 text-white">
                          {member?.name.charAt(0) || "M"}
                        </AvatarFallback>
                      </Avatar>
                    )
                  })}
                  {assignedMembers.length > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-white/20 bg-white/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">+{assignedMembers.length - 3}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleOpenAssigneeModal}
                  className="whitespace-nowrap cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
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
                className="whitespace-nowrap cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Assignee
              </Button>
            )}
            {selectedUsers.length > 0 && (
              <span className="text-sm font-medium text-white">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="mt-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Role Tabs with Counters */}
      <div className="mb-3">
        <Tabs value={selectedRoleTab || "all"} onValueChange={(value) => setSelectedRoleTab(value === "all" ? null : value)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="cursor-pointer">
              All
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                {roleCounts.all}
              </Badge>
            </TabsTrigger>
            {roles.map((role) => (
              <TabsTrigger key={role} value={role} className="cursor-pointer">
                {role.charAt(0).toUpperCase() + role.slice(1)}
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                  {roleCounts[role] || 0}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <DataTable
        columns={columns}
        data={paginatedUsers}
        pageCount={Math.max(1, pageCount)}
        onPaginationChange={handlePaginationChange}
        onSortingChange={setSorting}
        onFilterChange={setFilters}
        onSearchChange={setSearch}
        loading={loading}
        initialLoading={initialLoading}
        filterConfig={filterConfig}
        searchPlaceholder="Search users..."
        page={page}
        pageSize={pageSize}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        secondaryButtons={toolbarButtons}
        onDateRangeChange={setDateRange}
        quickFilters={quickFilters}
        selectedQuickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {userToDelete.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {userToDelete.email}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer">
              {actionLoading === "delete" ? (
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

      {/* Suspend Confirmation Dialog */}
      <Dialog open={suspendConfirmOpen} onOpenChange={setSuspendConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will not be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          {userToSuspend && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {userToSuspend.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {userToSuspend.email}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"} className="cursor-pointer">
              {actionLoading === "suspend" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Suspending...
                </>
              ) : (
                "Suspend"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit User Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user information and role."
                : "Create a new internal user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="name">Name *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the user's full name as it should appear in the system</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (formErrors.name) setFormErrors({ ...formErrors, name: "" })
                }}
                placeholder="Enter full name"
                className={formErrors.name ? "border-destructive" : ""}
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="email">Email *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email must be unique and will be used for login</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (formErrors.email) setFormErrors({ ...formErrors, email: "" })
                }}
                placeholder="Enter email address"
                className={formErrors.email ? "border-destructive" : ""}
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>

            {/* Password - Only for new users */}
            {!editingUser && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Password must be at least 8 characters long. Use the generate button for a secure password.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        if (formErrors.password) setFormErrors({ ...formErrors, password: "" })
                      }}
                      placeholder="Enter password"
                      className={formErrors.password ? "border-destructive pr-20" : "pr-20"}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{showPassword ? "Hide password" : "Show password"}</p>
                        </TooltipContent>
                      </Tooltip>
                      {formData.password && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer"
                              onClick={handleCopyPassword}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy password to clipboard</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGeneratePassword}
                        className="flex-shrink-0 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate a secure random password</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>
                        {getPasswordStrengthLabel(formData.password)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`}
                        style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }}
                      />
                    </div>
                  </div>
                )}
                {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="role">Role *</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Role determines the user's access level and permissions in the system</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as InternalUserRole })}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User account status. Active users can access the system, suspended users cannot.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* More Options - Expandable Section */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="more-options" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-2">
                    <span>More Options</span>
                    {(() => {
                      const filledCount = [
                        formData.phoneNumber,
                        formData.username,
                        formData.avatarUrl,
                        editingUser && formData.password ? formData.password : null,
                      ].filter(Boolean).length
                      return filledCount > 0 ? (
                        <Badge variant="secondary" className="text-xs">
                          {filledCount} filled
                        </Badge>
                      ) : null
                    })()}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional phone number for contact and notifications</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, phoneNumber: e.target.value })
                        if (formErrors.phoneNumber) setFormErrors({ ...formErrors, phoneNumber: "" })
                      }}
                      onBlur={() => {
                        if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
                          setFormErrors({ ...formErrors, phoneNumber: "Invalid phone number format" })
                        }
                      }}
                      placeholder="+1234567890"
                      className={formErrors.phoneNumber ? "border-destructive" : ""}
                    />
                    {formErrors.phoneNumber && <p className="text-xs text-destructive">{formErrors.phoneNumber}</p>}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="username">Username</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional unique username. If not provided, email will be used.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value })
                        if (formErrors.username) setFormErrors({ ...formErrors, username: "" })
                      }}
                      onBlur={() => {
                        if (formData.username) {
                          const duplicateUsername = users.find(
                            (u) => (u as any).username?.toLowerCase() === formData.username.toLowerCase() && u.id !== editingUser?.id
                          )
                          if (duplicateUsername) {
                            setFormErrors({ ...formErrors, username: "This username is already in use" })
                          }
                        }
                      }}
                      placeholder="username"
                      className={formErrors.username ? "border-destructive" : ""}
                    />
                    {formErrors.username && <p className="text-xs text-destructive">{formErrors.username}</p>}
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optional URL to user's avatar image</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, avatarUrl: e.target.value })
                        if (formErrors.avatarUrl) setFormErrors({ ...formErrors, avatarUrl: "" })
                      }}
                      onBlur={() => {
                        if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl)) {
                          setFormErrors({ ...formErrors, avatarUrl: "Invalid URL format" })
                        }
                      }}
                      placeholder="https://example.com/avatar.jpg"
                      className={formErrors.avatarUrl ? "border-destructive" : ""}
                    />
                    {formErrors.avatarUrl && <p className="text-xs text-destructive">{formErrors.avatarUrl}</p>}
                  </div>

                  {/* Password Reset - Edit Mode Only */}
                  {editingUser && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="passwordReset">Change Password</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Leave blank to keep current password. Enter new password to change it.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="passwordReset"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value })
                              if (formErrors.password) setFormErrors({ ...formErrors, password: "" })
                            }}
                            placeholder="Leave blank to keep current password"
                            className={formErrors.password ? "border-destructive pr-20" : "pr-20"}
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 cursor-pointer"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{showPassword ? "Hide password" : "Show password"}</p>
                              </TooltipContent>
                            </Tooltip>
                            {formData.password && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 cursor-pointer"
                                    onClick={handleCopyPassword}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy password to clipboard</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGeneratePassword}
                              className="flex-shrink-0 cursor-pointer"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Generate
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate a secure random password</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {formData.password && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Password strength:</span>
                            <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>
                              {getPasswordStrengthLabel(formData.password)}
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`}
                              style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setFormOpen(false)
                setEditingUser(null)
                setFormErrors({})
              }}
              disabled={formLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} variant="default" className="cursor-pointer">
              {formLoading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {editingUser ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingUser ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Quick View Modal */}
      <Dialog 
        open={quickViewOpen} 
        onOpenChange={(open) => {
          setQuickViewOpen(open)
          if (!open) {
            setSelectedUserForQuickView(null)
          }
        }}
      >
        <DialogContent className="max-w-xs p-4">
          {selectedUserForQuickView && (
            <>
              <DialogHeader className="pb-3 space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage
                      src={getAvatarUrl(selectedUserForQuickView.id, selectedUserForQuickView.email)}
                    />
                    <AvatarFallback className="text-sm">
                      {selectedUserForQuickView.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base truncate">{selectedUserForQuickView.name}</DialogTitle>
                    <DialogDescription className="text-xs truncate">{selectedUserForQuickView.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Role</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {selectedUserForQuickView.role.charAt(0).toUpperCase() + selectedUserForQuickView.role.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge
                    variant={selectedUserForQuickView.status === "active" ? "default" : "secondary"}
                    className="text-xs px-2 py-0.5"
                  >
                    {selectedUserForQuickView.status.charAt(0).toUpperCase() + selectedUserForQuickView.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <DialogFooter className="pt-3 border-t mt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuickViewOpen(false)
                    if (selectedUserForQuickView) {
                      router.push(`/admin/internal-users/${selectedUserForQuickView.id}`)
                    }
                  }}
                  className="w-full text-sm h-8 cursor-pointer"
                >
                  View More Details
                </Button>
              </DialogFooter>
            </>
          )}
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
                  {internalUsersForAssignee.map((user) => (
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
              
              {/* Top Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="members-search"
                  placeholder="Search users..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* User List */}
              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMembers.map((user) => {
                      const isSelected = tempMembers.includes(user.id)
                      const isOwner = tempOwner === user.id
                      return (
                        <div
                          key={user.id}
                          onClick={() => {
                            if (isOwner) return // Can't select owner as member
                            if (isSelected) {
                              handleRemoveMember(user.id)
                            } else {
                              handleAddMember(user.id)
                            }
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors",
                            isSelected && "bg-accent",
                            isOwner && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isOwner}
                            onCheckedChange={(checked) => {
                              if (isOwner) return
                              if (checked) {
                                handleAddMember(user.id)
                              } else {
                                handleRemoveMember(user.id)
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer"
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={getAvatarUrl(user.id, user.email)} />
                            <AvatarFallback className="text-xs">
                              {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          {isOwner && (
                            <Badge variant="outline" className="text-xs">
                              Owner
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              {/* Selected Members Summary */}
              {tempMembers.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    {tempMembers.length} member{tempMembers.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tempMembers.map((memberId) => {
                      const member = internalUsersForAssignee.find(u => u.id === memberId)
                      if (!member) return null
                      return (
                        <Badge key={memberId} variant="secondary" className="flex items-center gap-1.5">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={getAvatarUrl(memberId, member.email)} />
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{member.name}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveMember(memberId)
                            }}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigneeModalOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignees} variant="default" className="cursor-pointer">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
