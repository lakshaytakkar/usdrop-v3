"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, FileSearch } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createEmailLogsColumns } from "./components/email-logs-columns"
import { EmailLog } from "@/types/admin/email-automation"
import { sampleLogs } from "./data/logs"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { LargeModal } from "@/components/ui/large-modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function EmailLogsPage() {
  const { showSuccess, showError } = useToast()
  
  const [logs, setLogs] = useState<EmailLog[]>(sampleLogs)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedLogForQuickView, setSelectedLogForQuickView] = useState<EmailLog | null>(null)

  const filteredLogs = useMemo(() => {
    let result = logs

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (log) =>
          log.recipientEmail.toLowerCase().includes(searchLower) ||
          log.subject.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      result = result.filter((log) => {
        const logDate = new Date(log.createdAt)
        if (dateRange.from && logDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (logDate > toDate) return false
        }
        return true
      })
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        const statusValues = filter.value as string[]
        result = result.filter((log) => statusValues.includes(log.status))
      }
      if (filter.id === "recipientType" && Array.isArray(filter.value) && filter.value.length > 0) {
        const recipientTypeValues = filter.value as string[]
        result = result.filter((log) => recipientTypeValues.includes(log.recipientType))
      }
    })

    return result
  }, [logs, search, filters, dateRange])

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredLogs.slice(start, end)
  }, [filteredLogs, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredLogs.length / pageSize))
    setInitialLoading(false)
  }, [filteredLogs.length, pageSize])

  const handleViewDetails = useCallback((log: EmailLog) => {
    setSelectedLogForQuickView(log)
    setQuickViewOpen(true)
  }, [])

  const handleRowClick = useCallback((log: EmailLog) => {
    setSelectedLogForQuickView(log)
    setQuickViewOpen(true)
  }, [])

  const handleExport = () => {
    try {
      const csv = [
        ['Recipient Email', 'Subject', 'Status', 'Sent At', 'Opened At', 'Clicked At'].join(','),
        ...filteredLogs.map(log => [
          log.recipientEmail,
          `"${log.subject}"`,
          log.status,
          log.sentAt?.toISOString() || '',
          log.openedAt?.toISOString() || '',
          log.clickedAt?.toISOString() || '',
        ].join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      showSuccess('Email logs exported successfully')
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to export logs')
    }
  }

  const columns = useMemo(
    () =>
      createEmailLogsColumns({
        onViewDetails: handleViewDetails,
      }),
    [handleViewDetails]
  )

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) {
      setPageSize(s)
      setPage(1)
    }
  }, [page, pageSize])

  const filterConfig = [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Sent", value: "sent" },
        { label: "Delivered", value: "delivered" },
        { label: "Opened", value: "opened" },
        { label: "Clicked", value: "clicked" },
        { label: "Bounced", value: "bounced" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      columnId: "recipientType",
      title: "Recipient Type",
      options: [
        { label: "External User", value: "external_user" },
        { label: "Internal User", value: "internal_user" },
        { label: "Public Campaign", value: "public_campaign" },
      ],
    },
  ]

  useEffect(() => {
    const totalPages = Math.ceil(filteredLogs.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) {
      setPage(1)
    }
  }, [filteredLogs.length, pageSize, page])

  useEffect(() => {
    setInitialLoading(false)
  }, [])

  const getStatusBadgeVariant = (status: EmailLog['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'sent':
        return 'default'
      case 'delivered':
        return 'default'
      case 'opened':
        return 'outline'
      case 'clicked':
        return 'outline'
      case 'bounced':
      case 'failed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusColor = (status: EmailLog['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/90 text-white border-green-600'
      case 'opened':
        return 'bg-purple-500/90 text-white border-purple-600'
      case 'clicked':
        return 'bg-orange-500/90 text-white border-orange-600'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="bg-primary/85 text-primary-foreground rounded-md px-4 py-3 mb-3 flex-shrink-0 w-full">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">Email Logs</h1>
            <p className="text-xs text-white/90 mt-0.5">
              View and analyze email delivery, open, and click statistics.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading email logs...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedLogs}
          pageCount={Math.max(1, pageCount)}
          onPaginationChange={handlePaginationChange}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          onDateRangeChange={setDateRange}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search by email or subject..."
          page={page}
          pageSize={pageSize}
          onRowClick={handleRowClick}
        />
      )}

      {selectedLogForQuickView && (
        <LargeModal
          open={quickViewOpen}
          onOpenChange={(open) => {
            setQuickViewOpen(open)
            if (!open) {
              setSelectedLogForQuickView(null)
            }
          }}
          title="Email Log Details"
          footer={
            <div className="flex items-center gap-2">
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
                    <FileSearch className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-0">Email Details</CardTitle>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <Badge 
                        variant={getStatusBadgeVariant(selectedLogForQuickView.status)} 
                        className={`text-xs ${getStatusColor(selectedLogForQuickView.status)}`}
                      >
                        {selectedLogForQuickView.status.charAt(0).toUpperCase() + selectedLogForQuickView.status.slice(1)}
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
              </TabsList>

              <TabsContent value="overview" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Log Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Recipient Email</span>
                      <span className="text-sm font-medium">{selectedLogForQuickView.recipientEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Subject</span>
                      <span className="text-sm font-medium">{selectedLogForQuickView.subject}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Recipient Type</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedLogForQuickView.recipientType.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Template ID</span>
                      <span className="text-sm font-medium">{selectedLogForQuickView.templateId}</span>
                    </div>
                    {selectedLogForQuickView.automationId && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Automation ID</span>
                        <span className="text-sm font-medium">{selectedLogForQuickView.automationId}</span>
                      </div>
                    )}
                    {selectedLogForQuickView.dripId && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Drip ID</span>
                        <span className="text-sm font-medium">{selectedLogForQuickView.dripId}</span>
                      </div>
                    )}
                    {selectedLogForQuickView.errorMessage && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Error Message</p>
                        <p className="text-sm text-destructive">{selectedLogForQuickView.errorMessage}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-2 mt-4">
                <Card>
                  <CardHeader className="pb-2 px-4 pt-3">
                    <CardTitle className="text-sm font-semibold">Email Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 px-4 pb-3">
                    {selectedLogForQuickView.sentAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Sent At</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedLogForQuickView.sentAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedLogForQuickView.deliveredAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Delivered At</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedLogForQuickView.deliveredAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedLogForQuickView.openedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Opened At</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedLogForQuickView.openedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedLogForQuickView.clickedAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Clicked At</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedLogForQuickView.clickedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Created At</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedLogForQuickView.createdAt).toLocaleString()}
                      </span>
                    </div>
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

