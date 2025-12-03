"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Eye, Check, EyeOff, Edit, Zap, Calendar } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createAutomationColumns } from "./components/automation-columns"
import { EmailAutomation } from "@/types/admin/email-automation"
import { sampleAutomations } from "./data/automations"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function AutomationsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  
  const [automations, setAutomations] = useState<EmailAutomation[]>(sampleAutomations)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [automationToDelete, setAutomationToDelete] = useState<EmailAutomation | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedAutomationForQuickView, setSelectedAutomationForQuickView] = useState<EmailAutomation | null>(null)
  const [selectedAutomations, setSelectedAutomations] = useState<EmailAutomation[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredAutomations = useMemo(() => {
    let result = automations
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (auto) =>
          auto.name.toLowerCase().includes(searchLower) ||
          (auto.description && auto.description.toLowerCase().includes(searchLower))
      )
    }
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const isActive = filter.value.includes("active")
        const isInactive = filter.value.includes("inactive")
        result = result.filter((auto) => {
          if (isActive && !auto.isActive) return false
          if (isInactive && auto.isActive) return false
          return true
        })
      }
    })
    return result
  }, [automations, search, filters])

  const paginatedAutomations = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredAutomations.slice(start, end)
  }, [filteredAutomations, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredAutomations.length / pageSize))
    setInitialLoading(false)
  }, [filteredAutomations.length, pageSize])

  const handleViewDetails = useCallback((automation: EmailAutomation) => {
    setSelectedAutomationForQuickView(automation)
    setQuickViewOpen(true)
  }, [])

  const handleRowClick = useCallback((automation: EmailAutomation) => {
    setSelectedAutomationForQuickView(automation)
    setQuickViewOpen(true)
  }, [])

  const handleNameClick = useCallback((automation: EmailAutomation) => {
    setSelectedAutomationForQuickView(automation)
    setQuickViewOpen(true)
  }, [])

  const handleEdit = (automation: EmailAutomation) => {
    router.push(`/admin/email-automation/automations/${automation.id}`)
  }

  const handleDelete = (automation: EmailAutomation) => {
    setAutomationToDelete(automation)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!automationToDelete) return
    setActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const deletedName = automationToDelete.name
      setAutomations(automations.filter((a) => a.id !== automationToDelete.id))
      setDeleteConfirmOpen(false)
      setAutomationToDelete(null)
      showSuccess(`Automation "${deletedName}" has been deleted successfully`)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete automation")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (automation: EmailAutomation) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setAutomations(automations.map((a) => (a.id === automation.id ? { ...a, isActive: !a.isActive } : a)))
  }

  const columns = useMemo(
    () =>
      createAutomationColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
        onNameClick: handleNameClick,
      }),
    [handleViewDetails, handleNameClick, handleEdit, handleDelete, handleToggleActive]
  )

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1)
    }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: EmailAutomation[]) => {
    setSelectedAutomations(selectedRows)
  }, [])

  const toolbarButtons = useMemo(() => {
    if (selectedAutomations.length > 0) {
      return [
        {
          label: actionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: actionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("delete")
            try {
              await new Promise((resolve) => setTimeout(resolve, 500))
              const selectedIds = selectedAutomations.map((a) => a.id)
              setAutomations(automations.filter((a) => !selectedIds.includes(a.id)))
              setSelectedAutomations([])
              showSuccess(`${selectedAutomations.length} automation(s) deleted successfully`)
            } catch (err) {
              showError(err instanceof Error ? err.message : "Failed to delete automations")
            } finally {
              setActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedAutomations([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return []
    }
  }, [selectedAutomations, actionLoading, automations, showSuccess, showError])

  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]

  useEffect(() => {
    const totalPages = Math.ceil(filteredAutomations.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [filteredAutomations.length, pageSize, page])

  useEffect(() => {
    setInitialLoading(false)
  }, [])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Email Automations</h1>
          <p className="text-xs text-white/90 mt-0.5">
            Manage automated email workflows triggered by user actions and events.
          </p>
        </div>
      </div>

      {selectedAutomations.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium">
            {selectedAutomations.length} automation{selectedAutomations.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading automations...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedAutomations}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search automations..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            router.push('/admin/email-automation/automations/new')
          }}
          addButtonText="Create Automation"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={handleRowSelectionChange}
          onRowClick={handleRowClick}
          secondaryButtons={toolbarButtons}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete Automation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this automation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {automationToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Automation:</span> {automationToDelete.name}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer">
              {actionLoading === "delete" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedAutomationForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedAutomationForQuickView(null)
            }
          }}
          title={selectedAutomationForQuickView.name}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedAutomationForQuickView)
                }}
                className="cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuickViewOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-0">{selectedAutomationForQuickView.name}</CardTitle>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <Badge variant={selectedAutomationForQuickView.isActive ? "default" : "secondary"} className="text-xs">
                        {selectedAutomationForQuickView.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Automation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Trigger</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedAutomationForQuickView.trigger.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    {selectedAutomationForQuickView.description && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{selectedAutomationForQuickView.description}</p>
                      </div>
                    )}
                    {selectedAutomationForQuickView.delay !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Delay</span>
                        <span className="text-sm font-medium">
                          {selectedAutomationForQuickView.delay} {selectedAutomationForQuickView.delayUnit}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Target Audience</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedAutomationForQuickView.targetAudience || 'all'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    {selectedAutomationForQuickView.conditions && selectedAutomationForQuickView.conditions.length > 0 ? (
                      <div className="space-y-2">
                        {selectedAutomationForQuickView.conditions.map((condition, index) => (
                          <div key={condition.id || index} className="p-2 border rounded text-sm">
                            <span className="font-medium">{condition.field}</span> {condition.operator} <span className="font-mono">{String(condition.value)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No conditions configured</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    {selectedAutomationForQuickView.stats ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Sent</span>
                          <span className="text-sm font-medium">{selectedAutomationForQuickView.stats.totalSent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Open Rate</span>
                          <span className="text-sm font-medium">{selectedAutomationForQuickView.stats.openRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Click Rate</span>
                          <span className="text-sm font-medium">{selectedAutomationForQuickView.stats.clickRate.toFixed(1)}%</span>
                        </div>
                        {selectedAutomationForQuickView.stats.lastSent && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Last Sent</p>
                              <p className="text-sm font-medium">
                                {new Date(selectedAutomationForQuickView.stats.lastSent).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No statistics available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </LargeModal>
      )}
    </div>
  )
}




