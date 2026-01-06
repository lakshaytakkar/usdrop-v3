"use client"

import { use } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Edit, ExternalLink, FileText } from "lucide-react"
import { TaskDetailsModal } from "@/components/dev/task-details-modal"
import { useState } from "react"

async function fetchTask(id: string) {
  const response = await fetch(`/api/dev/tasks/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch task")
  }
  return response.json()
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: task, isLoading } = useQuery({
    queryKey: ["dev-task", id],
    queryFn: () => fetchTask(id),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-96" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Task Not Found</h1>
          <p className="text-muted-foreground mt-2">The task you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const statusConfig: Record<string, { label: string; variant: "outline" | "default" | "destructive" | "secondary" }> = {
    "not-started": { label: "Not Started", variant: "outline" },
    "in-progress": { label: "In Progress", variant: "default" },
    "in-review": { label: "In Review", variant: "outline" },
    "completed": { label: "Completed", variant: "outline" },
    "blocked": { label: "Blocked", variant: "destructive" },
  }

  const priorityConfig: Record<string, { label: string; variant: "outline" | "default" | "destructive" | "secondary" }> = {
    low: { label: "Low", variant: "secondary" },
    medium: { label: "Medium", variant: "default" },
    high: { label: "High", variant: "outline" },
    urgent: { label: "Urgent", variant: "destructive" },
  }

  const status = statusConfig[task.status as string] || { label: task.status, variant: "outline" }
  const priority = priorityConfig[task.priority as string] || { label: task.priority, variant: "outline" }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dev/tasks">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{task.title}</h1>
            {task.description && <p className="text-muted-foreground mt-2">{task.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dev/tasks/${task.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button onClick={() => setModalOpen(true)}>
            View Details
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Status</p>
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-2">Priority</p>
            <Badge variant={priority.variant}>{priority.label}</Badge>
          </CardContent>
        </Card>

        {task.phase && (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Phase</p>
              <Badge variant="secondary">Phase {task.phase}</Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {task.figma_link && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5 text-primary" />
              <a
                href={task.figma_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Figma Design
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <TaskDetailsModal 
        task={task} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  )
}

