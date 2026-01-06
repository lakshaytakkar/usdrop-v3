"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Code,
  Folder,
  CheckSquare,
  BookOpen,
  ExternalLink,
  Zap,
  Settings,
  FileText,
  Grid3x3,
  Sparkles,
  AlertCircle,
} from "lucide-react"
import { getTaskStats, getRecentTasks } from "@/lib/dev-tasks/queries"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchTaskStats() {
  // This will be called server-side, so we'll need an API route
  const response = await fetch("/api/dev/tasks/stats")
  if (!response.ok) {
    throw new Error("Failed to fetch stats")
  }
  return response.json()
}

async function fetchRecentTasks() {
  const response = await fetch("/api/dev/tasks/recent?limit=6")
  if (!response.ok) {
    throw new Error("Failed to fetch recent tasks")
  }
  return response.json()
}

export default function DevPortalPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dev-task-stats"],
    queryFn: fetchTaskStats,
  })

  const { data: recentTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["dev-recent-tasks"],
    queryFn: fetchRecentTasks,
  })

  const quickLinks = [
    { name: "Tasks", href: "/dev/tasks", icon: CheckSquare, description: "View all tasks and issues" },
    { name: "Stack", href: "/dev/stack", icon: Grid3x3, description: "Technology stack" },
    { name: "Docs", href: "/dev/docs", icon: BookOpen, description: "Project documentation" },
    { name: "Credentials", href: "/dev/credentials", icon: Settings, description: "Env vars & setup" },
  ]

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Developer Portal</h1>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium">
          Your purpose-built development workspace for planning and building.
          Streamline tasks, track progress, and manage development issues.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-secondary/30 border-border/50">
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card className="bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Total Tasks</p>
                    <p className="text-3xl font-bold tracking-tight">{stats?.total || 0}</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-3 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">In Progress</p>
                    <p className="text-3xl font-bold tracking-tight">{stats?.inProgress || 0}</p>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-3 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Completed</p>
                    <p className="text-3xl font-bold tracking-tight text-emerald-500">{stats?.completed || 0}</p>
                  </div>
                  <div className="bg-emerald-500/10 rounded-xl p-3 group-hover:bg-emerald-500/20 transition-colors">
                    <CheckSquare className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Blocked</p>
                    <p className="text-3xl font-bold tracking-tight text-red-500">{stats?.blocked || 0}</p>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-3 group-hover:bg-red-500/20 transition-colors">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Links Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="bg-secondary/20 border-border/40 hover:border-primary/50 hover:bg-secondary/40 transition-all cursor-pointer h-full group">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-secondary p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg border border-border/50">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-base tracking-tight">{link.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tasks Widget */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Tasks</h2>
          <Link href="/dev/tasks">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold tracking-tight">
              View all →
            </Button>
          </Link>
        </div>
        <Card className="bg-secondary/20 border-border/40 overflow-hidden">
          <CardContent className="p-0">
            {tasksLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentTasks && recentTasks.length > 0 ? (
              <div className="divide-y divide-border/40">
                {recentTasks.slice(0, 6).map((task: any) => (
                  <Link key={task.id} href={`/dev/tasks/${task.id}`}>
                    <div className="flex items-center justify-between p-5 hover:bg-secondary/40 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`
                          size-2 rounded-full
                          ${task.status === 'completed' ? 'bg-emerald-500' : 
                            task.status === 'in-progress' ? 'bg-primary' : 
                            task.status === 'blocked' ? 'bg-red-500' : 'bg-muted-foreground/30'}
                        `} />
                        <div>
                          <p className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{task.title}</p>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1.5 py-0.5 bg-secondary rounded capitalize">
                              {task.status.replace("-", " ")}
                            </span>
                            {task.priority === 'urgent' && (
                              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest px-1.5 py-0.5 bg-red-50 rounded">
                                Urgent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-muted-foreground font-medium">No recent tasks</p>
                <Link href="/dev/tasks/new" className="mt-4 inline-block">
                  <Button variant="outline" size="sm" className="font-bold tracking-tight">
                    Create your first task
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

