'use client'

import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

const VALID_PAGE_SIZES = [10, 20, 30, 40, 50] as const

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  // For manual pagination, use pageCount * pageSize to get total count
  // This works because pageCount is passed from parent and represents total pages
  const pageSize = table.getState().pagination.pageSize
  const totalCount = table.getPageCount() > 0 
    ? table.getPageCount() * pageSize
    : table.getFilteredRowModel().rows.length
  
  // Store table methods in ref to avoid dependency on table object
  const tableRef = useRef(table)
  const pageSizeRef = useRef(pageSize)
  const isInternalUpdateRef = useRef(false)
  
  // Update refs when they change
  useEffect(() => {
    tableRef.current = table
  }, [table])
  
  useEffect(() => {
    if (!isInternalUpdateRef.current) {
      pageSizeRef.current = pageSize
    }
    isInternalUpdateRef.current = false
  }, [pageSize])
  
  // Memoize the select value string to prevent unnecessary re-renders
  const selectValue = useMemo(() => `${pageSize}`, [pageSize])
  
  // Stable handler with empty deps - uses refs to access current values
  // This ensures the handler function reference never changes
  const handlePageSizeChange = useCallback((value: string) => {
    const newPageSize = Number(value)
    
    // Validate: must be a valid number, positive, and in the allowed list
    if (
      isNaN(newPageSize) || 
      newPageSize <= 0 || 
      !Number.isInteger(newPageSize) ||
      !VALID_PAGE_SIZES.includes(newPageSize as typeof VALID_PAGE_SIZES[number])
    ) {
      return
    }
    
    const currentPageSize = pageSizeRef.current
    
    // Only update if the value actually changed
    if (newPageSize !== currentPageSize) {
      // Mark as internal update to prevent sync loop
      isInternalUpdateRef.current = true
      // Update ref immediately to prevent stale value on rapid changes
      pageSizeRef.current = newPageSize
      // Call table.setPageSize which will trigger the parent callback
      tableRef.current.setPageSize(newPageSize)
    }
  }, [])
  
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0 px-2 py-2">
      <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
        {selectedCount > 0 ? (
          <>
            {selectedCount} of {totalCount} row(s) selected.
          </>
        ) : (
          <span className="hidden sm:inline">
            {totalCount} row(s) total.
          </span>
        )}
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 lg:gap-6 sm:space-x-0">
        <div className="flex items-center space-x-2">
          <p className="text-xs sm:text-sm font-medium hidden sm:inline">Rows per page</p>
          <p className="text-xs sm:text-sm font-medium sm:hidden">Per page</p>
          <Select
            value={selectValue}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[60px] sm:w-[70px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {VALID_PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center text-xs sm:text-sm font-medium min-w-[80px] sm:min-w-[100px]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

