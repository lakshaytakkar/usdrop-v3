import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Lock, Check, Search, X, Copy, Eye, EyeOff, RefreshCw, Download, Edit, UserPlus, AlertCircle, Users, Shield, CheckCircle2, Mail, MoreVertical } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  generateSecurePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  getPasswordStrengthProgress,
} from "@/lib/utils/password"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InternalUser, InternalUserRole, UserStatus } from "@/types/admin/users"
import { AdminPageHeader, AdminStatCards, AdminFilterBar, AdminActionBar, AdminStatusBadge, AdminEmptyState } from "@/components/admin"
import { DataTable } from "@/components/data-table/data-table"
import { createInternalUsersColumns } from "./components/internal-users-columns"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"

export default function AdminInternalUsersPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()

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
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>("all")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<InternalUser | null>(null)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [userToSuspend, setUserToSuspend] = useState<InternalUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null)
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  const roles = useMemo(() => ["superadmin", "admin", "manager", "executive"], [])

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: users.length }
    roles.forEach((role) => {
      counts[role] = users.filter((u) => u.role === role).length
    })
    return counts
  }, [users, roles])

  const statusCounts = useMemo(() => {
    return {
      active: users.filter(u => u.status === "active").length,
      suspended: users.filter(u => u.status === "suspended").length,
      inactive: users.filter(u => u.status === "inactive").length,
    }
  }, [users])

  const filteredUsers = useMemo(() => {
    let result = users

    if (selectedRoleTab && selectedRoleTab !== "all") {
      result = result.filter((user) => user.role === selectedRoleTab)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    filters.forEach((filter) => {
      if (!filter.value) return
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return
      if (filter.id === "status") {
        result = result.filter((user) => filterValues.includes(user.status))
      }
    })

    return result
  }, [users, search, filters, selectedRoleTab])

  const sortedUsers = useMemo(() => {
    if (!sorting || sorting.length === 0) return filteredUsers
    const sorted = [...filteredUsers]
    sorting.forEach((sort) => {
      const { id, desc } = sort
      sorted.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number
        switch (id) {
          case "name": aValue = a.name.toLowerCase(); bValue = b.name.toLowerCase(); break
          case "email": aValue = a.email.toLowerCase(); bValue = b.email.toLowerCase(); break
          case "role": aValue = a.role; bValue = b.role; break
          case "status": aValue = a.status; bValue = b.status; break
          case "updatedAt": aValue = a.updatedAt.getTime(); bValue = b.updatedAt.getTime(); break
          default: return 0
        }
        if (aValue < bValue) return desc ? 1 : -1
        if (aValue > bValue) return desc ? -1 : 1
        return 0
      })
    })
    return sorted
  }, [filteredUsers, sorting])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedUsers.slice(start, start + pageSize)
  }, [sortedUsers, page, pageSize])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch("/api/admin/internal-users")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
      const data = await response.json()
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

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const totalPages = Math.ceil(sortedUsers.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) setPage(1)
  }, [sortedUsers.length, pageSize, page])

  const handleViewDetails = useCallback((user: InternalUser) => {
    router.push(`/admin/internal-users/${user.id}`)
  }, [router])

  const handleNameClick = useCallback((user: InternalUser) => {
    router.push(`/admin/internal-users/${user.id}`)
  }, [router])

  const handleEdit = useCallback((user: InternalUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status || "active",
      phoneNumber: user.phoneNumber || "",
      username: user.username || "",
      avatarUrl: user.avatarUrl || "",
    })
    setFormErrors({})
    setFormOpen(true)
  }, [])

  const handleOpenAddForm = useCallback(() => {
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
    if (!canDelete) { showError("You don't have permission to delete users"); return }
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${userToDelete.id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }
      setDeleteConfirmOpen(false)
      showSuccess(`User "${userToDelete.name}" has been deleted successfully`)
      setUserToDelete(null)
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = useCallback((user: InternalUser) => {
    if (!canSuspend) { showError("You don't have permission to suspend users"); return }
    setUserToSuspend(user)
    setSuspendConfirmOpen(true)
  }, [canSuspend, showError])

  const confirmSuspend = async () => {
    if (!userToSuspend) return
    setActionLoading("suspend")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${userToSuspend.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'suspended' }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to suspend user')
      }
      setSuspendConfirmOpen(false)
      showSuccess(`User "${userToSuspend.name}" has been suspended`)
      setUserToSuspend(null)
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to suspend user."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = useCallback(async (user: InternalUser) => {
    if (!canActivate) { showError("You don't have permission to activate users"); return }
    setActionLoading(`activate-${user.id}`)
    try {
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to activate user')
      }
      showSuccess(`User "${user.name}" has been activated`)
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to activate user."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers, showSuccess, showError, canActivate])

  const handleExport = useCallback(() => {
    if (sortedUsers.length === 0) { showError("There are no users to export"); return }
    const csv = [
      ["Name", "Email", "Role", "Status", "Created At", "Last Updated"],
      ...sortedUsers.map((user) => [
        user.name, user.email, user.role, user.status,
        user.createdAt.toLocaleDateString("en-US"),
        user.updatedAt.toLocaleDateString("en-US"),
      ]),
    ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
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
  }, [sortedUsers, showSuccess, showError])

  const handleSendEmail = useCallback((user: InternalUser) => {
    showInfo(`Email functionality will be implemented. User: ${user.email}`)
  }, [showInfo])

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) { setPageSize(s); setPage(1) }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: InternalUser[]) => {
    setSelectedUsers(selectedRows)
  }, [])

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
    if (!canEdit) { showError("You don't have permission to create or edit users"); return }
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    else {
      const duplicateUser = users.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id
      )
      if (duplicateUser) errors.email = "This email is already in use"
    }
    if (!editingUser && !formData.password) errors.password = "Password is required"
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Invalid phone number format"
    }
    if (formData.username) {
      const duplicateUsername = users.find(
        (u) => (u as any).username?.toLowerCase() === formData.username.toLowerCase() && u.id !== editingUser?.id
      )
      if (duplicateUsername) errors.username = "This username is already in use"
    }
    if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl)) {
      errors.avatarUrl = "Invalid URL format"
    }
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setFormLoading(true)
    try {
      let response: Response
      if (editingUser) {
        const updateData: any = { name: formData.name, email: formData.email, role: formData.role, status: formData.status }
        if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber
        if (formData.username) updateData.username = formData.username
        if (formData.avatarUrl) updateData.avatarUrl = formData.avatarUrl
        if (formData.password) updateData.password = formData.password
        response = await apiFetch(`/api/admin/internal-users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      } else {
        response = await apiFetch('/api/admin/internal-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      }
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${editingUser ? 'update' : 'create'} user`)
      }
      setFormOpen(false)
      showSuccess(editingUser ? `User "${formData.name}" updated successfully` : `User "${formData.name}" created successfully`)
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${editingUser ? 'update' : 'create'} user`
      showError(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleBulkSuspend = async () => {
    if (selectedUsers.length === 0) return
    setActionLoading("bulk-suspend")
    try {
      for (const user of selectedUsers) {
        await apiFetch(`/api/admin/internal-users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'suspended' }),
        })
      }
      showSuccess(`${selectedUsers.length} user(s) suspended`)
      setSelectedUsers([])
      await fetchUsers()
    } catch (err) {
      showError("Failed to suspend selected users")
    } finally {
      setActionLoading(null)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return
    setActionLoading("bulk-delete")
    try {
      for (const user of selectedUsers) {
        await apiFetch(`/api/admin/internal-users/${user.id}`, { method: 'DELETE' })
      }
      showSuccess(`${selectedUsers.length} user(s) deleted`)
      setSelectedUsers([])
      await fetchUsers()
    } catch (err) {
      showError("Failed to delete selected users")
    } finally {
      setActionLoading(null)
    }
  }

  const statCards = useMemo(() => [
    { label: "Total Members", value: users.length, icon: Users, badge: `${roleCounts.superadmin + roleCounts.admin} admins`, badgeVariant: "info" as const },
    { label: "Active", value: statusCounts.active, icon: CheckCircle2, badge: `${Math.round((statusCounts.active / Math.max(users.length, 1)) * 100)}%`, badgeVariant: "success" as const },
    { label: "Suspended", value: statusCounts.suspended, icon: Lock, badge: statusCounts.suspended > 0 ? "Needs attention" : "None", badgeVariant: statusCounts.suspended > 0 ? "warning" as const : "success" as const },
    { label: "Roles", value: roles.length, icon: Shield, description: "superadmin, admin, manager, executive" },
  ], [users.length, roleCounts, statusCounts, roles.length])

  const roleTabs = useMemo(() => [
    { value: "all", label: "All", count: roleCounts.all },
    { value: "superadmin", label: "Superadmin", count: roleCounts.superadmin },
    { value: "admin", label: "Admin", count: roleCounts.admin },
    { value: "manager", label: "Manager", count: roleCounts.manager },
    { value: "executive", label: "Executive", count: roleCounts.executive },
  ], [roleCounts])

  const filterConfig = useMemo(() => [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
    },
  ], [])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden" data-testid="internal-users-page">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <AdminPageHeader
            title="Team Members"
            description="Manage internal users, roles and permissions"
            breadcrumbs={[
              { label: "Admin", href: "/admin" },
              { label: "Team Members" },
            ]}
            actions={[
              { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport, variant: "outline" },
              { label: "Add Team Member", icon: <UserPlus className="h-4 w-4" />, onClick: handleOpenAddForm },
            ]}
          />

          <AdminStatCards stats={statCards} loading={initialLoading} columns={4} />

          {selectedUsers.length > 0 && (
            <AdminActionBar
              selectedCount={selectedUsers.length}
              onClearSelection={() => setSelectedUsers([])}
              actions={[
                { label: "Suspend", icon: <Lock className="h-4 w-4" />, onClick: handleBulkSuspend, variant: "outline", loading: actionLoading === "bulk-suspend" },
                { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: handleBulkDelete, variant: "destructive", loading: actionLoading === "bulk-delete" },
                { label: "Export", icon: <Download className="h-4 w-4" />, onClick: handleExport, variant: "outline" },
              ]}
            />
          )}

          <AdminFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search by name or email..."
            tabs={roleTabs}
            activeTab={selectedRoleTab}
            onTabChange={setSelectedRoleTab}
          />

          <DataTable
            columns={columns}
            data={paginatedUsers}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            onSortingChange={setSorting}
            onFilterChange={setFilters}
            onSearchChange={() => {}}
            loading={loading}
            initialLoading={initialLoading}
            filterConfig={filterConfig}
            searchPlaceholder="Search users..."
            page={page}
            pageSize={pageSize}
            enableRowSelection={true}
            onRowSelectionChange={handleRowSelectionChange}
            onRowClick={handleViewDetails}
          />
        </div>
      </div>

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
              <p className="text-sm"><span className="font-medium">User:</span> {userToDelete.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {userToDelete.email}</p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} data-testid="cancel-delete">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} data-testid="confirm-delete">
              {actionLoading === "delete" ? (<><Loader size="sm" className="mr-2" />Deleting...</>) : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <p className="text-sm"><span className="font-medium">User:</span> {userToSuspend.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {userToSuspend.email}</p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} data-testid="cancel-suspend">Cancel</Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"} data-testid="confirm-suspend">
              {actionLoading === "suspend" ? (<><Loader size="sm" className="mr-2" />Suspending...</>) : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update user information and role." : "Create a new internal user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }) }}
                placeholder="Enter full name"
                className={formErrors.name ? "border-destructive" : ""}
                data-testid="input-name"
              />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }) }}
                placeholder="Enter email address"
                className={formErrors.email ? "border-destructive" : ""}
                data-testid="input-email"
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }) }}
                      placeholder="Enter password"
                      className={cn(formErrors.password ? "border-destructive pr-20" : "pr-20")}
                      data-testid="input-password"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPassword(!showPassword)} data-testid="toggle-password">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {formData.password && (
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopyPassword} data-testid="copy-password">
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleGeneratePassword} className="flex-shrink-0" data-testid="generate-password">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>{getPasswordStrengthLabel(formData.password)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`} style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }} />
                    </div>
                  </div>
                )}
                {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as InternalUserRole })}>
                <SelectTrigger id="role" data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}>
                <SelectTrigger id="status" data-testid="select-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="more-options" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-2">
                    <span>More Options</span>
                    {(() => {
                      const filledCount = [formData.phoneNumber, formData.username, formData.avatarUrl, editingUser && formData.password ? formData.password : null].filter(Boolean).length
                      return filledCount > 0 ? <Badge variant="secondary" className="text-xs">{filledCount} filled</Badge> : null
                    })()}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={(e) => { setFormData({ ...formData, phoneNumber: e.target.value }); if (formErrors.phoneNumber) setFormErrors({ ...formErrors, phoneNumber: "" }) }} placeholder="+1234567890" className={formErrors.phoneNumber ? "border-destructive" : ""} data-testid="input-phone" />
                    {formErrors.phoneNumber && <p className="text-xs text-destructive">{formErrors.phoneNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={formData.username} onChange={(e) => { setFormData({ ...formData, username: e.target.value }); if (formErrors.username) setFormErrors({ ...formErrors, username: "" }) }} placeholder="username" className={formErrors.username ? "border-destructive" : ""} data-testid="input-username" />
                    {formErrors.username && <p className="text-xs text-destructive">{formErrors.username}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input id="avatarUrl" type="url" value={formData.avatarUrl} onChange={(e) => { setFormData({ ...formData, avatarUrl: e.target.value }); if (formErrors.avatarUrl) setFormErrors({ ...formErrors, avatarUrl: "" }) }} placeholder="https://example.com/avatar.jpg" className={formErrors.avatarUrl ? "border-destructive" : ""} data-testid="input-avatar-url" />
                    {formErrors.avatarUrl && <p className="text-xs text-destructive">{formErrors.avatarUrl}</p>}
                  </div>
                  {editingUser && (
                    <div className="space-y-2">
                      <Label htmlFor="passwordReset">Change Password</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input id="passwordReset" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }) }} placeholder="Leave blank to keep current password" className={cn(formErrors.password ? "border-destructive pr-20" : "pr-20")} data-testid="input-password-reset" />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button type="button" variant="outline" onClick={handleGeneratePassword} className="flex-shrink-0">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                      {formData.password && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Password strength:</span>
                            <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>{getPasswordStrengthLabel(formData.password)}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`} style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }} />
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
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={formLoading} data-testid="cancel-form">Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} data-testid="submit-form">
              {formLoading ? (<><Loader size="sm" className="mr-2" />{editingUser ? "Saving..." : "Creating..."}</>) : (editingUser ? "Save Changes" : "Create User")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
