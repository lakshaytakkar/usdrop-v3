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
  Map,
  ListChecks,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface RoadmapTask {
  id: string
  stage_id: string
  task_no: number
  title: string
  link: string | null
  order_index: number
  is_published: boolean
}

interface RoadmapStage {
  id: string
  number: number
  title: string
  phase: string
  order_index: number
  is_published: boolean
  tasks: RoadmapTask[]
}

export default function AdminRoadmapContent() {
  const { showSuccess, showError } = useToast()
  const [stages, setStages] = useState<RoadmapStage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())

  const [stageDialogOpen, setStageDialogOpen] = useState(false)
  const [editingStage, setEditingStage] = useState<RoadmapStage | null>(null)
  const [stageForm, setStageForm] = useState({ number: 0, title: "", phase: "" })
  const [submittingStage, setSubmittingStage] = useState(false)

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<RoadmapTask | null>(null)
  const [taskParentStageId, setTaskParentStageId] = useState("")
  const [taskForm, setTaskForm] = useState({ id: "", task_no: 0, title: "", link: "" })
  const [submittingTask, setSubmittingTask] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: "stage" | "task"; id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchStages = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/roadmap-content")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setStages(data)
    } catch {
      showError("Failed to load roadmap content")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { fetchStages() }, [fetchStages])

  const openAddStage = () => {
    setEditingStage(null)
    const nextNum = stages.length > 0 ? Math.max(...stages.map(s => s.number)) + 1 : 1
    setStageForm({ number: nextNum, title: "", phase: "" })
    setStageDialogOpen(true)
  }

  const openEditStage = (stage: RoadmapStage) => {
    setEditingStage(stage)
    setStageForm({ number: stage.number, title: stage.title, phase: stage.phase })
    setStageDialogOpen(true)
  }

  const saveStage = async () => {
    if (!stageForm.title.trim() || !stageForm.phase.trim()) {
      showError("Title and phase are required")
      return
    }
    setSubmittingStage(true)
    try {
      if (editingStage) {
        const res = await apiFetch(`/api/admin/roadmap-content/stages/${editingStage.id}`, {
          method: "PUT",
          body: JSON.stringify(stageForm),
        })
        if (!res.ok) throw new Error()
        showSuccess("Stage updated")
      } else {
        const res = await apiFetch("/api/admin/roadmap-content/stages", {
          method: "POST",
          body: JSON.stringify({ ...stageForm, order_index: stages.length }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Stage created")
      }
      setStageDialogOpen(false)
      fetchStages()
    } catch {
      showError("Failed to save stage")
    } finally {
      setSubmittingStage(false)
    }
  }

  const openAddTask = (stageId: string) => {
    setEditingTask(null)
    setTaskParentStageId(stageId)
    const stage = stages.find(s => s.id === stageId)
    const allTasks = stages.flatMap(s => s.tasks)
    const nextNo = allTasks.length > 0 ? Math.max(...allTasks.map(t => t.task_no)) + 1 : 1
    const nextTaskId = `t-${nextNo}`
    setTaskForm({ id: nextTaskId, task_no: nextNo, title: "", link: "" })
    setTaskDialogOpen(true)
    if (stage) setExpandedStages(prev => new Set([...prev, stageId]))
  }

  const openEditTask = (task: RoadmapTask) => {
    setEditingTask(task)
    setTaskParentStageId(task.stage_id)
    setTaskForm({ id: task.id, task_no: task.task_no, title: task.title, link: task.link || "" })
    setTaskDialogOpen(true)
  }

  const saveTask = async () => {
    if (!taskForm.title.trim()) {
      showError("Title is required")
      return
    }
    setSubmittingTask(true)
    try {
      if (editingTask) {
        const res = await apiFetch(`/api/admin/roadmap-content/tasks/${editingTask.id}`, {
          method: "PUT",
          body: JSON.stringify({
            task_no: taskForm.task_no,
            title: taskForm.title,
            link: taskForm.link || null,
          }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Task updated")
      } else {
        const stage = stages.find(s => s.id === taskParentStageId)
        const res = await apiFetch("/api/admin/roadmap-content/tasks", {
          method: "POST",
          body: JSON.stringify({
            id: taskForm.id,
            stage_id: taskParentStageId,
            task_no: taskForm.task_no,
            title: taskForm.title,
            link: taskForm.link || null,
            order_index: stage ? stage.tasks.length : 0,
          }),
        })
        if (!res.ok) throw new Error()
        showSuccess("Task created")
      }
      setTaskDialogOpen(false)
      fetchStages()
    } catch {
      showError("Failed to save task")
    } finally {
      setSubmittingTask(false)
    }
  }

  const confirmDelete = (type: "stage" | "task", id: string, title: string) => {
    setDeleteTarget({ type, id, title })
    setDeleteDialogOpen(true)
  }

  const executeDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const endpoint = deleteTarget.type === "stage"
        ? `/api/admin/roadmap-content/stages/${deleteTarget.id}`
        : `/api/admin/roadmap-content/tasks/${deleteTarget.id}`
      const res = await apiFetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error()
      showSuccess(`${deleteTarget.type === "stage" ? "Stage" : "Task"} deleted`)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchStages()
    } catch {
      showError("Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (type: "stage" | "task", id: string, current: boolean) => {
    try {
      const endpoint = type === "stage"
        ? `/api/admin/roadmap-content/stages/${id}`
        : `/api/admin/roadmap-content/tasks/${id}`
      const res = await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ is_published: !current }),
      })
      if (!res.ok) throw new Error()
      fetchStages()
    } catch {
      showError("Failed to update")
    }
  }

  const moveStage = async (index: number, direction: "up" | "down") => {
    const newStages = [...stages]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= newStages.length) return

    const temp = newStages[index].order_index
    newStages[index].order_index = newStages[swapIndex].order_index
    newStages[swapIndex].order_index = temp;
    [newStages[index], newStages[swapIndex]] = [newStages[swapIndex], newStages[index]]

    setStages(newStages)
    try {
      await apiFetch("/api/admin/roadmap-content/stages/reorder", {
        method: "PUT",
        body: JSON.stringify({
          stages: newStages.map((s, i) => ({ id: s.id, order_index: i })),
        }),
      })
    } catch {
      showError("Failed to reorder")
      fetchStages()
    }
  }

  const moveTask = async (stageId: string, taskIndex: number, direction: "up" | "down") => {
    const stage = stages.find(s => s.id === stageId)
    if (!stage) return
    const newTasks = [...stage.tasks]
    const swapIndex = direction === "up" ? taskIndex - 1 : taskIndex + 1
    if (swapIndex < 0 || swapIndex >= newTasks.length) return;
    [newTasks[taskIndex], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[taskIndex]]

    setStages(prev => prev.map(s => s.id === stageId ? { ...s, tasks: newTasks } : s))
    try {
      await apiFetch("/api/admin/roadmap-content/tasks/reorder", {
        method: "PUT",
        body: JSON.stringify({
          tasks: newTasks.map((t, i) => ({ id: t.id, order_index: i })),
        }),
      })
    } catch {
      showError("Failed to reorder")
      fetchStages()
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const totalTasks = stages.reduce((sum, s) => sum + s.tasks.length, 0)
  const publishedStages = stages.filter(s => s.is_published).length
  const publishedTasks = stages.reduce((sum, s) => sum + s.tasks.filter(t => t.is_published).length, 0)

  if (loading) {
    return (
      <PageShell>
        <PageHeader title="Roadmap Content" subtitle="Loading..." />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <PageHeader
        title="Roadmap Content"
        subtitle="Manage the roadmap stages and tasks that users see in their journey"
        actions={
          <Button onClick={openAddStage} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-add-stage">
            <Plus className="h-4 w-4 mr-2" /> Add Stage
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Stages" value={stages.length} icon={Map} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard label="Total Tasks" value={totalTasks} icon={ListChecks} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard label="Published Stages" value={publishedStages} icon={Eye} iconBg="bg-purple-50" iconColor="text-purple-600" />
        <StatCard label="Published Tasks" value={publishedTasks} icon={Eye} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </StatGrid>

      {stages.length === 0 ? (
        <EmptyState
          title="No roadmap stages yet"
          description="Create your first roadmap stage to get started"
          actionLabel="Add Stage"
          onAction={openAddStage}
        />
      ) : (
        <div className="space-y-3">
          {stages.map((stage, stageIdx) => {
            const isExpanded = expandedStages.has(stage.id)
            return (
              <div key={stage.id} className="border rounded-lg bg-white overflow-hidden" data-testid={`stage-card-${stage.id}`}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <button onClick={() => toggleExpand(stage.id)} className="shrink-0 cursor-pointer" data-testid={`button-expand-stage-${stage.id}`}>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">Stage {stage.number}: {stage.title}</span>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{stage.phase}</span>
                      {!stage.is_published && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Draft</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{stage.tasks.length} tasks</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStage(stageIdx, "up")} disabled={stageIdx === 0} data-testid={`button-stage-up-${stage.id}`}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveStage(stageIdx, "down")} disabled={stageIdx === stages.length - 1} data-testid={`button-stage-down-${stage.id}`}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePublished("stage", stage.id, stage.is_published)} data-testid={`button-stage-publish-${stage.id}`}>
                      {stage.is_published ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-gray-400" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditStage(stage)} data-testid={`button-edit-stage-${stage.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => confirmDelete("stage", stage.id, stage.title)} data-testid={`button-delete-stage-${stage.id}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t">
                    {stage.tasks.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">No tasks in this stage</div>
                    ) : (
                      stage.tasks.map((task, taskIdx) => (
                        <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 bg-gray-50/50" data-testid={`task-row-${task.id}`}>
                          <span className="text-xs font-mono text-gray-400 w-8 shrink-0">{task.task_no}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-gray-700">{task.title}</span>
                            {task.link && <span className="ml-2 text-xs text-blue-500">{task.link}</span>}
                          </div>
                          {!task.is_published && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">Draft</span>
                          )}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveTask(stage.id, taskIdx, "up")} disabled={taskIdx === 0}>
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveTask(stage.id, taskIdx, "down")} disabled={taskIdx === stage.tasks.length - 1}>
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePublished("task", task.id, task.is_published)}>
                              {task.is_published ? <Eye className="h-3 w-3 text-emerald-500" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditTask(task)}>
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => confirmDelete("task", task.id, task.title)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    <div className="px-4 py-2 border-t">
                      <Button variant="ghost" size="sm" className="text-sm text-blue-600" onClick={() => openAddTask(stage.id)} data-testid={`button-add-task-${stage.id}`}>
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={stageDialogOpen} onOpenChange={setStageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStage ? "Edit Stage" : "Add Stage"}</DialogTitle>
            <DialogDescription>
              {editingStage ? "Update the stage details" : "Create a new roadmap stage"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Stage Number</Label>
              <Input type="number" value={stageForm.number} onChange={e => setStageForm(f => ({ ...f, number: parseInt(e.target.value) || 0 }))} data-testid="input-stage-number" />
            </div>
            <div>
              <Label>Title</Label>
              <Input value={stageForm.title} onChange={e => setStageForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Onboarding & Setup" data-testid="input-stage-title" />
            </div>
            <div>
              <Label>Phase</Label>
              <Input value={stageForm.phase} onChange={e => setStageForm(f => ({ ...f, phase: e.target.value }))} placeholder="e.g. Getting Started" data-testid="input-stage-phase" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStageDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveStage} disabled={submittingStage} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-save-stage">
              {submittingStage ? "Saving..." : editingStage ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the task details" : "Create a new task in this stage"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!editingTask && (
              <div>
                <Label>Task ID</Label>
                <Input value={taskForm.id} onChange={e => setTaskForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. t-49" data-testid="input-task-id" />
              </div>
            )}
            <div>
              <Label>Task Number</Label>
              <Input type="number" value={taskForm.task_no} onChange={e => setTaskForm(f => ({ ...f, task_no: parseInt(e.target.value) || 0 }))} data-testid="input-task-number" />
            </div>
            <div>
              <Label>Title</Label>
              <Input value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title" data-testid="input-task-title" />
            </div>
            <div>
              <Label>Link (optional)</Label>
              <Input value={taskForm.link} onChange={e => setTaskForm(f => ({ ...f, link: e.target.value }))} placeholder="/mentorship or leave empty" data-testid="input-task-link" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveTask} disabled={submittingTask} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="button-save-task">
              {submittingTask ? "Saving..." : editingTask ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteTarget?.type === "stage" ? "Stage" : "Task"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"?
              {deleteTarget?.type === "stage" && " This will also delete all tasks in this stage."}
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
