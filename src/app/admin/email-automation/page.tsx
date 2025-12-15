"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Droplets } from "lucide-react"
import { EmailStatsCards } from "./components/email-stats-cards"
import { EmailTouchpoints } from "./components/email-touchpoints"
import { sampleAutomations } from "./automations/data/automations"
import { sampleDrips } from "./drips/data/drips"

export default function EmailAutomationDashboard() {
  const router = useRouter()
  
  // Calculate stats from sample data
  const stats = useMemo(() => {
    const totalSent = sampleAutomations.reduce((sum, auto) => sum + (auto.stats?.totalSent || 0), 0) +
                     sampleDrips.reduce((sum, drip) => sum + (drip.stats?.totalSent || 0), 0)
    
    const totalOpened = sampleAutomations.reduce((sum, auto) => sum + (auto.stats?.totalOpened || 0), 0) +
                       sampleDrips.reduce((sum, drip) => sum + (drip.stats?.totalOpened || 0), 0)
    
    const totalClicked = sampleAutomations.reduce((sum, auto) => sum + (auto.stats?.totalClicked || 0), 0) +
                        sampleDrips.reduce((sum, drip) => sum + (drip.stats?.totalClicked || 0), 0)
    
    const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0
    const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0
    
    const activeAutomations = sampleAutomations.filter(a => a.isActive).length
    const activeDrips = sampleDrips.filter(d => d.isActive).length
    
    return {
      totalSent,
      openRate: Number(openRate.toFixed(1)),
      clickRate: Number(clickRate.toFixed(1)),
      activeCampaigns: activeAutomations + activeDrips,
      activeAutomations,
      activeDrips,
      templates: 16, // From sample data
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Email Automation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage email templates, automations, drip campaigns, and view logs
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <EmailStatsCards
        totalSent={stats.totalSent}
        openRate={stats.openRate}
        clickRate={stats.clickRate}
        activeCampaigns={stats.activeCampaigns}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-6 mt-6">
        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors" 
          onClick={() => router.push('/admin/email-automation/templates')}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Templates</CardTitle>
                <p className="text-xs text-muted-foreground">{stats.templates} templates</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push('/admin/email-automation/automations')}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Automations</CardTitle>
                <p className="text-xs text-muted-foreground">{stats.activeAutomations} active</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => router.push('/admin/email-automation/drips')}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Droplets className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Drip Campaigns</CardTitle>
                <p className="text-xs text-muted-foreground">{stats.activeDrips} active</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Touchpoints Section */}
      <EmailTouchpoints />
    </div>
  )
}














