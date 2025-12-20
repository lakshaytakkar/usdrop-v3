"use client"

import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  iconBg = "bg-white",
  iconColor = "text-[#1A1B25]"
}: StatCardProps) {
  return (
    <div className="bg-[#f6f8fa] border border-[#e2e2ee] rounded-lg shadow-sm overflow-hidden">
      <Card className="border-b border-[#e2e2ee] rounded-b-none bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "size-8 rounded-lg border border-black/8 shadow-sm flex items-center justify-center",
                iconBg
              )}>
                <Icon className={cn("size-4", iconColor)} />
              </div>
              <p className="text-xs font-medium text-[#6f6f77] leading-[1.55]">
                {title}
              </p>
            </div>
            <button className="size-8 rounded-lg border border-black/8 shadow-sm flex items-center justify-center bg-white hover:bg-gray-50">
              <svg className="size-4 text-[#1A1B25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
          </div>
          <p className="text-2xl font-semibold text-[#111113] leading-[1.2]">
            {value}
          </p>
        </CardContent>
      </Card>
      {trend && (
        <div className="px-4 py-3 bg-[#f6f8fa]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className={cn(
                "size-3",
                trend.isPositive ? "text-[#07c433]" : "text-[#d73e3d] rotate-180"
              )} />
              <p className={cn(
                "text-sm font-medium leading-[1.2]",
                trend.isPositive ? "text-[#07c433]" : "text-[#d73e3d]"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </p>
            </div>
            <p className="text-xs text-[#111113] font-normal leading-normal tracking-[-0.24px]">
              than last month
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

