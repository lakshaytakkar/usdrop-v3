import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  AdminPageHeader,
  AdminStatCards,
  AdminFilterBar,
  AdminStatusBadge,
  AdminActionBar,
  AdminEmptyState,
} from "@/components/admin"
import {
  Users,
  TrendingUp,
  Target,
  Sparkles,
  MoreVertical,
  User,
  Mail,
  ChevronRight,
  Star,
  BookOpen,
  Trash2,
  UserPlus,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react"

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

const STAGES: { key: Lead["stage"]; label: string }[] = [
  { key: "new_lead", label: "New Lead" },
  { key: "engaged", label: "Engaged" },
  { key: "pitched", label: "Pitched" },
  { key: "converted", label: "Converted" },
  { key: "churned", label: "Churned" },
]

const PRIORITIES: { key: Lead["priority"]; label: string }[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
]

const SOURCE_LABELS: Record<string, string> = {
  organic: "Organic",
  referral: "Referral",
  campaign: "Campaign",
  manual: "Manual",
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
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
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

  const toggleRow = (userId: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const toggleAllRows = () => {
    if (selectedRows.size === filteredLeads.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredLeads.map(l => l.user_id)))
    }
  }

  const newThisWeek = leads.filter(l => {
    const d = new Date(l.signup_date)
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return d >= weekAgo
  }).length

  const statCards = [
    { label: "Total Leads", value: stats.total, icon: Users, description: "All users in the pipeline" },
    { label: "New This Week", value: newThisWeek, icon: Sparkles, description: "Signed up in last 7 days" },
    { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: Target, description: "Free to pro conversion" },
    { label: "Avg Engagement", value: `${stats.avgEngagement}%`, icon: TrendingUp, description: "Average engagement score" },
  ]

  const stageTabs = [
    { value: "all", label: "All", count: stats.total },
    ...STAGES.map(s => ({
      value: s.key,
      label: s.label,
      count: (stats[s.key as keyof LeadStats] as number) || 0,
    })),
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leads & Sales"
        description="Track client journey from signup to conversion"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Leads" },
        ]}
        actions={[
          { label: "Export", icon: <Download className="h-4 w-4" />, onClick: () => {}, variant: "outline" },
          { label: "Refresh", icon: <RefreshCw className="h-4 w-4" />, onClick: fetchLeads, variant: "outline" },
        ]}
      />

      <AdminStatCards stats={statCards} loading={loading} columns={4} />

      <AdminActionBar
        selectedCount={selectedRows.size}
        onClearSelection={() => setSelectedRows(new Set())}
        actions={[
          {
            label: "Change Stage",
            icon: <ChevronRight className="h-4 w-4" />,
            onClick: () => {},
            variant: "outline",
          },
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => {},
            variant: "destructive",
          },
        ]}
      />

      <AdminFilterBar
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or email..."
        tabs={stageTabs}
        activeTab={stageFilter}
        onTabChange={setStageFilter}
      />

      <div className="bg-card border rounded-lg overflow-hidden" data-testid="leads-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30 w-10">
                  <input
                    type="checkbox"
                    checked={filteredLeads.length > 0 && selectedRows.size === filteredLeads.length}
                    onChange={toggleAllRows}
                    className="h-4 w-4 rounded border-gray-300"
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-name">Name</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-email">Email</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-stage">Stage</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-priority">Priority</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-source">Source</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-engagement">Engagement</th>
                <th className="text-left text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30" data-testid="header-signup">Signup Date</th>
                <th className="text-right text-[12px] font-medium text-muted-foreground uppercase tracking-[0.05em] px-4 py-3 bg-muted/30 w-[60px]" data-testid="header-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="px-4 py-3"><div className="h-4 w-4 bg-muted rounded animate-pulse" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                        <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="h-4 w-36 bg-muted rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-16 bg-muted rounded-full animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-5 w-14 bg-muted rounded-full animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-muted rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-2 w-20 bg-muted rounded-full animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-muted rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <AdminEmptyState
                      icon={Users}
                      title={searchQuery || stageFilter !== "all" ? "No leads match your filters" : "No leads found"}
                      description={searchQuery || stageFilter !== "all" ? "Try adjusting your search or stage filter" : "Leads will appear here as users sign up"}
                    />
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.user_id}
                    className={cn(
                      "border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors",
                      selectedRows.has(lead.user_id) && "bg-primary/5"
                    )}
                    onClick={() => openDrawer(lead)}
                    data-testid={`row-lead-${lead.user_id}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(lead.user_id)}
                        onChange={() => toggleRow(lead.user_id)}
                        className="h-4 w-4 rounded border-gray-300"
                        data-testid={`checkbox-lead-${lead.user_id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={lead.avatar_url || undefined} alt={lead.full_name || ""} />
                          <AvatarFallback className="text-xs">{getInitials(lead.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground truncate max-w-[160px]" data-testid={`text-name-${lead.user_id}`}>
                          {lead.full_name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px] block" data-testid={`text-email-${lead.user_id}`}>
                        {lead.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={lead.stage} size="sm" data-testid={`badge-stage-${lead.user_id}`} />
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={lead.priority} size="sm" dot data-testid={`badge-priority-${lead.user_id}`} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground" data-testid={`text-source-${lead.user_id}`}>
                        {SOURCE_LABELS[lead.source] || lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${lead.engagement_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium" data-testid={`text-engagement-${lead.user_id}`}>
                          {lead.engagement_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground" data-testid={`text-signup-${lead.user_id}`}>
                      {lead.signup_date ? format(new Date(lead.signup_date), "MMM d, yyyy") : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-actions-${lead.user_id}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/leads/${lead.user_id}`)}
                            data-testid={`action-view-${lead.user_id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/external-users/${lead.user_id}`)}
                            data-testid={`action-profile-${lead.user_id}`}
                          >
                            <User className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger data-testid={`action-change-stage-${lead.user_id}`}>
                              <ChevronRight className="mr-2 h-4 w-4" /> Change Stage
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {STAGES.map(s => (
                                <DropdownMenuItem
                                  key={s.key}
                                  disabled={!canEdit || lead.stage === s.key}
                                  onClick={() => updateLead(lead.user_id, { stage: s.key })}
                                  data-testid={`action-stage-${s.key}-${lead.user_id}`}
                                >
                                  <AdminStatusBadge status={s.key} size="sm" />
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger data-testid={`action-change-priority-${lead.user_id}`}>
                              <Star className="mr-2 h-4 w-4" /> Change Priority
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {PRIORITIES.map(p => (
                                <DropdownMenuItem
                                  key={p.key}
                                  disabled={!canEdit || lead.priority === p.key}
                                  onClick={() => updateLead(lead.user_id, { priority: p.key })}
                                  data-testid={`action-priority-${p.key}-${lead.user_id}`}
                                >
                                  <AdminStatusBadge status={p.key} size="sm" dot />
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => openDrawer(lead)} data-testid={`action-note-${lead.user_id}`}>
                            <BookOpen className="mr-2 h-4 w-4" /> Add Note
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!canEdit}
                            onClick={() => updateLead(lead.user_id, { last_contacted_at: new Date().toISOString() })}
                            data-testid={`action-contacted-${lead.user_id}`}
                          >
                            <Mail className="mr-2 h-4 w-4" /> Mark as Contacted
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            disabled={!canEdit}
                            className="text-destructive focus:text-destructive"
                            onClick={() => {}}
                            data-testid={`action-delete-${lead.user_id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
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
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedLead.avatar_url || undefined} alt={selectedLead.full_name || ""} />
                  <AvatarFallback>{getInitials(selectedLead.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground" data-testid="text-drawer-name">{selectedLead.full_name || "Unknown"}</div>
                  <div className="text-sm text-muted-foreground" data-testid="text-drawer-email">{selectedLead.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={selectedLead.account_type === "pro" ? "default" : "secondary"} data-testid="badge-drawer-plan">
                  {selectedLead.plan_name}
                </Badge>
                <AdminStatusBadge status={selectedLead.stage} />
                <AdminStatusBadge status={selectedLead.priority} dot />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Engagement Data</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      Engagement Score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${selectedLead.engagement_score}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground" data-testid="text-drawer-engagement">{selectedLead.engagement_score}</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      Onboarding
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${selectedLead.onboarding_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground" data-testid="text-drawer-onboarding">{selectedLead.onboarding_progress}%</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      Saved Products
                    </div>
                    <p className="text-sm font-medium text-foreground" data-testid="text-drawer-products">{selectedLead.saved_products}</p>
                  </div>
                  <div className="border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                      Roadmap Progress
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${selectedLead.roadmap_progress}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground" data-testid="text-drawer-roadmap">{selectedLead.roadmap_progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Admin Notes</h4>
                <Textarea
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                  placeholder="Add a note about this lead..."
                  data-testid="input-notes"
                />
                <Button
                  size="sm"
                  disabled={saving || !canEdit}
                  onClick={() => updateLead(selectedLead.user_id, { notes: drawerNotes })}
                  data-testid="button-save-note"
                >
                  {saving ? "Saving..." : "Save Note"}
                </Button>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDrawerOpen(false)
                    router.push(`/admin/leads/${selectedLead.user_id}`)
                  }}
                  data-testid="button-view-full-details"
                >
                  <Eye className="mr-1.5 h-4 w-4" /> Full Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDrawerOpen(false)
                    router.push(`/admin/external-users/${selectedLead.user_id}`)
                  }}
                  data-testid="button-view-profile"
                >
                  <User className="mr-1.5 h-4 w-4" /> View Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
