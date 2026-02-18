

import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Trash2,
  Lock,
  Check,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Calendar,
  MoreVertical,
  ArrowUp,
} from "lucide-react"
import { SubscriptionPlan } from "@/types/admin/plans"
import Loader from "@/components/kokonutui/loader"
import { useToast } from "@/hooks/use-toast"
export default function PlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params?.id as string

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch current plan from API
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return
      
      try {
        setLoading(true)
        const response = await apiFetch(`/api/admin/plans/${planId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setPlan(null)
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch plan')
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
    }

    fetchPlan()
  }, [planId])

  // Fetch all plans for navigation
  useEffect(() => {
    const fetchAllPlans = async () => {
      try {
        const response = await apiFetch("/api/admin/plans")
        if (response.ok) {
          const data = await response.json()
          const plansData: SubscriptionPlan[] = data.map((p: {
            id: string
            name: string
            slug: string
            description: string | null
            priceMonthly: number
            priceAnnual: number | null
            priceYearly: number | null
            features: string[]
            popular: boolean
            active: boolean
            isPublic: boolean
            displayOrder: number
            keyPointers: string | null
            trialDays: number
            createdAt: string | null
            updatedAt: string | null
          }) => ({
            ...p,
            createdAt: p.createdAt ? new Date(p.createdAt) : null,
            updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
          }))
          setAllPlans(plansData)
        }
      } catch (err) {
        console.error('Error fetching all plans:', err)
      }
    }

    fetchAllPlans()
  }, [])

  // Find previous and next plans
  const { prevPlan, nextPlan } = useMemo(() => {
    if (!plan) return { prevPlan: null, nextPlan: null }
    
    const currentIndex = allPlans.findIndex((p) => p.id === plan.id)
    const prev = currentIndex > 0 ? allPlans[currentIndex - 1] : null
    const next = currentIndex < allPlans.length - 1 ? allPlans[currentIndex + 1] : null
    
    return { prevPlan: prev, nextPlan: next }
  }, [plan, allPlans])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Loader 
            title="Loading plan details..." 
            subtitle="Fetching subscription plan information"
            size="md"
          />
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Plan not found</div>
        </div>
      </div>
    )
  }

  const getStatusBadgeVariant = (active: boolean) => {
    return active ? "default" as const : "secondary" as const
  }

  const getVisibilityBadgeVariant = (isPublic: boolean) => {
    return isPublic ? "outline" as const : "secondary" as const
  }

  const { showSuccess, showError } = useToast()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Handler functions
  const handleEdit = () => {
    router.push(`/admin/plans?edit=${plan.id}`)
  }

  const handleDelete = () => {
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!plan) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/plans/${plan.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete plan")
      }
      
      const result = await response.json()
      showSuccess(result.message || `Plan "${plan.name}" has been deleted successfully`)
      router.push("/admin/plans")
    } catch (err) {
      console.error("Error deleting plan:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
      setDeleteConfirmOpen(false)
    }
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
      console.error("Error toggling plan active status:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update plan. Please try again."
      showError(errorMessage)
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
      console.error("Error toggling plan public status:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update plan. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex h-14 items-center gap-2 px-3">
          {/* Back Button - Small Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/plans")}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1 min-w-0">
            <Link href="/admin/plans" className="hover:text-foreground transition-colors whitespace-nowrap cursor-pointer">
              Plans
            </Link>
            <span>/</span>
            <span className="line-clamp-1">{plan.name}</span>
          </nav>

          {/* Prev/Next Navigation on Right */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {prevPlan && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/plans/${prevPlan.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>
            )}
            {nextPlan && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/plans/${nextPlan.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3">

      {/* Plan Header */}
      <Card className="mb-2">
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <CardTitle className="text-lg mb-0">{plan.name}</CardTitle>
                  {plan.popular && (
                    <Badge variant="default" className="gap-1 text-xs">
                      <Star className="h-3 w-3" />
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant={getStatusBadgeVariant(plan.active)} className="text-xs">
                    {plan.active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={getVisibilityBadgeVariant(plan.isPublic)} className="text-xs">
                    {plan.isPublic ? "Public" : "Private"}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{plan.slug}</span>
                </div>
              </div>
            </div>
            
            {/* Button Group with Edit and More Actions */}
            <div className="flex items-center gap-1.5">
              <Button onClick={handleEdit} className="cursor-pointer" size="sm" variant="outline">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {plan.active ? (
                    <DropdownMenuItem onClick={handleToggleActive} className="cursor-pointer">
                      <Lock className="h-4 w-4 mr-2" />
                      Deactivate
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleToggleActive} className="cursor-pointer">
                      <Check className="h-4 w-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  {plan.isPublic ? (
                    <DropdownMenuItem onClick={handleTogglePublic} className="cursor-pointer">
                      <EyeOff className="h-4 w-4 mr-2" />
                      Make Private
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleTogglePublic} className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      Make Public
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList>
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="features" className="cursor-pointer">Features</TabsTrigger>
          <TabsTrigger value="permissions" className="cursor-pointer">Permissions</TabsTrigger>
          <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Price</p>
                    <p className="text-sm font-medium">
                      {plan.priceMonthly === 0
                        ? "Free"
                        : `$${plan.priceMonthly.toFixed(2)}/month`}
                    </p>
                  </div>
                </div>
                {plan.priceAnnual && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Annual Price</p>
                      <p className="text-sm font-medium">${plan.priceAnnual.toFixed(2)}/year</p>
                    </div>
                  </div>
                )}
                {plan.trialDays > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Trial Period</p>
                      <p className="text-sm font-medium">{plan.trialDays} days</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {plan.description && (
              <Card>
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-sm font-semibold">Description</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-3">
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardContent>
              </Card>
            )}

            {plan.keyPointers && (
              <Card>
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-sm font-semibold">Key Pointers</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-3">
                  <p className="text-sm font-medium">{plan.keyPointers}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Plan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Display Order</span>
                  <span className="text-sm font-medium">{plan.displayOrder}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant={getStatusBadgeVariant(plan.active)} className="text-xs">
                    {plan.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Visibility</span>
                  <Badge variant={getVisibilityBadgeVariant(plan.isPublic)} className="text-xs">
                    {plan.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
                {plan.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Created At</p>
                      <p className="text-sm font-medium">
                        {new Date(plan.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
                {plan.updatedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">
                        {new Date(plan.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Plan Features</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                {plan.features && plan.features.length > 0 ? (
                  <ul className="space-y-1.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No features configured</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Plan Permissions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <p className="text-sm text-muted-foreground">
                  Permission configuration will be displayed here. To manage plan permissions, go to the Permissions page.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Plan Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <p className="text-sm text-muted-foreground">
                  Settings and configuration options will be displayed here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      </div>
    </div>
  )
}

