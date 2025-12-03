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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react"
import { EmailDrip, DripEmail } from "@/types/admin/email-automation"
import { sampleDrips } from "../data/drips"
import { sampleTemplates } from "../../templates/data/templates"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableEmailItem({ email, onEdit, onDelete, index }: { email: DripEmail; onEdit: () => void; onDelete: () => void; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: email.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const template = sampleTemplates.find(t => t.id === email.templateId)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-1"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {email.order}
              </span>
              <span className="font-medium text-sm">Email {email.order}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="cursor-pointer"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Template:</span> {template?.name || `Template ${email.templateId}`}
            </p>
            <p>
              <span className="text-muted-foreground">Delay:</span> {email.delay} {email.delayUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DripBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const { showSuccess, showError } = useToast()
  const dripId = params.id as string
  const isNew = dripId === 'new'

  const [drip, setDrip] = useState<Partial<EmailDrip>>({
    name: '',
    description: null,
    type: 'utility',
    targetAudience: 'external',
    isActive: true,
    emails: [],
  })
  const [loading, setLoading] = useState(false)
  const [emailEditorOpen, setEmailEditorOpen] = useState(false)
  const [editingEmail, setEditingEmail] = useState<DripEmail | null>(null)
  const [emailForm, setEmailForm] = useState<Partial<DripEmail>>({
    templateId: '',
    delay: 0,
    delayUnit: 'days',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isNew) {
      const existingDrip = sampleDrips.find(d => d.id === dripId)
      if (existingDrip) {
        setDrip(existingDrip)
      }
    }
  }, [dripId, isNew])

  const handleSave = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      showSuccess(`Drip campaign ${isNew ? 'created' : 'updated'} successfully`)
      router.push('/admin/email-automation/drips')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to save drip campaign')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = drip.emails?.findIndex(e => e.id === active.id) ?? -1
      const newIndex = drip.emails?.findIndex(e => e.id === over.id) ?? -1

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedEmails = arrayMove(drip.emails || [], oldIndex, newIndex)
        const updatedEmails = reorderedEmails.map((email, index) => ({
          ...email,
          order: index + 1,
        }))
        setDrip({ ...drip, emails: updatedEmails })
      }
    }
  }

  const openEmailEditor = (email?: DripEmail) => {
    if (email) {
      setEditingEmail(email)
      setEmailForm(email)
    } else {
      setEditingEmail(null)
      setEmailForm({
        templateId: '',
        delay: 0,
        delayUnit: 'days',
      })
    }
    setEmailEditorOpen(true)
  }

  const saveEmail = () => {
    if (editingEmail) {
      // Update existing email
      const updatedEmails = drip.emails?.map(e =>
        e.id === editingEmail.id ? { ...editingEmail, ...emailForm } as DripEmail : e
      ) || []
      setDrip({ ...drip, emails: updatedEmails })
    } else {
      // Add new email
      const newEmail: DripEmail = {
        id: `email-${Date.now()}`,
        order: (drip.emails?.length || 0) + 1,
        templateId: emailForm.templateId || '',
        delay: emailForm.delay || 0,
        delayUnit: emailForm.delayUnit || 'days',
      }
      setDrip({ ...drip, emails: [...(drip.emails || []), newEmail] })
    }
    setEmailEditorOpen(false)
    setEditingEmail(null)
  }

  const deleteEmail = (emailId: string) => {
    const updatedEmails = drip.emails?.filter(e => e.id !== emailId)
      .map((email, index) => ({ ...email, order: index + 1 })) || []
    setDrip({ ...drip, emails: updatedEmails })
  }

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
              {isNew ? 'Create Drip Campaign' : 'Edit Drip Campaign'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isNew ? 'Create a new drip campaign' : 'Edit drip campaign settings and email sequence'}
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
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={drip.name}
                onChange={(e) => setDrip({ ...drip, name: e.target.value })}
                placeholder="New User Onboarding"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={drip.description || ''}
                onChange={(e) => setDrip({ ...drip, description: e.target.value || null })}
                placeholder="Campaign description..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={drip.type}
                  onValueChange={(v) => setDrip({ ...drip, type: v as 'utility' | 'marketing' })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utility">Utility</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select
                  value={drip.targetAudience}
                  onValueChange={(v) => setDrip({ ...drip, targetAudience: v as EmailDrip['targetAudience'] })}
                >
                  <SelectTrigger id="targetAudience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">External Users</SelectItem>
                    <SelectItem value="public">Public Campaign</SelectItem>
                    <SelectItem value="plan_based">Plan-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={drip.isActive}
                onCheckedChange={(checked) => setDrip({ ...drip, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        {/* Email Sequence */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Email Sequence</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEmailEditor()}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {drip.emails && drip.emails.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={drip.emails.map(e => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {drip.emails
                      .sort((a, b) => a.order - b.order)
                      .map((email, index) => (
                        <SortableEmailItem
                          key={email.id}
                          email={email}
                          index={index}
                          onEdit={() => openEmailEditor(email)}
                          onDelete={() => deleteEmail(email.id)}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No emails in sequence</p>
                <p className="text-xs mt-1">Click "Add Email" to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Email Editor Dialog */}
      <Dialog open={emailEditorOpen} onOpenChange={setEmailEditorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEmail ? 'Edit Email' : 'Add Email'}</DialogTitle>
            <DialogDescription>
              Configure email template and delay settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="emailTemplateId">Template</Label>
              <Select
                value={emailForm.templateId}
                onValueChange={(v) => setEmailForm({ ...emailForm, templateId: v })}
              >
                <SelectTrigger id="emailTemplateId">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailDelay">Delay</Label>
                <Input
                  id="emailDelay"
                  type="number"
                  value={emailForm.delay}
                  onChange={(e) => setEmailForm({ ...emailForm, delay: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="emailDelayUnit">Unit</Label>
                <Select
                  value={emailForm.delayUnit}
                  onValueChange={(v) => setEmailForm({ ...emailForm, delayUnit: v as 'minutes' | 'hours' | 'days' })}
                >
                  <SelectTrigger id="emailDelayUnit">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailEditorOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={saveEmail} className="cursor-pointer">
              {editingEmail ? 'Update' : 'Add'} Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}





