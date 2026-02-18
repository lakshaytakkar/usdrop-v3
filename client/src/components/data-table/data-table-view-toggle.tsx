

import { LayoutGrid, List, Table as TableIcon } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface DataTableViewToggleProps {
  view: string
  onViewChange: (view: string) => void
}

export function DataTableViewToggle({ view, onViewChange }: DataTableViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={view}
      onValueChange={onViewChange}
      className="h-8"
    >
      <ToggleGroupItem value="table" aria-label="Table view" className="h-8 px-2">
        <TableIcon className="h-3.5 w-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" className="h-8 px-2">
        <List className="h-3.5 w-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="kanban" aria-label="Kanban view" className="h-8 px-2">
        <LayoutGrid className="h-3.5 w-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

