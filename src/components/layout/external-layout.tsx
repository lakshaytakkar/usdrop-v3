"use client"

import { AppTopNavigation } from "@/components/layout/app-top-navigation"
import { SubNavTabs } from "@/components/layout/sub-nav-tabs"

interface ExternalLayoutProps {
  children: React.ReactNode
  showSubNav?: boolean
}

export function ExternalLayout({ children, showSubNav = true }: ExternalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <AppTopNavigation />
      {showSubNav && <SubNavTabs />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
