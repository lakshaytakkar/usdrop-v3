import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { AdminDetailLayout } from "@/components/admin/admin-detail-layout"
import { AdminStatusBadge } from "@/components/admin/admin-status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { ExternalUser, ExternalUserPlan, UserStatus, Activity } from "@/types/admin/users"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import {
  generateSecurePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  getPasswordStrengthProgress,
} from "@/lib/utils/password"
import { cn } from "@/lib/utils"
import { Loader } from "@/components/ui/loader"
import { freeLearningModules, findLesson } from "@/pages/free-learning/data"
import {
  Edit,
  Mail,
  MessageCircle,
  Coins,
  Calendar,
  CreditCard,
  Phone,
  Lock,
  Check,
  Trash2,
  ArrowUp,
  BookOpen,
  Map,
  ShoppingBag,
  Store,
  GraduationCap,
  ClipboardList,
  Key,
  Send,
  Clock,
  Shield,
  StickyNote,
  Activity as ActivityIcon,
  Compass,
  Settings,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Circle,
  Users,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Home,
  Bookmark,
  MonitorPlay,
  FlaskConical,
  UserCircle,
  TrendingUp,
  Trophy,
  Grid3x3,
  Flame,
  Video,
  Building2,
  Palette,
  User,
  PenTool,
  Receipt,
  Calculator,
  Truck,
  ClipboardCheck,
  Wrench,
  FolderOpen,
  Package,
  Globe,
  Route,
} from "lucide-react"

const TOTAL_FREE_LESSONS = freeLearningModules.reduce((acc, m) => acc + m.lessons.length, 0)

const allFreeLessons = freeLearningModules.flatMap(m =>
  m.lessons.map(l => ({ ...l, moduleName: m.title }))
)

