"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Megaphone,
  Mail,
  Image,
  Search,
  Video,
  Sparkles,
  LucideIcon,
} from "lucide-react"
import { AITool } from "../data/tools"

interface ToolCardProps {
  tool: AITool
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Megaphone,
  Mail,
  Image,
  Search,
  Video,
  Sparkles,
}

export function ToolCard({ tool }: ToolCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "premium":
        return "secondary"
      case "coming-soon":
        return "outline"
      default:
        return "outline"
    }
  }

  const Icon = iconMap[tool.icon] || Sparkles

  return (
    <Card className="flex h-full flex-col transition-transform hover:scale-[1.02]">
      <CardContent className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 flex-none items-center justify-center rounded-xl">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
              <Badge variant="outline">{tool.category}</Badge>
            </div>
          </div>
          <Badge variant={getStatusColor(tool.status) as any}>
            {tool.status === "available"
              ? "Available"
              : tool.status === "premium"
              ? "Premium"
              : "Coming Soon"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Features:</p>
          <div className="flex flex-wrap gap-1">
            {tool.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant={tool.status === "available" ? "default" : "outline"}
          className="w-full mt-auto"
          disabled={tool.status === "coming-soon"}
        >
          {tool.status === "available"
            ? "Use Tool"
            : tool.status === "premium"
            ? "Upgrade to Premium"
            : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  )
}

