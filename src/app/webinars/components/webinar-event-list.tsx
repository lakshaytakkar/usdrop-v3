"use client"

import { format } from "date-fns"
import { Calendar, Clock, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Webinar } from "../data/webinars"
import { cn } from "@/lib/utils"

interface WebinarEventListProps {
  upcomingWebinars: Webinar[]
  pastWebinars: Webinar[]
  onWebinarClick: (webinar: Webinar) => void
  isLoading?: boolean
}

export function WebinarEventList({
  upcomingWebinars,
  pastWebinars,
  onWebinarClick,
  isLoading = false,
}: WebinarEventListProps) {
  const displayUpcoming = upcomingWebinars.slice(0, 5)
  const displayPast = pastWebinars.slice(0, 5)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border transition-all duration-200 ease-in-out">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-border">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upcoming Webinars */}
      {displayUpcoming.length > 0 && (
        <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md" data-upcoming-webinars>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Video className="h-4 w-4 text-primary" />
              Upcoming Webinars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayUpcoming.map((webinar) => (
              <button
                key={webinar.id}
                onClick={() => onWebinarClick(webinar)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all duration-200 ease-in-out",
                  "bg-background border-border hover:bg-accent hover:border-primary/50 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm line-clamp-2 flex-1 text-foreground">
                    {webinar.title}
                  </h4>
                  <Badge variant="default" className="shrink-0">
                    Upcoming
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(webinar.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(webinar.date, "h:mm a")}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Duration: {webinar.duration}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Past Webinars */}
      {displayPast.length > 0 && (
        <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md" data-past-webinars>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-foreground">
              <Video className="h-4 w-4 text-muted-foreground" />
              Past Webinars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayPast.map((webinar) => (
              <button
                key={webinar.id}
                onClick={() => onWebinarClick(webinar)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-all duration-200 ease-in-out",
                  "bg-background border-border hover:bg-accent hover:border-muted-foreground/50 hover:shadow-sm",
                  "focus:outline-none focus:ring-2 focus:ring-muted-foreground focus:ring-offset-2"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm line-clamp-2 flex-1 text-foreground">
                    {webinar.title}
                  </h4>
                  <Badge variant="secondary" className="shrink-0">
                    Past
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(webinar.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(webinar.date, "h:mm a")}</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Duration: {webinar.duration}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {displayUpcoming.length === 0 && displayPast.length === 0 && (
        <Card className="bg-card border-border transition-all duration-200 ease-in-out">
          <CardContent className="p-6 text-center">
            <Video className="h-8 w-8 mx-auto mb-2 opacity-50 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No webinars available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

