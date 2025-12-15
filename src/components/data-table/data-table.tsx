'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'

// Extend ColumnMeta to include sticky and hidden properties
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    sticky?: boolean
    hidden?: boolean
  }
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { TableSkeleton, TableRowSkeleton } from '@/components/ui/table-skeleton'
import { PageLoader } from '@/components/ui/loader'
import { DataTableToolbar } from './data-table-toolbar'
import { DataTablePagination } from './data-table-pagination'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  onPaginationChange: (page: number, pageSize: number) => void
  onSortingChange: (sorting: SortingState) => void
  onFilterChange: (filters: ColumnFiltersState) => void
  onSearchChange: (search: string) => void
  loading?: boolean
  initialLoading?: boolean
  view?: string
  onViewChange?: (view: string) => void
  onAdd?: () => void
  onEdit?: (item: TData) => void
  onDelete?: (item: TData) => void
  onView?: (item: TData) => void
  onDateRangeChange?: (dateRange: { from: Date | undefined; to: Date | undefined }) => void
  searchPlaceholder?: string
  addButtonText?: string
  addButtonIcon?: React.ReactNode
  secondaryButtons?: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
  }>
  aiGenerateButton?: {
    label: string
    icon: React.ReactNode
    onClick: () => void
  }
  renderCustomView?: (view: string, data: TData[]) => React.ReactNode
  filterConfig?: {
    columnId: string
    title: string
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
  }[]
  quickFilters?: Array<{ id: string; label: string; count: number }>
  selectedQuickFilter?: string | null
  onQuickFilterChange?: (filterId: string | null) => void
  page?: number
  pageSize?: number
  enableRowSelection?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  onRowClick?: (item: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  onPaginationChange,
  onSortingChange,
  onFilterChange,
  onSearchChange,
  loading = false,
  initialLoading = false,
  view = 'table',
  onViewChange,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onDateRangeChange,
  searchPlaceholder,
  addButtonText,
  addButtonIcon,
  secondaryButtons,
  aiGenerateButton,
  renderCustomView,
  filterConfig = [],
  quickFilters,
  selectedQuickFilter,
  onQuickFilterChange,
  page: controlledPage,
  pageSize: controlledPageSize,
  enableRowSelection = false,
  onRowSelectionChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [pagination, setPagination] = useState({ 
    pageIndex: controlledPage !== undefined ? controlledPage - 1 : 0, 
    pageSize: controlledPageSize || 10 
  })

  // Sync controlled props to internal state, but only when they actually change
  useEffect(() => {
    if (controlledPage !== undefined || controlledPageSize !== undefined) {
      setPagination(prev => {
        const newPageIndex = controlledPage !== undefined ? controlledPage - 1 : prev.pageIndex
        const newPageSize = controlledPageSize !== undefined ? controlledPageSize : prev.pageSize
        
        // Only update if values actually changed to prevent infinite loops
        if (newPageIndex !== prev.pageIndex || newPageSize !== prev.pageSize) {
          return {
            pageIndex: newPageIndex,
            pageSize: newPageSize,
          }
        }
        return prev
      })
    }
  }, [controlledPage, controlledPageSize])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: (updater) => {
      setSorting(updater)
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(newSorting)
    },
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater)
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      onFilterChange(newFilters)
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      // Only update if values actually changed to prevent infinite loops
      if (newPagination.pageIndex !== pagination.pageIndex || newPagination.pageSize !== pagination.pageSize) {
        setPagination(newPagination)
        onPaginationChange(newPagination.pageIndex + 1, newPagination.pageSize)
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
      setRowSelection(newSelection)
    },
    enableRowSelection: enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  // Handle row selection changes - use refs to prevent infinite loops
  const prevSelectionKeysRef = useRef<string>('')
  const onRowSelectionChangeRef = useRef(onRowSelectionChange)
  const enableRowSelectionRef = useRef(enableRowSelection)
  const tableRef = useRef(table)
  
  // Keep refs updated without triggering effects
  useEffect(() => {
    onRowSelectionChangeRef.current = onRowSelectionChange
    enableRowSelectionRef.current = enableRowSelection
    tableRef.current = table
  }, [onRowSelectionChange, enableRowSelection, table])
  
  useEffect(() => {
    if (onRowSelectionChangeRef.current && enableRowSelectionRef.current) {
      // Get current selection keys as a sorted string for comparison
      const currentSelectionKeys = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .sort()
        .join(',')
      
      // Only call callback if selection actually changed
      if (currentSelectionKeys !== prevSelectionKeysRef.current) {
        prevSelectionKeysRef.current = currentSelectionKeys
        // Use ref to access table to avoid dependency
        const selectedRows = tableRef.current.getRowModel().rows
          .filter((row) => rowSelection[row.id])
          .map((row) => row.original)
        // Use setTimeout to defer and prevent synchronous loops
        setTimeout(() => {
          onRowSelectionChangeRef.current?.(selectedRows)
        }, 0)
      }
    }
    // Only depend on rowSelection, not table or callbacks (using refs instead)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection])


  const renderView = () => {
    if (initialLoading && view === 'table') {
      return (
        <div className="flex-1 overflow-x-auto overflow-y-auto rounded-md border min-h-0 w-full max-w-full overscroll-x-contain min-w-0">
          <TableSkeleton
            rows={pagination.pageSize || 10}
            columns={columns.length}
            showCheckbox={enableRowSelection}
            className="w-full max-w-full min-w-0"
          />
        </div>
      )
    }

    if (view !== 'table' && renderCustomView) {
      return renderCustomView(view, data)
    }

    return (
      <div className="flex-1 overflow-y-auto rounded-md border min-h-0 w-full max-w-full overflow-x-auto min-w-0">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-sm">
                {enableRowSelection && (
                  <TableHead className="w-12 py-2 px-2 sm:px-3">
                    <input
                      type="checkbox"
                      checked={table.getIsAllPageRowsSelected()}
                      onChange={(e) => {
                        if (e.target.checked) {
                          table.toggleAllPageRowsSelected(true)
                        } else {
                          table.toggleAllPageRowsSelected(false)
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </TableHead>
                )}
                {headerGroup.headers.map((header) => {
                  const isSticky = header.column.columnDef.meta?.sticky
                  return (
                    <TableHead 
                      key={header.id} 
                      className={cn(
                        "py-2 px-2 sm:px-3",
                        isSticky && "sticky right-0 bg-background z-20"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize || 5 }).map((_, index) => (
                <TableRowSkeleton
                  key={`loading-${index}`}
                  columns={columns.length}
                  showCheckbox={enableRowSelection}
                />
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn("text-sm h-16 group", onRowClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {enableRowSelection && (
                    <TableCell className="w-12 py-2 px-2 sm:px-3">
                      <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={(e) => {
                          row.toggleSelected(e.target.checked)
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => {
                    const isSticky = cell.column.columnDef.meta?.sticky
                    return (
                      <TableCell 
                        key={cell.id} 
                        className={cn(
                          "py-2 px-2 sm:px-3 max-w-0",
                          isSticky && "sticky right-0 bg-background z-10"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} className="h-24 text-center shrink-0">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <p className="text-sm text-muted-foreground">No users found</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 flex-1 min-w-0 overflow-x-hidden">
      <div className="shrink-0 mb-4">
        <DataTableToolbar
          table={table}
          onSearchChange={onSearchChange}
          view={view}
          onViewChange={onViewChange}
          data={data}
          onAdd={onAdd}
          onDateRangeChange={onDateRangeChange}
          searchPlaceholder={searchPlaceholder}
          addButtonText={addButtonText}
          addButtonIcon={addButtonIcon}
          secondaryButtons={secondaryButtons}
          aiGenerateButton={aiGenerateButton}
          filterConfig={filterConfig}
          quickFilters={quickFilters}
          selectedQuickFilter={selectedQuickFilter}
          onQuickFilterChange={onQuickFilterChange}
        />
      </div>
      <div className="flex-1 min-h-0 flex flex-col min-w-0 overflow-hidden">{renderView()}</div>
      {(view === 'table' || view === 'list') && (
        <div className="shrink-0 bg-background border-t mt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  )
}

