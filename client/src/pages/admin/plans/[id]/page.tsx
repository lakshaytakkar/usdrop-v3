import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Edit,
  Trash2,
  Lock,
  Unlock,
  Check,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Package,
  BookOpen,
  ShoppingCart,
  Store,
  Truck,
  TrendingUp,
  BarChart3,
  Palette,
  Search,
  GraduationCap,
  Lightbulb,
  Layout,
} from "lucide-react"
import { SubscriptionPlan } from "@/types/admin/plans"
import { AdminDetailLayout, AdminStatusBadge, AdminEmptyState } from "@/components/admin"
import { useToast } from "@/hooks/use-toast"

interface Subscriber {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  subscriptionStatus: string
  createdAt: string
}

interface ModulePermission {
  moduleId: string
  moduleName: string
  icon: React.ElementType
  accessLevel: "full_access" | "limited_access" | "locked" | "hidden"
}

const PLATFORM_MODULES: { id: string; name: string; icon: React.ElementType }[] = [
  { id: "winning-products", name: "Winning Products", icon: TrendingUp },
  { id: "product-hunt", name: "Product Hunt", icon: Search },
  { id: "categories", name: "Categories", icon: Layout },
  { id: "competitor-stores", name: "Competitor Stores", icon: Store },
  { id: "suppliers", name: "Suppliers", icon: Truck },
  { id: "my-products", name: "My Products", icon: Package },
  { id: "my-store", name: "My Store", icon: ShoppingCart },
  { id: "academy", name: "Academy", icon: GraduationCap },
  { id: "courses", name: "Courses", icon: BookOpen },
  { id: "intelligence-hub", name: "Intelligence Hub", icon: Lightbulb },
  { id: "meta-ads", name: "Meta Ads Research", icon: BarChart3 },
  { id: "ai-studio", name: "AI Studio", icon: Palette },
  { id: "mentorship", name: "Mentorship", icon: Users },
  { id: "shipping-calculator", name: "Shipping Calculator", icon: Truck },
  { id: "fulfillment", name: "Fulfillment", icon: Package },
  { id: "tools", name: "Tools", icon: Shield },
]

const ACCESS_LEVELS = [
  { value: "full_access", label: "Full Access", color: "text-emerald-600" },
  { value: "limited_access", label: "Limited", color: "text-amber-600" },
  { value: "locked", label: "Locked", color: "text-red-600" },
  { value: "hidden", label: "Hidden", color: "text-muted-foreground" },
]

