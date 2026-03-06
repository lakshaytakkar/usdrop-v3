import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { ExternalUser } from "@/types/admin/users"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Trash2,
  UserCheck,
  UserX,
  BookOpen,
  Eye,
  LogIn,
  MousePointerClick,
  UserPlus,
  Activity,
  Lock,
  Unlock,
  ChevronDown,
  Save,
  RefreshCw,
  Zap,
  Crown,
  Video,
  Play,
  CheckCircle2,
} from "lucide-react"
import {
  PageShell,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  StatCard,
  StatGrid,
} from "@/components/admin-shared"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, ShoppingBag, Clock } from "lucide-react"
import { freeLearningModules, type FreeLearningModule } from "@/pages/free-learning/data"

interface ContentAccessItem {
  id: string
  user_id: string
  content_type: string
  content_id: string
  is_unlocked: boolean
  unlocked_by: string | null
  unlocked_at: string | null
  notes: string | null
}

interface ActivityLogItem {
  id: string
  user_id: string
  activity_type: string
  activity_data: Record<string, any> | null
  created_at: string
}

interface LeadScore {
  user_id: string
  score: number
  engagement_level: string
  free_lessons_completed: number
  total_page_views: number
  last_activity_at: string | null
  auto_stage: string
  manual_stage_override: string | null
  assigned_rep_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const ACTIVITY_ICONS: Record<string, typeof Eye> = {
  page_view: Eye,
  lesson_complete: BookOpen,
  login: LogIn,
  signup: UserPlus,
  feature_click: MousePointerClick,
}

const ACTIVITY_LABELS: Record<string, string> = {
  page_view: "Page View",
  lesson_complete: "Lesson Completed",
  login: "Login",
  signup: "Sign Up",
  feature_click: "Feature Click",
}

const PIPELINE_STAGES = [
  { value: "new_lead", label: "New Lead" },
  { value: "engaged", label: "Engaged" },
  { value: "hot", label: "Hot" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
]

export default function ExternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [user, setUser] = useState<ExternalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [journey, setJourney] = useState<any>(null)
  const [journeyLoading, setJourneyLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const [contentAccess, setContentAccess] = useState<ContentAccessItem[]>([])
  const [contentLoading, setContentLoading] = useState(false)
  const [togglingContent, setTogglingContent] = useState<Set<string>>(new Set())

  const [contentJourney, setContentJourney] = useState<any>(null)
  const [contentJourneyLoading, setContentJourneyLoading] = useState(false)
  const [journeyActionLoading, setJourneyActionLoading] = useState(false)

  const [activities, setActivities] = useState<ActivityLogItem[]>([])
  const [activityTotal, setActivityTotal] = useState(0)
  const [activityPage, setActivityPage] = useState(0)
  const [activityLoading, setActivityLoading] = useState(false)

  const [leadScore, setLeadScore] = useState<LeadScore | null>(null)
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadSaving, setLeadSaving] = useState(false)
  const [editedNotes, setEditedNotes] = useState("")
  const [editedStage, setEditedStage] = useState("")

  const [freeLearningProgress, setFreeLearningProgress] = useState<{ lesson_id: string; completed_at: string; source: string }[]>([])
  const [freeLearningLoading, setFreeLearningLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}`)
        if (!response.ok) {
          setUser(null)
          return
        }
        const userData = await response.json()
        setUser({
          ...userData,
          subscriptionDate: new Date(userData.subscriptionDate),
          expiryDate: new Date(userData.expiryDate),
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt),
          trialEndsAt: userData.trialEndsAt ? new Date(userData.trialEndsAt) : null,
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchFreeLearning = async () => {
      try {
        setFreeLearningLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/learning-progress`)
        if (response.ok) {
          const data = await response.json()
          setFreeLearningProgress(data.lessons || [])
        }
      } catch (err) {
        console.error('Error fetching free learning progress:', err)
      } finally {
        setFreeLearningLoading(false)
      }
    }
    fetchFreeLearning()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchJourney = async () => {
      try {
        setJourneyLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/journey`)
        if (response.ok) {
          setJourney(await response.json())
        }
      } catch (err) {
        console.error('Error fetching journey:', err)
      } finally {
        setJourneyLoading(false)
      }
    }
    fetchJourney()
  }, [userId])

  const fetchContentAccess = useCallback(async () => {
    if (!userId) return
    try {
      setContentLoading(true)
      const response = await apiFetch(`/api/admin/users/${userId}/content-access`)
      if (response.ok) {
        setContentAccess(await response.json())
      }
    } catch (err) {
      console.error('Error fetching content access:', err)
    } finally {
      setContentLoading(false)
    }
  }, [userId])

  const fetchContentJourney = useCallback(async () => {
    if (!userId) return
    try {
      setContentJourneyLoading(true)
      const response = await apiFetch(`/api/admin/users/${userId}/journey`)
      if (response.ok) {
        setContentJourney(await response.json())
      }
    } catch (err) {
      console.error('Error fetching content journey:', err)
    } finally {
      setContentJourneyLoading(false)
    }
  }, [userId])

  const handleJourneyAction = async (action: string, extra?: Record<string, any>) => {
    if (!userId) return
    try {
      setJourneyActionLoading(true)
      const response = await apiFetch(`/api/admin/users/${userId}/unlock-journey`, {
        method: 'POST',
        body: JSON.stringify({ action, ...extra }),
      })
      if (response.ok) {
        showSuccess(
          action === 'lock_everything' ? 'Everything locked' :
          action === 'unlock_everything' ? 'Everything unlocked' :
          action === 'lock_all_sessions' ? 'All sessions locked' :
          'Action completed'
        )
        await Promise.all([fetchContentJourney(), fetchContentAccess()])
      } else {
        showError('Action failed')
      }
    } catch {
      showError('Action failed')
    } finally {
      setJourneyActionLoading(false)
    }
  }

  const isSessionUnlocked = (sessionId: string) => {
    if (!contentJourney) return false
    return (contentJourney.contentAccess || []).some(
      (ca: any) => ca.content_type === 'session' && ca.content_id === sessionId && ca.is_unlocked
    )
  }

  const toggleSession = async (sessionId: string, currentlyUnlocked: boolean) => {
    const key = `session:${sessionId}`
    setTogglingContent((prev) => new Set(prev).add(key))
    try {
      if (currentlyUnlocked) {
        const item = (contentJourney?.contentAccess || []).find(
          (ca: any) => ca.content_type === 'session' && ca.content_id === sessionId && ca.is_unlocked
        )
        if (item) {
          await apiFetch(`/api/admin/users/${userId}/content-access/${item.id}`, { method: 'DELETE' })
        }
      } else {
        await apiFetch(`/api/admin/users/${userId}/content-access`, {
          method: 'POST',
          body: JSON.stringify({ content_type: 'session', content_id: sessionId }),
        })
      }
      await Promise.all([fetchContentJourney(), fetchContentAccess()])
    } catch {
      showError('Failed to update session access')
    } finally {
      setTogglingContent((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const toggleCourseEnrollment = async (courseId: string, isEnrolled: boolean) => {
    const key = `course:${courseId}`
    setTogglingContent((prev) => new Set(prev).add(key))
    try {
      await apiFetch(`/api/admin/users/${userId}/unlock-journey`, {
        method: 'POST',
        body: JSON.stringify({
          action: isEnrolled ? 'unenroll_course' : 'enroll_course',
          course_id: courseId,
        }),
      })
      await fetchContentJourney()
    } catch {
      showError('Failed to update enrollment')
    } finally {
      setTogglingContent((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const fetchActivities = useCallback(async (page = 0) => {
    if (!userId) return
    try {
      setActivityLoading(true)
      const limit = 20
      const offset = page * limit
      const response = await apiFetch(`/api/admin/pipeline/${userId}/activity?limit=${limit}&offset=${offset}`)
      if (response.ok) {
        const result = await response.json()
        setActivities(result.data || [])
        setActivityTotal(result.total || 0)
        setActivityPage(page)
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
    } finally {
      setActivityLoading(false)
    }
  }, [userId])

  const fetchLeadScore = useCallback(async () => {
    if (!userId) return
    try {
      setLeadLoading(true)
      const response = await apiFetch(`/api/admin/pipeline`)
      if (response.ok) {
        const leads = await response.json()
        const lead = leads.find((l: any) => l.user_id === userId)
        if (lead) {
          setLeadScore(lead)
          setEditedNotes(lead.notes || "")
          setEditedStage(lead.manual_stage_override || "")
        }
      }
    } catch (err) {
      console.error('Error fetching lead score:', err)
    } finally {
      setLeadLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (activeTab === "content") {
      fetchContentAccess()
      fetchContentJourney()
    }
    if (activeTab === "activity") fetchActivities(0)
    if (activeTab === "lead") fetchLeadScore()
  }, [activeTab, fetchContentAccess, fetchContentJourney, fetchActivities, fetchLeadScore])

  const handleSuspend = useCallback(async () => {
    if (!user) return
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'suspended' }),
      })
      if (response.ok) {
        setUser({ ...user, status: 'suspended' })
        showSuccess('User suspended')
      } else {
        showError('Failed to suspend user')
      }
    } catch {
      showError('Failed to suspend user')
    }
  }, [user, showSuccess, showError])

  const handleActivate = useCallback(async () => {
    if (!user) return
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'active' }),
      })
      if (response.ok) {
        setUser({ ...user, status: 'active' })
        showSuccess('User activated')
      } else {
        showError('Failed to activate user')
      }
    } catch {
      showError('Failed to activate user')
    }
  }, [user, showSuccess, showError])

  const handleDelete = useCallback(async () => {
    if (!user) return
    if (!window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, { method: 'DELETE' })
      if (response.ok) {
        showSuccess('User deleted')
        router.push('/admin/external-users')
      } else {
        showError('Failed to delete user')
      }
    } catch {
      showError('Failed to delete user')
    }
  }, [user, showSuccess, showError, router])

  const isLessonUnlocked = (lessonId: string) => {
    return contentAccess.some(
      (ca) => ca.content_type === "chapter" && ca.content_id === lessonId && ca.is_unlocked
    )
  }

  const toggleLesson = async (lessonId: string, currentlyUnlocked: boolean) => {
    const key = `chapter:${lessonId}`
    setTogglingContent((prev) => new Set(prev).add(key))
    try {
      if (currentlyUnlocked) {
        const item = contentAccess.find(
          (ca) => ca.content_type === "chapter" && ca.content_id === lessonId && ca.is_unlocked
        )
        if (item) {
          await apiFetch(`/api/admin/users/${userId}/content-access/${item.id}`, { method: 'DELETE' })
        }
      } else {
        await apiFetch(`/api/admin/users/${userId}/content-access`, {
          method: 'POST',
          body: JSON.stringify({ content_type: 'chapter', content_id: lessonId }),
        })
      }
      await fetchContentAccess()
    } catch {
      showError('Failed to update content access')
    } finally {
      setTogglingContent((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const handleBulkAction = async (action: 'unlock' | 'lock', moduleId?: string) => {
    let items: { content_type: string; content_id: string }[] = []

    if (moduleId) {
      const mod = freeLearningModules.find((m) => m.id === moduleId)
      if (mod) {
        items = mod.lessons.map((l) => ({ content_type: 'chapter', content_id: l.id }))
      }
    } else {
      items = freeLearningModules.flatMap((m) =>
        m.lessons.map((l) => ({ content_type: 'chapter', content_id: l.id }))
      )
    }

    if (items.length === 0) return

    try {
      setContentLoading(true)
      await apiFetch(`/api/admin/users/${userId}/content-access/bulk`, {
        method: 'POST',
        body: JSON.stringify({ items, action }),
      })
      await fetchContentAccess()
      showSuccess(action === 'unlock' ? 'Content unlocked' : 'Content locked')
    } catch {
      showError('Failed to perform bulk action')
    } finally {
      setContentLoading(false)
    }
  }

  const handleSaveLeadInfo = async () => {
    if (!userId) return
    try {
      setLeadSaving(true)
      await apiFetch(`/api/admin/pipeline/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          notes: editedNotes,
          stage_override: editedStage || null,
        }),
      })
      showSuccess('Lead info updated')
      await fetchLeadScore()
    } catch {
      showError('Failed to update lead info')
    } finally {
      setLeadSaving(false)
    }
  }

  const handleRecalculate = async () => {
    if (!userId) return
    try {
      setLeadLoading(true)
      await apiFetch(`/api/admin/pipeline/${userId}/recalculate`, { method: 'POST' })
      showSuccess('Score recalculated')
      await fetchLeadScore()
    } catch {
      showError('Failed to recalculate score')
    } finally {
      setLeadLoading(false)
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—"
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatDateTime = (date: string | null | undefined) => {
    if (!date) return "—"
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysActive = () => {
    if (!user) return 0
    const now = new Date()
    const created = new Date(user.createdAt)
    return Math.max(Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)), 1)
  }

  const totalActivityPages = Math.ceil(activityTotal / 20)

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </PageShell>
    )
  }

  if (!user) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">User not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => router.push('/admin/external-users')} data-testid="button-back-to-list">
            <ArrowLeft className="size-4 mr-1.5" />
            Back to Clients
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/external-users')} data-testid="button-back">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="size-12">
            <AvatarImage src={user.avatarUrl || getAvatarUrl(user.id, user.email)} alt={user.name} />
            <AvatarFallback>
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold font-heading truncate" data-testid="text-user-name">{user.name}</h1>
            <p className="text-sm text-muted-foreground truncate" data-testid="text-user-email">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <StatusBadge status={user.plan} />
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {user.status === 'active' ? (
          <Button variant="outline" size="sm" onClick={handleSuspend} data-testid="button-suspend">
            <UserX className="size-4 mr-1.5" />
            Suspend
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={handleActivate} data-testid="button-activate">
            <UserCheck className="size-4 mr-1.5" />
            Activate
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleDelete} data-testid="button-delete">
          <Trash2 className="size-4 mr-1.5" />
          Delete
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-user-detail">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="content" data-testid="tab-content">Content Access</TabsTrigger>
          <TabsTrigger value="activity" data-testid="tab-activity">Activity Log</TabsTrigger>
          <TabsTrigger value="lead" data-testid="tab-lead">Lead Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <StatGrid>
              <StatCard
                label="Courses Enrolled"
                value={journey?.courses?.started || 0}
                icon={GraduationCap}
              />
              <StatCard
                label="Products Saved"
                value={journey?.productsSaved || 0}
                icon={ShoppingBag}
              />
              <StatCard
                label="Credits"
                value={(user.credits || 0).toLocaleString()}
                icon={CreditCard}
              />
              <StatCard
                label="Days Active"
                value={getDaysActive()}
                icon={Clock}
              />
            </StatGrid>

            {(() => {
              const allLessonIds = freeLearningModules.flatMap(m => m.lessons.map(l => l.id))
              const totalLessons = allLessonIds.length
              const completedLessonIds = freeLearningProgress.map(p => p.lesson_id)
              const completedCount = allLessonIds.filter(id => completedLessonIds.includes(id)).length
              const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
              const isComplete = completedCount >= totalLessons
              const lastCompletedAt = freeLearningProgress.length > 0
                ? freeLearningProgress.reduce((latest, p) => {
                    const d = new Date(p.completed_at)
                    return d > latest ? d : latest
                  }, new Date(0))
                : null

              return (
                <DetailSection title="Free Learning Progress">
                  {freeLearningLoading ? (
                    <div className="py-4"><Skeleton className="h-16 rounded-lg" /></div>
                  ) : (
                    <div className="space-y-3 py-2">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <BookOpen className="size-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium" data-testid="text-free-learning-count">
                              {completedCount} of {totalLessons} lessons completed
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid="text-free-learning-percent">
                              {progressPercent}% complete
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={isComplete ? "default" : "secondary"}
                          data-testid="badge-free-learning-status"
                        >
                          {isComplete ? (
                            <><CheckCircle2 className="size-3 mr-1" />Completed</>
                          ) : (
                            "In Progress"
                          )}
                        </Badge>
                      </div>
                      <Progress value={progressPercent} className="h-2" data-testid="progress-free-learning" />
                      {isComplete && lastCompletedAt && lastCompletedAt.getTime() > 0 && (
                        <p className="text-xs text-muted-foreground" data-testid="text-free-learning-completion-date">
                          Completed on {formatDate(lastCompletedAt)}
                        </p>
                      )}
                      {!isComplete && completedCount > 0 && lastCompletedAt && lastCompletedAt.getTime() > 0 && (
                        <p className="text-xs text-muted-foreground" data-testid="text-free-learning-last-activity">
                          Last lesson completed on {formatDate(lastCompletedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </DetailSection>
              )
            })()}

            <SectionGrid>
              <DetailSection title="Account Information">
                <InfoRow label="Plan">
                  <StatusBadge status={user.plan} />
                </InfoRow>
                <InfoRow label="Status">
                  <StatusBadge status={user.status} />
                </InfoRow>
                <InfoRow label="Credits" value={(user.credits || 0).toLocaleString()} />
                <InfoRow label="Subscription Date" value={formatDate(user.subscriptionDate)} />
                <InfoRow label="Expiry Date" value={formatDate(user.isTrial && user.trialEndsAt ? user.trialEndsAt : user.expiryDate)} />
                {user.isTrial && (
                  <InfoRow label="Trial">
                    <StatusBadge status="Trial" variant="warning" />
                  </InfoRow>
                )}
                <InfoRow label="Subscription Status" value={user.subscriptionStatus || "—"} />
              </DetailSection>

              <DetailSection title="Contact Information">
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Phone" value={user.phoneNumber || "—"} />
                <InfoRow label="Username" value={user.username || "—"} />
                <InfoRow label="Joined" value={formatDate(user.createdAt)} />
                <InfoRow label="Last Updated" value={formatDate(user.updatedAt)} />
              </DetailSection>
            </SectionGrid>

            {!journeyLoading && journey && (
              <SectionGrid>
                {journey.courses?.enrollments?.length > 0 && (
                  <DetailSection title="Course Enrollments">
                    {journey.courses.enrollments.map((enrollment: any) => (
                      <InfoRow key={enrollment.id} label={enrollment.courseTitle}>
                        <span className="text-sm font-medium">{Math.round(enrollment.progressPercentage)}%</span>
                      </InfoRow>
                    ))}
                  </DetailSection>
                )}

                {journey.roadmap && (
                  <DetailSection title="Roadmap Progress">
                    <InfoRow label="Total Tasks" value={journey.roadmap.total} />
                    <InfoRow label="Completed" value={journey.roadmap.completed} />
                    <InfoRow label="Progress" value={`${journey.roadmap.progressPercent}%`} />
                  </DetailSection>
                )}
              </SectionGrid>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <h3 className="text-sm font-semibold font-heading whitespace-nowrap">Journey Control</h3>
                  {contentJourney?.summary && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" data-testid="badge-enrolled-courses">
                        <GraduationCap className="size-3 mr-1" />
                        {contentJourney.summary.enrolledCourses}/{contentJourney.summary.totalCourses} Courses
                      </Badge>
                      <Badge variant="secondary" data-testid="badge-unlocked-sessions">
                        <Video className="size-3 mr-1" />
                        {contentJourney.summary.unlockedSessions}/{contentJourney.summary.totalSessions} Sessions
                      </Badge>
                      <Badge variant="secondary" data-testid="badge-unlocked-chapters">
                        <BookOpen className="size-3 mr-1" />
                        {contentJourney.summary.unlockedChapters} Chapters
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleJourneyAction('unlock_everything')}
                    disabled={journeyActionLoading || contentJourneyLoading}
                    data-testid="button-unlock-everything"
                  >
                    <Zap className="size-4 mr-1.5" />
                    Unlock Everything
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleJourneyAction('lock_everything')}
                    disabled={journeyActionLoading || contentJourneyLoading}
                    data-testid="button-lock-everything"
                  >
                    <Lock className="size-4 mr-1.5" />
                    Lock Everything
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        setJourneyActionLoading(true)
                        await apiFetch(`/api/admin/external-users/${userId}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ account_type: 'mentorship' }),
                        })
                        await handleJourneyAction('unlock_everything')
                        showSuccess('Upgraded to Mentorship')
                      } catch {
                        showError('Failed to upgrade')
                      } finally {
                        setJourneyActionLoading(false)
                      }
                    }}
                    disabled={journeyActionLoading || contentJourneyLoading}
                    data-testid="button-upgrade-mentorship"
                  >
                    <Crown className="size-4 mr-1.5" />
                    Upgrade to Mentorship
                  </Button>
                </div>
              </div>
            </div>

            {(contentLoading || contentJourneyLoading) ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
              </div>
            ) : (
              <>
                <DetailSection title="Course Enrollments">
                  <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-xs text-muted-foreground">
                      {contentJourney?.summary?.enrolledCourses || 0} of {contentJourney?.summary?.totalCourses || 0} enrolled
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJourneyAction('unlock_all_courses')}
                      disabled={journeyActionLoading}
                      data-testid="button-enroll-all-courses"
                    >
                      <GraduationCap className="size-4 mr-1.5" />
                      Enroll in All
                    </Button>
                  </div>
                  <div className="divide-y">
                    {(contentJourney?.allCourses || []).map((course: any) => {
                      const enrollment = (contentJourney?.enrollments || []).find(
                        (e: any) => e.course_id === course.id
                      )
                      const isEnrolled = !!enrollment
                      const toggling = togglingContent.has(`course:${course.id}`)
                      return (
                        <div
                          key={course.id}
                          className="flex items-center justify-between gap-3 py-2.5 px-1"
                          data-testid={`course-row-${course.id}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{course.title}</span>
                              {course.category && (
                                <Badge variant="outline" className="text-[10px] shrink-0">
                                  {course.category}
                                </Badge>
                              )}
                            </div>
                            {isEnrolled && (
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={enrollment.progress_percentage || 0} className="h-1.5 flex-1 max-w-[200px]" />
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(enrollment.progress_percentage || 0)}%
                                </span>
                                {enrollment.completed_at && (
                                  <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                                )}
                              </div>
                            )}
                          </div>
                          <Switch
                            checked={isEnrolled}
                            onCheckedChange={() => toggleCourseEnrollment(course.id, isEnrolled)}
                            disabled={toggling || journeyActionLoading}
                            data-testid={`switch-course-${course.id}`}
                          />
                        </div>
                      )
                    })}
                    {(!contentJourney?.allCourses || contentJourney.allCourses.length === 0) && (
                      <div className="py-6 text-center">
                        <p className="text-sm text-muted-foreground">No published courses found</p>
                      </div>
                    )}
                  </div>
                </DetailSection>

                <DetailSection title="Mentorship Sessions">
                  <div className="flex items-center justify-between gap-2 py-2 px-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {contentJourney?.summary?.unlockedSessions || 0} of {contentJourney?.summary?.totalSessions || 0} unlocked
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleJourneyAction('unlock_all_sessions')}
                        disabled={journeyActionLoading}
                        data-testid="button-unlock-all-sessions"
                      >
                        <Unlock className="size-4 mr-1.5" />
                        Unlock All Sessions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleJourneyAction('lock_all_sessions')}
                        disabled={journeyActionLoading}
                        data-testid="button-lock-all-sessions"
                      >
                        <Lock className="size-4 mr-1.5" />
                        Lock All Sessions
                      </Button>
                      <Select
                        onValueChange={(val) => handleJourneyAction('unlock_category', { category: val })}
                        disabled={journeyActionLoading}
                      >
                        <SelectTrigger className="w-[200px]" data-testid="select-unlock-category">
                          <SelectValue placeholder="Unlock Category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(contentJourney?.summary?.sessionsByCategory || {}).map((cat) => (
                            <SelectItem key={cat} value={cat} data-testid={`select-category-${cat}`}>
                              {cat} ({(contentJourney?.summary?.sessionsByCategory || {})[cat]?.unlocked || 0}/{(contentJourney?.summary?.sessionsByCategory || {})[cat]?.total || 0})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="divide-y">
                    {(() => {
                      const sessions = contentJourney?.allSessions || []
                      const grouped: Record<string, any[]> = {}
                      for (const s of sessions) {
                        if (!grouped[s.category]) grouped[s.category] = []
                        grouped[s.category].push(s)
                      }
                      return Object.entries(grouped).map(([category, categorySessions]) => (
                        <SessionCategorySection
                          key={category}
                          category={category}
                          sessions={categorySessions}
                          isSessionUnlocked={isSessionUnlocked}
                          toggleSession={toggleSession}
                          togglingContent={togglingContent}
                          journeyActionLoading={journeyActionLoading}
                          unlockCount={contentJourney?.summary?.sessionsByCategory?.[category]?.unlocked || 0}
                        />
                      ))
                    })()}
                    {(!contentJourney?.allSessions || contentJourney.allSessions.length === 0) && (
                      <div className="py-6 text-center">
                        <p className="text-sm text-muted-foreground">No published sessions found</p>
                      </div>
                    )}
                  </div>
                </DetailSection>

                <DetailSection title="Learning Chapters">
                  <div className="flex items-center justify-between gap-2 py-2 px-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">Free learning module toggles</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('unlock')}
                        disabled={contentLoading}
                        data-testid="button-unlock-all-chapters"
                      >
                        <Unlock className="size-4 mr-1.5" />
                        Unlock All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBulkAction('lock')}
                        disabled={contentLoading}
                        data-testid="button-lock-all-chapters"
                      >
                        <Lock className="size-4 mr-1.5" />
                        Lock All
                      </Button>
                      <Select
                        onValueChange={(val) => handleBulkAction('unlock', val)}
                        disabled={contentLoading}
                      >
                        <SelectTrigger className="w-[200px]" data-testid="select-unlock-module">
                          <SelectValue placeholder="Unlock Module..." />
                        </SelectTrigger>
                        <SelectContent>
                          {freeLearningModules.map((mod) => (
                            <SelectItem key={mod.id} value={mod.id} data-testid={`select-module-${mod.id}`}>
                              {mod.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="divide-y">
                    {freeLearningModules.map((mod) => (
                      <ModuleLessonsSection
                        key={mod.id}
                        module={mod}
                        isLessonUnlocked={isLessonUnlocked}
                        toggleLesson={toggleLesson}
                        togglingContent={togglingContent}
                      />
                    ))}
                  </div>
                </DetailSection>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="space-y-4">
            {activityLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 rounded-lg" />)}
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-lg border bg-background py-12 text-center">
                <Activity className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No activity recorded yet</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-background divide-y">
                {activities.map((activity) => {
                  const IconComp = ACTIVITY_ICONS[activity.activity_type] || Activity
                  return (
                    <div key={activity.id} className="flex items-start gap-3 px-5 py-3" data-testid={`activity-item-${activity.id}`}>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted mt-0.5">
                        <IconComp className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {ACTIVITY_LABELS[activity.activity_type] || activity.activity_type}
                        </p>
                        {activity.activity_data && (
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.activity_data.path || activity.activity_data.lessonId || JSON.stringify(activity.activity_data)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateTime(activity.created_at)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            {totalActivityPages > 1 && (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Page {activityPage + 1} of {totalActivityPages} ({activityTotal} total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activityPage === 0 || activityLoading}
                    onClick={() => fetchActivities(activityPage - 1)}
                    data-testid="button-activity-prev"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activityPage >= totalActivityPages - 1 || activityLoading}
                    onClick={() => fetchActivities(activityPage + 1)}
                    data-testid="button-activity-next"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="lead">
          {leadLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-48 rounded-lg" />
            </div>
          ) : !leadScore ? (
            <div className="rounded-lg border bg-background py-12 text-center">
              <Activity className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No lead score data available for this user</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleRecalculate}
                data-testid="button-create-lead-score"
              >
                <RefreshCw className="size-4 mr-1.5" />
                Generate Lead Score
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <StatGrid>
                <StatCard
                  label="Lead Score"
                  value={leadScore.score}
                  icon={Activity}
                />
                <StatCard
                  label="Engagement"
                  value={leadScore.engagement_level.charAt(0).toUpperCase() + leadScore.engagement_level.slice(1)}
                  icon={Activity}
                />
                <StatCard
                  label="Lessons Completed"
                  value={leadScore.free_lessons_completed}
                  icon={BookOpen}
                />
                <StatCard
                  label="Page Views"
                  value={leadScore.total_page_views}
                  icon={Eye}
                />
              </StatGrid>

              <SectionGrid>
                <DetailSection title="Pipeline Info">
                  <InfoRow label="Auto Stage">
                    <StatusBadge status={leadScore.auto_stage.replace('_', ' ')} />
                  </InfoRow>
                  <InfoRow label="Manual Override">
                    <Select
                      value={editedStage}
                      onValueChange={setEditedStage}
                    >
                      <SelectTrigger className="w-[160px]" data-testid="select-stage-override">
                        <SelectValue placeholder="No override" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Override</SelectItem>
                        {PIPELINE_STAGES.map((s) => (
                          <SelectItem key={s.value} value={s.value} data-testid={`select-stage-${s.value}`}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InfoRow>
                  <InfoRow label="Effective Stage">
                    <StatusBadge status={(leadScore.manual_stage_override || leadScore.auto_stage).replace('_', ' ')} />
                  </InfoRow>
                  <InfoRow label="Last Activity" value={formatDateTime(leadScore.last_activity_at)} />
                </DetailSection>

                <DetailSection title="Notes">
                  <div className="py-3">
                    <Textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add notes about this lead..."
                      className="resize-none text-sm min-h-[120px]"
                      data-testid="textarea-lead-notes"
                    />
                  </div>
                </DetailSection>
              </SectionGrid>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={handleSaveLeadInfo}
                  disabled={leadSaving}
                  data-testid="button-save-lead"
                >
                  <Save className="size-4 mr-1.5" />
                  {leadSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRecalculate}
                  disabled={leadLoading}
                  data-testid="button-recalculate"
                >
                  <RefreshCw className="size-4 mr-1.5" />
                  Recalculate Score
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}

function ModuleLessonsSection({
  module: mod,
  isLessonUnlocked,
  toggleLesson,
  togglingContent,
}: {
  module: FreeLearningModule
  isLessonUnlocked: (id: string) => boolean
  toggleLesson: (id: string, unlocked: boolean) => void
  togglingContent: Set<string>
}) {
  const [expanded, setExpanded] = useState(false)
  const unlockedCount = mod.lessons.filter((l) => isLessonUnlocked(l.id)).length

  return (
    <div data-testid={`module-section-${mod.id}`}>
      <button
        type="button"
        className="flex items-center justify-between w-full py-3 text-left hover-elevate rounded-md px-2"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-module-${mod.id}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown className={`size-4 shrink-0 transition-transform ${expanded ? "" : "-rotate-90"}`} />
          <span className="text-sm font-medium truncate">{mod.title}</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">
          {unlockedCount}/{mod.lessons.length} unlocked
        </span>
      </button>
      {expanded && (
        <div className="pl-6 pb-2 space-y-1">
          {mod.lessons.map((lesson) => {
            const unlocked = isLessonUnlocked(lesson.id)
            const toggling = togglingContent.has(`chapter:${lesson.id}`)
            return (
              <div
                key={lesson.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-md"
                data-testid={`lesson-row-${lesson.id}`}
              >
                <span className="text-sm truncate mr-2">{lesson.title}</span>
                <Switch
                  checked={unlocked}
                  onCheckedChange={() => toggleLesson(lesson.id, unlocked)}
                  disabled={toggling}
                  data-testid={`switch-lesson-${lesson.id}`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SessionCategorySection({
  category,
  sessions,
  isSessionUnlocked,
  toggleSession,
  togglingContent,
  journeyActionLoading,
  unlockCount,
}: {
  category: string
  sessions: any[]
  isSessionUnlocked: (id: string) => boolean
  toggleSession: (id: string, unlocked: boolean) => void
  togglingContent: Set<string>
  journeyActionLoading: boolean
  unlockCount: number
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div data-testid={`session-category-${category}`}>
      <button
        type="button"
        className="flex items-center justify-between w-full py-3 text-left hover-elevate rounded-md px-2"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-category-${category}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ChevronDown className={`size-4 shrink-0 transition-transform ${expanded ? "" : "-rotate-90"}`} />
          <span className="text-sm font-medium truncate">{category}</span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 ml-2">
          {unlockCount}/{sessions.length} unlocked
        </span>
      </button>
      {expanded && (
        <div className="pl-6 pb-2 space-y-1">
          {sessions.map((session) => {
            const unlocked = isSessionUnlocked(session.id)
            const toggling = togglingContent.has(`session:${session.id}`)
            return (
              <div
                key={session.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-md"
                data-testid={`session-row-${session.id}`}
              >
                <div className="flex items-center gap-2 min-w-0 mr-2">
                  <Play className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{session.title}</span>
                  {session.duration && (
                    <span className="text-[10px] text-muted-foreground shrink-0">{session.duration}</span>
                  )}
                </div>
                <Switch
                  checked={unlocked}
                  onCheckedChange={() => toggleSession(session.id, unlocked)}
                  disabled={toggling || journeyActionLoading}
                  data-testid={`switch-session-${session.id}`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
