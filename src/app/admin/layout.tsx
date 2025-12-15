"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Toaster } from "@/components/ui/toast"
import { VerifyEmailBanner } from "@/components/verify-email-banner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <VerifyEmailBanner />
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-2 bg-gray-50/50">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}