interface ModuleGroupDef {
  label: string
  icon: React.ComponentType<{ className?: string }>
  modules: Array<{
    moduleId: string
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

const MODULE_GROUPS: ModuleGroupDef[] = [
  {
    label: "My Mentorship",
    icon: Compass,
    modules: [
      { moduleId: "mentorship", name: "Framework & Sessions", description: "Home dashboard, My Sessions", icon: Home },
      { moduleId: "my-products", name: "My Products", description: "Saved products picklist", icon: Bookmark },
      { moduleId: "my-store", name: "My Store", description: "Shopify store management", icon: ShoppingBag },
      { moduleId: "my-roadmap", name: "My Roadmap", description: "Business roadmap tasks", icon: Map },
      { moduleId: "courses", name: "My Learning", description: "Free learning & paid courses", icon: GraduationCap },
      { moduleId: "my-credentials", name: "My Credentials", description: "Stored credentials vault", icon: KeyRound },
    ],
  },
  {
    label: "Products",
    icon: Package,
    modules: [
      { moduleId: "product-hunt", name: "Product Hunt", description: "AI product discovery", icon: TrendingUp },
      { moduleId: "winning-products", name: "Winning & Trending", description: "Winning products, trending items", icon: Trophy },
      { moduleId: "categories", name: "Categories", description: "Product categories browser", icon: Grid3x3 },
      { moduleId: "seasonal-collections", name: "Seasonal Collections", description: "Seasonal product sets", icon: Calendar },
      { moduleId: "competitor-stores", name: "Competitor Stores", description: "Competitor store analysis", icon: Store },
    ],
  },
  {
    label: "Videos & Ads",
    icon: Video,
    modules: [
      { moduleId: "meta-ads", name: "Videos & Meta Ads", description: "Ad intelligence and creatives", icon: BarChart3 },
    ],
  },
  {
    label: "Marketplaces",
    icon: Globe,
    modules: [
      { moduleId: "selling-channels", name: "Selling Channels", description: "Marketplace integrations", icon: Store },
    ],
  },
  {
    label: "LLC",
    icon: Building2,
    modules: [
      { moduleId: "fulfillment", name: "LLC Formation", description: "Business entity setup", icon: Building2 },
    ],
  },
  {
    label: "AI Studio",
    icon: Palette,
    modules: [
      { moduleId: "studio", name: "Model Studio & Whitelabelling", description: "AI creative tools", icon: Palette },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    modules: [
      { moduleId: "tools", name: "All Tools", description: "Description gen, emails, invoices, calculators", icon: Wrench },
    ],
  },
]

interface JourneyData {
  userId: string
  onboarding: {
    completed: boolean
    completedAt: string | null
    progress: number
    steps: Array<{ id: string; videoId: string; moduleId: string; completed: boolean; completedAt: string | null; watchDuration: number }>
    totalSteps: number
    completedSteps: number
  }
  courses: {
    enrollments: Array<{ id: string; courseId: string; courseTitle: string; enrolledAt: string; completedAt: string | null; progressPercentage: number }>
    started: number
    completed: number
  }
  productsSaved: number
  roadmap: {
    items: Array<{ id: string; taskId: string; status: string; createdAt: string; updatedAt: string }>
    total: number
    completed: number
    progressPercent: number
  }
  shopifyStores: Array<{ id: string; storeName: string; storeUrl: string; status: string; createdAt: string }>
  shopifyConnected: boolean
  credentialsCount: number
}

interface SessionModule {
  moduleId: string
  moduleName: string
  accessLevel: string | null
  hasOverride: boolean
  overriddenBy: string | null
  overriddenAt: string | null
}

interface AdminNote {
  id: string
  userId: string
  adminId: string
  adminName: string
  adminEmail: string | null
  adminAvatarUrl: string | null
  note: string
  createdAt: string
  updatedAt: string
}

interface LessonProgress {
  lesson_id: string
  completed_at: string
  source: string
}

export default function ExternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [user, setUser] = useState<ExternalUser | null>(null)
  const [allUsers, setAllUsers] = useState<ExternalUser[]>([])
  const [loading, setLoading] = useState(true)

  const [journey, setJourney] = useState<JourneyData | null>(null)
  const [journeyLoading, setJourneyLoading] = useState(true)

  const [sessions, setSessions] = useState<SessionModule[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [sessionsSaving, setSessionsSaving] = useState(false)
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, string | null>>({})

  const [activities, setActivities] = useState<Activity[]>([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)

  const [notes, setNotes] = useState<AdminNote[]>([])
  const [notesLoading, setNotesLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [noteSaving, setNoteSaving] = useState(false)

  const [userProgress, setUserProgress] = useState<any>(null)
  const [progressLoading, setProgressLoading] = useState(true)

  const [learningProgress, setLearningProgress] = useState<LessonProgress[]>([])
  const [learningProgressLoading, setLearningProgressLoading] = useState(true)

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const [editOpen, setEditOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    status: "active" as UserStatus,
    plan: "free" as ExternalUserPlan,
  })

  const [resetPwOpen, setResetPwOpen] = useState(false)
  const [resetPwLoading, setResetPwLoading] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
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
    const fetchAllUsers = async () => {
      try {
        const response = await apiFetch("/api/admin/external-users")
        if (response.ok) {
          const data = await response.json()
          const users: ExternalUser[] = data.map((u: any) => ({
            ...u,
            subscriptionDate: new Date(u.subscriptionDate),
            expiryDate: new Date(u.expiryDate),
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
            trialEndsAt: u.trialEndsAt ? new Date(u.trialEndsAt) : null,
          }))
          setAllUsers(users)
        }
      } catch (err) {
        console.error('Error fetching all users:', err)
      }
    }
    fetchAllUsers()
  }, [])

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

  useEffect(() => {
    if (!userId) return
    const fetchSessions = async () => {
      try {
        setSessionsLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/sessions`)
        if (response.ok) {
          const data = await response.json()
          setSessions(data.modules || [])
          setPendingOverrides({})
        }
      } catch (err) {
        console.error('Error fetching sessions:', err)
      } finally {
        setSessionsLoading(false)
      }
    }
    fetchSessions()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchActivity = async () => {
      try {
        setActivitiesLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/activity`)
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (err) {
        console.error('Error fetching activity:', err)
      } finally {
        setActivitiesLoading(false)
      }
    }
    fetchActivity()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchNotes = async () => {
      try {
        setNotesLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/notes`)
        if (response.ok) {
          const data = await response.json()
          setNotes(data.notes || [])
        }
      } catch (err) {
        console.error('Error fetching notes:', err)
      } finally {
        setNotesLoading(false)
      }
    }
    fetchNotes()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchProgress = async () => {
      try {
        setProgressLoading(true)
        const response = await apiFetch(`/api/admin/user-progress/${userId}`)
        if (response.ok) {
          setUserProgress(await response.json())
        }
      } catch (err) {
        console.error('Error fetching user progress:', err)
      } finally {
        setProgressLoading(false)
      }
    }
    fetchProgress()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const fetchLearningProgress = async () => {
      try {
        setLearningProgressLoading(true)
        const response = await apiFetch(`/api/admin/external-users/${userId}/learning-progress`)
        if (response.ok) {
          const data = await response.json()
          setLearningProgress(data.lessons || [])
        }
      } catch (err) {
        console.error('Error fetching learning progress:', err)
      } finally {
        setLearningProgressLoading(false)
      }
    }
    fetchLearningProgress()
  }, [userId])

  const { prevUser, nextUser } = useMemo(() => {
    if (!user) return { prevUser: null, nextUser: null }
    const currentIndex = allUsers.findIndex((u) => u.id === user.id)
    const prev = currentIndex > 0 ? allUsers[currentIndex - 1] : null
    const next = currentIndex < allUsers.length - 1 ? allUsers[currentIndex + 1] : null
    return { prevUser: prev, nextUser: next }
  }, [user, allUsers])

  const completedLessonIds = useMemo(() => {
    return new Set(learningProgress.map(lp => lp.lesson_id))
  }, [learningProgress])

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      showError('Failed to delete user')
    }
  }, [user, showSuccess, showError, router])

  const handleSaveModuleOverrides = useCallback(async () => {
    if (!userId || Object.keys(pendingOverrides).length === 0) return
    try {
      setSessionsSaving(true)
      const modules = Object.entries(pendingOverrides).map(([moduleId, accessLevel]) => ({
        moduleId,
        accessLevel,
      }))
      const response = await apiFetch(`/api/admin/external-users/${userId}/sessions`, {
        method: 'PATCH',
        body: JSON.stringify({ modules }),
      })
      if (response.ok) {
        showSuccess('Module access updated')
        const refreshed = await apiFetch(`/api/admin/external-users/${userId}/sessions`)
        if (refreshed.ok) {
          const data = await refreshed.json()
          setSessions(data.modules || [])
        }
        setPendingOverrides({})
      } else {
        showError('Failed to update module access')
      }
    } catch (err) {
      showError('Failed to update module access')
    } finally {
      setSessionsSaving(false)
    }
  }, [userId, pendingOverrides, showSuccess, showError])

  const handleAddNote = useCallback(async () => {
    if (!userId || !newNote.trim()) return
    try {
      setNoteSaving(true)
      const response = await apiFetch(`/api/admin/external-users/${userId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note: newNote.trim() }),
      })
      if (response.ok) {
        showSuccess('Note added')
        setNewNote("")
        const refreshed = await apiFetch(`/api/admin/external-users/${userId}/notes`)
        if (refreshed.ok) {
          const data = await refreshed.json()
          setNotes(data.notes || [])
        }
      } else {
        showError('Failed to add note')
      }
    } catch (err) {
      showError('Failed to add note')
    } finally {
      setNoteSaving(false)
    }
  }, [userId, newNote, showSuccess, showError])

