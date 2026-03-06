import { useState, useEffect, useCallback } from "react"
import { useParams } from "wouter"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/hooks/use-router"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  FastForward,
  MessageCircle,
  MoreHorizontal,
  Eye,
  Trash2,
  Copy,
  Users,
  Calendar,
  Layers,
} from "lucide-react"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  StatusBadge,
  FormDialog,
  EmptyState,
} from "@/components/admin-shared"

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  account_type: string | null
  phone_number: string | null
}

interface BatchMember {
  id: string
  batch_id: string
  user_id: string
  current_week: number
  status: string
  joined_at: string
  updated_at: string
  user: UserProfile | null
}

interface BatchDetail {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  max_size: number | null
  status: string
  created_at: string
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function AdminBatchDetail() {
  const { id } = useParams<{ id: string }>()
  const { showSuccess, showError } = useToast()
  const router = useRouter()

  const [batch, setBatch] = useState<BatchDetail | null>(null)
  const [members, setMembers] = useState<BatchMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdvancing, setIsAdvancing] = useState(false)

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [newMemberUserId, setNewMemberUserId] = useState("")
  const [isAddingMember, setIsAddingMember] = useState(false)

  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)

  const fetchBatch = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await apiFetch(`/api/admin/batches/${id}`)
      if (!res.ok) throw new Error("Failed to fetch batch")
      const data = await res.json()
      setBatch(data.batch)
      setMembers(data.members || [])
    } catch {
      showError("Failed to load batch details")
    } finally {
      setIsLoading(false)
    }
  }, [id, showError])

  useEffect(() => {
    if (id) fetchBatch()
  }, [id, fetchBatch])

  const handleAddMember = async () => {
    if (!newMemberUserId.trim()) {
      showError("User ID is required")
      return
    }
    setIsAddingMember(true)
    try {
      const res = await apiFetch(`/api/admin/batches/${id}/members`, {
        method: "POST",
        body: JSON.stringify({ user_id: newMemberUserId.trim() }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to add member")
      }
      showSuccess("Member added to batch")
      setShowAddMemberDialog(false)
      setNewMemberUserId("")
      fetchBatch()
    } catch (err: any) {
      showError(err.message || "Failed to add member")
    } finally {
      setIsAddingMember(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const res = await apiFetch(`/api/admin/batches/${id}/members/${memberId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to remove member")
      showSuccess("Member removed from batch")
      fetchBatch()
    } catch {
      showError("Failed to remove member")
    }
  }

  const handleAdvanceAll = async () => {
    setIsAdvancing(true)
    try {
      const res = await apiFetch(`/api/admin/batches/${id}/advance-all`, { method: "POST" })
      if (!res.ok) throw new Error("Failed to advance")
      const data = await res.json()
      showSuccess(`Advanced ${data.updated} members to the next week`)
      fetchBatch()
    } catch {
      showError("Failed to advance members")
    } finally {
      setIsAdvancing(false)
    }
  }

  const generateWhatsAppMessage = () => {
    if (!batch) return ""
    const activeMembers = members.filter((m) => m.status === "active")
    const avgWeek = activeMembers.length > 0
      ? Math.round(activeMembers.reduce((sum, m) => sum + m.current_week, 0) / activeMembers.length)
      : 0
    return `Hi team! Batch "${batch.name}" update:\n- ${activeMembers.length} active members\n- Average progress: Week ${avgWeek}\n- Keep up the great work!`
  }

  const handleCopyWhatsApp = () => {
    const msg = generateWhatsAppMessage()
    navigator.clipboard.writeText(msg)
    showSuccess("WhatsApp message copied to clipboard")
    setShowWhatsAppDialog(false)
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="space-y-4">
          <div className="h-8 w-64 bg-muted/50 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-muted/50 rounded-xl animate-pulse" />
        </div>
      </PageShell>
    )
  }

  if (!batch) {
    return (
      <PageShell>
        <EmptyState title="Batch not found" description="This batch does not exist or has been deleted." />
      </PageShell>
    )
  }

  const activeMembers = members.filter((m) => m.status === "active")
  const avgWeek = activeMembers.length > 0
    ? Math.round(activeMembers.reduce((sum, m) => sum + m.current_week, 0) / activeMembers.length)
    : 0

  return (
    <PageShell>
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={() => router.push("/admin/clients")} data-testid="button-back-clients">
          <ArrowLeft className="size-4" />
        </Button>
        <PageHeader
          title={batch.name}
          subtitle={`Batch members and progress tracking`}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWhatsAppDialog(true)}
                data-testid="button-message-batch"
              >
                <MessageCircle className="size-4 mr-1.5" />
                Message Batch
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdvanceAll}
                disabled={isAdvancing}
                data-testid="button-advance-all"
              >
                <FastForward className="size-4 mr-1.5" />
                {isAdvancing ? "Advancing..." : "Advance All"}
              </Button>
              <Button size="sm" onClick={() => setShowAddMemberDialog(true)} data-testid="button-add-member">
                <Plus className="size-4 mr-1.5" />
                Add Member
              </Button>
            </div>
          }
        />
      </div>

      <StatGrid>
        <StatCard label="Total Members" value={members.length} icon={Users} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" />
        <StatCard label="Active" value={activeMembers.length} icon={Users} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
        <StatCard label="Avg. Week" value={`Week ${avgWeek}`} icon={Calendar} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
        <StatCard
          label="Capacity"
          value={batch.max_size ? `${members.length}/${batch.max_size}` : `${members.length}`}
          icon={Layers}
          iconBg="rgba(139,92,246,0.1)"
          iconColor="#8b5cf6"
        />
      </StatGrid>

      <div className="rounded-xl border bg-card overflow-hidden" data-testid="section-batch-members">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Members</h3>
          <StatusBadge status={batch.status} />
        </div>

        {members.length === 0 ? (
          <EmptyState
            title="No members yet"
            description="Add members to this batch to get started."
            actionLabel="Add Member"
            onAction={() => setShowAddMemberDialog(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Week</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Updated</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => {
                  const user = member.user
                  return (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-muted/20 cursor-pointer"
                      onClick={() => user && router.push(`/admin/users/${user.id}`)}
                      data-testid={`row-member-${member.id}`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={user?.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">{getInitials(user?.full_name || null)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate" data-testid={`text-member-name-${member.id}`}>
                              {user?.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="secondary" className="border-0 text-xs">
                          Week {member.current_week}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {member.joined_at ? format(new Date(member.joined_at), "MMM d, yyyy") : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground">
                          {member.updated_at ? format(new Date(member.updated_at), "MMM d, yyyy") : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" data-testid={`button-member-actions-${member.id}`}>
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => user && router.push(`/admin/users/${user.id}`)}
                              data-testid={`action-view-member-${member.id}`}
                            >
                              <Eye className="size-3.5 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive"
                              data-testid={`action-remove-member-${member.id}`}
                            >
                              <Trash2 className="size-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <FormDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
        title="Add Member"
        onSubmit={handleAddMember}
        submitLabel="Add Member"
        isSubmitting={isAddingMember}
      >
        <div className="space-y-1.5">
          <Label htmlFor="member-user-id">User ID</Label>
          <Input
            id="member-user-id"
            value={newMemberUserId}
            onChange={(e) => setNewMemberUserId(e.target.value)}
            placeholder="Enter user ID (UUID)"
            data-testid="input-member-user-id"
          />
          <p className="text-xs text-muted-foreground">Paste the user&apos;s UUID from the Users page</p>
        </div>
      </FormDialog>

      <FormDialog
        open={showWhatsAppDialog}
        onOpenChange={setShowWhatsAppDialog}
        title="Message Batch"
        onSubmit={handleCopyWhatsApp}
        submitLabel="Copy Message"
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Copy this pre-written message to send via WhatsApp to the batch group.
          </p>
          <div className="rounded-lg border bg-muted/30 p-4">
            <pre className="text-sm whitespace-pre-wrap font-sans" data-testid="text-whatsapp-message">
              {generateWhatsAppMessage()}
            </pre>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleCopyWhatsApp}
            data-testid="button-copy-whatsapp"
          >
            <Copy className="size-4 mr-1.5" />
            Copy to Clipboard
          </Button>
        </div>
      </FormDialog>
    </PageShell>
  )
}