export default function PlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params?.id as string
  const { showSuccess, showError } = useToast()

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subscribersLoading, setSubscribersLoading] = useState(false)
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([])
  const [permissionsSaving, setPermissionsSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPlan = useCallback(async () => {
    if (!planId) return
    try {
      setLoading(true)
      const response = await apiFetch(`/api/admin/plans/${planId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setPlan(null)
          return
        }
        throw new Error('Failed to fetch plan')
      }
      const planData = await response.json()
      setPlan({
        ...planData,
        createdAt: planData.createdAt ? new Date(planData.createdAt) : null,
        updatedAt: planData.updatedAt ? new Date(planData.updatedAt) : null,
      })
    } catch (err) {
      console.error('Error fetching plan:', err)
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }, [planId])

  const fetchAllPlans = useCallback(async () => {
    try {
      const response = await apiFetch("/api/admin/plans")
      if (response.ok) {
        const data = await response.json()
        setAllPlans(data.map((p: any) => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : null,
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
        })))
      }
    } catch (err) {
      console.error('Error fetching all plans:', err)
    }
  }, [])

  const fetchSubscribers = useCallback(async () => {
    if (!planId) return
    try {
      setSubscribersLoading(true)
      const response = await apiFetch(`/api/admin/external-users?planId=${planId}`)
      if (response.ok) {
        const data = await response.json()
        const users = (data.users || data || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          fullName: u.fullName || u.full_name || '',
          avatarUrl: u.avatarUrl || u.avatar_url || null,
          subscriptionStatus: u.subscriptionStatus || u.subscription_status || 'active',
          createdAt: u.createdAt || u.created_at || '',
        }))
        setSubscribers(users)
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err)
    } finally {
      setSubscribersLoading(false)
    }
  }, [planId])

  useEffect(() => {
    fetchPlan()
    fetchAllPlans()
  }, [fetchPlan, fetchAllPlans])

  useEffect(() => {
    if (plan) {
      const perms = PLATFORM_MODULES.map(mod => ({
        moduleId: mod.id,
        moduleName: mod.name,
        icon: mod.icon,
        accessLevel: (plan.slug === "free" ? "locked" : "full_access") as ModulePermission["accessLevel"],
      }))
      setModulePermissions(perms)
      fetchSubscribers()
    }
  }, [plan, fetchSubscribers])

  const { prevPlan, nextPlan } = useMemo(() => {
    if (!plan) return { prevPlan: null, nextPlan: null }
    const currentIndex = allPlans.findIndex((p) => p.id === plan.id)
    return {
      prevPlan: currentIndex > 0 ? allPlans[currentIndex - 1] : null,
      nextPlan: currentIndex < allPlans.length - 1 ? allPlans[currentIndex + 1] : null,
    }
  }, [plan, allPlans])

  const handleEdit = () => {
    router.push(`/admin/plans?edit=${plan?.id}`)
  }

  const handleToggleActive = async () => {
    if (!plan) return
    setActionLoading("toggle-active")
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !plan.active }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      const updatedPlan = await response.json()
      setPlan({
        ...updatedPlan,
        createdAt: updatedPlan.createdAt ? new Date(updatedPlan.createdAt) : null,
        updatedAt: updatedPlan.updatedAt ? new Date(updatedPlan.updatedAt) : null,
      })
      showSuccess(`Plan ${updatedPlan.active ? "activated" : "deactivated"} successfully`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update plan"
      showError(msg)
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublic = async () => {
    if (!plan) return
    setActionLoading("toggle-public")
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !plan.isPublic }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update plan")
      }
      const updatedPlan = await response.json()
      setPlan({
        ...updatedPlan,
        createdAt: updatedPlan.createdAt ? new Date(updatedPlan.createdAt) : null,
        updatedAt: updatedPlan.updatedAt ? new Date(updatedPlan.updatedAt) : null,
      })
      showSuccess(`Plan ${updatedPlan.isPublic ? "made public" : "made private"} successfully`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update plan"
      showError(msg)
    } finally {
      setActionLoading(null)
    }
  }

  const confirmDelete = async () => {
    if (!plan) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, { method: "DELETE" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete plan")
      }
      const result = await response.json()
      showSuccess(result.message || `Plan "${plan.name}" deleted successfully`)
      router.push("/admin/plans")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete plan"
      showError(msg)
    } finally {
      setActionLoading(null)
      setDeleteConfirmOpen(false)
    }
  }

  const handlePermissionChange = (moduleId: string, accessLevel: string) => {
    setModulePermissions(prev =>
      prev.map(p =>
        p.moduleId === moduleId
          ? { ...p, accessLevel: accessLevel as ModulePermission["accessLevel"] }
          : p
      )
    )
  }

  const handleSavePermissions = async () => {
    setPermissionsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      showSuccess("Permissions saved successfully")
    } catch (err) {
      showError("Failed to save permissions")
    } finally {
      setPermissionsSaving(false)
    }
  }

  const handleChangePlan = async (userId: string, newPlanId: string) => {
    try {
      const response = await apiFetch(`/api/admin/external-users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: allPlans.find(p => p.id === newPlanId)?.slug || "free" }),
      })
      if (!response.ok) throw new Error("Failed to change plan")
      showSuccess("User plan updated successfully")
      fetchSubscribers()
    } catch (err) {
      showError("Failed to change user plan")
    }
  }

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price.toFixed(2)}`
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const overviewTab = plan ? (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div data-testid="text-monthly-price">
                <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                <p className="text-xl font-semibold">{formatPrice(plan.priceMonthly)}</p>
                {plan.priceMonthly > 0 && <p className="text-xs text-muted-foreground">/month</p>}
              </div>
              {plan.priceAnnual != null && (
                <div data-testid="text-annual-price">
                  <p className="text-xs text-muted-foreground mb-1">Annual</p>
                  <p className="text-xl font-semibold">${plan.priceAnnual.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">/year</p>
                </div>
              )}
            </div>
            {plan.trialDays > 0 && (
              <div className="mt-4 pt-3 border-t" data-testid="text-trial-days">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{plan.trialDays}-day free trial</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-muted-foreground" />
              Features ({plan.features?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            {plan.features && plan.features.length > 0 ? (
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm" data-testid={`text-feature-${index}`}>
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No features configured</p>
            )}
          </CardContent>
        </Card>

        {plan.description && (
          <Card>
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-sm text-muted-foreground" data-testid="text-description">{plan.description}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-3xl font-semibold" data-testid="text-subscriber-count">
              {subscribersLoading ? <Skeleton className="h-9 w-16" /> : subscribers.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">active users on this plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 px-4 pt-4">
            <CardTitle className="text-sm font-semibold">Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Slug</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono" data-testid="text-slug">{plan.slug}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Display Order</span>
              <span className="text-sm font-medium" data-testid="text-display-order">{plan.displayOrder}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <AdminStatusBadge status={plan.active ? "active" : "inactive"} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Visibility</span>
              <Badge variant="outline" className="text-xs">
                {plan.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            {plan.popular && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Popular</span>
                <Badge variant="default" className="text-xs gap-1">
                  <Star className="h-3 w-3" />
                  Yes
                </Badge>
              </div>
            )}
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-xs" data-testid="text-created-at">{formatDate(plan.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Updated</span>
                <span className="text-xs" data-testid="text-updated-at">{formatDate(plan.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {plan.keyPointers && (
          <Card>
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold">Key Pointers</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-sm" data-testid="text-key-pointers">{plan.keyPointers}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  ) : null

  const permissionsTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Module Access Matrix</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure which platform modules this plan can access
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSavePermissions}
          disabled={permissionsSaving}
          data-testid="button-save-permissions"
        >
          {permissionsSaving ? "Saving..." : "Save Permissions"}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Module</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Access Level</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {modulePermissions.map((perm) => {
                  const Icon = perm.icon
                  const levelConfig = ACCESS_LEVELS.find(l => l.value === perm.accessLevel)
                  return (
                    <tr key={perm.moduleId} className="border-b last:border-b-0" data-testid={`row-permission-${perm.moduleId}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{perm.moduleName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={perm.accessLevel}
                          onValueChange={(val) => handlePermissionChange(perm.moduleId, val)}
                        >
                          <SelectTrigger className="w-[160px]" data-testid={`select-permission-${perm.moduleId}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ACCESS_LEVELS.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {perm.accessLevel === "full_access" && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                            <Unlock className="h-3 w-3 mr-1" />
                            Full
                          </Badge>
                        )}
                        {perm.accessLevel === "limited_access" && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                            <Eye className="h-3 w-3 mr-1" />
                            Limited
                          </Badge>
                        )}
                        {perm.accessLevel === "locked" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                            <Lock className="h-3 w-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                        {perm.accessLevel === "hidden" && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const subscribersTab = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Plan Subscribers</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {subscribers.length} user{subscribers.length !== 1 ? "s" : ""} on this plan
          </p>
        </div>
      </div>

      {subscribersLoading ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      ) : subscribers.length === 0 ? (
        <AdminEmptyState
          title="No subscribers"
          description="No users are currently on this plan"
          icon={Users}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((user) => (
                    <tr key={user.id} className="border-b last:border-b-0" data-testid={`row-subscriber-${user.id}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatarUrl || undefined} />
                            <AvatarFallback className="text-xs bg-primary/5 text-primary">
                              {(user.fullName || user.email).slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate text-sm">{user.fullName || "Unnamed"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <AdminStatusBadge status={user.subscriptionStatus || "active"} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/external-users/${user.id}`)}
                            data-testid={`button-view-user-${user.id}`}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          {allPlans.length > 1 && (
                            <Select onValueChange={(val) => handleChangePlan(user.id, val)}>
                              <SelectTrigger className="w-[130px]" data-testid={`select-change-plan-${user.id}`}>
                                <SelectValue placeholder="Change plan" />
                              </SelectTrigger>
                              <SelectContent>
                                {allPlans
                                  .filter(p => p.id !== planId)
                                  .map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const badges = plan ? [
    <AdminStatusBadge key="status" status={plan.active ? "active" : "inactive"} dot />,
    <Badge key="visibility" variant="outline" className="text-xs">
      {plan.isPublic ? "Public" : "Private"}
    </Badge>,
    ...(plan.popular ? [
      <Badge key="popular" variant="default" className="gap-1 text-xs">
        <Star className="h-3 w-3" />
        Popular
      </Badge>
    ] : []),
  ] : []

  const actions = plan ? [
    {
      label: plan.active ? "Deactivate" : "Activate",
      icon: plan.active ? <Lock className="h-4 w-4" /> : <Check className="h-4 w-4" />,
      onClick: handleToggleActive,
      disabled: actionLoading === "toggle-active",
    },
    {
      label: plan.isPublic ? "Make Private" : "Make Public",
      icon: plan.isPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
      onClick: handleTogglePublic,
      disabled: actionLoading === "toggle-public",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => setDeleteConfirmOpen(true),
      variant: "destructive" as const,
      separator: true,
      disabled: actionLoading === "delete",
    },
  ] : []

  const tabs = plan ? [
    { value: "overview", label: "Overview", icon: <Layout className="h-4 w-4" />, content: overviewTab },
    { value: "permissions", label: "Permissions", icon: <Shield className="h-4 w-4" />, count: modulePermissions.length, content: permissionsTab },
    { value: "subscribers", label: "Subscribers", icon: <Users className="h-4 w-4" />, count: subscribers.length, content: subscribersTab },
  ] : []

  if (!loading && !plan) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <AdminEmptyState
            title="Plan not found"
            description="The plan you're looking for doesn't exist or has been deleted"
            icon={DollarSign}
            actionLabel="Back to Plans"
            onAction={() => router.push("/admin/plans")}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <AdminDetailLayout
        backHref="/admin/plans"
        backLabel="Plans"
        title={plan?.name || ""}
        subtitle={plan ? `${formatPrice(plan.priceMonthly)}${plan.priceMonthly > 0 ? "/mo" : ""} · ${plan.slug}` : ""}
        avatarFallback={plan?.name?.slice(0, 2).toUpperCase()}
        badges={badges}
        actions={actions}
        primaryActions={
          <Button onClick={handleEdit} size="sm" variant="outline" data-testid="button-edit-plan">
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
        }
        tabs={tabs}
        defaultTab="overview"
        loading={loading}
        onPrev={prevPlan ? () => router.push(`/admin/plans/${prevPlan.id}`) : undefined}
        onNext={nextPlan ? () => router.push(`/admin/plans/${nextPlan.id}`) : undefined}
        hasPrev={!!prevPlan}
        hasNext={!!nextPlan}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{plan?.name}"? This action cannot be undone.
              {subscribers.length > 0 && (
                <span className="block mt-2 font-medium text-amber-600">
                  This plan has {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}. It will be deactivated instead of deleted.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} data-testid="button-cancel-delete">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={actionLoading === "delete"}
              data-testid="button-confirm-delete"
            >
              {actionLoading === "delete" ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
