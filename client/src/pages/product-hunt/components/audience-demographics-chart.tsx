

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

function deriveAgeDistribution(ageRange: string) {
  const colors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
  ]
  const allRanges = ["18-24", "25-34", "35-44", "45-54", "55+"]

  const normalized = ageRange.replace(/\s/g, "")
  const match = normalized.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (!match) {
    return allRanges.map((range, i) => ({ range, percent: 20, color: colors[i] }))
  }

  const low = parseInt(match[1])
  const high = parseInt(match[2])

  const rangeBounds = [
    { range: "18-24", lo: 18, hi: 24 },
    { range: "25-34", lo: 25, hi: 34 },
    { range: "35-44", lo: 35, hi: 44 },
    { range: "45-54", lo: 45, hi: 54 },
    { range: "55+", lo: 55, hi: 75 },
  ]

  const weights = rangeBounds.map((rb) => {
    const overlap = Math.max(0, Math.min(high, rb.hi) - Math.max(low, rb.lo) + 1)
    return overlap > 0 ? overlap : 0
  })

  const peak = rangeBounds.findIndex((rb) => {
    const mid = (low + high) / 2
    return mid >= rb.lo && mid <= rb.hi
  })

  const adjusted = weights.map((w, i) => {
    if (w > 0) {
      if (i === peak || i === peak - 1 || i === peak + 1) return w * 3
      return w * 1.5
    }
    return 1
  })

  const total = adjusted.reduce((s, v) => s + v, 0)
  const percents = adjusted.map((v) => Math.round((v / total) * 100))

  const diff = 100 - percents.reduce((s, v) => s + v, 0)
  if (peak >= 0) percents[peak] += diff

  return allRanges.map((range, i) => ({
    range,
    percent: percents[i],
    color: colors[i],
  }))
}

function deriveGenderSplit(gender: string) {
  const g = gender.toLowerCase().trim()

  if (g === "female" || g.includes("women") || g.includes("primarily female")) {
    return [
      { label: "Female", percent: 72, color: "bg-pink-500" },
      { label: "Male", percent: 22, color: "bg-blue-500" },
      { label: "Other", percent: 6, color: "bg-gray-400" },
    ]
  }
  if (g === "male" || g.includes("men") || g.includes("primarily male")) {
    return [
      { label: "Female", percent: 22, color: "bg-pink-500" },
      { label: "Male", percent: 72, color: "bg-blue-500" },
      { label: "Other", percent: 6, color: "bg-gray-400" },
    ]
  }
  if (g === "unisex" || g.includes("both") || g.includes("male and female") || g.includes("all")) {
    return [
      { label: "Female", percent: 48, color: "bg-pink-500" },
      { label: "Male", percent: 46, color: "bg-blue-500" },
      { label: "Other", percent: 6, color: "bg-gray-400" },
    ]
  }

  return [
    { label: "Female", percent: 48, color: "bg-pink-500" },
    { label: "Male", percent: 42, color: "bg-blue-500" },
    { label: "Other", percent: 10, color: "bg-gray-400" },
  ]
}

export function AudienceDemographicsChart({
  demographics,
  interests,
  suggestions,
}: AudienceDemographicsChartProps) {
  const demo = demographics || { age: "25-34", gender: "Unisex" }
  const interestList = interests && interests.length > 0 ? interests : []
  const suggestionList = suggestions && suggestions.length > 0 ? suggestions : []

  const ageGroups = deriveAgeDistribution(demo.age)
  const genderSplit = deriveGenderSplit(demo.gender)

  const hasData = (demographics && (demographics.age || demographics.gender)) || interestList.length > 0 || suggestionList.length > 0
  if (!hasData) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Card className="p-4 lg:h-full">
        <div className="flex items-center gap-2 mb-0.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Audience Demographics</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Primary: {demo.age} · {demo.gender}
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
          {interestList.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Top Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {interestList.map((interest, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal px-2.5 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {suggestionList.length > 0 && (
            <div className={interestList.length > 0 ? "pt-3 border-t" : ""}>
              <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations</p>
              <div className="space-y-1.5">
                {suggestionList.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <div className="w-4.5 h-4.5 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5" style={{ width: '18px', height: '18px' }}>
                      <span className="text-blue-600 font-semibold text-[10px]">{i + 1}</span>
                    </div>
                    <p className="text-muted-foreground leading-snug">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
