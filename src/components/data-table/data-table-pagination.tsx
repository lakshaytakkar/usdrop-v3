'use client'

import { useCallback } from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

const VALID_PAGE_SIZES = [10, 20, 30, 40, 50] as const

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const pageSize = table.getState().pagination.pageSize
  const pageCount = table.getPageCount()
  
  // For manual pagination, calculate total count from pageCount
  // If pageCount is 0 or invalid, fall back to visible rows
  const totalCount = pageCount > 0 
    ? pageCount * pageSize
    : table.getFilteredRowModel().rows.length
  
  // Use native select to avoid Radix Select infinite loop issues
  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value)
    
    // Validate: must be a valid number, positive, and in the allowed list
    if (
      isNaN(newPageSize) || 
      newPageSize <= 0 || 
      !Number.isInteger(newPageSize) ||
      !VALID_PAGE_SIZES.includes(newPageSize as typeof VALID_PAGE_SIZES[number])
    ) {
      return
    }
    
    const currentPageSize = table.getState().pagination.pageSize
    
    // Only update if the value actually changed
    if (newPageSize !== currentPageSize) {
      table.setPageSize(newPageSize)
    }
  }, [table])
  
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
          <p className="text-xs sm:text-sm font-medium hidden sm:inline whitespace-nowrap">Rows per page</p>
          <p className="text-xs sm:text-sm font-medium sm:hidden whitespace-nowrap">Per page</p>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className={cn(
              "h-8 w-[60px] sm:w-[70px] rounded-md border border-input bg-background px-2 py-1 text-xs sm:text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {VALID_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center text-xs sm:text-sm font-medium min-w-[80px] sm:min-w-[100px]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
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

