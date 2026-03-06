import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "@/hooks/use-router"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Download,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  CreditCard,
  TicketCheck,
  Archive,
  Pencil,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Layers,
} from "lucide-react"
import {
  PageShell,
  PageHeader,
  StatCard,
  StatGrid,
  StatusBadge,
  FormDialog,
  EmptyState,
} from "@/components/admin-shared"
import { cn } from "@/lib/utils"

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  account_type: string | null
  phone_number: string | null
  created_at: string | null
}

interface BatchInfo {
  id: string
  name: string
  status: string
}

interface Client {
  id: string
  batch_id: string
  user_id: string
  current_week: number
  status: string
  joined_at: string
  updated_at: string
  is_stalled: boolean
  days_since_update: number
  user: UserProfile | null
  batch: BatchInfo | null
}

interface Batch {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  max_size: number | null
  status: string
  created_at: string
  member_count: number
}

function getInitials(name: string | null) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default function AdminClients() {
  const { showSuccess, showError } = useToast()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("clients")
  const [clients, setClients] = useState<Client[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [isLoadingBatches, setIsLoadingBatches] = useState(true)
  const [totalClients, setTotalClients] = useState(0)

  const [searchQuery, setSearchQuery] = useState("")
  const [filterBatch, setFilterBatch] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterWeek, setFilterWeek] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 20

  const [showNewBatchDialog, setShowNewBatchDialog] = useState(false)
  const [newBatchName, setNewBatchName] = useState("")
  const [newBatchStartDate, setNewBatchStartDate] = useState("")
  const [newBatchEndDate, setNewBatchEndDate] = useState("")
  const [newBatchMaxSize, setNewBatchMaxSize] = useState("")
  const [isCreatingBatch, setIsCreatingBatch] = useState(false)

  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set())

  const fetchClients = useCallback(async () => {
    setIsLoadingClients(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("search", searchQuery)
      if (filterBatch !== "all") params.set("batch_id", filterBatch)
      if (filterStatus !== "all") params.set("status", filterStatus)
      if (filterWeek !== "all") params.set("week", filterWeek)
      params.set("page", String(currentPage))
      params.set("pageSize", String(pageSize))

      const res = await apiFetch(`/api/admin/clients?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch clients")
      const data = await res.json()
      setClients(data.clients || [])
      setTotalClients(data.totalCount || 0)
    } catch {
      showError("Failed to load clients")
    } finally {
      setIsLoadingClients(false)
    }
  }, [searchQuery, filterBatch, filterStatus, filterWeek, currentPage, showError])

  const fetchBatches = useCallback(async () => {
    setIsLoadingBatches(true)
    try {
      const res = await apiFetch("/api/admin/batches")
      if (!res.ok) throw new Error("Failed to fetch batches")
      const data = await res.json()
      setBatches(data.batches || [])
    } catch {
      showError("Failed to load batches")
    } finally {
      setIsLoadingBatches(false)
    }
  }, [showError])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  const handleExportCSV = async () => {
    try {
      const res = await apiFetch("/api/admin/clients/export")
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "clients-export.csv"
      a.click()
      URL.revokeObjectURL(url)
      showSuccess("Client data downloaded as CSV")
    } catch {
      showError("Failed to export clients")
    }
  }

  const handleCreateBatch = async () => {
    if (!newBatchName.trim()) {
      showError("Batch name is required")
      return
    }
    setIsCreatingBatch(true)
    try {
      const res = await apiFetch("/api/admin/batches", {
        method: "POST",
        body: JSON.stringify({
          name: newBatchName.trim(),
          start_date: newBatchStartDate || null,
          end_date: newBatchEndDate || null,
          max_size: newBatchMaxSize ? parseInt(newBatchMaxSize) : null,
        }),
      })
      if (!res.ok) throw new Error("Failed to create batch")
      showSuccess("Batch created successfully")
      setShowNewBatchDialog(false)
      setNewBatchName("")
      setNewBatchStartDate("")
      setNewBatchEndDate("")
      setNewBatchMaxSize("")
      fetchBatches()
    } catch {
      showError("Failed to create batch")
    } finally {
      setIsCreatingBatch(false)
    }
  }

  const handleArchiveBatch = async (batchId: string) => {
    try {
      const res = await apiFetch(`/api/admin/batches/${batchId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "archived" }),
      })
      if (!res.ok) throw new Error("Failed to archive batch")
      showSuccess("Batch archived")
      fetchBatches()
    } catch {
      showError("Failed to archive batch")
    }
  }

  const totalPages = Math.ceil(totalClients / pageSize)
  const stalledCount = clients.filter((c) => c.is_stalled).length
  const activeCount = clients.filter((c) => c.status === "active").length

  return (
    <PageShell>
      <PageHeader
        title="Clients"
        subtitle="Post-sales client management and batch tracking"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} data-testid="button-export-csv">
              <Download className="size-4 mr-1.5" />
              Export CSV
            </Button>
          </div>
        }
      />

      <StatGrid>
        <StatCard label="Total Clients" value={totalClients} icon={Users} iconBg="rgba(59,130,246,0.1)" iconColor="#3b82f6" />
        <StatCard label="Active" value={activeCount} icon={Users} iconBg="rgba(16,185,129,0.1)" iconColor="#10b981" />
        <StatCard label="Stalled" value={stalledCount} icon={AlertTriangle} iconBg="rgba(245,158,11,0.1)" iconColor="#f59e0b" />
        <StatCard label="Batches" value={batches.length} icon={Layers} iconBg="rgba(139,92,246,0.1)" iconColor="#8b5cf6" />
      </StatGrid>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList data-testid="tabs-client-sections">
          <TabsTrigger value="clients" data-testid="tab-clients">Clients</TabsTrigger>
          <TabsTrigger value="batches" data-testid="tab-batches">Batch Manager</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="mt-4">
          <ClientsTable
            clients={clients}
            batches={batches}
            isLoading={isLoadingClients}
            searchQuery={searchQuery}
            onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1) }}
            filterBatch={filterBatch}
            onFilterBatchChange={(v) => { setFilterBatch(v); setCurrentPage(1) }}
            filterStatus={filterStatus}
            onFilterStatusChange={(v) => { setFilterStatus(v); setCurrentPage(1) }}
            filterWeek={filterWeek}
            onFilterWeekChange={(v) => { setFilterWeek(v); setCurrentPage(1) }}
            currentPage={currentPage}
            totalPages={totalPages}
            totalClients={totalClients}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            selectedIds={selectedClientIds}
            onSelectionChange={setSelectedClientIds}
            onViewClient={(userId) => router.push(`/admin/users/${userId}`)}
          />
        </TabsContent>

        <TabsContent value="batches" className="mt-4">
          <BatchManager
            batches={batches}
            isLoading={isLoadingBatches}
            onNewBatch={() => setShowNewBatchDialog(true)}
            onViewMembers={(batchId) => router.push(`/admin/batches/${batchId}`)}
            onArchive={handleArchiveBatch}
          />
        </TabsContent>
      </Tabs>

      <FormDialog
        open={showNewBatchDialog}
        onOpenChange={setShowNewBatchDialog}
        title="New Batch"
        onSubmit={handleCreateBatch}
        submitLabel="Create Batch"
        isSubmitting={isCreatingBatch}
      >
        <div className="space-y-1.5">
          <Label htmlFor="batch-name">Name</Label>
          <Input
            id="batch-name"
            value={newBatchName}
            onChange={(e) => setNewBatchName(e.target.value)}
            placeholder="e.g. Batch 12 - June 2025"
            data-testid="input-batch-name"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="batch-start">Start Date</Label>
            <Input
              id="batch-start"
              type="date"
              value={newBatchStartDate}
              onChange={(e) => setNewBatchStartDate(e.target.value)}
              data-testid="input-batch-start-date"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="batch-end">End Date</Label>
            <Input
              id="batch-end"
              type="date"
              value={newBatchEndDate}
              onChange={(e) => setNewBatchEndDate(e.target.value)}
              data-testid="input-batch-end-date"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="batch-max">Max Size</Label>
          <Input
            id="batch-max"
            type="number"
            value={newBatchMaxSize}
            onChange={(e) => setNewBatchMaxSize(e.target.value)}
            placeholder="Leave blank for unlimited"
            data-testid="input-batch-max-size"
          />
        </div>
      </FormDialog>
    </PageShell>
  )
}

