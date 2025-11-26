'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DataTableDateRangePickerProps {
  onDateRangeChange: (dateRange: { from: Date | undefined; to: Date | undefined }) => void
}

export function DataTableDateRangePicker({ onDateRangeChange }: DataTableDateRangePickerProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const handlePresetClick = (preset: string) => {
    const now = new Date()
    let from: Date | undefined
    let to: Date | undefined

    switch (preset) {
      case 'today':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        to = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'last7days':
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        to = now
        break
      case 'last30days':
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        to = now
        break
      case 'last90days':
        from = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        to = now
        break
      case 'all':
        from = undefined
        to = undefined
        break
    }

    setDateRange({ from, to })
    onDateRangeChange({ from, to })
  }

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal h-8',
              !dateRange.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Card className="max-w-[300px] py-4">
            <CardContent className="px-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range: any) => {
                  const newRange = range
                    ? { from: range.from, to: range.to }
                    : { from: undefined, to: undefined }
                  setDateRange(newRange)
                  onDateRangeChange(newRange)
                }}
                numberOfMonths={1}
              />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t px-4 pb-0 pt-4">
              {[
                { label: 'Today', value: 'today' },
                { label: 'Last 7 days', value: 'last7days' },
                { label: 'Last 30 days', value: 'last30days' },
                { label: 'Last 90 days', value: 'last90days' },
                { label: 'All time', value: 'all' },
              ].map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handlePresetClick(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}

