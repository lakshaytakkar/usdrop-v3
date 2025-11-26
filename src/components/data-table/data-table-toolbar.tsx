'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewToggle } from './data-table-view-toggle'
import { DataTableExportMenu } from './data-table-export-menu'
import { DataTableDateRangePicker } from './data-table-date-range-picker'
import { X, Plus } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearchChange: (value: string) => void
  view?: string
  onViewChange?: (view: string) => void
  data?: TData[]
  onAdd?: () => void
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
  filterConfig?: {
    columnId: string
    title: string
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  onSearchChange,
  view = 'table',
  onViewChange,
  data = [],
  onAdd,
  onDateRangeChange,
  searchPlaceholder = 'Search...',
  addButtonText = 'Add Item',
  addButtonIcon = <Plus className="mr-2 h-4 w-4" />,
  secondaryButtons = [],
  aiGenerateButton,
  filterConfig = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1.5 pb-1">
      {/* Search and Filters Row */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <Input
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-full sm:w-[140px] flex-shrink-0 text-sm"
        />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {filterConfig.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) {
              console.warn(`[Table] Column with id '${filter.columnId}' does not exist.`)
              return null
            }
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 flex-shrink-0"
            size="sm"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {/* Right-aligned section: View Toggles, View, Export, Create */}
      <div className="flex items-center gap-1.5 flex-shrink-0 sm:ml-auto overflow-x-auto">
        {onDateRangeChange && (
          <div className="flex-shrink-0 hidden sm:block">
            <DataTableDateRangePicker onDateRangeChange={onDateRangeChange} />
          </div>
        )}
        {aiGenerateButton && (
          <div className="flex-shrink-0 max-w-fit">
            <Button onClick={aiGenerateButton.onClick} size="sm" variant="outline" className="h-8 px-2 sm:px-3 whitespace-nowrap">
              {aiGenerateButton.icon}
              <span className="hidden lg:inline ml-1.5 text-xs">{aiGenerateButton.label}</span>
              <span className="hidden sm:inline lg:hidden ml-1.5 text-xs">AI Generate</span>
            </Button>
          </div>
        )}
        {onViewChange && (
          <div className="flex-shrink-0">
            <DataTableViewToggle view={view} onViewChange={onViewChange} />
          </div>
        )}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <DataTableViewOptions table={table} />
          <div className="hidden sm:block">
            <DataTableExportMenu data={data} />
          </div>
        </div>
        {secondaryButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            onClick={button.onClick}
            variant={button.variant || 'outline'}
            size="sm"
            className="h-8 px-2 sm:px-3 flex-shrink-0"
          >
            <span className="hidden sm:inline">{button.icon}</span>
            <span className="text-sm hidden sm:inline">{button.label}</span>
            {button.icon && <span className="sm:hidden">{button.icon}</span>}
          </Button>
        ))}
        {onAdd && (
          <Button 
            type="button" 
            onClick={onAdd} 
            size="sm" 
            className="h-8 px-2 sm:px-3 flex-shrink-0"
          >
            <span className="hidden sm:inline">{addButtonIcon}</span>
            <span className="text-sm hidden sm:inline">{addButtonText}</span>
            <Plus className="h-4 w-4 sm:hidden" />
          </Button>
        )}
      </div>
    </div>
  )
}

