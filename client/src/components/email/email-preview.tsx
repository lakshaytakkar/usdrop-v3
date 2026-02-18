

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone } from "lucide-react"
import { renderTemplate, getSampleVariables } from "@/lib/email/template-engine"
import { cn } from "@/lib/utils"

interface EmailPreviewProps {
  htmlContent: string
  className?: string
}

export function EmailPreview({ htmlContent, className }: EmailPreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const sampleVariables = getSampleVariables()
  const renderedContent = renderTemplate(htmlContent, sampleVariables)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
            className="cursor-pointer"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="cursor-pointer"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "border rounded-lg bg-background overflow-auto",
          viewMode === 'desktop' ? "max-w-2xl" : "max-w-sm mx-auto"
        )}
        style={{
          maxHeight: '600px',
        }}
      >
        <div
          className="p-4"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      </div>
    </div>
  )
}














