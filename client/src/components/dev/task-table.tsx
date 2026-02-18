

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ExternalLink, FileText, Sparkles, Edit, Trash2 } from "lucide-react"
import { Link } from "wouter"
import type { DevTask } from "@/types/dev-tasks"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; variant: "secondary" | "default" | "outline" | "destructive"; className?: string }> = {
  "not-started": { label: "Not Started", variant: "outline", className: "text-muted-foreground" },
  "in-progress": { label: "In Progress", variant: "default", className: "text-primary border-primary" },
  "in-review": { label: "In Review", variant: "outline", className: "text-yellow-600 border-yellow-600" },
  "completed": { label: "Completed", variant: "outline", className: "text-emerald-600 border-emerald-600" },
  "blocked": { label: "Blocked", variant: "destructive", className: "text-red-600 border-red-600" },
}

const priorityConfig: Record<string, { label: string; variant: "secondary" | "default" | "outline" | "destructive"; className?: string }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "outline", className: "text-orange-600 border-orange-600" },
  urgent: { label: "Urgent", variant: "destructive" },
}

interface ExpandedRows {
  [key: string]: boolean
}

interface TaskTableProps {
  tasks: DevTask[]
  onDelete?: (taskId: string) => void
}

function TaskRow({ task, level, expandedRows, onToggleExpand, isLast, onDelete }: {
  task: DevTask
  level: number
  expandedRows: ExpandedRows
  onToggleExpand: (taskId: string) => void
  isLast?: boolean
  onDelete?: (taskId: string) => void
}) {
  const hasSubtasks = task.subtasks && task.subtasks.length > 0
  const isExpanded = expandedRows[task.id] ?? (level === 0 ? true : false)
  const indentClass = level === 0 ? "" : level === 1 ? "pl-16" : "pl-32"

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <>
      <TableRow
        className={cn(
          "hover:bg-muted/30 transition-colors",
          level === 0 && "bg-muted/20 font-semibold",
          level === 1 && "bg-muted/10",
          level === 2 && "text-sm"
        )}
      >
        <TableCell className={cn("font-bold max-w-md py-4", indentClass)}>
          <div className="flex items-center gap-3">
            {hasSubtasks ? (
              <button
                onClick={() => onToggleExpand(task.id)}
                className="p-1 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </button>
            ) : (
              <div className="w-5.5 flex-shrink-0" />
            )}
            <span className={cn(
              "tracking-tight transition-colors",
              level === 0 ? "text-foreground text-sm" : "text-muted-foreground text-[13px] font-medium"
            )}>
              {task.title}
            </span>
            <div className="flex items-center gap-1.5 ml-1">
              {task.figma_link && (
                <a
                  href={task.figma_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {task.doc_links && task.doc_links.length > 0 && (
                <span title={`${task.doc_links.length} doc(s)`}>
                  <FileText className="h-3 w-3 text-primary/60" />
                </span>
              )}
            </div>
          </div>
          {task.description && (
            <div className={cn(
              "text-muted-foreground/60 text-[11px] mt-1 font-medium leading-relaxed max-w-xs truncate",
              level > 0 && "ml-0"
            )}>
              {task.description}
            </div>
          )}
        </TableCell>
        <TableCell className="py-4">
          <Badge variant={status.variant} className={cn("h-5 px-2 text-[10px] font-bold uppercase tracking-wider", status.className)}>
            {status.label}
          </Badge>
        </TableCell>
        <TableCell className="py-4">
          <Badge variant={priority.variant} className={cn("h-5 px-2 text-[10px] font-bold uppercase tracking-wider", priority.className)}>
            {priority.label}
          </Badge>
        </TableCell>
        <TableCell className="py-4">
          {task.assigned_user ? (
            <div className="flex items-center gap-2.5">
              <Avatar className="h-6 w-6 border border-border/50">
                <AvatarImage src={task.assigned_user.avatar_url || undefined} alt={task.assigned_user.full_name || ''} />
                <AvatarFallback className="text-[10px] bg-secondary font-bold">
                  {(task.assigned_user.full_name || task.assigned_user.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-muted-foreground tracking-tight">
                {task.assigned_user.full_name || task.assigned_user.email}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/40 text-[11px] font-bold uppercase tracking-widest">
              Open
            </span>
          )}
        </TableCell>
        <TableCell className="py-4 px-6 text-right">
          <span className="text-[11px] font-bold text-muted-foreground/60 tabular-nums">
            {new Date(task.updated_at).toLocaleDateString()}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Link href={`/dev/tasks/${task.id}/edit`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600 hover:text-red-700"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {hasSubtasks && isExpanded && (
        <>
          {task.subtasks?.map((subtask, index) => (
            <TaskRow
              key={subtask.id}
              task={subtask}
              level={level + 1}
              expandedRows={expandedRows}
              onToggleExpand={onToggleExpand}
              isLast={index === task.subtasks!.length - 1}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </>
  )
}

export function TaskTable({ tasks, onDelete }: TaskTableProps) {
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>(() => {
    const initial: ExpandedRows = {}
    tasks.forEach((task) => {
      initial[task.id] = true
    })
    return initial
  })

  const onToggleExpand = (taskId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }))
  }

  return (
    <Table>
      <TableHeader className="bg-secondary/40 border-b border-border/40">
        <TableRow className="hover:bg-transparent border-none">
          <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task Name</TableHead>
          <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
          <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Priority</TableHead>
          <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Assigned To</TableHead>
          <TableHead className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Last Updated</TableHead>
          <TableHead className="py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks && tasks.length > 0 ? (
          tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              level={0}
              expandedRows={expandedRows}
              onToggleExpand={onToggleExpand}
              isLast={index === tasks.length - 1}
              onDelete={onDelete}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-secondary rounded-full border border-border/40">
                  <FileText className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold tracking-tight">No tasks found</p>
                  <p className="text-sm text-muted-foreground">Create your first task to get started.</p>
                </div>
                <Link href="/dev/tasks/new" className="mt-2">
                  <Button variant="outline" size="sm" className="font-bold tracking-tight px-6 h-10 border-border/40">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