interface ClientsTableProps {
  clients: Client[]
  batches: Batch[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (v: string) => void
  filterBatch: string
  onFilterBatchChange: (v: string) => void
  filterStatus: string
  onFilterStatusChange: (v: string) => void
  filterWeek: string
  onFilterWeekChange: (v: string) => void
  currentPage: number
  totalPages: number
  totalClients: number
  pageSize: number
  onPageChange: (p: number) => void
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onViewClient: (userId: string) => void
}

function ClientsTable({
  clients,
  batches,
  isLoading,
  searchQuery,
  onSearchChange,
  filterBatch,
  onFilterBatchChange,
  filterStatus,
  onFilterStatusChange,
  filterWeek,
  onFilterWeekChange,
  currentPage,
  totalPages,
  totalClients,
  pageSize,
  onPageChange,
  selectedIds,
  onSelectionChange,
  onViewClient,
}: ClientsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const allSelected = clients.length > 0 && clients.every((c) => selectedIds.has(c.id))
  const toggleAll = () => {
    if (allSelected) onSelectionChange(new Set())
    else onSelectionChange(new Set(clients.map((c) => c.id)))
  }
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  const weekOptions = Array.from({ length: 12 }, (_, i) => String(i + 1))

  return (
    <div className="rounded-xl border bg-card overflow-hidden" data-testid="section-clients-table">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 w-56 pl-8 text-sm"
              data-testid="input-client-search"
            />
          </div>
          <Select value={filterBatch} onValueChange={onFilterBatchChange}>
            <SelectTrigger className="h-8 w-auto min-w-[130px] text-sm" data-testid="filter-batch">
              <SelectValue placeholder="Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="h-8 w-auto min-w-[120px] text-sm" data-testid="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="dropped">Dropped</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterWeek} onValueChange={onFilterWeekChange}>
            <SelectTrigger className="h-8 w-auto min-w-[110px] text-sm" data-testid="filter-week">
              <SelectValue placeholder="Week" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Weeks</SelectItem>
              {weekOptions.map((w) => (
                <SelectItem key={w} value={w}>Week {w}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{selectedIds.size} selected</Badge>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-input"
                  data-testid="checkbox-select-all-clients"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Batch</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Week</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <EmptyState
                    title="No clients found"
                    description="No clients match your current filters."
                  />
                </td>
              </tr>
            ) : (
              clients.map((client) => {
                const user = client.user
                const progressPercent = Math.min((client.current_week / 12) * 100, 100)
                return (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-muted/20 cursor-pointer"
                    onClick={() => user && onViewClient(user.id)}
                    data-testid={`row-client-${client.id}`}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(client.id)}
                        onChange={() => toggleOne(client.id)}
                        className="rounded border-input"
                        data-testid={`checkbox-client-${client.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={user?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">{getInitials(user?.full_name || null)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" data-testid={`text-client-name-${client.id}`}>
                            {user?.full_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                        </div>
                        {client.is_stalled && (
                          <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-0 text-xs shrink-0">
                            Stalled
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{client.batch?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">Week {client.current_week}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={progressPercent} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(progressPercent)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={client.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {client.joined_at ? format(new Date(client.joined_at), "MMM d, yyyy") : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" data-testid={`button-client-actions-${client.id}`}>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => user && onViewClient(user.id)}
                            data-testid={`action-view-${client.id}`}
                          >
                            <Eye className="size-3.5 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-payment-${client.id}`}>
                            <CreditCard className="size-3.5 mr-2" />
                            Payment Link
                          </DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-ticket-${client.id}`}>
                            <TicketCheck className="size-3.5 mr-2" />
                            Create Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-xs text-muted-foreground" data-testid="text-pagination-info">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalClients)} of {totalClients}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              data-testid="button-clients-prev"
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum = i + 1
              if (totalPages > 5) {
                if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  size="icon"
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  onClick={() => onPageChange(pageNum)}
                  data-testid={`button-clients-page-${pageNum}`}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              size="icon"
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              data-testid="button-clients-next"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface BatchManagerProps {
  batches: Batch[]
  isLoading: boolean
  onNewBatch: () => void
  onViewMembers: (batchId: string) => void
  onArchive: (batchId: string) => void
}

function BatchManager({ batches, isLoading, onNewBatch, onViewMembers, onArchive }: BatchManagerProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden" data-testid="section-batch-manager">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">All Batches</h3>
        <Button size="sm" onClick={onNewBatch} data-testid="button-new-batch">
          <Plus className="size-4 mr-1.5" />
          New Batch
        </Button>
      </div>

      {batches.length === 0 ? (
        <EmptyState
          title="No batches yet"
          description="Create your first batch to start organizing clients."
          actionLabel="New Batch"
          onAction={onNewBatch}
        />
      ) : (
        <div className="divide-y">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="flex flex-wrap items-center justify-between gap-4 px-4 py-4"
              data-testid={`row-batch-${batch.id}`}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" data-testid={`text-batch-name-${batch.id}`}>{batch.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {batch.member_count} member{batch.member_count !== 1 ? "s" : ""}
                      {batch.max_size ? ` / ${batch.max_size} max` : ""}
                    </span>
                    {batch.start_date && (
                      <span className="text-xs text-muted-foreground">
                        Started {format(new Date(batch.start_date), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={batch.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" data-testid={`button-batch-actions-${batch.id}`}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => onViewMembers(batch.id)}
                      data-testid={`action-view-members-${batch.id}`}
                    >
                      <Users className="size-3.5 mr-2" />
                      View Members
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid={`action-edit-batch-${batch.id}`}>
                      <Pencil className="size-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onArchive(batch.id)}
                      className="text-destructive"
                      data-testid={`action-archive-batch-${batch.id}`}
                    >
                      <Archive className="size-3.5 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
