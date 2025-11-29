'use client'

import { useState, useMemo } from 'react'
import { Column } from '@tanstack/react-table'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const filterValue = column?.getFilterValue() as string[] | undefined
  const [open, setOpen] = useState(false)
  
  // Derive selected values from column filter value
  const selectedValues = useMemo(() => {
    return new Set(filterValue || [])
  }, [filterValue])

  const hasActiveFilters = selectedValues.size > 0
  
  const handleToggleOption = (optionValue: string) => {
    const newSet = new Set(selectedValues)
    
    if (newSet.has(optionValue)) {
      newSet.delete(optionValue)
    } else {
      newSet.add(optionValue)
    }
    
    const filterValues = Array.from(newSet)
    column?.setFilterValue(filterValues.length > 0 ? filterValues : undefined)
  }
  
  const handleClearFilters = () => {
    column?.setFilterValue(undefined)
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "h-8 px-2.5 border-dashed text-xs whitespace-nowrap cursor-pointer",
            hasActiveFilters && "border-primary bg-primary/5"
          )}
        >
          <ChevronsUpDown className="mr-1.5 h-3.5 w-3.5" />
          {title}
          {hasActiveFilters && (
            <>
              <Badge variant="secondary" className="ml-1.5 rounded-sm px-1 font-normal text-[10px]">
                {selectedValues.size}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0" 
        align="start" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <div
                    key={option.value}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleToggleOption(option.value)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleToggleOption(option.value)
                      }
                    }}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span className="whitespace-nowrap">{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </div>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandGroup>
                  <div
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleClearFilters()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleClearFilters()
                      }
                    }}
                    className="relative flex cursor-pointer select-none items-center justify-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-center"
                    role="button"
                    tabIndex={0}
                  >
                    Clear filters
                  </div>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