  const openEditDialog = useCallback(() => {
    if (!user) return
    setEditForm({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      status: (user.status || "active") as UserStatus,
      plan: (user.plan || "free") as ExternalUserPlan,
    })
    setEditOpen(true)
  }, [user])

  const handleEditSubmit = useCallback(async () => {
    if (!user) return
    setEditLoading(true)
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          phoneNumber: editForm.phoneNumber || undefined,
          status: editForm.status,
          plan: editForm.plan,
        }),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to update user')
      }
      const updated = await response.json()
      setUser({
        ...updated,
        subscriptionDate: new Date(updated.subscriptionDate),
        expiryDate: new Date(updated.expiryDate),
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt),
        trialEndsAt: updated.trialEndsAt ? new Date(updated.trialEndsAt) : null,
      })
      setEditOpen(false)
      showSuccess('User updated')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setEditLoading(false)
    }
  }, [user, editForm, showSuccess, showError])

  const openResetPassword = useCallback(() => {
    setNewPassword("")
    setShowNewPassword(false)
    setResetPwOpen(true)
  }, [])

  const handleResetPassword = useCallback(async () => {
    if (!user || !newPassword) return
    if (newPassword.length < 8) {
      showError("Password must be at least 8 characters")
      return
    }
    setResetPwLoading(true)
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to reset password')
      }
      setResetPwOpen(false)
      setNewPassword("")
      showSuccess('Password reset successfully')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setResetPwLoading(false)
    }
  }, [user, newPassword, showSuccess, showError])

  const handleGeneratePassword = useCallback(() => {
    const pw = generateSecurePassword(16)
    setNewPassword(pw)
    setShowNewPassword(true)
  }, [])

  const handleCopyPassword = useCallback(async () => {
    if (newPassword) {
      await navigator.clipboard.writeText(newPassword)
      showSuccess("Password copied to clipboard")
    }
  }, [newPassword, showSuccess])

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—"
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatDateTime = (date: Date | string | null | undefined) => {
    if (!date) return "—"
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  const getDaysActive = useCallback(() => {
    if (!user) return 0
    const now = new Date()
    const created = new Date(user.createdAt)
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(diff, 1)
  }, [user])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <BlueSpinner size="lg" label="Loading user details..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">User not found</div>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <Clock className="h-4 w-4" />
      case 'subscription': return <CreditCard className="h-4 w-4" />
      case 'plan_change': return <ArrowUp className="h-4 w-4" />
      case 'feature_usage': return <Compass className="h-4 w-4" />
      case 'visibility_change': return <Shield className="h-4 w-4" />
      default: return <ActivityIcon className="h-4 w-4" />
    }
  }

  const getAccessLevelBadge = (level: string | null) => {
    switch (level) {
      case 'full_access':
        return <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Full Access</Badge>
      case 'limited_access':
        return <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Limited</Badge>
      case 'locked':
        return <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">Locked</Badge>
      case 'hidden':
        return <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20">Hidden</Badge>
      default:
        return <Badge variant="outline" className="text-[10px]">Plan Default</Badge>
    }
  }

  const overviewTab = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/5 border flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold" data-testid="stat-courses-enrolled">{journey?.courses.started || 0}</p>
                <p className="text-xs text-muted-foreground">Courses Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/5 border flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold" data-testid="stat-products-saved">{journey?.productsSaved || 0}</p>
                <p className="text-xs text-muted-foreground">Products Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/5 border flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold" data-testid="stat-lessons-completed">{completedLessonIds.size}</p>
                <p className="text-xs text-muted-foreground">Lessons Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/5 border flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold" data-testid="stat-days-active">{getDaysActive()}</p>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Plan</p>
                <AdminStatusBadge status={user.plan} size="sm" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <AdminStatusBadge status={user.status} dot size="sm" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Subscription Date</p>
                <p className="text-sm font-medium" data-testid="text-subscription-date">{formatDate(user.subscriptionDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiry Date</p>
                <p className="text-sm font-medium" data-testid="text-expiry-date">
                  {formatDate(user.isTrial && user.trialEndsAt ? user.trialEndsAt : user.expiryDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="text-sm font-semibold" data-testid="text-credits">{(user.credits || 0).toLocaleString()}</p>
              </div>
              {user.isTrial && (
                <div>
                  <p className="text-xs text-muted-foreground">Trial</p>
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">Trial</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium" data-testid="text-email">{user.email}</p>
              </div>
              {user.phoneNumber && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium" data-testid="text-phone">{user.phoneNumber}</p>
                </div>
              )}
              {user.username && (
                <div>
                  <p className="text-xs text-muted-foreground">Username</p>
                  <p className="text-sm font-medium" data-testid="text-username">{user.username}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium" data-testid="text-joined">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!progressLoading && userProgress?.userDetails && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              Business Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const details = Array.isArray(userProgress.userDetails) ? userProgress.userDetails[0] ?? null : userProgress.userDetails ?? null
              if (!details) return <p className="text-sm text-muted-foreground">No business details on file</p>
              const fields = [
                { label: "Full Name", value: details.full_name },
                { label: "Batch ID", value: details.batch_id },
                { label: "Enrolled Number", value: details.enrolled_number },
                { label: "Contact Number", value: details.contact_number },
                { label: "Email", value: details.email },
                { label: "Website", value: details.website_name },
                { label: "Facebook Page", value: details.fb_page },
                { label: "Instagram Account", value: details.ig_account },
                { label: "LLC Name", value: details.llc_name },
                { label: "EIN Name", value: details.ein_name },
              ]
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-3">
                  {fields.map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="text-sm font-medium">{f.value || "—"}</p>
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )

  const learningTab = (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            Free Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {learningProgressLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="space-y-2 mt-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall completion</span>
                  <span className="font-semibold" data-testid="text-free-learning-progress">{completedLessonIds.size}/{TOTAL_FREE_LESSONS} lessons</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${TOTAL_FREE_LESSONS > 0 ? (completedLessonIds.size / TOTAL_FREE_LESSONS) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {TOTAL_FREE_LESSONS > 0 ? Math.round((completedLessonIds.size / TOTAL_FREE_LESSONS) * 100) : 0}% complete
                </p>
              </div>

              <div className="space-y-1">
                {freeLearningModules.map((mod) => {
                  const completedInModule = mod.lessons.filter(l => completedLessonIds.has(l.id)).length
                  const isModuleComplete = completedInModule === mod.lessons.length
                  return (
                    <div key={mod.id} className="border-b last:border-b-0">
                      <div className="flex items-center justify-between py-2.5 px-1" data-testid={`free-module-${mod.id}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {isModuleComplete ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-sm font-medium truncate">{mod.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{completedInModule}/{mod.lessons.length}</span>
                      </div>
                      {completedInModule > 0 && completedInModule < mod.lessons.length && (
                        <div className="pl-7 pb-2 space-y-1">
                          {mod.lessons.map(lesson => {
                            const isComplete = completedLessonIds.has(lesson.id)
                            const progressEntry = learningProgress.find(lp => lp.lesson_id === lesson.id)
                            return (
                              <div key={lesson.id} className="flex items-center justify-between text-xs py-0.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {isComplete ? (
                                    <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                  ) : (
                                    <Circle className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
                                  )}
                                  <span className={cn("truncate", !isComplete && "text-muted-foreground")}>{lesson.title}</span>
                                </div>
                                {isComplete && progressEntry && (
                                  <span className="text-muted-foreground flex-shrink-0 ml-2">{formatDate(progressEntry.completed_at)}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            Paid Course Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {journeyLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : journey && journey.courses.enrollments.length > 0 ? (
            <div className="space-y-3">
              {journey.courses.enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0" data-testid={`enrollment-${enrollment.id}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{enrollment.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">Enrolled: {formatDate(enrollment.enrolledAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${enrollment.progressPercentage}%` }} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{Math.round(enrollment.progressPercentage)}%</p>
                    </div>
                    {enrollment.completedAt ? (
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Done</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">In Progress</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-2">No paid course enrollments</p>
          )}
        </CardContent>
      </Card>

      {journey && journey.roadmap.total > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Map className="h-4 w-4 text-muted-foreground" />
              Roadmap Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall completion</span>
                <span className="font-medium">{journey.roadmap.progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journey.roadmap.progressPercent}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{journey.roadmap.completed} of {journey.roadmap.total} tasks completed</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const toggleGroup = useCallback((label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [])

  const getSessionModule = useCallback((moduleId: string): SessionModule | undefined => {
    return sessions.find(s => s.moduleId === moduleId)
  }, [sessions])

  const getEffectiveAccess = useCallback((moduleId: string): string | null => {
    if (pendingOverrides[moduleId] !== undefined) return pendingOverrides[moduleId]
    const mod = getSessionModule(moduleId)
    return mod?.hasOverride ? mod.accessLevel : null
  }, [pendingOverrides, getSessionModule])

  const handleApplyAllInGroup = useCallback((group: ModuleGroupDef, value: string) => {
    const updates: Record<string, string | null> = {}
    for (const mod of group.modules) {
      updates[mod.moduleId] = value === "plan_default" ? null : value
    }
    setPendingOverrides(prev => ({ ...prev, ...updates }))
  }, [])

  const pendingCount = Object.keys(pendingOverrides).length

  const accessControlTab = (
    <div className="space-y-4">
      {sessionsLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="py-4 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                Module Access Controls
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Override module access for {user?.name || "this user"}. Leave as "Plan Default" to use their {user?.plan || "plan"} access.
              </p>
            </div>
            {pendingCount > 0 && (
              <Button
                size="sm"
                onClick={handleSaveModuleOverrides}
                disabled={sessionsSaving}
                className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
                data-testid="button-save-overrides"
              >
                {sessionsSaving && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Save Changes ({pendingCount})
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
            <div className="space-y-3">
              {MODULE_GROUPS.map((group) => {
                const isCollapsed = collapsedGroups.has(group.label)
                const overrideCount = group.modules.filter(m => {
                  const eff = getEffectiveAccess(m.moduleId)
                  return eff !== null
                }).length
                const GroupIcon = group.icon

                return (
                  <Card key={group.label}>
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/30 transition-colors"
                      onClick={() => toggleGroup(group.label)}
                      data-testid={`group-toggle-${group.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                        <GroupIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">{group.label}</span>
                        {overrideCount > 0 && (
                          <Badge variant="outline" className="text-[10px] ml-1">{overrideCount} override{overrideCount !== 1 ? "s" : ""}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Select
                          value=""
                          onValueChange={(value) => handleApplyAllInGroup(group, value)}
                        >
                          <SelectTrigger className="h-7 w-[110px] text-[11px]" data-testid={`select-group-all-${group.label.toLowerCase().replace(/\s+/g, "-")}`}>
                            <SelectValue placeholder="Apply all..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plan_default">Plan Default</SelectItem>
                            <SelectItem value="full_access">Full Access</SelectItem>
                            <SelectItem value="locked">Locked</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {!isCollapsed && (
                      <CardContent className="pt-0 pb-2 px-4">
                        <div className="border-t">
                          {group.modules.map((mod) => {
                            const sessionMod = getSessionModule(mod.moduleId)
                            const effectiveAccess = getEffectiveAccess(mod.moduleId)
                            const hasPendingChange = pendingOverrides[mod.moduleId] !== undefined
                            const ModIcon = mod.icon

                            return (
                              <div
                                key={mod.moduleId}
                                className={cn(
                                  "flex items-center gap-3 py-2.5 border-b last:border-b-0",
                                  hasPendingChange && "bg-primary/5 -mx-2 px-2 rounded"
                                )}
                                data-testid={`session-module-${mod.moduleId}`}
                              >
                                <div className="h-8 w-8 rounded-lg bg-muted/50 border flex items-center justify-center flex-shrink-0">
                                  <ModIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium leading-tight">{mod.name}</p>
                                  <p className="text-[11px] text-muted-foreground leading-tight">{mod.description}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="w-20 flex justify-center">
                                    {getAccessLevelBadge(effectiveAccess)}
                                  </div>
                                  <Select
                                    value={effectiveAccess || "plan_default"}
                                    onValueChange={(value) => {
                                      if (value === "plan_default") {
                                        setPendingOverrides((prev) => ({ ...prev, [mod.moduleId]: null }))
                                      } else {
                                        setPendingOverrides((prev) => ({ ...prev, [mod.moduleId]: value }))
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-[130px] h-8 text-xs" data-testid={`select-module-${mod.moduleId}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="plan_default">Plan Default</SelectItem>
                                      <SelectItem value="full_access">Full Access</SelectItem>
                                      <SelectItem value="limited_access">Limited</SelectItem>
                                      <SelectItem value="locked">Locked</SelectItem>
                                      <SelectItem value="hidden">Hidden</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>

            <div className="xl:sticky xl:top-4 self-start">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                    <Eye className="h-3.5 w-3.5" />
                    Nav Preview
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground">What {user?.name?.split(" ")[0] || "user"} sees in the sidebar</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {MODULE_GROUPS.map((group) => {
                      const visibleModules = group.modules.filter(m => {
                        const access = getEffectiveAccess(m.moduleId)
                        return access !== "hidden"
                      })
                      if (visibleModules.length === 0) return null
                      const GroupIcon = group.icon
                      return (
                        <div key={group.label}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <GroupIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</span>
                          </div>
                          <div className="space-y-0.5 pl-[18px]">
                            {visibleModules.map(m => {
                              const access = getEffectiveAccess(m.moduleId)
                              const isLocked = access === "locked"
                              return (
                                <div key={m.moduleId} className={cn(
                                  "flex items-center gap-1.5 text-[11px] py-0.5",
                                  isLocked && "opacity-50"
                                )}>
                                  <span className="truncate">{m.name}</span>
                                  {isLocked && <Lock className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />}
                                  {access === "full_access" && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 flex-shrink-0" />}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const journeyTab = (
    <div className="space-y-4">
      {journeyLoading ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i}><CardContent className="py-4"><Skeleton className="h-10 w-full" /></CardContent></Card>
            ))}
          </div>
          {[1, 2].map(i => (
            <Card key={i}><CardContent className="py-6 space-y-3"><Skeleton className="h-4 w-32" /><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : !journey ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Route className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No journey data available</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Card>
              <CardContent className="pt-3 pb-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Onboarding</p>
                <p className="text-lg font-semibold" data-testid="stat-onboarding">{journey.onboarding?.progress ?? 0}%</p>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journey.onboarding?.progress ?? 0}%` }} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Courses</p>
                <p className="text-lg font-semibold" data-testid="stat-courses">{journey.courses?.completed ?? 0}/{journey.courses?.started ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">completed / enrolled</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Roadmap</p>
                <p className="text-lg font-semibold" data-testid="stat-roadmap">{journey.roadmap?.progressPercent ?? 0}%</p>
                <p className="text-[10px] text-muted-foreground">{journey.roadmap?.completed ?? 0}/{journey.roadmap?.total ?? 0} tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Stores</p>
                <p className="text-lg font-semibold" data-testid="stat-stores">{journey.shopifyStores?.length ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">{journey.shopifyConnected ? "Connected" : "Not connected"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-3 pb-2.5">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Products</p>
                <p className="text-lg font-semibold" data-testid="stat-saved-products">{journey.productsSaved}</p>
                <p className="text-[10px] text-muted-foreground">saved to picklist</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                Onboarding Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Overall completion</span>
                  <span className="font-medium">{journey.onboarding?.completedSteps ?? 0}/{journey.onboarding?.totalSteps ?? 0} steps</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journey.onboarding?.progress ?? 0}%` }} />
                </div>
              </div>
              {(journey.onboarding?.steps?.length ?? 0) > 0 ? (
                <div className="space-y-1">
                  {(journey.onboarding?.steps ?? []).map((step, idx) => (
                    <div key={step.id || idx} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                      <div className="flex items-center gap-2 min-w-0">
                        {step.completed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="text-sm truncate">{step.moduleId || `Step ${idx + 1}`}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {step.watchDuration > 0 && (
                          <span className="text-[10px] text-muted-foreground">{Math.round(step.watchDuration / 60)}m watched</span>
                        )}
                        {step.completedAt && (
                          <span className="text-[10px] text-muted-foreground">{formatDate(step.completedAt)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No onboarding steps recorded</p>
              )}
            </CardContent>
          </Card>

          {(journey.courses?.enrollments?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  Course Enrollments ({journey.courses?.enrollments?.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(journey.courses?.enrollments ?? []).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{enrollment.courseTitle}</p>
                        <p className="text-xs text-muted-foreground">Enrolled: {formatDate(enrollment.enrolledAt)}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-20">
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${enrollment.progressPercentage}%` }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{Math.round(enrollment.progressPercentage)}%</p>
                        </div>
                        {enrollment.completedAt ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Done</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">In Progress</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(journey.roadmap?.total ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  Roadmap Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{journey.roadmap?.completed ?? 0}/{journey.roadmap?.total ?? 0} tasks</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${journey.roadmap?.progressPercent ?? 0}%` }} />
                  </div>
                </div>
                {(journey.roadmap?.items?.length ?? 0) > 0 && (
                  <div className="space-y-1">
                    {(journey.roadmap?.items ?? []).map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.status === "completed" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          ) : item.status === "in_progress" ? (
                            <Clock className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="text-sm truncate">{item.taskId}</span>
                        </div>
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          item.status === "completed" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          item.status === "in_progress" && "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {item.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(journey.shopifyStores?.length ?? 0) > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  Shopify Stores ({journey.shopifyStores?.length ?? 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(journey.shopifyStores ?? []).map((store) => (
                    <div key={store.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{store.storeName}</p>
                        <p className="text-xs text-muted-foreground truncate">{store.storeUrl}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{formatDate(store.createdAt)}</span>
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          store.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""
                        )}>{store.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted/50 border flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold" data-testid="stat-credentials">{journey.credentialsCount}</p>
                    <p className="text-xs text-muted-foreground">Stored Credentials</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted/50 border flex items-center justify-center">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{journey.productsSaved}</p>
                    <p className="text-xs text-muted-foreground">Products Saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )

  const activityTab = (
    <div className="space-y-4">
      {activitiesLoading ? (
        <Card>
          <CardContent className="py-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : activities.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <ActivityIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No activity recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-0">
                {activities.map((activity: any, index: number) => (
                  <div key={activity.id || index} className="relative flex items-start gap-4 py-3" data-testid={`activity-item-${index}`}>
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-card flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(activity.timestamp)}</p>
                    </div>
                    <AdminStatusBadge
                      status={activity.type === 'login' ? 'active' : activity.type === 'visibility_change' ? 'pending' : 'published'}
                      label={activity.type.replace(/_/g, ' ')}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const notesTab = (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" />
            Add Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type a note about this user..."
              className="resize-none text-sm"
              rows={3}
              data-testid="input-note"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || noteSaving}
                data-testid="button-add-note"
              >
                {noteSaving ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                Add Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {notesLoading ? (
        <Card>
          <CardContent className="py-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 pb-3 border-b last:border-b-0">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : notes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <StickyNote className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No notes yet. Add the first note above.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Notes ({notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="pb-3 border-b last:border-b-0" data-testid={`note-item-${note.id}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={note.adminAvatarUrl || undefined} />
                      <AvatarFallback className="text-[8px]">{note.adminName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{note.adminName}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground/90 pl-7">{note.note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const tabs = [
    { value: "overview", label: "Overview", icon: <BarChart3 className="h-3.5 w-3.5" />, content: overviewTab },
    { value: "journey", label: "Journey", icon: <Route className="h-3.5 w-3.5" />, content: journeyTab },
    { value: "learning", label: "Learning", icon: <GraduationCap className="h-3.5 w-3.5" />, content: learningTab },
    { value: "access", label: "Access Control", icon: <Shield className="h-3.5 w-3.5" />, content: accessControlTab, count: sessions.filter(s => s.hasOverride).length || undefined },
    { value: "activity", label: "Activity", icon: <ActivityIcon className="h-3.5 w-3.5" />, content: activityTab, count: activities.length || undefined },
    { value: "notes", label: "Notes", icon: <StickyNote className="h-3.5 w-3.5" />, content: notesTab, count: notes.length || undefined },
  ]

  const headerActions = [
    { label: "Send Email", icon: <Mail className="h-4 w-4" />, onClick: () => window.open(`mailto:${user.email}`) },
    ...(user.phoneNumber ? [{ label: "Send WhatsApp", icon: <MessageCircle className="h-4 w-4" />, onClick: () => window.open(`https://wa.me/${user.phoneNumber?.replace(/\D/g, '')}`) }] : []),
    { label: "Reset Password", icon: <KeyRound className="h-4 w-4" />, onClick: openResetPassword, separator: true },
    ...(user.status === "active"
      ? [{ label: "Suspend", icon: <Lock className="h-4 w-4" />, onClick: handleSuspend, separator: true }]
      : [{ label: "Activate", icon: <Check className="h-4 w-4" />, onClick: handleActivate, separator: true }]),
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, onClick: handleDelete, variant: "destructive" as const, separator: true },
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-y-auto">
      <AdminDetailLayout
        backHref="/admin/external-users"
        backLabel="Clients"
        title={user.name}
        subtitle={`${user.email} · Joined ${formatDate(user.createdAt)}`}
        avatarUrl={user.avatarUrl || getAvatarUrl(user.id, user.email)}
        badges={[
          <AdminStatusBadge key="plan" status={user.plan} />,
          <AdminStatusBadge key="status" status={user.status} dot />,
        ]}
        primaryActions={
          <Button variant="outline" size="sm" onClick={openEditDialog} className="cursor-pointer" data-testid="button-edit-user">
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        }
        actions={headerActions}
        tabs={tabs}
        defaultTab="overview"
        onPrev={prevUser ? () => router.push(`/admin/external-users/${prevUser.id}`) : undefined}
        onNext={nextUser ? () => router.push(`/admin/external-users/${nextUser.id}`) : undefined}
        hasPrev={!!prevUser}
        hasNext={!!nextUser}
      />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and account settings.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter full name"
                data-testid="input-edit-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Enter email"
                data-testid="input-edit-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                placeholder="+1234567890"
                data-testid="input-edit-phone"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={editForm.plan} onValueChange={(v) => setEditForm({ ...editForm, plan: v as ExternalUserPlan })}>
                  <SelectTrigger data-testid="select-edit-plan"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as UserStatus })}>
                  <SelectTrigger data-testid="select-edit-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={editLoading} className="cursor-pointer" data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={editLoading || !editForm.name.trim() || !editForm.email.trim()} className="bg-blue-500 hover:bg-blue-600 cursor-pointer" data-testid="button-save-edit">
              {editLoading ? <><Loader size="sm" className="mr-2" />Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetPwOpen} onOpenChange={setResetPwOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {user.name}. They will need to use this password on their next login.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-20"
                    data-testid="input-new-password"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)} data-testid="button-toggle-pw-visibility">
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {newPassword && (
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={handleCopyPassword} data-testid="button-copy-pw">
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={handleGeneratePassword} className="flex-shrink-0 cursor-pointer" data-testid="button-generate-pw">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
            </div>
            {newPassword && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Strength:</span>
                  <span className={cn("font-medium", getPasswordStrengthColor(newPassword))}>{getPasswordStrengthLabel(newPassword)}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all", getPasswordStrengthBarColor(newPassword))} style={{ width: `${getPasswordStrengthProgress(newPassword)}%` }} />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPwOpen(false)} disabled={resetPwLoading} className="cursor-pointer" data-testid="button-cancel-reset-pw">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resetPwLoading || !newPassword || newPassword.length < 8} className="bg-blue-500 hover:bg-blue-600 cursor-pointer" data-testid="button-confirm-reset-pw">
              {resetPwLoading ? <><Loader size="sm" className="mr-2" />Resetting...</> : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
