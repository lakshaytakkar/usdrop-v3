

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Users, TrendingUp, Target, Search, MoreVertical, User, Mail, Calendar, Activity, ShoppingBag, Map, BookOpen, Star, ChevronRight, Zap } from "lucide-react"

interface Lead {
  id: string
  user_id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: string
  plan_name: string
  account_type: string
  stage: "new_lead" | "engaged" | "pitched" | "converted" | "churned"
  source: "organic" | "referral" | "campaign" | "manual"
  priority: "low" | "medium" | "high"
  assigned_to: string | null
  notes: string | null
  last_contacted_at: string | null
  tags: string[]
  signup_date: string
  last_active: string
  onboarding_completed: boolean
  onboarding_progress: number
  saved_products: number
  has_shopify: boolean
  roadmap_progress: number
  engagement_score: number
  subscription_status: string | null
}

interface LeadStats {
  total: number
  new_lead: number
  engaged: number
  pitched: number
  converted: number
  churned: number
  avgEngagement: number
  conversionRate: number
}

const STAGES: { key: Lead["stage"]; label: string; badgeClass: string }[] = [
  { key: "new_lead", label: "New Lead", badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-700/20 dark:text-gray-300" },
  { key: "engaged", label: "Engaged", badgeClass: "bg-[#eff6ff] text-[#1d4ed8] dark:bg-[#1d4ed8]/10 dark:text-[#60a5fa]" },
  { key: "pitched", label: "Pitched", badgeClass: "bg-[#fff8e6] text-[#d39c3d] dark:bg-[#d39c3d]/10 dark:text-[#ffbe4c]" },
  { key: "converted", label: "Converted", badgeClass: "bg-[#effefa] text-[#40c4aa] dark:bg-[#40c4aa]/10 dark:text-[#40c4aa]" },
  { key: "churned", label: "Churned", badgeClass: "bg-[#fff0f3] text-[#df1c41] dark:bg-[#df1c41]/10 dark:text-[#df1c41]" },
]

const PRIORITIES: { key: Lead["priority"]; label: string; dotColor: string }[] = [
  { key: "low", label: "Low", dotColor: "bg-gray-400" },
  { key: "medium", label: "Medium", dotColor: "bg-amber-400" },
  { key: "high", label: "High", dotColor: "bg-red-500" },
]

function getStageBadge(stage: Lead["stage"]) {
  const s = STAGES.find((s) => s.key === stage)
  if (!s) return null
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", s.badgeClass)}>{s.label}</span>
}

function getPriorityDot(priority: Lead["priority"]) {
  const p = PRIORITIES.find((p) => p.key === priority)
  if (!p) return null
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", p.dotColor)} />
      <span className="text-sm text-muted-foreground">{p.label}</span>
    </div>
  )
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const { hasPermission: canEdit } = useHasPermission("leads.edit")

  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats>({ total: 0, new_lead: 0, engaged: 0, pitched: 0, converted: 0, churned: 0, avgEngagement: 0, conversionRate: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<Lead["stage"] | "all">("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerNotes, setDrawerNotes] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiFetch("/api/admin/leads")
      if (!response.ok) throw new Error("Failed to fetch leads")
      const data = await response.json()
      setLeads(data.leads || [])
      setStats(data.stats || { total: 0, new_lead: 0, engaged: 0, pitched: 0, converted: 0, churned: 0, avgEngagement: 0, conversionRate: 0 })
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to load leads")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const filteredLeads = leads.filter((lead) => {
    if (stageFilter !== "all" && lead.stage !== stageFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!(lead.full_name?.toLowerCase().includes(q) || lead.email?.toLowerCase().includes(q))) return false
    }
    return true
  })

  const updateLead = useCallback(async (userId: string, updates: Record<string, unknown>) => {
    setSaving(true)
    try {
      const response = await apiFetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...updates }),
      })
      if (!response.ok) throw new Error("Failed to update lead")
      showSuccess("Lead updated successfully")
      await fetchLeads()
      if (selectedLead && selectedLead.user_id === userId) {
        const updatedLeads = leads.map((l) =>
          l.user_id === userId ? { ...l, ...updates } : l
        )
        const updated = updatedLeads.find((l) => l.user_id === userId)
        if (updated) setSelectedLead(updated as Lead)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to update lead")
    } finally {
      setSaving(false)
    }
  }, [fetchLeads, showSuccess, showError, selectedLead, leads])

  const openDrawer = (lead: Lead) => {
    setSelectedLead(lead)
    setDrawerNotes(lead.notes || "")
    setDrawerOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">Leads & Sales</h1>
          <p className="text-sm text-muted-foreground mt-1">Track client journey from signup to conversion</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
              <div className="flex items-center justify-between w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-[36px] h-[36px] rounded-lg" />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />

        <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none overflow-hidden">
          <div className="px-4 py-3 bg-muted/30 border-b">
            <div className="flex gap-8">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-3 w-16" />
              ))}
            </div>
          </div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 flex items-center gap-8">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-2 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold leading-[1.35] tracking-tight text-foreground">Leads & Sales</h1>
        <p className="text-sm text-muted-foreground mt-1">Track client journey from signup to conversion</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Total Leads</p>
            <div className="w-[36px] h-[36px] bg-card border rounded-lg flex items-center justify-center">
              <Users className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-foreground text-2xl font-semibold leading-[1.3] tracking-tight">{stats.total}</p>
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">All users in the pipeline</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Conversion Rate</p>
            <div className="w-[36px] h-[36px] bg-card border rounded-lg flex items-center justify-center">
              <Target className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-foreground text-2xl font-semibold leading-[1.3] tracking-tight">{stats.conversionRate}%</p>
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Free to pro conversion</p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Avg Engagement</p>
            <div className="w-[36px] h-[36px] bg-card border rounded-lg flex items-center justify-center">
              <TrendingUp className="h-[18px] w-[18px] text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <p className="text-foreground text-2xl font-semibold leading-[1.3] tracking-tight">{stats.avgEngagement}%</p>
            <p className="text-muted-foreground text-[14px] font-medium tracking-[0.02em]">Average engagement score</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setStageFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
            stageFilter === "all" ? "bg-primary text-white border-primary" : "bg-card border hover:bg-muted/50"
          )}
        >
          All <span className="ml-1 text-xs opacity-70">{stats.total}</span>
        </button>
        {STAGES.map((stage) => {
          const count = stats[stage.key as keyof LeadStats] as number
          const isActive = stageFilter === stage.key
          return (
            <button
              key={stage.key}
              onClick={() => setStageFilter(isActive ? "all" : stage.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                isActive ? "bg-primary text-white border-primary" : "bg-card border hover:bg-muted/50"
              )}
            >
              {stage.label} <span className="ml-1 text-xs opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30 w-[250px]">Name</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30">Plan</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30">Stage</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30">Engagement</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30">Priority</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30">Signup Date</th>
                <th className="text-right text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30 w-[60px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    {searchQuery || stageFilter !== "all" ? "No leads match your filters" : "No leads found"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.user_id}
                    className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => openDrawer(lead)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0 overflow-hidden">
                          {lead.avatar_url ? (
                            <img src={lead.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getInitials(lead.full_name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{lead.full_name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={lead.account_type === "pro" ? "default" : "secondary"} className="text-xs">
                        {lead.plan_name}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{getStageBadge(lead.stage)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${lead.engagement_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{lead.engagement_score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getPriorityDot(lead.priority)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/external-users/${lead.user_id}`)}>
                            <User className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!canEdit}
                            onClick={() => {
                              const stages: Lead["stage"][] = ["new_lead", "engaged", "pitched", "converted", "churned"]
                              const currentIdx = stages.indexOf(lead.stage)
                              const nextStage = stages[(currentIdx + 1) % stages.length]
                              updateLead(lead.user_id, { stage: nextStage })
                            }}
                          >
                            <ChevronRight className="mr-2 h-4 w-4" /> Change Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!canEdit}
                            onClick={() => {
                              const priorities: Lead["priority"][] = ["low", "medium", "high"]
                              const currentIdx = priorities.indexOf(lead.priority)
                              const nextPriority = priorities[(currentIdx + 1) % priorities.length]
                              updateLead(lead.user_id, { priority: nextPriority })
                            }}
                          >
                            <Star className="mr-2 h-4 w-4" /> Change Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDrawer(lead)}>
                            <BookOpen className="mr-2 h-4 w-4" /> Add Note
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!canEdit}
                            onClick={() => updateLead(lead.user_id, { last_contacted_at: new Date().toISOString() })}
                          >
                            <Mail className="mr-2 h-4 w-4" /> Mark as Contacted
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>View and manage lead information</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-5 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground shrink-0 overflow-hidden">
                  {selectedLead.avatar_url ? (
                    <img src={selectedLead.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedLead.full_name)
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">{selectedLead.full_name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{selectedLead.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={selectedLead.account_type === "pro" ? "default" : "secondary"}>{selectedLead.plan_name}</Badge>
                {getStageBadge(selectedLead.stage)}
                {getPriorityDot(selectedLead.priority)}
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Engagement Data</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Activity className="w-3 h-3" /> Engagement Score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${selectedLead.engagement_score}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{selectedLead.engagement_score}</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <BookOpen className="w-3 h-3" /> Onboarding
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-[#40c4aa] rounded-full transition-all" style={{ width: `${selectedLead.onboarding_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{selectedLead.onboarding_progress}%</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <ShoppingBag className="w-3 h-3" /> Saved Products
                    </div>
                    <div className="text-lg font-semibold text-foreground">{selectedLead.saved_products}</div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Zap className="w-3 h-3" /> Shopify Connected
                    </div>
                    <div className="text-lg font-semibold text-foreground">{selectedLead.has_shopify ? "Yes" : "No"}</div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      <Map className="w-3 h-3" /> Roadmap Progress
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${selectedLead.roadmap_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{selectedLead.roadmap_progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Stage</h4>
                <div className="flex flex-wrap gap-1.5">
                  {STAGES.map((stage) => (
                    <button
                      key={stage.key}
                      disabled={!canEdit || saving}
                      onClick={() => {
                        updateLead(selectedLead.user_id, { stage: stage.key })
                        setSelectedLead({ ...selectedLead, stage: stage.key })
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50",
                        selectedLead.stage === stage.key
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-muted-foreground border hover:bg-muted/50"
                      )}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Priority</h4>
                <div className="flex gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.key}
                      disabled={!canEdit || saving}
                      onClick={() => {
                        updateLead(selectedLead.user_id, { priority: p.key })
                        setSelectedLead({ ...selectedLead, priority: p.key })
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-50 flex items-center gap-1.5",
                        selectedLead.priority === p.key
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-muted-foreground border hover:bg-muted/50"
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full", p.dotColor, selectedLead.priority === p.key && "bg-white")} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Notes</h4>
                <Textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add notes about this lead..."
                  rows={3}
                  disabled={!canEdit}
                  className="resize-none"
                />
                <Button
                  size="sm"
                  disabled={!canEdit || saving}
                  onClick={() => {
                    updateLead(selectedLead.user_id, { notes: drawerNotes })
                  }}
                >
                  {saving ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
