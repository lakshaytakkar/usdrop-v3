"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { Users, TrendingUp, Target, Search, MoreVertical, User, Mail, Calendar, Activity, ShoppingBag, Map, BookOpen, Star, ChevronRight, ArrowUpRight, Zap, Filter, X } from "lucide-react"

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

const STAGES: { key: Lead["stage"]; label: string; color: string; bgColor: string }[] = [
  { key: "new_lead", label: "New Lead", color: "text-gray-700", bgColor: "bg-gray-100" },
  { key: "engaged", label: "Engaged", color: "text-blue-700", bgColor: "bg-blue-100" },
  { key: "pitched", label: "Pitched", color: "text-amber-700", bgColor: "bg-amber-100" },
  { key: "converted", label: "Converted", color: "text-green-700", bgColor: "bg-green-100" },
  { key: "churned", label: "Churned", color: "text-red-700", bgColor: "bg-red-100" },
]

const PRIORITIES: { key: Lead["priority"]; label: string; dotColor: string }[] = [
  { key: "low", label: "Low", dotColor: "bg-gray-400" },
  { key: "medium", label: "Medium", dotColor: "bg-amber-400" },
  { key: "high", label: "High", dotColor: "bg-red-500" },
]

function getStageBadge(stage: Lead["stage"]) {
  const s = STAGES.find((s) => s.key === stage)
  if (!s) return null
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bgColor} ${s.color}`}>{s.label}</span>
}

function getPriorityDot(priority: Lead["priority"]) {
  const p = PRIORITIES.find((p) => p.key === priority)
  if (!p) return null
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
      <span className="text-sm text-muted-foreground capitalize">{p.label}</span>
    </div>
  )
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
      const response = await fetch("/api/admin/leads")
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
      if (
        !(lead.full_name?.toLowerCase().includes(q) || lead.email?.toLowerCase().includes(q))
      ) return false
    }
    return true
  })

  const updateLead = useCallback(async (userId: string, updates: Record<string, unknown>) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/leads", {
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

  const getInitials = (name: string | null) => {
    if (!name) return "?"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[20px] font-semibold text-foreground">Leads & Sales</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track client journey from signup to conversion</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-4 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
        <div className="bg-white border rounded-lg p-4 shadow-sm animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[20px] font-semibold text-foreground">Leads & Sales</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track client journey from signup to conversion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{stats.total}</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">All users in the pipeline</span>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{stats.conversionRate}%</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Free to pro conversion</span>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Avg Engagement</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-semibold">{stats.avgEngagement}%</span>
          </div>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">Average engagement score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {STAGES.map((stage) => {
          const count = stats[stage.key as keyof LeadStats] as number
          const isActive = stageFilter === stage.key
          return (
            <button
              key={stage.key}
              onClick={() => setStageFilter(isActive ? "all" : stage.key)}
              className={`border rounded-lg p-3 text-left transition-colors ${
                isActive ? "border-blue-500 bg-blue-50" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="text-xs text-muted-foreground">{stage.label}</div>
              <div className="text-lg font-semibold mt-0.5">{count}</div>
            </button>
          )
        })}
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 w-[250px]">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Stage</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Engagement</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Priority</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Signup Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 w-[60px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    {searchQuery || stageFilter !== "all" ? "No leads match your filters" : "No leads found"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.user_id}
                    className="border-b last:border-b-0 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => openDrawer(lead)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0 overflow-hidden">
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
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${lead.engagement_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{lead.engagement_score}</span>
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
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0 overflow-hidden">
                  {selectedLead.avatar_url ? (
                    <img src={selectedLead.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(selectedLead.full_name)
                  )}
                </div>
                <div>
                  <div className="font-medium">{selectedLead.full_name || "Unknown"}</div>
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
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Activity className="w-3 h-3" /> Engagement Score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedLead.engagement_score}%` }} />
                      </div>
                      <span className="text-sm font-medium">{selectedLead.engagement_score}</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <BookOpen className="w-3 h-3" /> Onboarding
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedLead.onboarding_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium">{selectedLead.onboarding_progress}%</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <ShoppingBag className="w-3 h-3" /> Saved Products
                    </div>
                    <div className="text-sm font-medium">{selectedLead.saved_products}</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Zap className="w-3 h-3" /> Shopify Connected
                    </div>
                    <div className="text-sm font-medium">{selectedLead.has_shopify ? "Yes" : "No"}</div>
                  </div>
                  <div className="border rounded-lg p-3 col-span-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Map className="w-3 h-3" /> Roadmap Progress
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${selectedLead.roadmap_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium">{selectedLead.roadmap_progress}%</span>
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
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        selectedLead.stage === stage.key
                          ? `${stage.bgColor} ${stage.color} border-current`
                          : "bg-white text-muted-foreground hover:bg-gray-50"
                      } disabled:opacity-50`}
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
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        selectedLead.priority === p.key
                          ? "bg-gray-100 border-gray-300"
                          : "bg-white text-muted-foreground hover:bg-gray-50"
                      } disabled:opacity-50`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.dotColor}`} />
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
                />
                <Button
                  size="sm"
                  disabled={!canEdit || saving || drawerNotes === (selectedLead.notes || "")}
                  onClick={() => {
                    updateLead(selectedLead.user_id, { notes: drawerNotes })
                    setSelectedLead({ ...selectedLead, notes: drawerNotes })
                  }}
                >
                  {saving ? "Saving..." : "Save Notes"}
                </Button>
              </div>

              {selectedLead.last_contacted_at && (
                <div className="text-xs text-muted-foreground">
                  Last contacted: {format(new Date(selectedLead.last_contacted_at), "MMM d, yyyy 'at' h:mm a")}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
