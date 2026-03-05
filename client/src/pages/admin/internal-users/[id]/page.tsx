import { apiFetch } from '@/lib/supabase'
import { useState, useEffect } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Mail, Lock, Check, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { InternalUser } from "@/types/admin/users"
import {
  PageShell,
  PageHeader,
  StatusBadge,
  InfoRow,
  DetailSection,
} from "@/components/admin-shared"

export default function InternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError, showInfo } = useToast()

  const [user, setUser] = useState<InternalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      try {
        setLoading(true)
        const response = await apiFetch(`/api/admin/internal-users/${userId}`)
        if (!response.ok) {
          if (response.status === 404) { setUser(null); return }
          throw new Error('Failed to fetch user')
        }
        const userData = await response.json()
        setUser({ ...userData, createdAt: new Date(userData.createdAt), updatedAt: new Date(userData.updatedAt) })
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  const handleSuspend = async () => {
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

  const confirmDelete = async () => {
    if (!user) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/internal-users/${user.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete user')
      showSuccess(`User "${user.name}" has been deleted`)
      router.push("/admin/internal-users")
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete user.")
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-12"><Loader /></div>
      </PageShell>
    )
  }

  if (!user) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-muted-foreground">User not found</p>
          <Button variant="outline" onClick={() => router.push("/admin/internal-users")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Team
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/internal-users")} data-testid="button-back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to Team</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        <Avatar className="size-16">
          <AvatarImage src={user.avatarUrl || getAvatarUrl(user.id, user.email)} />
          <AvatarFallback className="text-lg">{user.name.split(" ").map(n => n[0]).join("").toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold font-heading" data-testid="text-user-name">{user.name}</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-user-email">{user.email}</p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <StatusBadge status={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
            <StatusBadge status={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" onClick={() => showInfo(`Email: ${user.email}`)} data-testid="button-send-email">
            <Mail className="h-4 w-4 mr-1.5" />
            Email
          </Button>
          <Button variant="outline" onClick={() => router.push(`/admin/internal-users?edit=${user.id}`)} data-testid="button-edit">
            <Edit className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          {user.status === "active" ? (
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(true)} data-testid="button-suspend">
              <Lock className="h-4 w-4 mr-1.5" />
              Suspend
            </Button>
          ) : (
            <Button variant="outline" onClick={handleActivate} disabled={actionLoading === "activate"} data-testid="button-activate">
              <Check className="h-4 w-4 mr-1.5" />
              Activate
            </Button>
          )}
          <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)} data-testid="button-delete">
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DetailSection title="Contact Information">
          <InfoRow label="Email" value={user.email} />
          {user.phoneNumber && <InfoRow label="Phone" value={user.phoneNumber} />}
          {user.username && <InfoRow label="Username" value={user.username} />}
        </DetailSection>

        <DetailSection title="Account Details">
          <InfoRow label="Role">
            <StatusBadge status={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
          </InfoRow>
          <InfoRow label="Status">
            <StatusBadge status={user.status.charAt(0).toUpperCase() + user.status.slice(1)} />
          </InfoRow>
          <InfoRow
            label="Member Since"
            value={user.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          />
          <InfoRow
            label="Last Updated"
            value={user.updatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          />
        </DetailSection>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
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
            <DialogDescription>Are you sure? They will lose platform access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm"><span className="font-medium">User:</span> {user.name}</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} data-testid="cancel-suspend">Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend} disabled={actionLoading === "suspend"} data-testid="confirm-suspend">
              {actionLoading === "suspend" ? (<><Loader size="sm" className="mr-2" />Suspending...</>) : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
