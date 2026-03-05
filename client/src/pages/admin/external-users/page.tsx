import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Plus, UserPlus } from "lucide-react"
import { ExternalUser } from "@/types/admin/users"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  DataTable,
  StatusBadge,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

export default function ExternalUsersPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()

  const [users, setUsers] = useState<ExternalUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/external-users")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch users")
      }
      const data = await response.json()
      const mappedUsers: ExternalUser[] = data.map((user: any) => ({
        ...user,
        subscriptionDate: new Date(user.subscriptionDate),
        expiryDate: new Date(user.expiryDate),
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      }))
      setUsers(mappedUsers)
    } catch (err) {
      console.error("Error fetching users:", err)
      showError(err instanceof Error ? err.message : "Failed to load users.")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSuspend = useCallback(async (user: ExternalUser) => {
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "suspended" }),
      })
      if (!response.ok) throw new Error("Failed to suspend user")
      showSuccess(`User "${user.name}" has been suspended`)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to suspend user.")
    }
  }, [fetchUsers, showSuccess, showError])

  const handleActivate = useCallback(async (user: ExternalUser) => {
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
      if (!response.ok) throw new Error("Failed to activate user")
      showSuccess(`User "${user.name}" has been activated`)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to activate user.")
    }
  }, [fetchUsers, showSuccess, showError])

  const handleDelete = useCallback(async (user: ExternalUser) => {
    if (!window.confirm(`Are you sure you want to delete "${user.name}"? This cannot be undone.`)) return
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete user")
      showSuccess(`User "${user.name}" has been deleted`)
      await fetchUsers()
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete user.")
    }
  }, [fetchUsers, showSuccess, showError])

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "—"
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const columns: Column<ExternalUser>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={user.avatarUrl || getAvatarUrl(user.id, user.email)} alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" data-testid={`text-user-name-${user.id}`}>{user.name}</p>
            <p className="text-xs text-muted-foreground truncate" data-testid={`text-user-email-${user.id}`}>{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      sortable: true,
      render: (user) => <StatusBadge status={user.plan} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (user) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-joined-${user.id}`}>
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "expiryDate",
      header: "Last Active",
      render: (user) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-expiry-${user.id}`}>
          {formatDate(user.isTrial && user.trialEndsAt ? user.trialEndsAt : user.expiryDate)}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<ExternalUser>[] = [
    {
      label: "View Details",
      onClick: (user) => router.push(`/admin/external-users/${user.id}`),
    },
    {
      label: "Edit",
      onClick: (user) => router.push(`/admin/external-users/${user.id}`),
    },
    {
      label: "Suspend",
      onClick: (user) => handleSuspend(user),
      separator: true,
    },
    {
      label: "Activate",
      onClick: (user) => handleActivate(user),
    },
    {
      label: "Delete",
      onClick: (user) => handleDelete(user),
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Clients"
        subtitle="Manage external users and their subscriptions"
        actions={
          <Button data-testid="button-add-user" onClick={() => {}}>
            <UserPlus className="size-4 mr-1.5" />
            Add User
          </Button>
        }
      />

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search clients..."
        searchKey="name"
        rowActions={rowActions}
        onRowClick={(user) => router.push(`/admin/external-users/${user.id}`)}
        filters={[
          { label: "Status", key: "status", options: ["active", "suspended", "inactive"] },
          { label: "Plan", key: "plan", options: ["free", "pro"] },
        ]}
        pageSize={10}
        emptyTitle="No clients found"
        emptyDescription="There are no external users to display."
        isLoading={loading}
      />
    </PageShell>
  )
}
