

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format, subDays, startOfMonth, startOfYear } from 'date-fns'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface DataTableDateRangePickerProps {
  onDateRangeChange: (dateRange: { from: Date | undefined; to: Date | undefined }) => void
}

export function DataTableDateRangePicker({ onDateRangeChange }: DataTableDateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [selectedPreset, setSelectedPreset] = useState<string>('all')
  
  // Initialize with "All Time" as default
  useEffect(() => {
    onDateRangeChange({ from: undefined, to: undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePresetClick = (preset: string) => {
    const now = new Date()
    let from: Date | undefined
    let to: Date | undefined
    let range: DateRange | undefined

    switch (preset) {
      case 'all':
        // All time - no date restrictions
        from = undefined
        to = undefined
        range = undefined
        break
      case 'today':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        range = { from, to }
        break
      case 'yesterday':
        const yesterday = subDays(now, 1)
        from = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
        to = from
        range = { from, to }
        break
      case 'thisWeek':
        const dayOfWeek = now.getDay()
        from = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000)
        from.setHours(0, 0, 0, 0)
        to = now
        range = { from, to }
        break
      case 'last7days':
        from = subDays(now, 7)
        to = now
        range = { from, to }
        break
      case 'thisMonth':
        from = startOfMonth(now)
        to = now
        range = { from, to }
        break
      case 'lastMonth':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        from = lastMonth
        to = new Date(now.getFullYear(), now.getMonth(), 0)
        range = { from, to }
        break
      case 'thisYear':
        from = startOfYear(now)
        to = now
        range = { from, to }
        break
      default:
        return
    }

    setDateRange(range)
    setSelectedPreset(preset)
    onDateRangeChange({ from, to })
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    setSelectedPreset('') // Clear preset when manually selecting dates
    onDateRangeChange({ 
      from: range?.from, 
      to: range?.to 
    })
  }

  const presets = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'This Month', value: 'thisMonth' },
    { label: 'Last Month', value: 'lastMonth' },
    { label: 'This Year', value: 'thisYear' },
  ]

  const getDisplayText = () => {
    if (selectedPreset === 'all') {
      return 'All Time'
    }
    if (selectedPreset === 'today') {
      return 'Today'
    }
    if (selectedPreset === 'yesterday') {
      return 'Yesterday'
    }
    if (selectedPreset === 'thisWeek') {
      return 'This Week'
    }
    if (selectedPreset === 'last7days') {
      return 'Last 7 Days'
    }
    if (selectedPreset === 'thisMonth') {
      return 'This Month'
    }
    if (selectedPreset === 'lastMonth') {
      return 'Last Month'
    }
    if (selectedPreset === 'thisYear') {
      return 'This Year'
    }
    if (dateRange?.from) {
      if (dateRange?.to) {
        return `${format(dateRange.from, 'dd MMM y')} - ${format(dateRange.to, 'dd MMM y')}`
      }
      return format(dateRange.from, 'dd MMM y')
    }
    return 'Date range'
  }
  
  const getTopBarText = () => {
    if (dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'dd MMM y')} - ${format(dateRange.to, 'dd MMM y')}`
    }
    if (dateRange?.from) {
      return format(dateRange.from, 'dd MMM y')
    }
    return 'Select date range'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'justify-start text-left font-normal h-8',
            !dateRange?.from && selectedPreset !== 'all' && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 mb-6" 
        align="start" 
        sideOffset={4}
        style={{ marginBottom: '24px' }}
      >
        {/* Top Bar - Selected Date Range Display */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{getTopBarText()}</span>
        </div>
        
        <div className="flex">
          {/* Left Sidebar - Presets */}
          <div className="py-2 px-2 shrink-0 border-r border-border/50">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={cn(
                  "text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors cursor-pointer whitespace-nowrap block w-full mb-0.5 last:mb-0",
                  selectedPreset === preset.value && "bg-accent"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Right Panel - Calendar */}
          <div className="p-2.5">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from || new Date()}
              selected={dateRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={1}
              className="border-0 shadow-none [--cell-size:31px]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
