"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Topbar } from "@/components/layout/topbar"
import { Skeleton } from "@/components/ui/skeleton"

interface PageLoadingProps {
  title?: string
}

export function PageLoading({ title }: PageLoadingProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-100/50">
          {title && (
            <h1 className="text-2xl font-bold">{title}</h1>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <Skeleton className="h-32 w-full mb-4 rounded-lg" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function ContentLoading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6">
            <Skeleton className="h-32 w-full mb-4 rounded-lg" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
