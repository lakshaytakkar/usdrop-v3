import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { ExternalUser } from "@/types/admin/users"
import { ArrowLeft, Mail, Phone, Calendar, CreditCard, Shield, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import {
  PageShell,
  PageHeader,
  DetailSection,
  InfoRow,
  StatusBadge,
  SectionGrid,
  StatCard,
  StatGrid,
} from "@/components/admin-shared"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, ShoppingBag, BookOpen, Clock } from "lucide-react"

export default function ExternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [user, setUser] = useState<ExternalUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [journey, setJourney] = useState<any>(null)
  const [journeyLoading, setJourneyLoading] = useState(true)

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

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "—"
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getDaysActive = () => {
    if (!user) return 0
    const now = new Date()
    const created = new Date(user.createdAt)
    return Math.max(Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)), 1)
  }

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
    </PageShell>
  )
}
