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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  StatusBadge,
  type Column,
  type RowAction,
} from "@/components/admin-shared"
import { Mail, Plus, Eye, Send, FileText, Zap, Monitor, Smartphone } from "lucide-react"
import { renderTemplate, getSampleVariables } from "@/lib/email/template-engine"
import { EMAIL_VARIABLES, getVariablesByCategory } from "@/lib/email/variables"
import type { EmailVariable } from "@/lib/email/variables"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: string
  category: string
  description: string | null
  html_content: string
  text_content: string | null
  variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

const TEMPLATE_TYPES = ["utility", "marketing", "transactional"]
const TEMPLATE_CATEGORIES = [
  "welcome",
  "onboarding",
  "password-reset",
  "order-confirmation",
  "shipping-notification",
  "abandoned-cart",
  "re-engagement",
  "promotional",
  "newsletter",
  "custom",
]

const DEFAULT_FORM: {
  name: string
  subject: string
  type: string
  category: string
  description: string
  html_content: string
  text_content: string
  is_active: boolean
} = {
  name: "",
  subject: "",
  type: "utility",
  category: "custom",
  description: "",
  html_content: "",
  text_content: "",
  is_active: true,
}

export default function AdminEmailTemplatesPage() {
  const { showSuccess, showError } = useToast()

  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const [showFormDialog, setShowFormDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testTemplateId, setTestTemplateId] = useState<string | null>(null)
  const [testEmail, setTestEmail] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/email/templates?limit=500")
      if (!response.ok) throw new Error("Failed to fetch templates")
      const data = await response.json()
      setTemplates(data.templates || [])
      setTotal(data.total || 0)
    } catch {
      showError("Failed to load email templates")
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
    setShowFormDialog(true)
  }

  const handleOpenEdit = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      type: template.type,
      category: template.category,
      description: template.description || "",
      html_content: template.html_content,
      text_content: template.text_content || "",
      is_active: template.is_active,
    })
    setShowFormDialog(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
      showError("Name, subject, and HTML content are required")
      return
    }
    try {
      setIsSubmitting(true)
      const isEdit = !!editingTemplate
      const url = isEdit
        ? `/api/admin/email/templates/${editingTemplate.id}`
        : "/api/admin/email/templates"
      const method = isEdit ? "PUT" : "POST"

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Failed to save template")
      showSuccess(isEdit ? "Template updated" : "Template created")
      setShowFormDialog(false)
      setFormData(DEFAULT_FORM)
      setEditingTemplate(null)
      fetchTemplates()
    } catch {
      showError("Failed to save template")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (template: EmailTemplate) => {
    if (!confirm(`Delete "${template.name}"? This will deactivate the template.`)) return
    try {
      const response = await apiFetch(`/api/admin/email/templates/${template.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete template")
      showSuccess(`"${template.name}" deactivated`)
      fetchTemplates()
    } catch {
      showError("Failed to delete template")
    }
  }

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const response = await apiFetch(`/api/admin/email/templates/${template.id}`, {
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

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template)
    setPreviewMode("desktop")
    setShowPreviewDialog(true)
  }

  const handleOpenTest = (template: EmailTemplate) => {
    setTestTemplateId(template.id)
    setTestEmail("")
    setShowTestDialog(true)
  }

  const handleSendTest = async () => {
    if (!testTemplateId) return
    try {
      setIsSendingTest(true)
      const response = await apiFetch(`/api/admin/email/templates/${testTemplateId}/send-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail || undefined }),
      })
      if (!response.ok) throw new Error("Failed to send test email")
      const data = await response.json()
      showSuccess(`Test email sent to ${data.to}`)
      setShowTestDialog(false)
    } catch {
      showError("Failed to send test email")
    } finally {
      setIsSendingTest(false)
    }
  }

  const handleVariableInsert = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      html_content: prev.html_content + variable,
    }))
  }

  const activeCount = templates.filter((t) => t.is_active).length
  const marketingCount = templates.filter((t) => t.type === "marketing").length
  const utilityCount = templates.filter((t) => t.type === "utility").length

  const columns: Column<EmailTemplate>[] = [
    {
      key: "name",
      header: "Template",
      sortable: true,
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium" data-testid={`text-template-name-${item.id}`}>
            {item.name}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[280px]">
            {item.subject}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <Badge variant="outline" className="text-xs capitalize" data-testid={`badge-type-${item.id}`}>
          {item.type}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item) => (
        <span className="text-sm text-muted-foreground capitalize" data-testid={`text-category-${item.id}`}>
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
            data-testid={`switch-active-${item.id}`}
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
        <span className="text-sm text-muted-foreground" data-testid={`text-updated-${item.id}`}>
          {new Date(item.updated_at || item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<EmailTemplate>[] = [
    {
      label: "Preview",
      onClick: handlePreview,
    },
    {
      label: "Edit",
      onClick: handleOpenEdit,
    },
    {
      label: "Send Test",
      onClick: handleOpenTest,
    },
    {
      label: "Delete",
      onClick: handleDelete,
      variant: "destructive",
      separator: true,
    },
  ]

  const sampleVariables = getSampleVariables()

  return (
    <PageShell>
      <PageHeader
        title="Email Templates"
        subtitle="Create and manage email templates"
        actions={
          <Button onClick={handleOpenCreate} data-testid="button-create-template">
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Templates" value={total} icon={Mail} />
        <StatCard label="Active" value={activeCount} icon={FileText} />
        <StatCard label="Marketing" value={marketingCount} icon={Zap} />
        <StatCard label="Utility" value={utilityCount} icon={FileText} />
      </StatGrid>

      <DataTable
        data={templates}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search templates..."
        searchKey="name"
        onRowClick={handleOpenEdit}
        filters={[
          { label: "Type", key: "type", options: TEMPLATE_TYPES },
          { label: "Category", key: "category", options: TEMPLATE_CATEGORIES },
        ]}
        emptyTitle="No email templates"
        emptyDescription="Create your first email template to get started."
        isLoading={loading}
        pageSize={10}
        headerActions={
          <Button onClick={handleOpenCreate} data-testid="button-create-template-table">
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        }
      />

      <Dialog
        open={showFormDialog}
        onOpenChange={(open) => {
          setShowFormDialog(open)
          if (!open) {
            setFormData(DEFAULT_FORM)
            setEditingTemplate(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold font-heading">
              {editingTemplate ? "Edit Template" : "Create Template"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingTemplate ? "Edit email template" : "Create a new email template"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="template-name">Name</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Welcome Email"
                  data-testid="input-template-name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="template-subject">Subject Line</Label>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Welcome to USDrop AI, {{user.name}}!"
                  data-testid="input-template-subject"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="select-template-type">
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
                    <SelectTrigger data-testid="select-template-category">
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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="template-description">Description</Label>
                <Input
                  id="template-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the template"
                  data-testid="input-template-description"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="template-html">HTML Content</Label>
                <Textarea
                  id="template-html"
                  value={formData.html_content}
                  onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                  placeholder="<html>...</html>"
                  className="font-mono text-xs min-h-[240px] resize-y"
                  data-testid="input-template-html"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  data-testid="switch-template-active"
                />
                <Label>Active</Label>
              </div>

              <VariableSelector onVariableSelect={handleVariableInsert} />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label>Preview</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                    data-testid="button-preview-desktop"
                  >
                    <Monitor className="h-4 w-4 mr-1.5" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                    data-testid="button-preview-mobile"
                  >
                    <Smartphone className="h-4 w-4 mr-1.5" />
                    Mobile
                  </Button>
                </div>
              </div>
              <div
                className={cn(
                  "border rounded-md bg-white overflow-auto",
                  previewMode === "desktop" ? "w-full" : "max-w-[375px] mx-auto w-full"
                )}
                style={{ maxHeight: "560px", minHeight: "300px" }}
                data-testid="container-preview"
              >
                {formData.html_content ? (
                  <div
                    className="p-3"
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(formData.html_content, sampleVariables),
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                    Enter HTML content to see preview
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFormDialog(false)}
              data-testid="button-form-cancel"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              data-testid="button-form-submit"
            >
              {isSubmitting
                ? "Saving..."
                : editingTemplate
                  ? "Update Template"
                  : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold font-heading">
              {previewTemplate?.name || "Template Preview"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Subject: {previewTemplate?.subject || ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 pb-2">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
              data-testid="button-preview-dialog-desktop"
            >
              <Monitor className="h-4 w-4 mr-1.5" />
              Desktop
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
              data-testid="button-preview-dialog-mobile"
            >
              <Smartphone className="h-4 w-4 mr-1.5" />
              Mobile
            </Button>
          </div>
          <div
            className={cn(
              "border rounded-md bg-white overflow-auto mx-auto",
              previewMode === "desktop" ? "w-full" : "max-w-[375px] w-full"
            )}
            style={{ maxHeight: "600px" }}
            data-testid="container-preview-dialog"
          >
            {previewTemplate?.html_content ? (
              <div
                className="p-4"
                dangerouslySetInnerHTML={{
                  __html: renderTemplate(previewTemplate.html_content, sampleVariables),
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                No content
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowPreviewDialog(false)} data-testid="button-close-preview">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold font-heading">Send Test Email</DialogTitle>
            <DialogDescription className="sr-only">Send a test email to verify the template</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="test-email">Recipient Email</Label>
              <Input
                id="test-email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Leave blank to send to your email"
                data-testid="input-test-email"
              />
              <p className="text-xs text-muted-foreground">
                If left empty, the test email will be sent to your admin email.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestDialog(false)}
              data-testid="button-cancel-test"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendTest}
              disabled={isSendingTest}
              data-testid="button-send-test"
            >
              <Send className="h-4 w-4 mr-1.5" />
              {isSendingTest ? "Sending..." : "Send Test"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

function VariableSelector({ onVariableSelect }: { onVariableSelect: (variable: string) => void }) {
  const [search, setSearch] = useState("")

  const filteredVariables = EMAIL_VARIABLES.filter(
    (v) =>
      v.key.toLowerCase().includes(search.toLowerCase()) ||
      v.label.toLowerCase().includes(search.toLowerCase())
  )

  const userVariables = getVariablesByCategory("user")
  const orderVariables = getVariablesByCategory("order")
  const systemVariables = getVariablesByCategory("system")
  const companyVariables = getVariablesByCategory("company")

  const handleClick = (variable: EmailVariable) => {
    onVariableSelect(variable.key)
  }

  const renderVariables = (variables: EmailVariable[]) => (
    <div className="flex flex-wrap gap-1.5">
      {variables.map((variable) => (
        <Badge
          key={variable.key}
          variant="outline"
          className="font-mono text-xs cursor-pointer"
          onClick={() => handleClick(variable)}
          title={variable.description}
          data-testid={`badge-variable-${variable.key}`}
        >
          {variable.key}
        </Badge>
      ))}
    </div>
  )

  return (
    <div className="border rounded-md p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-medium">Insert Variable</Label>
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 w-36 text-xs"
          data-testid="input-variable-search"
        />
      </div>
      {search ? (
        renderVariables(filteredVariables)
      ) : (
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="user" className="text-xs">User</TabsTrigger>
            <TabsTrigger value="order" className="text-xs">Order</TabsTrigger>
            <TabsTrigger value="system" className="text-xs">System</TabsTrigger>
            <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
          </TabsList>
          <TabsContent value="user" className="mt-3">
            {renderVariables(userVariables)}
          </TabsContent>
          <TabsContent value="order" className="mt-3">
            {renderVariables(orderVariables)}
          </TabsContent>
          <TabsContent value="system" className="mt-3">
            {renderVariables(systemVariables)}
          </TabsContent>
          <TabsContent value="company" className="mt-3">
            {renderVariables(companyVariables)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
