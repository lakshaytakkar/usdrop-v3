"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { TaskForm } from "@/components/dev/task-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { DevTaskFormData } from "@/types/dev-tasks"

export default function NewTaskPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: DevTaskFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/dev/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const task = await response.json()
      showSuccess("The task has been successfully created.")
      router.push(`/dev/tasks/${task.id}`)
    } catch (error) {
      console.error("Error creating task:", error)
      showError("Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Create New Task</h1>
        <p className="text-muted-foreground mt-2">Add a new development task or issue.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}




