

import { useState, useMemo } from "react"
import { format, startOfDay, isSameDay } from "date-fns"
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
    <>
        <div className="flex flex-1 flex-col gap-2 p-4 md:p-6 min-h-0">

          {/* Main Content: Calendar and Event List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Calendar Section - 2/3 width on large screens */}
            <div className="lg:col-span-2 flex flex-col min-h-0">
              <Card className="bg-card border-border flex-shrink-0">
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
              <Card className="mt-3 bg-card border-border flex-shrink-0">
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

      {/* Webinar Modal */}
      <WebinarModal
        webinar={selectedWebinar}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  )
}

