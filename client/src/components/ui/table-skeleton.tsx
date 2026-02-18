

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

const skeletonWidths = ["w-32", "w-20", "w-16", "w-24", "w-16", "w-20", "w-12", "w-16"]

export function TableSkeleton({
  rows = 5,
  columns = 7,
  showCheckbox = false,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("rounded-md border w-full max-w-full overflow-hidden min-w-0", className)}>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead className="w-12 py-2 px-2 sm:px-3">
                <Skeleton className="h-4 w-4" />
              </TableHead>
            )}
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="py-2 px-2 sm:px-3">
                <Skeleton className={cn("h-4", skeletonWidths[index % skeletonWidths.length])} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="h-16">
              {showCheckbox && (
                <TableCell className="w-12 py-2 px-2 sm:px-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex} className="py-2 px-2 sm:px-3">
                  <div className="flex items-center gap-2">
                    {colIndex === 0 && <Skeleton className="h-10 w-10 rounded shrink-0" />}
                    <div className="space-y-1.5">
                      <Skeleton
                        className={cn(
                          "h-4",
                          colIndex === 0 ? "w-28" : skeletonWidths[(colIndex) % skeletonWidths.length]
                        )}
                      />
                      {colIndex === 0 && <Skeleton className="h-3 w-20" />}
                    </div>
                  </div>
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
    <TableRow className={cn("h-16", className)}>
      {showCheckbox && (
        <TableCell className="w-12 py-2 px-2 sm:px-3">
          <Skeleton className="h-4 w-4 rounded" />
        </TableCell>
      )}
      {Array.from({ length: columns }).map((_, colIndex) => (
        <TableCell key={colIndex} className="py-2 px-2 sm:px-3">
          <div className="flex items-center gap-2">
            {colIndex === 0 && <Skeleton className="h-10 w-10 rounded shrink-0" />}
            <div className="space-y-1.5">
              <Skeleton
                className={cn(
                  "h-4",
                  colIndex === 0 ? "w-28" : skeletonWidths[(colIndex) % skeletonWidths.length]
                )}
              />
              {colIndex === 0 && <Skeleton className="h-3 w-20" />}
            </div>
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
}
