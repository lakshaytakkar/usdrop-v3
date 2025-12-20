"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ExternalLink, Calendar, Clock, Loader2, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Webinar } from "../data/webinars"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/contexts/onboarding-context"
import { UpsellDialog } from "@/components/ui/upsell-dialog"
import { LockOverlay } from "@/components/ui/lock-overlay"

interface WebinarModalProps {
  webinar: Webinar | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebinarModal({ webinar, open, onOpenChange }: WebinarModalProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [isUpsellOpen, setIsUpsellOpen] = useState(false)
  const { isFree } = useOnboarding()

  if (!webinar) return null

  const handleOpenUrl = async () => {
    setIsOpening(true)
    try {
      window.open(webinar.url, "_blank", "noopener,noreferrer")
      // Small delay to show loading state
      setTimeout(() => setIsOpening(false), 500)
    } catch (error) {
      setIsOpening(false)
    }
  }

  // Parse description to extract checkpoints
  const parseDescription = (description: string) => {
    const parts = description.split("✅")
    if (parts.length === 1) {
      // No checkpoints, return as is
      return { intro: description, checkpoints: [] }
    }
    const intro = parts[0].trim()
    const checkpoints = parts.slice(1).map(cp => cp.trim()).filter(cp => cp.length > 0)
    return { intro, checkpoints }
  }

  const { intro, checkpoints } = parseDescription(webinar.description)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background border-border">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2 text-foreground">{webinar.title}</DialogTitle>
              <DialogDescription className="text-base mt-2 text-muted-foreground">
                {intro}
              </DialogDescription>
              {checkpoints.length > 0 && (
                <div className="mt-4 space-y-2">
                  {checkpoints.map((checkpoint, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{checkpoint}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Badge variant={webinar.isUpcoming ? "default" : "secondary"} className="shrink-0">
              {webinar.isUpcoming ? "Upcoming" : "Past"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{format(webinar.date, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Duration: {webinar.duration}</span>
          </div>

          <div className="pt-4 border-t border-border">
            {webinar.isUpcoming ? (
              <button
                onClick={handleOpenUrl}
                disabled={isOpening}
                className={cn(
                  "group relative w-full h-10 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer",
                  "flex items-center justify-center gap-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                <span className="relative flex items-center justify-center gap-2 z-10">
                  {isOpening ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Opening...
                    </>
                  ) : (
                    <>
                      Join Webinar
                      <ExternalLink className="h-4 w-4 text-white" />
                    </>
                  )}
                </span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={handleOpenUrl}
                  disabled={isOpening || (isFree && !webinar.isUpcoming)}
                  className={cn(
                    "group relative w-full h-10 rounded-md text-sm font-medium text-white transition-all duration-300",
                    "flex items-center justify-center gap-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    !isFree || webinar.isUpcoming ? "cursor-pointer" : "cursor-not-allowed"
                  )}
                >
                  <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                  <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                  <span className="relative flex items-center justify-center gap-2 z-10">
                    {isOpening ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Opening...
                      </>
                    ) : (
                      <>
                        Watch Recording
                        <ExternalLink className="h-4 w-4 text-white" />
                      </>
                    )}
                  </span>
                </button>
                {isFree && !webinar.isUpcoming && (
                  <LockOverlay 
                    onClick={() => setIsUpsellOpen(true)}
                    variant="button"
                    size="sm"
                    className="rounded-md"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      
      {/* Upsell Dialog */}
      <UpsellDialog 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
      />
    </Dialog>
  )
}

