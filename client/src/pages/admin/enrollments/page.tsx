import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { GraduationCap, Users, CheckCircle, TrendingUp, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  DataTable,
  FormDialog,
  type Column,
  type RowAction,
} from "@/components/admin-shared"

interface Enrollment {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
  last_accessed_at: string | null
  user: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    account_type: string | null
  } | null
  course: {
    id: string
    title: string
    slug: string
    category: string | null
    level: string | null
    thumbnail: string | null
  } | null
}

interface EnrollmentStats {
  total: number
  active: number
  completed: number
  avgProgress: number
}

interface UserOption {
  id: string
  full_name: string | null
  email: string
}

interface CourseOption {
  id: string
  title: string
  category: string | null
}

export default function AdminEnrollmentsPage() {
  const { showSuccess, showError } = useToast()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [users, setUsers] = useState<UserOption[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])

  const [formUserId, setFormUserId] = useState("")
  const [formCourseId, setFormCourseId] = useState("")

  const stats: EnrollmentStats = {
    total: enrollments.length,
    active: enrollments.filter((e) => !e.completed_at).length,
    completed: enrollments.filter((e) => e.completed_at).length,
    avgProgress: enrollments.length > 0
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) / enrollments.length)
      : 0,
  }

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiFetch("/api/admin/enrollments")
      if (res.ok) {
        const data = await res.json()
        setEnrollments(data)
      }
    } catch {
      showError("Failed to load enrollments")
    } finally {
      setLoading(false)
    }
  }, [showError])

  const fetchOptions = useCallback(async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        apiFetch("/api/admin/external-users"),
        apiFetch("/api/admin/courses"),
      ])
      if (usersRes.ok) {
        const data = await usersRes.json()
        const list = data.users || data || []
        setUsers(list.map((u: any) => ({ id: u.id, full_name: u.full_name, email: u.email })))
      }
      if (coursesRes.ok) {
        const data = await coursesRes.json()
        const list = data.courses || data || []
        setCourses(list.map((c: any) => ({ id: c.id, title: c.title, category: c.category })))
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchEnrollments()
    fetchOptions()
  }, [fetchEnrollments, fetchOptions])

  const resetForm = () => {
    setFormUserId("")
    setFormCourseId("")
  }

  const handleCreate = async () => {
    if (!formUserId || !formCourseId) {
      showError("User and course are required")
      return
    }
    try {
      setSubmitting(true)
      const res = await apiFetch("/api/admin/enrollments", {
        method: "POST",
        body: JSON.stringify({
          user_id: formUserId,
          course_id: formCourseId,
          progress_percentage: 0,
        }),
      })
      if (!res.ok) throw new Error("Failed to create")
      showSuccess("User enrolled successfully")
      setDialogOpen(false)
      resetForm()
      fetchEnrollments()
    } catch {
      showError("Failed to enroll user")
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkComplete = async (enrollment: Enrollment) => {
    try {
      const res = await apiFetch(`/api/admin/enrollments/${enrollment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ mark_complete: true }),
      })
      if (!res.ok) throw new Error("Failed to update")
      showSuccess("Enrollment marked as completed")
      fetchEnrollments()
    } catch {
      showError("Failed to mark as complete")
    }
  }

  const handleResetProgress = async (enrollment: Enrollment) => {
    try {
      const res = await apiFetch(`/api/admin/enrollments/${enrollment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ reset_progress: true }),
      })
      if (!res.ok) throw new Error("Failed to update")
      showSuccess("Progress reset successfully")
      fetchEnrollments()
    } catch {
      showError("Failed to reset progress")
    }
  }

  const handleUnenroll = async (enrollment: Enrollment) => {
    try {
      const res = await apiFetch(`/api/admin/enrollments/${enrollment.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      showSuccess("User unenrolled successfully")
      fetchEnrollments()
    } catch {
      showError("Failed to unenroll user")
    }
  }

  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    if (email) return email.slice(0, 2).toUpperCase()
    return "??"
  }

  const columns: Column<Enrollment>[] = [
    {
      key: "user",
      header: "User",
      render: (e) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="size-8 shrink-0">
            {e.user?.avatar_url && <AvatarImage src={e.user.avatar_url} />}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(e.user?.full_name, e.user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" data-testid={`text-user-name-${e.id}`}>
              {e.user?.full_name || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground truncate" data-testid={`text-user-email-${e.id}`}>
              {e.user?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "course",
      header: "Course",
      sortable: true,
      render: (e) => (
        <div className="min-w-0">
          <p className="text-sm font-medium truncate max-w-[200px]" data-testid={`text-course-title-${e.id}`}>
            {e.course?.title || "Unknown Course"}
          </p>
          {e.course?.category && (
            <Badge variant="secondary" className="mt-0.5 text-xs" data-testid={`badge-category-${e.id}`}>
              {e.course.category}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "enrolled_at",
      header: "Enrolled",
      sortable: true,
      render: (e) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-enrolled-date-${e.id}`}>
          {e.enrolled_at ? format(new Date(e.enrolled_at), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
    {
      key: "progress_percentage",
      header: "Progress",
      sortable: true,
      render: (e) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={e.progress_percentage || 0} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground w-8 text-right" data-testid={`text-progress-${e.id}`}>
            {e.progress_percentage || 0}%
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (e) => (
        <Badge
          variant={e.completed_at ? "default" : "secondary"}
          data-testid={`badge-status-${e.id}`}
        >
          {e.completed_at ? "Completed" : "Active"}
        </Badge>
      ),
    },
    {
      key: "last_accessed_at",
      header: "Last Accessed",
      sortable: true,
      render: (e) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-last-accessed-${e.id}`}>
          {e.last_accessed_at ? format(new Date(e.last_accessed_at), "MMM d, yyyy") : "\u2014"}
        </span>
      ),
    },
  ]

  const rowActions: RowAction<Enrollment>[] = [
    {
      label: "Mark Complete",
      onClick: handleMarkComplete,
    },
    {
      label: "Reset Progress",
      onClick: handleResetProgress,
    },
    {
      label: "Unenroll",
      onClick: handleUnenroll,
      variant: "destructive",
      separator: true,
    },
  ]

  const courseOptions = courses.map((c) => c.title)

  return (
    <PageShell>
      <PageHeader
        title="Enrollments"
        subtitle="Manage course enrollments for all users"
        actions={
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            data-testid="button-enroll-user"
          >
            <Plus className="size-4 mr-1.5" />
            Enroll User
          </Button>
        }
      />

      <StatGrid>
        <StatCard label="Total Enrollments" value={stats.total} icon={Users} />
        <StatCard
          label="Active"
          value={stats.active}
          icon={GraduationCap}
          iconBg="rgba(59, 130, 246, 0.1)"
          iconColor="#3b82f6"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle}
          iconBg="rgba(16, 185, 129, 0.1)"
          iconColor="#10b981"
        />
        <StatCard
          label="Avg Progress"
          value={`${stats.avgProgress}%`}
          icon={TrendingUp}
          iconBg="rgba(245, 158, 11, 0.1)"
          iconColor="#f59e0b"
        />
      </StatGrid>

      <DataTable
        data={enrollments}
        columns={columns}
        rowActions={rowActions}
        searchPlaceholder="Search enrollments..."
        searchKey="user"
        isLoading={loading}
        filters={[
          {
            label: "Course",
            key: "course",
            options: courseOptions,
          },
          {
            label: "Status",
            key: "status",
            options: ["Active", "Completed"],
          },
        ]}
        emptyTitle="No enrollments yet"
        emptyDescription="Enroll users in courses to get started."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}
        title="Enroll User in Course"
        onSubmit={handleCreate}
        submitLabel="Enroll"
        isSubmitting={submitting}
      >
        <div className="space-y-1.5">
          <Label>User</Label>
          <Select value={formUserId} onValueChange={setFormUserId}>
            <SelectTrigger data-testid="select-enroll-user">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.full_name || u.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Course</Label>
          <Select value={formCourseId} onValueChange={setFormCourseId}>
            <SelectTrigger data-testid="select-enroll-course">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </FormDialog>
    </PageShell>
  )
}
