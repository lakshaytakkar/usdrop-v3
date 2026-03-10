import { useState, useCallback, useEffect, useMemo } from "react"
import { apiFetch } from "@/lib/supabase"
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
import { Plus, Zap, Play, Pause, Trash2, Mail, Clock } from "lucide-react"

interface AutomationCondition {
  id: string
  field: string
  operator: string
  value: string
}

interface EmailAutomation {
  id: string
  name: string
  description: string | null
  trigger: string
  conditions: AutomationCondition[]
  template_id: string | null
  delay: number
  delay_unit: string
  is_active: boolean
  target_audience: string
  plan_levels: string[]
  created_at: string
  updated_at: string
  email_templates?: { id: string; name: string; subject: string } | null
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
}

const TRIGGER_OPTIONS = [
  { value: "user_signup", label: "User Signup" },
  { value: "user_login", label: "User Login" },
  { value: "order_placed", label: "Order Placed" },
  { value: "order_shipped", label: "Order Shipped" },
  { value: "order_delivered", label: "Order Delivered" },
  { value: "cart_abandoned", label: "Cart Abandoned" },
  { value: "subscription_started", label: "Subscription Started" },
  { value: "subscription_cancelled", label: "Subscription Cancelled" },
  { value: "plan_upgraded", label: "Plan Upgraded" },
  { value: "plan_downgraded", label: "Plan Downgraded" },
  { value: "custom_event", label: "Custom Event" },
]

const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "external", label: "External Users" },
  { value: "internal", label: "Internal Users" },
  { value: "plan_based", label: "Plan Based" },
]

const DELAY_UNIT_OPTIONS = [
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
]

const CONDITION_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
]

function getTriggerLabel(trigger: string): string {
  return TRIGGER_OPTIONS.find(t => t.value === trigger)?.label || trigger
}

const emptyForm = {
  name: "",
  description: "",
  trigger: "user_signup",
  template_id: "",
  delay: "0",
  delay_unit: "minutes",
  target_audience: "all",
  plan_levels: "",
  is_active: true,
  conditions: [] as AutomationCondition[],
}

