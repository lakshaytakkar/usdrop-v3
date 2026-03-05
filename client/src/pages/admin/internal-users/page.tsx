import { apiFetch } from '@/lib/supabase'
import { useState, useCallback, useEffect } from "react"
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
import { UserPlus, Download, Eye, EyeOff, RefreshCw, Copy } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { InternalUser, InternalUserRole, UserStatus } from "@/types/admin/users"
import {
  PageShell,
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

export default function AdminInternalUsersPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const [users, setUsers] = useState<InternalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<InternalUser | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "executive" as InternalUserRole,
    status: "active" as UserStatus,
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
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
      const errorMessage = err instanceof Error ? err.message : "Failed to load users."
      showError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleExport = useCallback(() => {
    if (users.length === 0) { showError("No users to export"); return }
    const csv = [
      ["Name", "Email", "Role", "Status", "Created At"],
      ...users.map((user) => [
        user.name, user.email, user.role, user.status,
        user.createdAt.toLocaleDateString("en-US"),
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
    showSuccess(`Exported ${users.length} user(s) to CSV`)
  }, [users, showSuccess, showError])

  const handleOpenAddForm = useCallback(() => {
    setEditingUser(null)
    setFormData({ name: "", email: "", password: "", role: "executive", status: "active" })
    setFormErrors({})
    setShowPassword(false)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((user: InternalUser) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: "", role: user.role, status: user.status || "active" })
    setFormErrors({})
    setFormOpen(true)
  }, [])

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(16)
    setFormData((prev) => ({ ...prev, password: newPassword }))
    setShowPassword(true)
  }

  const handleCopyPassword = async () => {
    if (formData.password) {
      await navigator.clipboard.writeText(formData.password)
      showSuccess("Password copied to clipboard")
    }
  }

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
      showSuccess(`User "${userToDelete.name}" has been deleted`)
      setUserToDelete(null)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeactivate = useCallback(async (user: InternalUser) => {
    try {
      const newStatus = user.status === "active" ? "suspended" : "active"
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error(`Failed to ${newStatus === 'suspended' ? 'deactivate' : 'activate'} user`)
      showSuccess(`User "${user.name}" has been ${newStatus === 'suspended' ? 'deactivated' : 'activated'}`)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Action failed.")
    }
  }, [fetchUsers, showSuccess, showError])

  const handleFormSubmit = async () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    if (!editingUser && !formData.password) errors.password = "Password is required"
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setFormLoading(true)
    try {
      let response: Response
      if (editingUser) {
        const updateData: Record<string, string> = { name: formData.name, email: formData.email, role: formData.role, status: formData.status }
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
      showSuccess(editingUser ? `User "${formData.name}" updated` : `User "${formData.name}" created`)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : `Failed to ${editingUser ? 'update' : 'create'} user`)
    } finally {
      setFormLoading(false)
    }
  }

  const columns: Column<InternalUser>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.avatarUrl || getAvatarUrl(user.id, user.email)} />
            <AvatarFallback className="text-xs">{user.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium" data-testid={`text-name-${user.id}`}>{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user) => (
        <StatusBadge status={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user) => (
        <StatusBadge status={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
      ),
    },
    {
      key: "createdAt",
      header: "Joined Date",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-joined-${user.id}`}>
          {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<InternalUser>[] = [
    { label: "View", onClick: (user) => router.push(`/admin/internal-users/${user.id}`) },
    { label: "Edit", onClick: handleEdit },
    {
      label: "Deactivate",
      onClick: handleDeactivate,
      separator: true,
      variant: "destructive",
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Team"
        subtitle="Manage internal users and roles"
        actions={
          <>
            <Button variant="outline" onClick={handleExport} data-testid="button-export">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button onClick={handleOpenAddForm} data-testid="button-add-user">
              <UserPlus className="h-4 w-4 mr-1.5" />
              Add Member
            </Button>
          </>
        }
      />

      <DataTable
        data={users}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search team members..."
        searchKey="name"
        onRowClick={(user) => router.push(`/admin/internal-users/${user.id}`)}
        filters={[
          { label: "Status", key: "status", options: ["active", "inactive", "suspended"] },
          { label: "Role", key: "role", options: ["superadmin", "admin", "manager", "executive"] },
        ]}
        isLoading={loading}
        emptyTitle="No team members found"
        emptyDescription="Add your first team member to get started."
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingUser ? "Edit Member" : "Add Member"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update team member information." : "Create a new internal user account."}
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
            <div className="space-y-2">
              <Label htmlFor="password">{editingUser ? "Change Password" : "Password *"}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }) }}
                    placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
                    className={cn(formErrors.password ? "border-destructive pr-20" : "pr-20")}
                    data-testid="input-password"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} data-testid="toggle-password">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {formData.password && (
                      <Button type="button" variant="ghost" size="icon" onClick={handleCopyPassword} data-testid="copy-password">
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={handleGeneratePassword} data-testid="generate-password">
                  <RefreshCw className="h-4 w-4 mr-1.5" />
                  Generate
                </Button>
              </div>
              {formData.password && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>{getPasswordStrengthLabel(formData.password)}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`} style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }} />
                  </div>
                </div>
              )}
              {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as InternalUserRole })}>
                <SelectTrigger id="role" data-testid="select-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superadmin">Superadmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
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
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setFormOpen(false)} disabled={formLoading} data-testid="cancel-form">Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} data-testid="submit-form">
              {formLoading ? (<><Loader size="sm" className="mr-2" />{editingUser ? "Saving..." : "Creating..."}</>) : (editingUser ? "Save Changes" : "Create Member")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
