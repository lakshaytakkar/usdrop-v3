"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudienceDemographicsChartProps {
  demographics?: {
    age: string
    gender: string
  }
  interests?: string[]
  suggestions?: string[]
}

const defaultData = {
  demographics: { age: "25-34", gender: "Unisex" },
  interests: ["Home & Garden", "Lifestyle", "Technology", "Trending Products", "Online Shopping"],
  suggestions: [
    "Target value-conscious consumers aged 25-44",
    "Focus on lifestyle and home improvement enthusiasts",
    "Use social proof in ad creatives for higher conversion",
    "Test TikTok and Instagram Reels for organic reach",
  ],
}

const ageGroups = [
  { range: "18-24", percent: 18, color: "bg-violet-500" },
  { range: "25-34", percent: 38, color: "bg-blue-500" },
  { range: "35-44", percent: 24, color: "bg-emerald-500" },
  { range: "45-54", percent: 13, color: "bg-amber-500" },
  { range: "55+", percent: 7, color: "bg-rose-500" },
]

const genderSplit = [
  { label: "Female", percent: 48, color: "bg-pink-500" },
  { label: "Male", percent: 42, color: "bg-blue-500" },
  { label: "Other", percent: 10, color: "bg-gray-400" },
]

export function AudienceDemographicsChart({
  demographics,
  interests,
  suggestions,
}: AudienceDemographicsChartProps) {
  const data = {
    demographics: demographics || defaultData.demographics,
    interests: interests && interests.length > 0 ? interests : defaultData.interests,
    suggestions: suggestions && suggestions.length > 0 ? suggestions : defaultData.suggestions,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Card className="p-4 lg:h-full">
        <div className="flex items-center gap-2 mb-0.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Audience Demographics</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Primary: {data.demographics.age} · {data.demographics.gender}
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Age Distribution</p>
            <div className="space-y-1.5">
              {ageGroups.map((group) => (
                <div key={group.range} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 shrink-0">{group.range}</span>
                  <div className="flex-1 h-4 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", group.color)}
                      style={{ width: `${group.percent}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{group.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Gender Split</p>
            <div className="flex h-2.5 rounded-full overflow-hidden mb-1.5">
              {genderSplit.map((g) => (
                <div key={g.label} className={cn("h-full", g.color)} style={{ width: `${g.percent}%` }} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              {genderSplit.map((g) => (
                <div key={g.label} className="flex items-center gap-1 text-xs">
                  <div className={cn("w-2 h-2 rounded-full", g.color)} />
                  <span className="text-muted-foreground">{g.label} {g.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 lg:h-full">
        <div className="flex items-center gap-2 mb-0.5">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Targeting Insights</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Interest groups and marketing recommendations
        </p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Top Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {data.interests.map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal px-2.5 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations</p>
            <div className="space-y-1.5">
              {data.suggestions.map((suggestion, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <div className="w-4.5 h-4.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5" style={{ width: '18px', height: '18px' }}>
                    <span className="text-blue-600 font-semibold text-[10px]">{i + 1}</span>
                  </div>
                  <p className="text-muted-foreground leading-snug">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
