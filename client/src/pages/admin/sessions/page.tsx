import { useState, useEffect, useCallback, useMemo } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Video, Eye, EyeOff, Calendar, Clock, Plus, ExternalLink, FolderOpen, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface MentorshipSession {
  id: string
  title: string
  description: string
  url: string
  category: string
  duration: string | null
  session_date: string | null
  order_index: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function AdminSessionsPage() {
  const { showSuccess, showError } = useToast()
  const [sessions, setSessions] = useState<MentorshipSession[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingSession, setEditingSession] = useState<MentorshipSession | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formUrl, setFormUrl] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [formCustomCategory, setFormCustomCategory] = useState("")
  const [formDuration, setFormDuration] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formPublished, setFormPublished] = useState(true)
  const [reorderMode, setReorderMode] = useState(false)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/sessions")
      if (res.ok) {
        const data = await res.json()
        setSessions(data)
      }
    } catch {
      showError("Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const categories = useMemo(() => {
    const cats = new Set(sessions.map((s) => s.category))
    return Array.from(cats).sort()
  }, [sessions])

  const stats = useMemo(() => {
    const published = sessions.filter((s) => s.is_published).length
    const unpublished = sessions.length - published
    const byCat: Record<string, number> = {}
    sessions.forEach((s) => {
      byCat[s.category] = (byCat[s.category] || 0) + 1
    })
    return { total: sessions.length, published, unpublished, byCat }
  }, [sessions])

  const resetForm = () => {
    setFormTitle("")
    setFormDescription("")
    setFormUrl("")
    setFormCategory("")
    setFormCustomCategory("")
    setFormDuration("")
    setFormDate("")
    setFormPublished(true)
    setEditingSession(null)
  }

  const openEdit = (session: MentorshipSession) => {
    setEditingSession(session)
    setFormTitle(session.title)
    setFormDescription(session.description || "")
    setFormUrl(session.url)
    setFormCategory(session.category)
    setFormCustomCategory("")
    setFormDuration(session.duration || "")
    setFormDate(session.session_date ? session.session_date.split("T")[0] : "")
    setFormPublished(session.is_published)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const category = formCategory === "__custom__" ? formCustomCategory : formCategory
    if (!formTitle || !formUrl || !category) {
      showError("Title, URL, and category are required")
      return
    }
    try {
      setSubmitting(true)
      const body = {
        title: formTitle,
        description: formDescription,
        url: formUrl,
        category,
        duration: formDuration || null,
        session_date: formDate || null,
        is_published: formPublished,
      }

      if (editingSession) {
        const res = await apiFetch(`/api/admin/sessions/${editingSession.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to update")
        showSuccess("Session updated")
      } else {
        const res = await apiFetch("/api/admin/sessions", {
          method: "POST",
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to create")
        showSuccess("Session created")
      }
      setDialogOpen(false)
      resetForm()
      fetchSessions()
    } catch {
      showError(editingSession ? "Failed to update session" : "Failed to create session")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (session: MentorshipSession) => {
    try {
      const res = await apiFetch(`/api/admin/sessions/${session.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      showSuccess("Session deleted")
      fetchSessions()
    } catch {
      showError("Failed to delete session")
    }
  }

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const newSessions = [...sessions]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSessions.length) return

    const temp = newSessions[index]
    newSessions[index] = newSessions[targetIndex]
    newSessions[targetIndex] = temp

    const reordered = newSessions.map((s, i) => ({ ...s, order_index: i }))
    setSessions(reordered)

    try {
      for (const s of reordered) {
        await apiFetch(`/api/admin/sessions/${s.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order_index: s.order_index }),
        })
      }
    } catch {
      showError("Failed to reorder")
      fetchSessions()
    }
  }

  const handleTogglePublished = async (session: MentorshipSession) => {
    try {
      const res = await apiFetch(`/api/admin/sessions/${session.id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_published: !session.is_published }),
      })
      if (!res.ok) throw new Error("Failed to update")
      showSuccess(session.is_published ? "Session unpublished" : "Session published")
      fetchSessions()
    } catch {
      showError("Failed to update session")
    }
  }

  const columns: Column<MentorshipSession>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (s) => (
        <div className="min-w-0 max-w-[280px]">
          <p className="text-sm font-medium truncate" data-testid={`text-title-${s.id}`}>{s.title}</p>
          {s.description && (
            <p className="text-xs text-muted-foreground truncate">{s.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (s) => <StatusBadge status={s.category} variant="info" />,
    },
    {
      key: "duration",
      header: "Duration",
      render: (s) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-duration-${s.id}`}>
          {s.duration || "\u2014"}
        </span>
      ),
    },
    {
      key: "session_date",
      header: "Date",
      sortable: true,
      render: (s) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-date-${s.id}`}>
          {s.session_date ? format(new Date(s.session_date), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Published",
      render: (s) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleTogglePublished(s)
          }}
          className="cursor-pointer"
          data-testid={`toggle-published-${s.id}`}
        >
          <StatusBadge status={s.is_published ? "Published" : "Draft"} />
        </button>
      ),
    },
    {
      key: "url",
      header: "URL",
      render: (s) => (
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          data-testid={`link-url-${s.id}`}
        >
          <ExternalLink className="size-3" />
          Open
        </a>
      ),
    },
  ]

  const rowActions: RowAction<MentorshipSession>[] = [
    {
      label: "Edit",
      onClick: (s) => openEdit(s),
    },
    {
      label: "Toggle Published",
      onClick: (s) => handleTogglePublished(s),
    },
    {
      label: "Delete",
      onClick: (s) => handleDelete(s),
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Sessions"
        subtitle="Manage mentorship session recordings"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={reorderMode ? "default" : "outline"}
              onClick={() => setReorderMode(!reorderMode)}
              data-testid="button-toggle-reorder"
            >
              <ArrowUpDown className="size-4 mr-1.5" />
              {reorderMode ? "Done Reordering" : "Reorder"}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetForm()
                setDialogOpen(true)
              }}
              data-testid="button-add-session"
            >
              <Plus className="size-4 mr-1.5" />
              Add Session
            </Button>
          </div>
        }
      />

      <StatGrid>
        <StatCard label="Total Sessions" value={stats.total} icon={Video} />
        <StatCard
          label="Published"
          value={stats.published}
          icon={Eye}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard
          label="Unpublished"
          value={stats.unpublished}
          icon={EyeOff}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
        />
        <StatCard
          label="Categories"
          value={categories.length}
          icon={FolderOpen}
          iconBg="rgba(139, 92, 246, 0.1)"
          iconColor="#8b5cf6"
        />
      </StatGrid>

      {reorderMode ? (
        <div className="rounded-xl border bg-card overflow-hidden" data-testid="section-reorder">
          <div className="px-4 py-3 border-b">
            <p className="text-sm text-muted-foreground">Drag sessions up/down to reorder them</p>
          </div>
          <div className="divide-y">
            {sessions.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3" data-testid={`reorder-row-${s.id}`}>
                <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => handleReorder(i, "up")} data-testid={`button-reorder-up-${s.id}`}>
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" disabled={i === sessions.length - 1} onClick={() => handleReorder(i, "down")} data-testid={`button-reorder-down-${s.id}`}>
                    <ArrowDown className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DataTable
          data={sessions}
          columns={columns}
          rowActions={rowActions}
          searchPlaceholder="Search sessions..."
          searchKey="title"
          isLoading={loading}
          filters={[
            {
              label: "Category",
              key: "category",
              options: categories,
            },
            {
              label: "Status",
              key: "is_published",
              options: ["true", "false"],
            },
          ]}
          emptyTitle="No sessions yet"
          emptyDescription="Add your first mentorship session recording."
        />
      )}

      <FormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}
        title={editingSession ? "Edit Session" : "Add Session"}
        onSubmit={handleSubmit}
        submitLabel={editingSession ? "Update" : "Create"}
        isSubmitting={submitting}
      >
        <div className="space-y-1.5">
          <Label htmlFor="session-title">Title</Label>
          <Input
            id="session-title"
            placeholder="e.g. Product Research Deep Dive"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            data-testid="input-session-title"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-url">Video URL</Label>
          <Input
            id="session-url"
            placeholder="https://drive.google.com/..."
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            data-testid="input-session-url"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={formCategory} onValueChange={setFormCategory}>
            <SelectTrigger data-testid="select-session-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
              <SelectItem value="__custom__">+ Custom Category</SelectItem>
            </SelectContent>
          </Select>
          {formCategory === "__custom__" && (
            <Input
              placeholder="Enter custom category..."
              value={formCustomCategory}
              onChange={(e) => setFormCustomCategory(e.target.value)}
              className="mt-2"
              data-testid="input-session-custom-category"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="session-description">Description</Label>
          <Textarea
            id="session-description"
            placeholder="Session description..."
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="resize-none"
            data-testid="input-session-description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="session-duration">Duration</Label>
            <Input
              id="session-duration"
              placeholder="e.g. 45 min"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              data-testid="input-session-duration"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="session-date">Date</Label>
            <Input
              id="session-date"
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              data-testid="input-session-date"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="session-published">Published</Label>
          <Switch
            id="session-published"
            checked={formPublished}
            onCheckedChange={setFormPublished}
            data-testid="switch-session-published"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
