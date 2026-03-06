import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Link2, Plus, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react"
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

interface ImportantLink {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  icon: string | null
  is_published: boolean
  order_index: number
  created_at: string
  updated_at: string
}

const LINK_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "supplier", label: "Supplier" },
  { value: "tool", label: "Tool" },
  { value: "learning", label: "Learning" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "shipping", label: "Shipping" },
  { value: "finance", label: "Finance" },
]

export default function AdminImportantLinksPage() {
  const { showSuccess, showError } = useToast()
  const [links, setLinks] = useState<ImportantLink[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingLink, setEditingLink] = useState<ImportantLink | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formUrl, setFormUrl] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formCategory, setFormCategory] = useState("general")
  const [formIcon, setFormIcon] = useState("")
  const [formPublished, setFormPublished] = useState(true)

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/important-links")
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch {
      showError("Failed to load links")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const resetForm = () => {
    setFormTitle("")
    setFormUrl("")
    setFormDescription("")
    setFormCategory("general")
    setFormIcon("")
    setFormPublished(true)
    setEditingLink(null)
  }

  const openAdd = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (link: ImportantLink) => {
    setEditingLink(link)
    setFormTitle(link.title)
    setFormUrl(link.url)
    setFormDescription(link.description || "")
    setFormCategory(link.category)
    setFormIcon(link.icon || "")
    setFormPublished(link.is_published)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formUrl.trim()) {
      showError("Title and URL are required")
      return
    }
    setSubmitting(true)
    try {
      const body = {
        title: formTitle.trim(),
        url: formUrl.trim(),
        description: formDescription.trim() || null,
        category: formCategory,
        icon: formIcon.trim() || null,
        is_published: formPublished,
      }

      const res = editingLink
        ? await apiFetch(`/api/admin/important-links/${editingLink.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await apiFetch("/api/admin/important-links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })

      if (res.ok) {
        showSuccess(editingLink ? "Link updated" : "Link created")
        setDialogOpen(false)
        resetForm()
        fetchLinks()
      } else {
        const err = await res.json()
        showError(err.error || "Failed to save")
      }
    } catch {
      showError("Failed to save link")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (link: ImportantLink) => {
    if (!confirm(`Delete "${link.title}"?`)) return
    try {
      const res = await apiFetch(`/api/admin/important-links/${link.id}`, { method: "DELETE" })
      if (res.ok) {
        showSuccess("Link deleted")
        fetchLinks()
      }
    } catch {
      showError("Failed to delete")
    }
  }

  const togglePublish = async (link: ImportantLink) => {
    try {
      await apiFetch(`/api/admin/important-links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !link.is_published }),
      })
      fetchLinks()
    } catch {
      showError("Failed to update")
    }
  }

  const moveOrder = async (link: ImportantLink, direction: "up" | "down") => {
    const idx = links.findIndex(l => l.id === link.id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= links.length) return

    try {
      await Promise.all([
        apiFetch(`/api/admin/important-links/${link.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: links[swapIdx].order_index }),
        }),
        apiFetch(`/api/admin/important-links/${links[swapIdx].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_index: link.order_index }),
        }),
      ])
      fetchLinks()
    } catch {
      showError("Failed to reorder")
    }
  }

  const publishedCount = links.filter(l => l.is_published).length
  const categoryLabel = (cat: string) => LINK_CATEGORIES.find(c => c.value === cat)?.label || cat

  const columns: Column<ImportantLink>[] = [
    {
      key: "title",
      label: "Link",
      render: (link) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
            <Link2 className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{link.title}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 truncate block hover:underline" onClick={e => e.stopPropagation()}>
              {link.url}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (link) => (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {categoryLabel(link.category)}
        </span>
      ),
    },
    {
      key: "is_published",
      label: "Status",
      render: (link) => (
        <StatusBadge
          status={link.is_published ? "active" : "inactive"}
          label={link.is_published ? "Published" : "Draft"}
        />
      ),
    },
    {
      key: "order_index",
      label: "Order",
      render: (link) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); moveOrder(link, "up"); }}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
            data-testid={`button-move-up-${link.id}`}
          >
            <ArrowUp className="h-3 w-3" />
          </button>
          <span className="text-xs text-gray-400 w-5 text-center">{link.order_index}</span>
          <button
            onClick={(e) => { e.stopPropagation(); moveOrder(link, "down"); }}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
            data-testid={`button-move-down-${link.id}`}
          >
            <ArrowDown className="h-3 w-3" />
          </button>
        </div>
      ),
    },
  ]

  const rowActions: RowAction<ImportantLink>[] = [
    {
      label: "Open URL",
      icon: <ExternalLink className="h-3.5 w-3.5" />,
      onClick: (link) => window.open(link.url, "_blank"),
    },
    {
      label: "Toggle Publish",
      icon: <Eye className="h-3.5 w-3.5" />,
      onClick: (link) => togglePublish(link),
    },
    {
      label: "Edit",
      onClick: (link) => openEdit(link),
    },
    {
      label: "Delete",
      onClick: (link) => handleDelete(link),
      variant: "destructive" as any,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="Important Links"
        description="Manage resource links visible to all users"
        actions={
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-add-link">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Link
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Links" value={links.length} icon={<Link2 className="h-5 w-5" />} />
        <StatCard label="Published" value={publishedCount} icon={<Eye className="h-5 w-5" />} />
        <StatCard label="Draft" value={links.length - publishedCount} icon={<EyeOff className="h-5 w-5" />} />
        <StatCard label="Categories" value={new Set(links.map(l => l.category)).size} icon={<Link2 className="h-5 w-5" />} />
      </StatGrid>

      <DataTable
        data={links}
        columns={columns}
        rowActions={rowActions}
        loading={loading}
        emptyMessage="No important links yet"
        onRowClick={openEdit}
        rowTestId={(link) => `row-link-${link.id}`}
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}
        title={editingLink ? "Edit Link" : "Add Link"}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel={editingLink ? "Save Changes" : "Create Link"}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              data-testid="input-link-title"
              placeholder="e.g. Shopify Partner Program"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              data-testid="input-link-url"
              placeholder="https://..."
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-testid="input-link-description"
              placeholder="Brief description of this link"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger data-testid="select-link-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LINK_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="icon">Icon (emoji or text)</Label>
              <Input
                id="icon"
                data-testid="input-link-icon"
                placeholder="e.g. 🔗 or S"
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={formPublished}
              onCheckedChange={setFormPublished}
              data-testid="switch-link-published"
            />
          </div>
        </div>
      </FormDialog>
    </PageShell>
  )
}
