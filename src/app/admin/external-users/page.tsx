"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Check, Lock, UserPlus, Search, X, Mail, MessageCircle, Coins, Copy, Eye, EyeOff, RefreshCw, ArrowLeft, ChevronLeft, ChevronRight, Download, Edit } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createExternalUsersColumns } from "./components/external-users-columns"
import { ExternalUser, ExternalUserPlan, InternalUser } from "@/types/admin/users"
import { sampleExternalUsers } from "./data/users"
import { sampleInternalUsers } from "../internal-users/data/users"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import {
  generateSecurePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  getPasswordStrengthProgress,
} from "@/lib/utils/password"
import { Loader } from "@/components/ui/loader"

export default function AdminExternalUsersPage() {
  const [users, setUsers] = useState<ExternalUser[]>(sampleExternalUsers)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<ExternalUser | null>(null)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [userToSuspend, setUserToSuspend] = useState<ExternalUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ExternalUser | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedUserForQuickView, setSelectedUserForQuickView] = useState<ExternalUser | null>(null)
  const [addAssigneeOpen, setAddAssigneeOpen] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<InternalUser[]>([])
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [assignees, setAssignees] = useState<{ owner: InternalUser | null; members: InternalUser[] }>({
    owner: null,
    members: [],
  })
  const [assigneeQuickModalOpen, setAssigneeQuickModalOpen] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState<InternalUser | null>(null)
  const [assigneeDetailsModalOpen, setAssigneeDetailsModalOpen] = useState(false)
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<ExternalUser[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    plan: "free" as ExternalUserPlan,
    phoneNumber: "",
    credits: 0,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [creditsModalOpen, setCreditsModalOpen] = useState(false)
  const [userForCredits, setUserForCredits] = useState<ExternalUser | null>(null)
  const [creditsAmount, setCreditsAmount] = useState("")
  const [creditsAction, setCreditsAction] = useState<"add" | "remove">("add")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)

  const plans = useMemo(() => ["free", "trial", "basic", "pro", "premium", "enterprise"], [])

  // Filter users based on search and filters
  // Since manualFiltering is true, we handle filtering in the parent component
  const filteredUsers = useMemo(() => {
    let result = users

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply column filters from TanStack table
    filters.forEach((filter) => {
      if (!filter.value) return
      
      if (filter.id === "plan") {
        const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
        if (filterValues.length > 0) {
          result = result.filter((user) => filterValues.includes(user.plan))
        }
      }
      
      if (filter.id === "status") {
        const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
        if (filterValues.length > 0) {
          result = result.filter((user) => filterValues.includes(user.status))
        }
      }
    })

    return result
  }, [users, search, filters])

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
          case "plan":
            aValue = a.plan
            bValue = b.plan
            break
          case "status":
            aValue = a.status
            bValue = b.status
            break
          case "subscriptionDate":
            aValue = a.subscriptionDate.getTime()
            bValue = b.subscriptionDate.getTime()
            break
          case "expiryDate":
            aValue = (a.isTrial && a.trialEndsAt ? a.trialEndsAt : a.expiryDate).getTime()
            bValue = (b.isTrial && b.trialEndsAt ? b.trialEndsAt : b.expiryDate).getTime()
            break
          case "credits":
            aValue = a.credits || 0
            bValue = b.credits || 0
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

  useEffect(() => {
    setPageCount(Math.ceil(sortedUsers.length / pageSize))
    setInitialLoading(false)
  }, [sortedUsers.length, pageSize])

  const handleViewDetails = useCallback((user: ExternalUser) => {
    setSelectedUserForQuickView(user)
    setUserDetailsModalOpen(true)
  }, [])


  const handleEdit = useCallback((user: ExternalUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      plan: user.plan,
      phoneNumber: user.phoneNumber || "",
      credits: user.credits || 0,
    })
    setFormErrors({})
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
      // You could add a toast notification here
    }
  }

  const handleSendEmail = useCallback(async (user: ExternalUser) => {
    // TODO: Implement email sending
    console.log("Sending email to:", user.email)
  }, [])

  const handleSendWhatsApp = useCallback((user: ExternalUser) => {
    if (user.phoneNumber) {
      const whatsappUrl = `https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, "")}`
      window.open(whatsappUrl, "_blank")
    } else {
      // You could show a toast/alert here
      console.log("No phone number available")
    }
  }, [])

  const handleManageCredits = useCallback((user: ExternalUser) => {
    setUserForCredits(user)
    setCreditsAmount("")
    setCreditsAction("add")
    setCreditsModalOpen(true)
  }, [])

  const handleCreditsSubmit = async () => {
    if (!userForCredits || !creditsAmount) return
    const amount = parseInt(creditsAmount)
    if (isNaN(amount) || amount <= 0) return

    setActionLoading("credits")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers(
        users.map((u) =>
          u.id === userForCredits.id
            ? {
                ...u,
                credits:
                  creditsAction === "add"
                    ? (u.credits || 0) + amount
                    : Math.max(0, (u.credits || 0) - amount),
                updatedAt: new Date(),
              }
            : u
        )
      )
      setCreditsModalOpen(false)
      setUserForCredits(null)
      setCreditsAmount("")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = useCallback((user: ExternalUser) => {
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }, [])

  const confirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading("delete")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      setDeleteConfirmOpen(false)
      setUserToDelete(null)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = useCallback((user: ExternalUser) => {
    setUserToSuspend(user)
    setSuspendConfirmOpen(true)
  }, [])

  const confirmSuspend = async () => {
    if (!userToSuspend) return
    setActionLoading("suspend")
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers(
        users.map((u) =>
          u.id === userToSuspend.id ? { ...u, status: "suspended" as const, updatedAt: new Date() } : u
        )
      )
      setSuspendConfirmOpen(false)
      setUserToSuspend(null)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = useCallback(async (user: ExternalUser) => {
    setActionLoading(`activate-${user.id}`)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: "active" as const, updatedAt: new Date() } : u
        )
      )
    } finally {
      setActionLoading(null)
    }
  }, [])

  const handleUpsell = useCallback(async (user: ExternalUser) => {
    setActionLoading(`upsell-${user.id}`)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      const planIndex = plans.indexOf(user.plan)
      const nextPlanIndex = planIndex < plans.length - 1 ? planIndex + 1 : planIndex
      const nextPlan = plans[nextPlanIndex] || user.plan
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, plan: nextPlan as ExternalUserPlan, updatedAt: new Date() } : u
        )
      )
    } finally {
      setActionLoading(null)
    }
  }, [plans])

  const handleNameClick = useCallback((user: ExternalUser) => {
    setSelectedUserForQuickView(user)
    setQuickViewOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      createExternalUsersColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onSuspend: handleSuspend,
        onActivate: handleActivate,
        onUpsell: handleUpsell,
        onSendEmail: handleSendEmail,
        onSendWhatsApp: handleSendWhatsApp,
        onManageCredits: handleManageCredits,
        onNameClick: handleNameClick,
      }),
    [handleViewDetails, handleEdit, handleDelete, handleSuspend, handleActivate, handleUpsell, handleSendEmail, handleSendWhatsApp, handleManageCredits, handleNameClick]
  )

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    if (!editingUser && !formData.password) errors.password = "Password is required"
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingUser) {
    setUsers(
      users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                plan: formData.plan,
                phoneNumber: formData.phoneNumber,
                credits: formData.credits,
                updatedAt: new Date(),
              }
            : u
        )
      )
    } else {
      const newUser: ExternalUser = {
        id: `ext_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        plan: formData.plan,
        status: "active",
        subscriptionDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        createdAt: new Date(),
        updatedAt: new Date(),
        isTrial: formData.plan === "trial",
        trialEndsAt: formData.plan === "trial" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
        subscriptionStatus: "active",
        credits: formData.credits,
        phoneNumber: formData.phoneNumber,
      }
      setUsers([...users, newUser])
    }

    setFormOpen(false)
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      plan: "free",
      phoneNumber: "",
      credits: 0,
    })
    setFormErrors({})
    setShowPassword(false)
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
        plan: "free",
        phoneNumber: "",
        credits: 0,
      })
      setFormErrors({})
      setShowPassword(false)
    }
  }, [formOpen, editingUser])

  const filterConfig = [
    {
      columnId: "plan",
      title: "Plan",
      options: plans.map((plan) => ({
        label: plan.charAt(0).toUpperCase() + plan.slice(1),
        value: plan,
      })),
    },
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

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      {/* Page Title and Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 flex-shrink-0 min-w-0">
        <div className="min-w-0 flex-shrink">
          <h1 className="text-lg font-semibold tracking-tight">External Users</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage external users and their subscription plans. To edit plan permissions, go to the Plans page.
          </p>
          </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          {/* Assignees Display */}
          {(assignees.owner || assignees.members.length > 0) && (
            <div className="flex items-center gap-2 min-w-0 flex-shrink">
              <div className="flex items-center -space-x-2 flex-shrink-0">
                {assignees.owner && (
                  <Avatar
                    className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-all flex-shrink-0"
                    title={assignees.owner.name}
                    onClick={() => {
                      setSelectedAssignee(assignees.owner)
                      setAssigneeQuickModalOpen(true)
                    }}
                  >
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(assignees.owner.name)}`}
                    />
                    <AvatarFallback className="text-xs">
                      {assignees.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                )}
                {assignees.members.slice(0, assignees.owner ? 2 : 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-all flex-shrink-0"
                    title={member.name}
                    onClick={() => {
                      setSelectedAssignee(member)
                      setAssigneeQuickModalOpen(true)
                    }}
                  >
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(member.name)}`}
                    />
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {(() => {
                  const totalAssignees = (assignees.owner ? 1 : 0) + assignees.members.length
                  const visibleCount = assignees.owner ? 3 : 3
                  const remaining = totalAssignees - visibleCount
                  return remaining > 0 ? (
                    <div
                      className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-muted/80 transition-all flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => {
                        setAssigneeDetailsModalOpen(true)
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setAssigneeDetailsModalOpen(true)
                        }
                      }}
                    >
                      +{remaining}
                    </div>
                  ) : null
                })()}
              </div>
            </div>
          )}
          {selectedUsers.length === 0 && (
            <Button
              variant="outline"
              onClick={() => {
                // Load existing assignees into modal
                setSelectedOwner(assignees.owner?.id || "")
                setSelectedMembers(assignees.members)
                setMemberSearchQuery("")
                setAddAssigneeOpen(true)
              }}
              className="flex-shrink-0"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Assignee</span>
              <span className="sm:hidden">Add</span>
          </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="bg-muted/50 border-muted mb-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setBulkActionLoading("delete")
                    try {
                      // Bulk delete
                      await new Promise((resolve) => setTimeout(resolve, 500))
                      const selectedIds = selectedUsers.map((u) => u.id)
                      setUsers(users.filter((u) => !selectedIds.includes(u.id)))
                      setSelectedUsers([])
                    } finally {
                      setBulkActionLoading(null)
                    }
                  }}
                  disabled={bulkActionLoading !== null}
                >
                  {bulkActionLoading === "delete" ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setBulkActionLoading("suspend")
                    try {
                      // Bulk suspend
                      await new Promise((resolve) => setTimeout(resolve, 500))
                      const selectedIds = selectedUsers.map((u) => u.id)
                      setUsers(
                        users.map((u) =>
                          selectedIds.includes(u.id)
                            ? { ...u, status: "suspended" as const, updatedAt: new Date() }
                            : u
                        )
                      )
                      setSelectedUsers([])
                    } finally {
                      setBulkActionLoading(null)
                    }
                  }}
                  disabled={bulkActionLoading !== null}
                >
                  {bulkActionLoading === "suspend" ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Suspending...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Suspend Selected
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setBulkActionLoading("activate")
                    try {
                      // Bulk activate
                      await new Promise((resolve) => setTimeout(resolve, 500))
                      const selectedIds = selectedUsers.map((u) => u.id)
                      setUsers(
                        users.map((u) =>
                          selectedIds.includes(u.id)
                            ? { ...u, status: "active" as const, updatedAt: new Date() }
                            : u
                        )
                      )
                      setSelectedUsers([])
                    } finally {
                      setBulkActionLoading(null)
                    }
                  }}
                  disabled={bulkActionLoading !== null}
                >
                  {bulkActionLoading === "activate" ? (
                    <>
                      <Loader size="sm" className="mr-2" />
                      Activating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Activate Selected
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Export selected users
                    console.log("Exporting users:", selectedUsers)
                    // TODO: Implement export functionality
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable
          columns={columns}
          data={paginatedUsers}
          pageCount={pageCount}
          onPaginationChange={(p, s) => {
            // Only update if values actually changed to prevent infinite loops
            if (p !== page || s !== pageSize) {
              setPage(p)
              setPageSize(s)
            }
          }}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={false}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search users..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            setEditingUser(null)
            setFormOpen(true)
          }}
          addButtonText="Create User"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={(selectedRows) => {
            setSelectedUsers(selectedRows)
          }}
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
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"}>
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
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"}>
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
                ? "Update user information and subscription plan."
                : "Create a new external user account with subscription plan."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
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
              <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {formData.password && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={handleCopyPassword}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGeneratePassword}
                    className="flex-shrink-0"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
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

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+1234567890"
              />
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan *</Label>
              <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value as ExternalUserPlan })}>
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Credits */}
            <div className="space-y-2">
              <Label htmlFor="credits">Initial Credits</Label>
              <Input
                id="credits"
                type="number"
                min="0"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
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
            >
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading}>
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

      {/* Manage Credits Dialog */}
      <Dialog open={creditsModalOpen} onOpenChange={setCreditsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>
              {creditsAction === "add" ? "Add Credits" : "Remove Credits"}
            </DialogTitle>
            <DialogDescription>
              {userForCredits && (
                <>
                  Current credits: <span className="font-semibold">{userForCredits.credits || 0}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="credits-amount">Amount</Label>
              <Input
                id="credits-amount"
                type="number"
                min="1"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={creditsAction === "add" ? "default" : "outline"}
                onClick={() => setCreditsAction("add")}
                className="flex-1"
              >
                Add
              </Button>
              <Button
                variant={creditsAction === "remove" ? "default" : "outline"}
                onClick={() => setCreditsAction("remove")}
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setCreditsModalOpen(false)} disabled={actionLoading === "credits"}>
              Cancel
            </Button>
            <Button onClick={handleCreditsSubmit} disabled={actionLoading === "credits"}>
              {actionLoading === "credits" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                creditsAction === "add" ? "Add Credits" : "Remove Credits"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Assignee Dialog */}
      <Dialog open={addAssigneeOpen} onOpenChange={setAddAssigneeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>User Access Control</DialogTitle>
            <DialogDescription>
              Manage ownership and access for external users. Assign an owner and add members who can manage these users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Owner Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Owner</label>
              <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {sampleInternalUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(user.name)}`} />
                          <AvatarFallback className="text-xs">
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                The owner is responsible for maintaining and managing these external users.
              </p>
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Members</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users to add..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md border">
                  {selectedMembers.map((member) => (
                    <Badge key={member.id} variant="secondary" className="gap-1.5 px-2 py-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(member.name)}`} />
                        <AvatarFallback className="text-[10px]">
                          {member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{member.name}</span>
                      <button
                        onClick={() => {
                          setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id))
                        }}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {memberSearchQuery && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {sampleInternalUsers
                    .filter(
                      (user) =>
                        !selectedMembers.some((m) => m.id === user.id) &&
                        (user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                    )
                    .map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          if (!selectedMembers.some((m) => m.id === user.id)) {
                            setSelectedMembers([...selectedMembers, user])
                            setMemberSearchQuery("")
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(user.name)}`} />
                          <AvatarFallback>
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </button>
                    ))}
                  {sampleInternalUsers.filter(
                    (user) =>
                      !selectedMembers.some((m) => m.id === user.id) &&
                      (user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                        user.email.toLowerCase().includes(memberSearchQuery.toLowerCase()))
                  ).length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setAddAssigneeOpen(false)
              setSelectedOwner("")
              setSelectedMembers([])
              setMemberSearchQuery("")
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Save assignees
              const owner = selectedOwner ? sampleInternalUsers.find((u) => u.id === selectedOwner) || null : null
              setAssignees({
                owner,
                members: selectedMembers,
              })
              setAddAssigneeOpen(false)
              setSelectedOwner("")
              setSelectedMembers([])
              setMemberSearchQuery("")
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignee Quick View Modal */}
      <Dialog open={assigneeQuickModalOpen} onOpenChange={setAssigneeQuickModalOpen}>
        <DialogContent className="max-w-sm">
          {selectedAssignee && (
            <>
              <DialogHeader className="pb-4 text-center">
                <div className="flex justify-center mb-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(selectedAssignee.name)}`}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedAssignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <DialogTitle>{selectedAssignee.name}</DialogTitle>
                <DialogDescription className="text-center">{selectedAssignee.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedAssignee.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={selectedAssignee.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {selectedAssignee.status.charAt(0).toUpperCase() + selectedAssignee.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAssigneeQuickModalOpen(false)
                    setAssigneeDetailsModalOpen(true)
                  }}
                  className="w-full"
                >
                  View More Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignee Full Details Modal */}
      <Dialog open={assigneeDetailsModalOpen} onOpenChange={setAssigneeDetailsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedAssignee && (
            <>
              <DialogHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(selectedAssignee.name)}`}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedAssignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedAssignee.name}</DialogTitle>
                    <DialogDescription>{selectedAssignee.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                      <p className="text-sm font-medium">{selectedAssignee.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                      <p className="text-sm font-medium">{selectedAssignee.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Role</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedAssignee.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Status</p>
                      <Badge
                        variant={selectedAssignee.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {selectedAssignee.status.charAt(0).toUpperCase() + selectedAssignee.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Created At</p>
                      <p className="text-sm font-medium">
                        {selectedAssignee.createdAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                      <p className="text-sm font-medium">
                        {selectedAssignee.updatedAt.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Permissions & Access</h3>
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      This user has {selectedAssignee.role} level permissions and can manage external users assigned to them.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button variant="outline" onClick={() => setAssigneeDetailsModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    setAssigneeDetailsModalOpen(false)
                  }}
                >
                  Edit Assignee
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    // TODO: Implement remove functionality
                    if (selectedAssignee) {
                      if (assignees.owner?.id === selectedAssignee.id) {
                        setAssignees({ ...assignees, owner: null })
                      } else {
                        setAssignees({
                          ...assignees,
                          members: assignees.members.filter((m) => m.id !== selectedAssignee.id),
                        })
                      }
                      setAssigneeDetailsModalOpen(false)
                      setAssigneeQuickModalOpen(false)
                      setSelectedAssignee(null)
                    }
                  }}
                >
                  Remove
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* User Quick View Modal (Small Centered) */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-sm">
          {selectedUserForQuickView && (
            <>
              <DialogHeader className="pb-4 text-center">
                <div className="flex justify-center mb-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(selectedUserForQuickView.name)}`}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedUserForQuickView.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <DialogTitle>{selectedUserForQuickView.name}</DialogTitle>
                <DialogDescription className="text-center">{selectedUserForQuickView.email}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedUserForQuickView.plan.charAt(0).toUpperCase() + selectedUserForQuickView.plan.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={selectedUserForQuickView.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {selectedUserForQuickView.status.charAt(0).toUpperCase() + selectedUserForQuickView.status.slice(1)}
                  </Badge>
                </div>
                {selectedUserForQuickView.credits !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Credits</span>
                    <span className="text-sm font-medium">{selectedUserForQuickView.credits.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuickViewOpen(false)
                    setUserDetailsModalOpen(true)
                  }}
                  className="w-full"
                >
                  View More Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Full User Details Modal */}
      <Dialog open={userDetailsModalOpen} onOpenChange={setUserDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedUserForQuickView && (() => {
            const currentIndex = sortedUsers.findIndex((u) => u.id === selectedUserForQuickView.id)
            const hasPrevious = currentIndex > 0
            const hasNext = currentIndex < sortedUsers.length - 1
            const previousUser = hasPrevious ? sortedUsers[currentIndex - 1] : null
            const nextUser = hasNext ? sortedUsers[currentIndex + 1] : null

            return (
              <>
                {/* Breadcrumbs and Navigation */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <button
                      onClick={() => setUserDetailsModalOpen(false)}
                      className="hover:text-foreground transition-colors"
                    >
                      Admin
                    </button>
                    <span>/</span>
                    <button
                      onClick={() => setUserDetailsModalOpen(false)}
                      className="hover:text-foreground transition-colors"
                    >
                      External Users
                    </button>
                    <span>/</span>
                    <span className="text-foreground font-medium">{selectedUserForQuickView.name}</span>
                  </nav>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (previousUser) {
                          setSelectedUserForQuickView(previousUser)
                        }
                      }}
                      disabled={!hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (nextUser) {
                          setSelectedUserForQuickView(nextUser)
                        }
                      }}
                      disabled={!hasNext}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserDetailsModalOpen(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>

                <div className="space-y-6 py-4">
                  {/* Profile Card */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={`https://avatar.iran.liara.run/public?name=${encodeURIComponent(selectedUserForQuickView.name)}`}
                          />
                          <AvatarFallback className="text-xl">
                            {selectedUserForQuickView.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold">{selectedUserForQuickView.name}</h2>
                            <Badge
                              variant={selectedUserForQuickView.status === "active" ? "default" : "secondary"}
                            >
                              {selectedUserForQuickView.status.charAt(0).toUpperCase() +
                                selectedUserForQuickView.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">{selectedUserForQuickView.email}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              {selectedUserForQuickView.plan.charAt(0).toUpperCase() +
                                selectedUserForQuickView.plan.slice(1)}
                            </Badge>
                            {selectedUserForQuickView.phoneNumber && (
                              <Badge variant="outline">{selectedUserForQuickView.phoneNumber}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Details Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Plan</p>
                          <p className="text-sm font-medium capitalize">{selectedUserForQuickView.plan}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <Badge
                            variant={selectedUserForQuickView.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {selectedUserForQuickView.status.charAt(0).toUpperCase() +
                              selectedUserForQuickView.status.slice(1)}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Subscription Date</p>
                          <p className="text-sm font-medium">
                            {selectedUserForQuickView.subscriptionDate.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                          <p className="text-sm font-medium">
                            {(selectedUserForQuickView.isTrial && selectedUserForQuickView.trialEndsAt
                              ? selectedUserForQuickView.trialEndsAt
                              : selectedUserForQuickView.expiryDate
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {selectedUserForQuickView.isTrial && selectedUserForQuickView.trialEndsAt && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Trial Status</p>
                            <p className="text-sm font-medium">
                              {selectedUserForQuickView.trialEndsAt > new Date() ? "Active" : "Expired"}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Credits Card */}
                  {selectedUserForQuickView.credits !== undefined && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Credits</h3>
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-muted-foreground" />
                          <span className="text-2xl font-bold">{selectedUserForQuickView.credits.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Account Information Card */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Created At</p>
                          <p className="text-sm font-medium">
                            {selectedUserForQuickView.createdAt.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                          <p className="text-sm font-medium">
                            {selectedUserForQuickView.updatedAt.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserDetailsModalOpen(false)
                        handleEdit(selectedUserForQuickView)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserDetailsModalOpen(false)
                        handleSendEmail(selectedUserForQuickView)
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    {selectedUserForQuickView.phoneNumber && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUserDetailsModalOpen(false)
                          handleSendWhatsApp(selectedUserForQuickView)
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send WhatsApp
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserDetailsModalOpen(false)
                        handleManageCredits(selectedUserForQuickView)
                      }}
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      Manage Credits
                    </Button>
                    {selectedUserForQuickView.status === "active" ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUserDetailsModalOpen(false)
                          handleSuspend(selectedUserForQuickView)
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setUserDetailsModalOpen(false)
                          handleActivate(selectedUserForQuickView)
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setUserDetailsModalOpen(false)
                        handleDelete(selectedUserForQuickView)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

