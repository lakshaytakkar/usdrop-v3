"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { TaskForm } from "@/components/dev/task-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import type { DevTaskFormData } from "@/types/dev-tasks"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

async function fetchTask(id: string) {
  const response = await fetch(`/api/dev/tasks/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch task")
  }
  return response.json()
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  const { data: task, isLoading } = useQuery({
    queryKey: ["dev-task", id],
    queryFn: () => fetchTask(id),
  })

  const handleSubmit = async (data: DevTaskFormData) => {
    try {
      const response = await fetch(`/api/dev/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      queryClient.invalidateQueries({ queryKey: ["dev-task", id] })
      queryClient.invalidateQueries({ queryKey: ["dev-tasks"] })
      queryClient.invalidateQueries({ queryKey: ["dev-task-stats"] })

      showSuccess("The task has been successfully updated.")
      router.push(`/dev/tasks/${id}`)
    } catch (error) {
      console.error("Error updating task:", error)
      showError("Failed to update task. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="space-y-6 pb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Task Not Found</h1>
          <p className="text-muted-foreground mt-2">The task you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link href={`/dev/tasks/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Edit Task</h1>
          <p className="text-muted-foreground mt-2">Update task details and information.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm 
            initialData={task} 
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/dev/tasks/${id}`)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

