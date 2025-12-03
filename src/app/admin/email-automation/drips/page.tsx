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
import { Plus, Trash2, Eye, Check, EyeOff, Edit, Droplets, Calendar } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createDripColumns } from "./components/drip-columns"
import { EmailDrip } from "@/types/admin/email-automation"
import { sampleDrips } from "./data/drips"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"

export default function DripsPage() {
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  
  const [drips, setDrips] = useState<EmailDrip[]>(sampleDrips)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [dripToDelete, setDripToDelete] = useState<EmailDrip | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedDripForQuickView, setSelectedDripForQuickView] = useState<EmailDrip | null>(null)
  const [selectedDrips, setSelectedDrips] = useState<EmailDrip[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const filteredDrips = useMemo(() => {
    let result = drips
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (drip) =>
          drip.name.toLowerCase().includes(searchLower) ||
          (drip.description && drip.description.toLowerCase().includes(searchLower))
      )
    }
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const isActive = filter.value.includes("active")
        const isInactive = filter.value.includes("inactive")
        result = result.filter((drip) => {
          if (isActive && !drip.isActive) return false
          if (isInactive && drip.isActive) return false
          return true
        })
      }
    })
    return result
  }, [drips, search, filters])

  const paginatedDrips = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredDrips.slice(start, end)
  }, [filteredDrips, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredDrips.length / pageSize))
    setInitialLoading(false)
  }, [filteredDrips.length, pageSize])

  const handleViewDetails = useCallback((drip: EmailDrip) => {
    setSelectedDripForQuickView(drip)
    setQuickViewOpen(true)
  }, [])

  const handleRowClick = useCallback((drip: EmailDrip) => {
    setSelectedDripForQuickView(drip)
    setQuickViewOpen(true)
  }, [])

  const handleNameClick = useCallback((drip: EmailDrip) => {
    setSelectedDripForQuickView(drip)
    setQuickViewOpen(true)
  }, [])

  const handleEdit = (drip: EmailDrip) => {
    router.push(`/admin/email-automation/drips/${drip.id}`)
  }

  const handleDelete = (drip: EmailDrip) => {
    setDripToDelete(drip)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!dripToDelete) return
    setActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const deletedName = dripToDelete.name
      setDrips(drips.filter((d) => d.id !== dripToDelete.id))
      setDeleteConfirmOpen(false)
      setDripToDelete(null)
      showSuccess(`Drip campaign "${deletedName}" has been deleted successfully`)
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to delete drip campaign")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (drip: EmailDrip) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setDrips(drips.map((d) => (d.id === drip.id ? { ...d, isActive: !d.isActive } : d)))
  }

  const columns = useMemo(
    () =>
      createDripColumns({
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

  const handleRowSelectionChange = useCallback((selectedRows: EmailDrip[]) => {
    setSelectedDrips(selectedRows)
  }, [])

  const toolbarButtons = useMemo(() => {
    if (selectedDrips.length > 0) {
      return [
        {
          label: actionLoading === "delete" ? "Deleting..." : "Delete Selected",
          icon: actionLoading === "delete" ? <Loader size="sm" className="mr-2" /> : <Trash2 className="h-4 w-4" />,
          onClick: async () => {
            setActionLoading("delete")
            try {
              await new Promise((resolve) => setTimeout(resolve, 500))
              const selectedIds = selectedDrips.map((d) => d.id)
              setDrips(drips.filter((d) => !selectedIds.includes(d.id)))
              setSelectedDrips([])
              showSuccess(`${selectedDrips.length} drip campaign(s) deleted successfully`)
            } catch (err) {
              showError(err instanceof Error ? err.message : "Failed to delete drip campaigns")
            } finally {
              setActionLoading(null)
            }
          },
          variant: "outline" as const,
        },
        {
          label: "Clear Selection",
          onClick: () => setSelectedDrips([]),
          variant: "ghost" as const,
        },
      ]
    } else {
      return []
    }
  }, [selectedDrips, actionLoading, drips, showSuccess, showError])

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
    const totalPages = Math.ceil(filteredDrips.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [filteredDrips.length, pageSize, page])

  useEffect(() => {
    setInitialLoading(false)
  }, [])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">Drip Campaigns</h1>
          <p className="text-xs text-white/90 mt-0.5">
            Manage multi-email drip campaigns with scheduled sequences.
          </p>
        </div>
      </div>

      {selectedDrips.length > 0 && (
        <div className="mb-2">
          <span className="text-sm font-medium">
            {selectedDrips.length} drip campaign{selectedDrips.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading drip campaigns...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedDrips}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search drip campaigns..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            router.push('/admin/email-automation/drips/new')
          }}
          addButtonText="Create Drip Campaign"
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
            <DialogTitle>Delete Drip Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this drip campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {dripToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Campaign:</span> {dripToDelete.name}
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

      {selectedDripForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedDripForQuickView(null)
            }
          }}
          title={selectedDripForQuickView.name}
          footer={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedDripForQuickView)
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
                    <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-0">{selectedDripForQuickView.name}</CardTitle>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <Badge variant={selectedDripForQuickView.isActive ? "default" : "secondary"} className="text-xs">
                        {selectedDripForQuickView.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {selectedDripForQuickView.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="emails">Emails</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Campaign Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    {selectedDripForQuickView.description && (
                      <div className="pb-2 border-b">
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm">{selectedDripForQuickView.description}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Type</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedDripForQuickView.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Target Audience</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedDripForQuickView.targetAudience}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Email Count</span>
                      <span className="text-sm font-medium">{selectedDripForQuickView.emails.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Email Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <div className="space-y-3">
                      {selectedDripForQuickView.emails
                        .sort((a, b) => a.order - b.order)
                        .map((email, index) => (
                          <div key={email.id} className="flex items-start gap-3 p-3 border rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">{email.order}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Email {email.order}</p>
                              <p className="text-xs text-muted-foreground">
                                Template: {email.templateId}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Delay: {email.delay} {email.delayUnit}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emails" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Email Sequence</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <div className="space-y-2">
                      {selectedDripForQuickView.emails
                        .sort((a, b) => a.order - b.order)
                        .map((email) => (
                          <div key={email.id} className="p-2 border rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Email {email.order}</span>
                              <Badge variant="outline" className="text-xs">
                                Template {email.templateId}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Sends after {email.delay} {email.delayUnit}
                            </p>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    {selectedDripForQuickView.stats ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Subscribers</span>
                          <span className="text-sm font-medium">{selectedDripForQuickView.stats.totalSubscribers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Total Sent</span>
                          <span className="text-sm font-medium">{selectedDripForQuickView.stats.totalSent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Completion Rate</span>
                          <span className="text-sm font-medium">{selectedDripForQuickView.stats.completionRate.toFixed(1)}%</span>
                        </div>
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




