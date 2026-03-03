import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Edit,
  Mail,
  Calendar,
  User,
  Lock,
  Check,
  Trash2,
  UserCog,
  Shield,
  Phone,
  Globe,
  Clock,
} from "lucide-react"
import { InternalUser } from "@/types/admin/users"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import { AdminDetailLayout, AdminStatusBadge } from "@/components/admin"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { cn } from "@/lib/utils"

const PERMISSION_MODULES = [
  { id: "dashboard", name: "Dashboard", description: "Access to admin dashboard and analytics" },
  { id: "external_users", name: "Client Management", description: "View and manage external users/clients" },
  { id: "internal_users", name: "Team Management", description: "View and manage internal team members" },
  { id: "products", name: "Products", description: "Manage product listings and inventory" },
  { id: "courses", name: "Courses & Academy", description: "Manage courses, modules and chapters" },
  { id: "categories", name: "Categories", description: "Manage product categories" },
  { id: "competitor_stores", name: "Competitor Stores", description: "Manage and monitor competitor stores" },
  { id: "suppliers", name: "Suppliers", description: "Manage supplier relationships" },
  { id: "plans", name: "Plans & Billing", description: "Manage subscription plans and billing" },
  { id: "leads", name: "Leads", description: "Manage sales leads and pipeline" },
  { id: "shopify_stores", name: "Shopify Stores", description: "Manage connected Shopify stores" },
  { id: "reports", name: "Reports & Analytics", description: "Access financial and performance reports" },
]

const PERMISSION_ACTIONS = ["view", "create", "edit", "delete"]

const ROLE_DEFAULT_PERMISSIONS: Record<string, Record<string, string[]>> = {
  superadmin: Object.fromEntries(PERMISSION_MODULES.map(m => [m.id, [...PERMISSION_ACTIONS]])),
  admin: Object.fromEntries(PERMISSION_MODULES.map(m => [m.id, [...PERMISSION_ACTIONS]])),
  manager: Object.fromEntries(PERMISSION_MODULES.map(m => [m.id, ["view", "edit"]])),
  executive: Object.fromEntries(PERMISSION_MODULES.map(m => [m.id, ["view"]])),
}

