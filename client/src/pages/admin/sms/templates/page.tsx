import { useState, useCallback, useEffect } from "react"
import { apiFetch } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
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
import { MessageSquare, Plus, FileText, Zap } from "lucide-react"

interface SmsTemplate {
  id: string
  name: string
  body: string
  type: string
  category: string
  variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

const TEMPLATE_TYPES = ["utility", "marketing", "transactional"]
const TEMPLATE_CATEGORIES = [
  "utility",
  "marketing",
  "transactional",
  "welcome",
  "onboarding",
  "learning",
  "mentorship",
  "store",
  "llc",
  "re-engagement",
  "retention",
]

const DEFAULT_FORM = {
  name: "",
  body: "",
  type: "utility",
  category: "utility",
  is_active: true,
}

export default function AdminSmsTemplatesPage() {
  const { showSuccess, showError } = useToast()

  const [templates, setTemplates] = useState<SmsTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const [showDialog, setShowDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/sms/templates?limit=500")
      if (!response.ok) throw new Error("Failed to fetch templates")
      const data = await response.json()
      setTemplates(data.templates || [])
      setTotal(data.total || 0)
    } catch {
      showError("Failed to load SMS templates")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleOpenCreate = () => {
    setEditingTemplate(null)
    setFormData(DEFAULT_FORM)
    setShowDialog(true)
  }

  const handleOpenEdit = (template: SmsTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      body: template.body,
      type: template.type,
      category: template.category,
      is_active: template.is_active,
    })
    setShowDialog(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.body.trim()) {
      showError("Name and body are required")
      return
    }
    try {
      setIsSubmitting(true)
      const isEdit = !!editingTemplate
      const url = isEdit
        ? `/api/admin/sms/templates/${editingTemplate.id}`
        : "/api/admin/sms/templates"
      const method = isEdit ? "PUT" : "POST"

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to save template")
      showSuccess(isEdit ? "Template updated" : "Template created")
      setShowDialog(false)
      setFormData(DEFAULT_FORM)
      setEditingTemplate(null)
      fetchTemplates()
    } catch {
      showError("Failed to save template")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (template: SmsTemplate) => {
    if (!confirm(`Delete "${template.name}"? This will deactivate the template.`)) return
    try {
      const response = await apiFetch(`/api/admin/sms/templates/${template.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete template")
      showSuccess(`"${template.name}" deactivated`)
      fetchTemplates()
    } catch {
      showError("Failed to delete template")
    }
  }

  const handleToggleActive = async (template: SmsTemplate) => {
    try {
      const response = await apiFetch(`/api/admin/sms/templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !template.is_active }),
      })
      if (!response.ok) throw new Error("Failed to update status")
      showSuccess(`Template ${!template.is_active ? "activated" : "deactivated"}`)
      fetchTemplates()
    } catch {
      showError("Failed to update template status")
    }
  }

  const activeCount = templates.filter((t) => t.is_active).length
  const marketingCount = templates.filter((t) => t.type === "marketing").length
  const utilityCount = templates.filter((t) => t.type === "utility").length

  const charCount = formData.body.length
  const segmentCount = Math.ceil(charCount / 160) || 0

  const columns: Column<SmsTemplate>[] = [
    {
      key: "name",
      header: "Template",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium" data-testid={`text-sms-template-name-${item.id}`}>
            {item.name}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[280px]">
            {item.body.slice(0, 60)}{item.body.length > 60 ? "..." : ""}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <Badge variant="outline" className="text-xs capitalize" data-testid={`badge-sms-type-${item.id}`}>
          {item.type}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="text-sm text-muted-foreground capitalize" data-testid={`text-sms-category-${item.id}`}>
          {item.category.replace(/-/g, " ")}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={item.is_active}
            onCheckedChange={() => handleToggleActive(item)}
            data-testid={`switch-sms-active-${item.id}`}
          />
          <StatusBadge
            status={item.is_active ? "Active" : "Inactive"}
            variant={item.is_active ? "success" : "neutral"}
          />
        </div>
      ),
    },
    {
      key: "updated_at",
      header: "Last Updated",
      sortable: true,
      render: (item) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-sms-updated-${item.id}`}>
          {new Date(item.updated_at || item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<SmsTemplate>[] = [
    {
      label: "Edit",
      onClick: handleOpenEdit,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ]

  return (
    <PageShell>
      <PageHeader
        title="SMS Templates"
        subtitle="Create and manage SMS message templates"
        actions={
          <Button onClick={handleOpenCreate} data-testid="button-create-sms-template">
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Templates" value={total} icon={MessageSquare} />
        <StatCard label="Active" value={activeCount} icon={FileText} />
        <StatCard label="Marketing" value={marketingCount} icon={Zap} />
        <StatCard label="Utility" value={utilityCount} icon={FileText} />
      </StatGrid>

      <DataTable
        data={templates}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search SMS templates..."
        searchKey="name"
        onRowClick={handleOpenEdit}
        filters={[
          { label: "Type", key: "type", options: TEMPLATE_TYPES },
          { label: "Category", key: "category", options: TEMPLATE_CATEGORIES },
        ]}
        emptyTitle="No SMS templates"
        emptyDescription="Create your first SMS template to get started."
        isLoading={loading}
        pageSize={10}
        headerActions={
          <Button onClick={handleOpenCreate} data-testid="button-create-sms-template-table">
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        }
      />

      <FormDialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) {
            setFormData(DEFAULT_FORM)
            setEditingTemplate(null)
          }
        }}
        title={editingTemplate ? "Edit SMS Template" : "Create SMS Template"}
        onSubmit={handleSubmit}
        submitLabel={editingTemplate ? "Update" : "Create"}
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sms-template-name">Name</Label>
          <Input
            id="sms-template-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome SMS"
            data-testid="input-sms-template-name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sms-template-body">Message Body</Label>
          <Textarea
            id="sms-template-body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Hi {{user.name}}, welcome to USDrop!"
            className="min-h-[120px] resize-y"
            data-testid="input-sms-template-body"
          />
          <p className="text-xs text-muted-foreground">
            {charCount} characters | {segmentCount} SMS segment{segmentCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger data-testid="select-sms-template-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger data-testid="select-sms-template-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="sms-template-active">Active</Label>
          <Switch
            id="sms-template-active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            data-testid="switch-sms-template-active"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}
