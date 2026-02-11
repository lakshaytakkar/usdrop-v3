"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DevTaskFormData, TaskStatus, TaskPriority } from "@/types/dev-tasks"

interface TaskFormProps {
  initialData?: Partial<DevTaskFormData>
  onSubmit: (data: DevTaskFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function TaskForm({ initialData, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<DevTaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "not-started",
    priority: initialData?.priority || "medium",
    assigned_to: initialData?.assigned_to || null,
    parent_task_id: initialData?.parent_task_id || null,
    project_id: initialData?.project_id || null,
    phase: initialData?.phase || null,
    estimated_hours: initialData?.estimated_hours || null,
    actual_hours: initialData?.actual_hours || null,
    due_date: initialData?.due_date || null,
    figma_link: initialData?.figma_link || null,
    doc_links: initialData?.doc_links || [],
    related_files: initialData?.related_files || [],
    metadata: initialData?.metadata || {},
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addDocLink = () => {
    const link = prompt("Enter documentation link:")
    if (link) {
      setFormData({
        ...formData,
        doc_links: [...(formData.doc_links || []), link],
      })
    }
  }

  const removeDocLink = (index: number) => {
    setFormData({
      ...formData,
      doc_links: formData.doc_links?.filter((_, i) => i !== index) || [],
    })
  }

  const addRelatedFile = () => {
    const file = prompt("Enter related file path:")
    if (file) {
      setFormData({
        ...formData,
        related_files: [...(formData.related_files || []), file],
      })
    }
  }

  const removeRelatedFile = (index: number) => {
    setFormData({
      ...formData,
      related_files: formData.related_files?.filter((_, i) => i !== index) || [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Task title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="datetime-local"
            value={formData.due_date ? new Date(formData.due_date).toISOString().slice(0, 16) : ""}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value || null })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_hours">Estimated Hours</Label>
          <Input
            id="estimated_hours"
            type="number"
            step="0.5"
            value={formData.estimated_hours || ""}
            onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_hours">Actual Hours</Label>
          <Input
            id="actual_hours"
            type="number"
            step="0.5"
            value={formData.actual_hours || ""}
            onChange={(e) => setFormData({ ...formData, actual_hours: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phase">Phase</Label>
          <Input
            id="phase"
            type="number"
            value={formData.phase || ""}
            onChange={(e) => setFormData({ ...formData, phase: e.target.value ? parseInt(e.target.value) : null })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="figma_link">Figma Link</Label>
          <Input
            id="figma_link"
            type="url"
            value={formData.figma_link || ""}
            onChange={(e) => setFormData({ ...formData, figma_link: e.target.value || null })}
            placeholder="https://figma.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Task description..."
          rows={6}
        />
      </div>

      {/* Doc Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documentation Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {formData.doc_links && formData.doc_links.length > 0 ? (
            <div className="space-y-2">
              {formData.doc_links.map((link, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={link} readOnly className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocLink(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No documentation links</p>
          )}
          <Button type="button" variant="outline" size="sm" onClick={addDocLink}>
            Add Link
          </Button>
        </CardContent>
      </Card>

      {/* Related Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Related Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {formData.related_files && formData.related_files.length > 0 ? (
            <div className="space-y-2">
              {formData.related_files.map((file, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={file} readOnly className="flex-1 font-mono text-sm" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRelatedFile(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No related files</p>
          )}
          <Button type="button" variant="outline" size="sm" onClick={addRelatedFile}>
            Add File
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}