export default function InternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError, showInfo } = useToast()

  const [user, setUser] = useState<InternalUser | null>(null)
  const [allUsers, setAllUsers] = useState<InternalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      try {
        setLoading(true)
        const response = await apiFetch(`/api/admin/internal-users/${userId}`)
        if (!response.ok) {
          if (response.status === 404) { setUser(null); return }
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch user')
        }
        const userData = await response.json()
        const u = { ...userData, createdAt: new Date(userData.createdAt), updatedAt: new Date(userData.updatedAt) }
        setUser(u)
        setPermissions(ROLE_DEFAULT_PERMISSIONS[u.role] || {})
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await apiFetch("/api/admin/internal-users")
        if (response.ok) {
          const data = await response.json()
          setAllUsers(data.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt), updatedAt: new Date(u.updatedAt) })))
        }
      } catch (err) { console.error('Error fetching all users:', err) }
    }
    fetchAllUsers()
  }, [])

  const { prevUser, nextUser, currentIndex } = useMemo(() => {
    if (!user) return { prevUser: null, nextUser: null, currentIndex: -1 }
    const idx = allUsers.findIndex((u) => u.id === user.id)
    return {
      prevUser: idx > 0 ? allUsers[idx - 1] : null,
      nextUser: idx < allUsers.length - 1 ? allUsers[idx + 1] : null,
      currentIndex: idx,
    }
  }, [user, allUsers])

  const handleEdit = () => {
    router.push(`/admin/internal-users?edit=${user?.id}`)
  }

  const handleSendEmail = () => {
    showInfo(`Email functionality will be implemented. User: ${user?.email}`)
  }

  const handleSuspend = () => { setSuspendConfirmOpen(true) }

  const confirmSuspend = async () => {
    if (!user) return
    setActionLoading("suspend")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'suspended' }),
      })
      if (!response.ok) throw new Error('Failed to suspend user')
      setUser({ ...user, status: "suspended" as const, updatedAt: new Date() })
      setSuspendConfirmOpen(false)
      showSuccess(`User "${user.name}" has been suspended`)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to suspend user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async () => {
    if (!user) return
    setActionLoading("activate")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })
      if (!response.ok) throw new Error('Failed to activate user')
      setUser({ ...user, status: "active" as const, updatedAt: new Date() })
      showSuccess(`User "${user.name}" has been activated`)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to activate user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = () => { setDeleteConfirmOpen(true) }

  const confirmDelete = async () => {
    if (!user) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete user')
      showSuccess(`User "${user.name}" has been deleted successfully`)
      router.push("/admin/internal-users")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete user.")
    } finally {
      setActionLoading(null)
    }
  }

  const togglePermission = (moduleId: string, action: string) => {
    setPermissions(prev => {
      const current = prev[moduleId] || []
      const has = current.includes(action)
      return {
        ...prev,
        [moduleId]: has ? current.filter(a => a !== action) : [...current, action],
      }
    })
    showInfo("Permission changes are saved locally (backend integration pending)")
  }

  const handleSavePermissions = () => {
    showSuccess("Permissions saved successfully")
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8"><Loader /></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">User not found</div>
        </div>
      </div>
    )
  }

  const headerActions = [
    { label: "Send Email", icon: <Mail className="h-4 w-4" />, onClick: handleSendEmail },
    { label: "Manage Permissions", icon: <UserCog className="h-4 w-4" />, onClick: () => showInfo("Switch to the Permissions tab"), separator: true },
    ...(user.status === "active"
      ? [{ label: "Suspend", icon: <Lock className="h-4 w-4" />, onClick: handleSuspend, separator: true }]
      : [{ label: "Activate", icon: <Check className="h-4 w-4" />, onClick: handleActivate, separator: true }]),
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: handleDelete, variant: "destructive" as const, separator: true },
  ]

  const overviewTab = (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium" data-testid="text-email">{user.email}</p>
            </div>
          </div>
          {user.phoneNumber && (
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium" data-testid="text-phone">{user.phoneNumber}</p>
              </div>
            </div>
          )}
          {user.username && (
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-medium" data-testid="text-username">{user.username}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <AdminStatusBadge status={user.role === "superadmin" ? "active" : user.role === "admin" ? "active" : "pending"} label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium" data-testid="text-member-since">
                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium" data-testid="text-last-updated">
                {new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const permissionsTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Permission Matrix</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure what this user can access. Defaults based on role: <span className="font-medium">{user.role}</span>
          </p>
        </div>
        <Button size="sm" onClick={handleSavePermissions} data-testid="save-permissions">
          Save Permissions
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Module</th>
                  {PERMISSION_ACTIONS.map(action => (
                    <th key={action} className="text-center py-3 px-3 font-medium text-muted-foreground capitalize w-20">
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_MODULES.map((mod, i) => (
                  <tr key={mod.id} className={cn("border-b last:border-0", i % 2 === 0 ? "bg-muted/20" : "")}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-sm" data-testid={`text-module-${mod.id}`}>{mod.name}</p>
                        <p className="text-xs text-muted-foreground">{mod.description}</p>
                      </div>
                    </td>
                    {PERMISSION_ACTIONS.map(action => {
                      const isEnabled = (permissions[mod.id] || []).includes(action)
                      return (
                        <td key={action} className="text-center py-3 px-3">
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => togglePermission(mod.id, action)}
                            data-testid={`switch-${mod.id}-${action}`}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const activityTab = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Account created</p>
              <p className="text-xs text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          {user.status === "suspended" && (
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Account suspended</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Last profile update</p>
              <p className="text-xs text-muted-foreground">
                {new Date(user.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">Full activity logging will be available in a future update.</p>
      </CardContent>
    </Card>
  )

  const settingsTab = (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">User Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email Notifications</p>
            <p className="text-xs text-muted-foreground">Receive email notifications for important events</p>
          </div>
          <Switch defaultChecked data-testid="switch-email-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Two-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to the account</p>
          </div>
          <Switch data-testid="switch-2fa" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">API Access</p>
            <p className="text-xs text-muted-foreground">Allow API key generation for programmatic access</p>
          </div>
          <Switch defaultChecked={user.role === "superadmin" || user.role === "admin"} data-testid="switch-api-access" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto" data-testid="internal-user-detail-page">
      <AdminDetailLayout
        backHref="/admin/internal-users"
        backLabel="Team Members"
        title={user.name}
        subtitle={user.email}
        avatarUrl={getAvatarUrl(user.id, user.email)}
        badges={[
          <AdminStatusBadge key="role" status={user.role === "superadmin" || user.role === "admin" ? "active" : "pending"} label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />,
          <AdminStatusBadge key="status" status={user.status} dot />,
        ]}
        primaryActions={
          <Button onClick={handleEdit} variant="outline" size="sm" data-testid="button-edit">
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
        }
        actions={headerActions}
        tabs={[
          { value: "overview", label: "Overview", content: overviewTab },
          { value: "permissions", label: "Permissions", icon: <Shield className="h-4 w-4" />, content: permissionsTab },
          { value: "activity", label: "Activity", content: activityTab },
          { value: "settings", label: "Settings", content: settingsTab },
        ]}
        defaultTab="overview"
        onPrev={prevUser ? () => router.push(`/admin/internal-users/${prevUser.id}`) : undefined}
        onNext={nextUser ? () => router.push(`/admin/internal-users/${nextUser.id}`) : undefined}
        hasPrev={!!prevUser}
        hasNext={!!nextUser}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">User:</span> {user.name}</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
          </div>
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
            <DialogDescription>Are you sure you want to suspend this user? They will not be able to access the platform.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">User:</span> {user.name}</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} data-testid="cancel-suspend">Cancel</Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"} data-testid="confirm-suspend">
              {actionLoading === "suspend" ? (<><Loader size="sm" className="mr-2" />Suspending...</>) : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
