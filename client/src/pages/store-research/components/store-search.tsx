

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface StoreSearchProps {
  onSearch: (url: string) => void
  isLoading?: boolean
  initialValue?: string
}

export function StoreSearch({
  onSearch,
  isLoading = false,
  initialValue = "www.jsblueridge.com",
}: StoreSearchProps) {
  const [url, setUrl] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSearch(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            placeholder="www.example-store.com"
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={isLoading || !url.trim()}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  )
}

