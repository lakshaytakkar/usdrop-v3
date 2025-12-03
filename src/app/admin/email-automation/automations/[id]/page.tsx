"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Save, Plus, Trash2, X } from "lucide-react"
import { EmailAutomation, AutomationTrigger, AutomationCondition } from "@/types/admin/email-automation"
import { sampleAutomations } from "../data/automations"
import { sampleTemplates } from "../../templates/data/templates"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

export default function AutomationBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const { showSuccess, showError } = useToast()
  const automationId = params.id as string
  const isNew = automationId === 'new'

  const [automation, setAutomation] = useState<Partial<EmailAutomation>>({
    name: '',
    description: null,
    trigger: 'user_signup',
    conditions: [],
    templateId: '',
    delay: 0,
    delayUnit: 'minutes',
    isActive: true,
    targetAudience: 'all',
    planLevels: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isNew) {
      const existingAutomation = sampleAutomations.find(a => a.id === automationId)
      if (existingAutomation) {
        setAutomation(existingAutomation)
      }
    }
  }, [automationId, isNew])

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess(`Automation ${isNew ? 'created' : 'updated'} successfully`)
      router.push('/admin/email-automation/automations')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save automation')
    } finally {
      setLoading(false)
    }
  }

  const addCondition = () => {
    const newCondition: AutomationCondition = {
      id: `cond-${Date.now()}`,
      field: 'user.plan',
      operator: 'equals',
      value: '',
    }
    setAutomation({
      ...automation,
      conditions: [...(automation.conditions || []), newCondition],
    })
  }

  const removeCondition = (conditionId: string) => {
    setAutomation({
      ...automation,
      conditions: automation.conditions?.filter(c => c.id !== conditionId) || [],
    })
  }

  const updateCondition = (conditionId: string, updates: Partial<AutomationCondition>) => {
    setAutomation({
      ...automation,
      conditions: automation.conditions?.map(c =>
        c.id === conditionId ? { ...c, ...updates } : c
      ) || [],
    })
  }

  const triggerOptions: { value: AutomationTrigger; label: string }[] = [
    { value: 'user_signup', label: 'User Signup' },
    { value: 'user_login', label: 'User Login' },
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'order_shipped', label: 'Order Shipped' },
    { value: 'order_delivered', label: 'Order Delivered' },
    { value: 'cart_abandoned', label: 'Cart Abandoned' },
    { value: 'subscription_started', label: 'Subscription Started' },
    { value: 'subscription_cancelled', label: 'Subscription Cancelled' },
    { value: 'plan_upgraded', label: 'Plan Upgraded' },
    { value: 'plan_downgraded', label: 'Plan Downgraded' },
    { value: 'custom_event', label: 'Custom Event' },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              {isNew ? 'Create Automation' : 'Edit Automation'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isNew ? 'Create a new email automation' : 'Edit automation settings and conditions'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? (
            <>
              <Loader size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Automation Name</Label>
              <Input
                id="name"
                value={automation.name}
                onChange={(e) => setAutomation({ ...automation, name: e.target.value })}
                placeholder="Welcome New Users"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={automation.description || ''}
                onChange={(e) => setAutomation({ ...automation, description: e.target.value || null })}
                placeholder="Automation description..."
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={automation.isActive}
                onCheckedChange={(checked) => setAutomation({ ...automation, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Trigger Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trigger">Trigger Type</Label>
              <Select
                value={automation.trigger}
                onValueChange={(v) => setAutomation({ ...automation, trigger: v as AutomationTrigger })}
              >
                <SelectTrigger id="trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {triggerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conditions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={addCondition}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {automation.conditions && automation.conditions.length > 0 ? (
              automation.conditions.map((condition) => (
                <div key={condition.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Condition</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCondition(condition.id)}
                      className="h-6 w-6 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Field</Label>
                      <Select
                        value={condition.field}
                        onValueChange={(v) => updateCondition(condition.id, { field: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user.plan">User Plan</SelectItem>
                          <SelectItem value="user.status">User Status</SelectItem>
                          <SelectItem value="order.total">Order Total</SelectItem>
                          <SelectItem value="order.status">Order Status</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Operator</Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(v) => updateCondition(condition.id, { operator: v as AutomationCondition['operator'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Not Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="greater_than">Greater Than</SelectItem>
                          <SelectItem value="less_than">Less Than</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Value</Label>
                      <Input
                        value={String(condition.value)}
                        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                        placeholder="Value"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No conditions. Automation will trigger for all events.</p>
            )}
          </CardContent>
        </Card>

        {/* Template Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="templateId">Email Template</Label>
              <Select
                value={automation.templateId}
                onValueChange={(v) => setAutomation({ ...automation, templateId: v })}
              >
                <SelectTrigger id="templateId">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {sampleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Delay Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Delay Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="delay">Delay Amount</Label>
                <Input
                  id="delay"
                  type="number"
                  value={automation.delay || 0}
                  onChange={(e) => setAutomation({ ...automation, delay: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="delayUnit">Delay Unit</Label>
                <Select
                  value={automation.delayUnit}
                  onValueChange={(v) => setAutomation({ ...automation, delayUnit: v as 'minutes' | 'hours' | 'days' })}
                >
                  <SelectTrigger id="delayUnit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={automation.targetAudience || 'all'}
              onValueChange={(v) => setAutomation({ ...automation, targetAudience: v as EmailAutomation['targetAudience'] })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="external" id="external" />
                <Label htmlFor="external">External Users Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="internal" id="internal" />
                <Label htmlFor="internal">Internal Users Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plan_based" id="plan_based" />
                <Label htmlFor="plan_based">Plan-Based</Label>
              </div>
            </RadioGroup>
            {automation.targetAudience === 'plan_based' && (
              <div className="mt-4">
                <Label>Select Plans</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Plan selection will be implemented with plan data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





