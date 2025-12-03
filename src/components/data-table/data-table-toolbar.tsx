'use client'

import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewToggle } from './data-table-view-toggle'
import { DataTableExportMenu } from './data-table-export-menu'
import { DataTableDateRangePicker } from './data-table-date-range-picker'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { X, Plus, Filter, Check } from 'lucide-react'

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
    disabled?: boolean
    tooltip?: string
    className?: string
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
  quickFilters?: Array<{ id: string; label: string; icon?: React.ComponentType<{ className?: string }>; isWarning?: boolean }>
  selectedQuickFilter?: string | null
  onQuickFilterChange?: (filterId: string | null) => void
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
  quickFilters = [],
  selectedQuickFilter,
  onQuickFilterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center gap-1.5 pb-1 flex-wrap">
      {/* Search and Filters */}
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
        {/* Quick Filters Dropdown */}
        {quickFilters.length > 0 && onQuickFilterChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={selectedQuickFilter ? "default" : "outline"}
                size="sm"
                className="h-8 px-2 cursor-pointer"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {quickFilters.map((filter) => {
                const Icon = filter.icon
                return (
                  <DropdownMenuItem
                    key={filter.id}
                    onClick={() => onQuickFilterChange(selectedQuickFilter === filter.id ? null : filter.id)}
                    className={cn(
                      "cursor-pointer",
                      selectedQuickFilter === filter.id && "bg-accent"
                    )}
                  >
                    {Icon && <Icon className={cn("h-4 w-4 mr-2", filter.isWarning && "text-destructive")} />}
                    <span className={cn(filter.isWarning && "text-destructive")}>
                      {filter.label}
                    </span>
                    {selectedQuickFilter === filter.id && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                )
              })}
              {selectedQuickFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onQuickFilterChange(null)}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {onDateRangeChange && (
          <div className="flex-shrink-0">
            <DataTableDateRangePicker onDateRangeChange={onDateRangeChange} />
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 flex-shrink-0 cursor-pointer"
            size="sm"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      {/* Right-aligned section: View Toggles, View, Export, Create */}
      <div className="flex items-center gap-1.5 flex-shrink-0 overflow-x-auto">
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
        {secondaryButtons.map((button, index) => {
          const ButtonComponent = (
            <Button
              key={index}
              type="button"
              onClick={button.onClick}
              variant={button.variant || 'outline'}
              size="sm"
              className={cn("h-8 px-2 sm:px-3 flex-shrink-0 whitespace-nowrap cursor-pointer", button.className)}
              disabled={button.disabled}
            >
              {button.icon && <span className="hidden sm:inline mr-1.5">{button.icon}</span>}
              <span className="text-sm hidden sm:inline whitespace-nowrap">{button.label}</span>
              {button.icon && <span className="sm:hidden">{button.icon}</span>}
            </Button>
          )
          
          // Only add tooltip if button is disabled and has a reason
          if (button.disabled && button.tooltip) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  {ButtonComponent}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )
          }
          
          return ButtonComponent
        })}
        {onAdd && (
          <Button 
            type="button" 
            onClick={onAdd} 
            size="sm" 
            className="h-8 px-2 sm:px-3 flex-shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span className="hidden sm:inline mr-1.5">{addButtonIcon}</span>
            <span className="text-sm hidden sm:inline whitespace-nowrap">{addButtonText}</span>
            <Plus className="h-4 w-4 sm:hidden" />
          </Button>
        )}
      </div>
    </div>
  )
}

