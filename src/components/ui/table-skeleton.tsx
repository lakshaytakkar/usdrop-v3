"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showCheckbox?: boolean
  className?: string
}

export function TableSkeleton({
  rows = 5,
  columns = 7,
  showCheckbox = false,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("rounded-md border w-full max-w-full overflow-hidden min-w-0", className)}>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-12 shrink-0">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            )}
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="min-w-0">
                <Skeleton className="h-4 w-16 max-w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {showCheckbox && (
                <TableCell className="w-12 shrink-0">
                  <Skeleton className="h-4 w-4 rounded" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="min-w-0 max-w-0">
                  <Skeleton
                    className={cn(
                      "h-4 max-w-full",
                      colIndex === 0 ? "w-24" : colIndex === 1 ? "w-32" : "w-20"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface TableRowSkeletonProps {
  columns?: number
  showCheckbox?: boolean
  className?: string
}

export function TableRowSkeleton({
  columns = 7,
  showCheckbox = false,
  className,
}: TableRowSkeletonProps) {
  return (
    <TableRow className={className}>
      {showCheckbox && (
        <TableCell className="w-12 shrink-0">
          <Skeleton className="h-4 w-4 rounded" />
        </TableCell>
      )}
      {Array.from({ length: columns }).map((_, colIndex) => (
        <TableCell key={colIndex} className="min-w-0 max-w-0">
          <div className="flex items-center gap-2 min-w-0">
            {colIndex === 0 && <Skeleton className="h-8 w-8 rounded-full shrink-0" />}
            <Skeleton
              className={cn(
                "h-4 max-w-full",
                colIndex === 0 ? "w-24" : colIndex === 1 ? "w-32" : "w-20"
              )}
            />
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
}

