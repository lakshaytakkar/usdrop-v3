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
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            )}
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {showCheckbox && (
                <TableCell>
                  <Skeleton className="h-4 w-4 rounded" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    className={cn(
                      "h-4",
                      colIndex === 0 ? "w-32" : colIndex === 1 ? "w-48" : "w-24"
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
        <TableCell>
          <Skeleton className="h-4 w-4 rounded" />
        </TableCell>
      )}
      {Array.from({ length: columns }).map((_, colIndex) => (
        <TableCell key={colIndex}>
          <div className="flex items-center gap-2">
            {colIndex === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            <Skeleton
              className={cn(
                "h-4",
                colIndex === 0 ? "w-32" : colIndex === 1 ? "w-48" : "w-24"
              )}
            />
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
}

