"use client"

import { Card } from "@/components/ui/card"
import { Target, Users } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface InterestGroup {
  name: string
  audienceSize: string
}

interface TargetingSectionProps {
  interestGroups?: InterestGroup[]
  demographics?: {
    gender?: string
    age?: string
    totalAudience?: string
  }
}

const defaultInterestGroups: InterestGroup[] = [
  { name: "Automobiles", audienceSize: "796.7M" },
  { name: "Sedan (automobile)", audienceSize: "93.4M" },
  { name: "Car tuning", audienceSize: "51.2M" },
  { name: "Compact car", audienceSize: "30.6M" },
  { name: "Crossover (automobile)", audienceSize: "23.0M" },
  { name: "City car", audienceSize: "11.4M" },
]

export function TargetingSection({ 
  interestGroups = defaultInterestGroups,
  demographics = { gender: "Unisex", age: "18-30", totalAudience: "1.0B" }
}: TargetingSectionProps) {
  return (
    <Card className="p-6 min-w-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Interest Groups */}
        <div>
          <h4 className="text-sm font-medium mb-3">Interest Groups</h4>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Interest</TableHead>
                  <TableHead className="h-10 text-right">Audience Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interestGroups.map((group, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {group.audienceSize}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Demographics */}
        <div>
          <h4 className="text-sm font-medium mb-3">Demographics</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Gender</div>
                <div className="font-medium">{demographics.gender}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="font-medium">{demographics.age}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Total Audience Size</div>
                <div className="font-medium">{demographics.totalAudience}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