export default function AdminEmailAutomationsPage() {
  const { showSuccess, showError } = useToast()

  const [automations, setAutomations] = useState<EmailAutomation[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const fetchAutomations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/email/automations")
      if (!response.ok) throw new Error("Failed to fetch automations")
      const data = await response.json()
      setAutomations(data.automations || [])
    } catch {
      showError("Failed to load automations")
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/email/templates?limit=200")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch {
      // silent
    }
  }, [])

  useEffect(() => {
    fetchAutomations()
    fetchTemplates()
  }, [fetchAutomations, fetchTemplates])

  const activeCount = useMemo(() => automations.filter(a => a.is_active).length, [automations])
  const pausedCount = useMemo(() => automations.filter(a => !a.is_active).length, [automations])

  const triggerFilterOptions = useMemo(() => {
    const triggers = new Set(automations.map(a => getTriggerLabel(a.trigger)))
    return Array.from(triggers)
  }, [automations])

  const handleToggleActive = async (automation: EmailAutomation) => {
    try {
      const response = await apiFetch(`/api/admin/email/automations/${automation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !automation.is_active }),
      })
      if (!response.ok) throw new Error("Failed to update automation")
      showSuccess(`Automation ${!automation.is_active ? "activated" : "paused"}`)
      fetchAutomations()
    } catch {
      showError("Failed to toggle automation")
    }
  }

  const handleDelete = async (automation: EmailAutomation) => {
    if (!confirm(`Delete "${automation.name}"? This cannot be undone.`)) return
    try {
      const response = await apiFetch(`/api/admin/email/automations/${automation.id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete automation")
      showSuccess(`"${automation.name}" deleted`)
      fetchAutomations()
    } catch {
      showError("Failed to delete automation")
    }
  }

  const openCreateDialog = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setShowDialog(true)
  }

  const openEditDialog = (automation: EmailAutomation) => {
    setEditingId(automation.id)
    setFormData({
      name: automation.name,
      description: automation.description || "",
      trigger: automation.trigger,
      template_id: automation.template_id || "",
      delay: String(automation.delay || 0),
      delay_unit: automation.delay_unit || "minutes",
      target_audience: automation.target_audience || "all",
      plan_levels: (automation.plan_levels || []).join(", "),
      is_active: automation.is_active,
      conditions: automation.conditions || [],
    })
    setShowDialog(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Name is required")
      return
    }
    if (!formData.trigger) {
      showError("Trigger is required")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        name: formData.name,
        description: formData.description || null,
        trigger: formData.trigger,
        template_id: formData.template_id === "none" ? null : (formData.template_id || null),
        delay: parseInt(formData.delay, 10) || 0,
        delay_unit: formData.delay_unit,
        target_audience: formData.target_audience,
        plan_levels: formData.plan_levels
          ? formData.plan_levels.split(",").map(s => s.trim()).filter(Boolean)
          : [],
        is_active: formData.is_active,
        conditions: formData.conditions,
      }

      const url = editingId
        ? `/api/admin/email/automations/${editingId}`
        : "/api/admin/email/automations"
      const method = editingId ? "PUT" : "POST"

      const response = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to save automation")
      showSuccess(editingId ? "Automation updated" : "Automation created")
      setShowDialog(false)
      setEditingId(null)
      setFormData(emptyForm)
      fetchAutomations()
    } catch {
      showError("Failed to save automation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { id: crypto.randomUUID(), field: "", operator: "equals", value: "" },
      ],
    }))
  }

  const removeCondition = (id: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id),
    }))
  }

  const updateCondition = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }))
  }

  const columns: Column<EmailAutomation>[] = [
    {
      key: "name",
      header: "Automation",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-[200px]" data-testid={`text-automation-name-${item.id}`}>
              {item.name}
            </p>
            {item.description && (
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "trigger",
      header: "Trigger",
      render: (item) => (
        <StatusBadge
          status={getTriggerLabel(item.trigger)}
          variant="info"
        />
      ),
    },
    {
      key: "template",
      header: "Template",
      render: (item) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-automation-template-${item.id}`}>
          {item.email_templates?.name || "No template"}
        </span>
      ),
    },
    {
      key: "delay",
      header: "Delay",
      render: (item) => (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span data-testid={`text-automation-delay-${item.id}`}>
            {item.delay > 0 ? `${item.delay} ${item.delay_unit}` : "Immediate"}
          </span>
        </div>
      ),
    },
    {
      key: "target_audience",
      header: "Audience",
      render: (item) => (
        <span className="text-sm text-muted-foreground capitalize" data-testid={`text-automation-audience-${item.id}`}>
          {(item.target_audience || "all").replace("_", " ")}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item) => (
        <div className="flex items-center gap-2" data-testid={`status-automation-${item.id}`}>
          <div className={`w-2 h-2 rounded-full ${item.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
          <span className="text-sm">{item.is_active ? "Active" : "Paused"}</span>
          <Switch
            checked={item.is_active}
            onCheckedChange={() => handleToggleActive(item)}
            data-testid={`switch-automation-active-${item.id}`}
          />
        </div>
      ),
    },
  ]

  const rowActions: RowAction<EmailAutomation>[] = [
    {
      label: "Edit",
      onClick: openEditDialog,
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
        title="Email Automations"
        subtitle="Configure automated email workflows triggered by user events"
        actions={
          <Button onClick={openCreateDialog} data-testid="button-create-automation">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Automation
          </Button>
        }
      />

      <StatGrid>
        <StatCard
          label="Total Automations"
          value={automations.length}
          icon={Zap}
        />
        <StatCard
          label="Active"
          value={activeCount}
          icon={Play}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard
          label="Paused"
          value={pausedCount}
          icon={Pause}
          iconBg="rgba(100, 116, 139, 0.1)"
          iconColor="#64748b"
        />
        <StatCard
          label="Templates Linked"
          value={automations.filter(a => a.template_id).length}
          icon={Mail}
          iconBg="rgba(99, 102, 241, 0.1)"
          iconColor="#6366f1"
        />
      </StatGrid>

      <DataTable
        data={automations}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search automations..."
        searchKey="name"
        onRowClick={openEditDialog}
        filters={
          triggerFilterOptions.length > 0
            ? [{ label: "Trigger", key: "trigger", options: triggerFilterOptions }]
            : []
        }
        emptyTitle="No automations found"
        emptyDescription="Create your first email automation to get started."
        isLoading={loading}
        pageSize={10}
        headerActions={
          <Button onClick={openCreateDialog} data-testid="button-create-automation-table">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Automation
          </Button>
        }
      />

      <FormDialog
        open={showDialog}
        onOpenChange={(open) => {
          setShowDialog(open)
          if (!open) {
            setEditingId(null)
            setFormData(emptyForm)
          }
        }}
        title={editingId ? "Edit Automation" : "Create Automation"}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Update" : "Create"}
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="automation-name">Name</Label>
          <Input
            id="automation-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Welcome Email Automation"
            data-testid="input-automation-name"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="automation-description">Description</Label>
          <Textarea
            id="automation-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this automation does..."
            data-testid="input-automation-description"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Trigger</Label>
          <Select
            value={formData.trigger}
            onValueChange={(value) => setFormData({ ...formData, trigger: value })}
          >
            <SelectTrigger data-testid="select-automation-trigger">
              <SelectValue placeholder="Select trigger" />
            </SelectTrigger>
            <SelectContent>
              {TRIGGER_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Email Template</Label>
          <Select
            value={formData.template_id}
            onValueChange={(value) => setFormData({ ...formData, template_id: value })}
          >
            <SelectTrigger data-testid="select-automation-template">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No template</SelectItem>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="automation-delay">Delay</Label>
            <Input
              id="automation-delay"
              type="number"
              min="0"
              value={formData.delay}
              onChange={(e) => setFormData({ ...formData, delay: e.target.value })}
              placeholder="0"
              data-testid="input-automation-delay"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Unit</Label>
            <Select
              value={formData.delay_unit}
              onValueChange={(value) => setFormData({ ...formData, delay_unit: value })}
            >
              <SelectTrigger data-testid="select-automation-delay-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELAY_UNIT_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Target Audience</Label>
          <Select
            value={formData.target_audience}
            onValueChange={(value) => setFormData({ ...formData, target_audience: value })}
          >
            <SelectTrigger data-testid="select-automation-audience">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCE_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.target_audience === "plan_based" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="automation-plan-levels">Plan Levels (comma separated)</Label>
            <Input
              id="automation-plan-levels"
              value={formData.plan_levels}
              onChange={(e) => setFormData({ ...formData, plan_levels: e.target.value })}
              placeholder="e.g. pro, enterprise"
              data-testid="input-automation-plan-levels"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="automation-active">Active</Label>
          <Switch
            id="automation-active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            data-testid="switch-automation-form-active"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Conditions</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addCondition}
              data-testid="button-add-condition"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Condition
            </Button>
          </div>

          {formData.conditions.length === 0 && (
            <p className="text-xs text-muted-foreground">No conditions. Automation will trigger for all matching events.</p>
          )}

          {formData.conditions.map((condition, idx) => (
            <div key={condition.id} className="flex items-center gap-2">
              <Input
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, "field", e.target.value)}
                placeholder="Field"
                className="flex-1"
                data-testid={`input-condition-field-${idx}`}
              />
              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(condition.id, "operator", value)}
              >
                <SelectTrigger className="w-[130px]" data-testid={`select-condition-operator-${idx}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPERATORS.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                placeholder="Value"
                className="flex-1"
                data-testid={`input-condition-value-${idx}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCondition(condition.id)}
                data-testid={`button-remove-condition-${idx}`}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </FormDialog>
    </PageShell>
  )
}
