"use client"

import { Card } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface InstagramInfluencersProps {
  influencers?: string[]
}

const defaultInfluencers = [
  "@technologiaa",
  "@techy_inventions",
  "@engineering.mag",
  "@coolgadgetsonly",
  "@gadget.brand1",
  "@technologytv",
]

export function InstagramInfluencers({ influencers = defaultInfluencers }: InstagramInfluencersProps) {
  return (
    <Card className="p-6 min-w-0">
      <div className="flex flex-wrap gap-2 min-w-0">
        {influencers.map((handle, index) => (
          <Badge
            key={index}
            variant="outline"
            className="px-3 py-1.5 text-sm font-medium cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors"
          >
            {handle}
          </Badge>
        ))}
      </div>
    </Card>
  )
}

