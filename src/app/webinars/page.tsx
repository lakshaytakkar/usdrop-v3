"use client"

import { useState, useMemo } from "react"
import { format, startOfDay, isSameDay } from "date-fns"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Webinar, sampleWebinars } from "./data/webinars"
import { WebinarModal } from "./components/webinar-modal"
import { WebinarEventList } from "./components/webinar-event-list"
import { cn } from "@/lib/utils"

export default function WebinarsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update isUpcoming based on current date
  const now = new Date()
  const webinarsWithStatus = useMemo(() => {
    return sampleWebinars.map((webinar) => ({
      ...webinar,
      isUpcoming: webinar.date > now,
    }))
  }, [])

  const upcomingWebinars = useMemo(
    () => webinarsWithStatus.filter((w) => w.isUpcoming).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [webinarsWithStatus]
  )

  const pastWebinars = useMemo(
    () => webinarsWithStatus.filter((w) => !w.isUpcoming).sort((a, b) => b.date.getTime() - a.date.getTime()),
    [webinarsWithStatus]
  )

  // Get dates with webinars
  const upcomingDates = useMemo(
    () => upcomingWebinars.map((w) => startOfDay(w.date)),
    [upcomingWebinars]
  )

  const pastDates = useMemo(
    () => pastWebinars.map((w) => startOfDay(w.date)),
    [pastWebinars]
  )

  // Find webinar for a specific date
  const getWebinarForDate = (date: Date): Webinar | null => {
    const dateStart = startOfDay(date)
    return (
      webinarsWithStatus.find((w) => isSameDay(startOfDay(w.date), dateStart)) || null
    )
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const webinar = getWebinarForDate(date)
    if (webinar) {
      setSelectedWebinar(webinar)
      setIsModalOpen(true)
    }
    setSelectedDate(date)
  }

  const handleWebinarClick = (webinar: Webinar) => {
    setSelectedWebinar(webinar)
    setIsModalOpen(true)
    setSelectedDate(webinar.date)
  }

  // Modifiers for calendar styling
  const modifiers = {
    upcoming: upcomingDates,
    past: pastDates,
  }

  const modifiersClassNames = {
    upcoming: "bg-black/25 text-white border-2 border-black/60 hover:bg-black/35 hover:border-black/80 font-semibold shadow-sm transition-all duration-200",
    past: "bg-muted/60 text-muted-foreground border-2 border-muted hover:bg-muted/80 hover:border-muted-foreground/50 transition-all duration-200",
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 bg-gray-50/50 min-h-0">
          {/* Premium Banner with grainy gradient */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-500 p-3 text-white h-[154px] flex-shrink-0">
            {/* Enhanced grainy texture layers */}
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                opacity: 0.5,
                mixBlendMode: 'overlay'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
                opacity: 0.4,
                mixBlendMode: 'multiply'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise3'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise3)'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                mixBlendMode: 'screen'
              }}
            ></div>
            <div 
              className="absolute inset-0 z-0"
              style={{
                background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.08) 1px, rgba(0,0,0,0.08) 2px),
                              repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)`,
                opacity: 0.6
              }}
            ></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4 h-full">
              {/* 3D Thumbnail */}
              <img
                src="/3d-ecom-icons-blue/Balloons_Surprise.png"
                alt="Webinars"
                width={110}
                height={110}
                className="w-[5.5rem] h-[5.5rem] md:w-[6.6rem] md:h-[6.6rem] flex-shrink-0 object-contain"
              />

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-2">USDrop Webinars</h2>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Join live webinars and watch recordings of past sessions.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                  onClick={() => {
                    // Scroll to past webinars section
                    const pastSection = document.querySelector('[data-past-webinars]')
                    pastSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">View Recordings</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm cursor-pointer"
                  onClick={() => {
                    // Scroll to upcoming webinars section
                    const upcomingSection = document.querySelector('[data-upcoming-webinars]')
                    upcomingSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Play className="h-3 w-3 mr-1" />
                  <span className="text-xs">Upcoming Events</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content: Calendar and Event List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calendar Section - 2/3 width on large screens */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md flex-shrink-0">
                <CardContent className="p-4 md:p-5">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={modifiers}
                    modifiersClassNames={modifiersClassNames}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Enhanced Legend */}
              <Card className="mt-3 bg-card border-border transition-all duration-200 ease-in-out hover:shadow-sm flex-shrink-0">
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-black/25 border-black/60 shadow-sm" />
                      <span className="text-foreground font-medium">Upcoming Webinar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 bg-muted/60 border-muted shadow-sm" />
                      <span className="text-foreground font-medium">Past Webinar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event List Sidebar - 1/3 width on large screens */}
            <div className="lg:col-span-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto">
                <WebinarEventList
                  upcomingWebinars={upcomingWebinars}
                  pastWebinars={pastWebinars}
                  onWebinarClick={handleWebinarClick}
                />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Webinar Modal */}
      <WebinarModal
        webinar={selectedWebinar}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </SidebarProvider>
  )
}

