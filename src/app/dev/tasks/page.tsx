"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, FileText, CheckSquare, Sparkles, Filter, X } from "lucide-react"
import { TaskTable } from "@/components/dev/task-table"
import type { DevTask, TaskStatus, TaskPriority } from "@/types/dev-tasks"
import { deleteTask } from "@/lib/dev-tasks/mutations"
import { useToast } from "@/hooks/use-toast"

async function fetchTasks(filters?: {
  status?: string[]
  priority?: string[]
  search?: string
}) {
  const params = new URLSearchParams()
  if (filters?.status && filters.status.length > 0) {
    params.append('status', filters.status.join(','))
  }
  if (filters?.priority && filters.priority.length > 0) {
    params.append('priority', filters.priority.join(','))
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }

  const response = await fetch(`/api/dev/tasks?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }
  return response.json()
}

export default function DevTasksPage() {
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  const { data: tasks, isLoading, error } = useQuery<DevTask[]>({
    queryKey: ["dev-tasks", statusFilter, priorityFilter, searchQuery],
    queryFn: () => fetchTasks({
      status: statusFilter.length > 0 ? statusFilter : undefined,
      priority: priorityFilter.length > 0 ? priorityFilter : undefined,
      search: searchQuery || undefined,
    }),
  })

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await fetch(`/api/dev/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      queryClient.invalidateQueries({ queryKey: ["dev-tasks"] })
      queryClient.invalidateQueries({ queryKey: ["dev-task-stats"] })
      queryClient.invalidateQueries({ queryKey: ["dev-recent-tasks"] })

      showSuccess("The task has been successfully deleted.")
    } catch (error) {
      console.error('Error deleting task:', error)
      showError("Failed to delete task. Please try again.")
    }
  }

  const completedCount = tasks?.reduce((acc, task) => {
    const countCompleted = (t: DevTask): number => {
      let total = t.status === "completed" ? 1 : 0
      if (t.subtasks) {
        total += t.subtasks.reduce((sum, st) => sum + countCompleted(st), 0)
      }
      return total
    }
    return acc + countCompleted(task)
  }, 0) || 0

  const totalCount = tasks?.reduce((acc, task) => {
    const countTotal = (t: DevTask): number => {
      let total = 1
      if (t.subtasks) {
        total += t.subtasks.reduce((sum, st) => sum + countTotal(st), 0)
      }
      return total
    }
    return acc + countTotal(task)
  }, 0) || 0

  const inProgressCount = tasks?.reduce((acc, task) => {
    const countInProgress = (t: DevTask): number => {
      let total = t.status === "in-progress" ? 1 : 0
      if (t.subtasks) {
        total += t.subtasks.reduce((sum, st) => sum + countInProgress(st), 0)
      }
      return total
    }
    return acc + countInProgress(task)
  }, 0) || 0

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Development Tasks</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium">
            Track and manage development tasks, issues, and progress.
          </p>
        </div>
        <Link href="/dev/tasks/new">
          <Button className="font-bold tracking-tight px-6 h-11 rounded-xl shadow-lg shadow-primary/20">
            <Plus className="h-4.5 w-4.5 mr-2" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Backlog", value: totalCount, icon: FileText, color: "text-primary" },
          { label: "Completed", value: completedCount, icon: CheckSquare, color: "text-emerald-500" },
          { label: "In Progress", value: inProgressCount, icon: Sparkles, color: "text-primary" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-secondary/20 border-border/40 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className="bg-secondary p-3 rounded-xl border border-border/50">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-secondary/20 border-border/40">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Select value={statusFilter.join(',')} onValueChange={(value) => setStatusFilter(value ? [value] : [])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter.join(',')} onValueChange={(value) => setPriorityFilter(value ? [value] : [])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            {(statusFilter.length > 0 || priorityFilter.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter([])
                  setPriorityFilter([])
                  setSearchQuery("")
                }}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        </div>
        <Card className="bg-secondary/20 border-border/40 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="p-10 text-center">
                <p className="text-destructive font-medium">Failed to load tasks. Please try again.</p>
              </div>
            ) : (
              <TaskTable tasks={tasks || []} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


