import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Pencil,
  ClipboardList,
  ListChecks,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  EmptyState,
} from "@/components/admin-shared"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface CROItem {
  id: string
  category_id: string
  label: string
  description: string
  priority: string
  order_index: number
  is_published: boolean
}

interface CROCategory {
  id: string
  title: string
  icon: string | null
  color_config: { bg: string; text: string; border: string; progress: string }
  order_index: number
  is_published: boolean
  items: CROItem[]
}

export default function AdminCROContent() {
  const { showSuccess, showError } = useToast()
  const [categories, setCategories] = useState<CROCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const [catDialogOpen, setCatDialogOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<CROCategory | null>(null)
  const [catForm, setCatForm] = useState({ id: "", title: "", icon: "" })
  const [submittingCat, setSubmittingCat] = useState(false)

  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CROItem | null>(null)
  const [itemParentCatId, setItemParentCatId] = useState("")
  const [itemForm, setItemForm] = useState({ id: "", label: "", description: "", priority: "medium" })
  const [submittingItem, setSubmittingItem] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "item"; id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/cro-content")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setCategories(data)
    } catch {
      showError("Failed to load CRO content")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const openAddCategory = () => {
    setEditingCat(null)
    setCatForm({ id: "", title: "", icon: "" })
    setCatDialogOpen(true)
  }

  const openEditCategory = (cat: CROCategory) => {
    setEditingCat(cat)
    setCatForm({ id: cat.id, title: cat.title, icon: cat.icon || "" })
    setCatDialogOpen(true)
  }

  const saveCategory = async () => {
    if (!catForm.title.trim()) {
      showError("Title is required")
      return
    }
    setSubmittingCat(true)
    try {
      if (editingCat) {
        const res = await apiFetch(`/api/admin/cro-content/categories/${editingCat.id}`, {
          method: "PUT",
          body: JSON.stringify({ title: catForm.title, icon: catForm.icon || null }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Category updated")
      } else {
        if (!catForm.id.trim()) {
          showError("ID is required")
          setSubmittingCat(false)
          return
        }
        const res = await apiFetch("/api/admin/cro-content/categories", {
          method: "POST",
          body: JSON.stringify({
            id: catForm.id,
            title: catForm.title,
            icon: catForm.icon || null,
            color_config: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-100", progress: "bg-gray-500" },
            order_index: categories.length,
          }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Category created")
      }
      setCatDialogOpen(false)
      fetchCategories()
    } catch {
      showError("Failed to save category")
    } finally {
      setSubmittingCat(false)
    }
  }

  const openAddItem = (catId: string) => {
    setEditingItem(null)
    setItemParentCatId(catId)
    setItemForm({ id: "", label: "", description: "", priority: "medium" })
    setItemDialogOpen(true)
    setExpandedCategories(prev => new Set([...prev, catId]))
  }

  const openEditItem = (item: CROItem) => {
    setEditingItem(item)
    setItemParentCatId(item.category_id)
    setItemForm({ id: item.id, label: item.label, description: item.description, priority: item.priority })
    setItemDialogOpen(true)
  }

  const saveItem = async () => {
    if (!itemForm.label.trim()) {
      showError("Label is required")
      return
    }
    setSubmittingItem(true)
    try {
      if (editingItem) {
        const res = await apiFetch(`/api/admin/cro-content/items/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify({
            label: itemForm.label,
            description: itemForm.description,
            priority: itemForm.priority,
          }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Item updated")
      } else {
        if (!itemForm.id.trim()) {
          showError("ID is required")
          setSubmittingItem(false)
          return
        }
        const cat = categories.find(c => c.id === itemParentCatId)
        const res = await apiFetch("/api/admin/cro-content/items", {
          method: "POST",
          body: JSON.stringify({
            id: itemForm.id,
            category_id: itemParentCatId,
            label: itemForm.label,
            description: itemForm.description,
            priority: itemForm.priority,
            order_index: cat ? cat.items.length : 0,
          }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Item created")
      }
      setItemDialogOpen(false)
      fetchCategories()
    } catch {
      showError("Failed to save item")
    } finally {
      setSubmittingItem(false)
    }
  }

  const confirmDelete = (type: "category" | "item", id: string, title: string) => {
    setDeleteTarget({ type, id, title })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const endpoint = deleteTarget.type === "category"
        ? `/api/admin/cro-content/categories/${deleteTarget.id}`
        : `/api/admin/cro-content/items/${deleteTarget.id}`
      const res = await apiFetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error()
      showSuccess(`${deleteTarget.type === "category" ? "Category" : "Item"} deleted`)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchCategories()
    } catch {
      showError("Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (type: "category" | "item", id: string, current: boolean) => {
    try {
      const endpoint = type === "category"
        ? `/api/admin/cro-content/categories/${id}`
        : `/api/admin/cro-content/items/${id}`
      const res = await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ is_published: !current }),
      })
      if (!res.ok) throw new Error()
      fetchCategories()
    } catch {
      showError("Failed to update")
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)
  const publishedCats = categories.filter(c => c.is_published).length
  const publishedItems = categories.reduce((sum, c) => sum + c.items.filter(i => i.is_published).length, 0)

  const priorityColors: Record<string, string> = {
    critical: "text-red-600 bg-red-50",
    high: "text-amber-600 bg-amber-50",
    medium: "text-blue-600 bg-blue-50",
  }

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="CRO Checklist Content" subtitle="Loading..." />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="CRO Checklist Content"
        subtitle="Manage the CRO checklist categories and items that users see"
        actions={
          <Button onClick={openAddCategory} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-add-category">
            <Plus className="h-4 w-4 mr-2" /> Add Category
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Categories" value={categories.length} icon={ClipboardList} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Total Items" value={totalItems} icon={ListChecks} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Published Categories" value={publishedCats} icon={Eye} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Published Items" value={publishedItems} icon={Eye} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </StatGrid>

      {categories.length === 0 ? (
        <EmptyState
          title="No CRO categories yet"
          description="Create your first category to get started"
          actionLabel="Add Category"
          onAction={openAddCategory}
        />
      ) : (
        <div className="space-y-3">
          {categories.map((cat, catIdx) => {
            const isExpanded = expandedCategories.has(cat.id)
            return (
              <div key={cat.id} className="border rounded-lg bg-white overflow-hidden" data-testid={`cro-category-card-${cat.id}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => toggleExpand(cat.id)} className="shrink-0 cursor-pointer" data-testid={`button-expand-cat-${cat.id}`}>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </button>
                  {cat.icon && (
                    <img src={cat.icon} alt="" className="w-6 h-6 object-contain shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{cat.title}</span>
                      {!cat.is_published && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{cat.items.length} items</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished("category", cat.id, cat.is_published)} data-testid={`button-cat-publish-${cat.id}`}>
                      {cat.is_published ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-gray-400" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditCategory(cat)} data-testid={`button-edit-cat-${cat.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => confirmDelete("category", cat.id, cat.title)} data-testid={`button-delete-cat-${cat.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t">
                    {cat.items.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">No items in this category</div>
                    ) : (
                      cat.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 bg-gray-50/50" data-testid={`cro-item-row-${item.id}`}>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-700">{item.label}</span>
                            <p className="text-xs text-gray-400 truncate">{item.description}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${priorityColors[item.priority] || "text-gray-600 bg-gray-50"}`}>
                            {item.priority}
                          </span>
                          {!item.is_published && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">Draft</span>
                          )}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePublished("item", item.id, item.is_published)}>
                              {item.is_published ? <Eye className="h-3 w-3 text-emerald-500" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditItem(item)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => confirmDelete("item", item.id, item.label)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="px-4 py-2 border-t">
                      <Button variant="ghost" size="sm" className="text-sm text-blue-600" onClick={() => openAddItem(cat.id)} data-testid={`button-add-item-${cat.id}`}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Item
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCat ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingCat ? "Update the category details" : "Create a new CRO category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editingCat && (
              <div>
                <Label>ID (slug)</Label>
                <Input value={catForm.id} onChange={e => setCatForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. homepage" data-testid="input-cat-id" />
              </div>
            )}
            <div>
              <Label>Title</Label>
              <Input value={catForm.title} onChange={e => setCatForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Homepage & First Impression" data-testid="input-cat-title" />
            </div>
            <div>
              <Label>Icon URL (optional)</Label>
              <Input value={catForm.icon} onChange={e => setCatForm(f => ({ ...f, icon: e.target.value }))} placeholder="/images/cro-icons/homepage.png" data-testid="input-cat-icon" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCategory} disabled={submittingCat} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-save-category">
              {submittingCat ? "Saving..." : editingCat ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the checklist item" : "Create a new checklist item"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editingItem && (
              <div>
                <Label>ID</Label>
                <Input value={itemForm.id} onChange={e => setItemForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. hp-7" data-testid="input-item-id" />
              </div>
            )}
            <div>
              <Label>Label</Label>
              <Input value={itemForm.label} onChange={e => setItemForm(f => ({ ...f, label: e.target.value }))} placeholder="Checklist item label" data-testid="input-item-label" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={itemForm.description} onChange={e => setItemForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed description" data-testid="input-item-description" />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={itemForm.priority} onValueChange={v => setItemForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger data-testid="select-item-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveItem} disabled={submittingItem} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-save-item">
              {submittingItem ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.type === "category" ? "Category" : "Item"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"?
              {deleteTarget?.type === "category" && " This will also delete all items in this category."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={executeDelete} disabled={deleting} data-testid="button-confirm-delete">
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
