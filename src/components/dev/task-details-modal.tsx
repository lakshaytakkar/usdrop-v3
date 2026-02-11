"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"
import type { DevTask } from "@/types/dev-tasks"
import { TaskComments } from "./task-comments"
import { TaskAttachments } from "./task-attachments"
import { TaskHistory } from "./task-history"

interface TaskDetailsModalProps {
  task: DevTask
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsModal({ task, open, onOpenChange }: TaskDetailsModalProps) {
  const statusConfig = {
    "not-started": { label: "Not Started", variant: "outline" as const },
    "in-progress": { label: "In Progress", variant: "default" as const },
    "in-review": { label: "In Review", variant: "outline" as const },
    "completed": { label: "Completed", variant: "outline" as const },
    "blocked": { label: "Blocked", variant: "destructive" as const },
  }

  const priorityConfig = {
    low: { label: "Low", variant: "secondary" as const },
    medium: { label: "Medium", variant: "default" as const },
    high: { label: "High", variant: "outline" as const },
    urgent: { label: "Urgent", variant: "destructive" as const },
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">{task.title}</SheetTitle>
            <Link href={`/dev/tasks/${task.id}/edit`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
            <TabsList className="shrink-0 h-9 w-fit mx-6 mt-4">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="comments" className="text-xs">Comments</TabsTrigger>
              <TabsTrigger value="attachments" className="text-xs">Attachments</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
              <TabsContent value="overview" className="mt-0 space-y-4">
                <div className="space-y-4">
                  {task.description && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Status</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Priority</h3>
                      <Badge variant={priority.variant}>{priority.label}</Badge>
                    </div>
                    {task.phase && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Phase</h3>
                        <Badge variant="secondary">Phase {task.phase}</Badge>
                      </div>
                    )}
                    {task.due_date && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Due Date</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {task.estimated_hours && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Estimated Hours</h3>
                        <p className="text-sm text-muted-foreground">{task.estimated_hours}h</p>
                      </div>
                    )}
                    {task.actual_hours && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Actual Hours</h3>
                        <p className="text-sm text-muted-foreground">{task.actual_hours}h</p>
                      </div>
                    )}
                  </div>

                  {task.assigned_user && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Assigned To</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.assigned_user.full_name || task.assigned_user.email}
                      </p>
                    </div>
                  )}

                  {task.figma_link && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Figma Design</h3>
                      <a
                        href={task.figma_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {task.figma_link}
                      </a>
                    </div>
                  )}

                  {task.doc_links && task.doc_links.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Documentation Links</h3>
                      <ul className="space-y-1">
                        {task.doc_links.map((link, index) => (
                          <li key={index}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.related_files && task.related_files.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Related Files</h3>
                      <ul className="space-y-1">
                        {task.related_files.map((file, index) => (
                          <li key={index} className="text-sm text-muted-foreground font-mono">
                            {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0">
                <TaskComments taskId={task.id} />
              </TabsContent>

              <TabsContent value="attachments" className="mt-0">
                <TaskAttachments taskId={task.id} />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <TaskHistory taskId={task.id} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}




