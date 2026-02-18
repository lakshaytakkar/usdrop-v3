

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface HelpSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function HelpSearch({
  value,
  onChange,
  placeholder = "Search for help...",
  className,
}: HelpSearchProps) {
  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-12 text-base bg-background border-border rounded-lg"
      />
    </div>
  )
}

