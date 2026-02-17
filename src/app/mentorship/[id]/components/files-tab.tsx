"use client"

import { CourseChapter } from "@/types/courses"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilesTabProps {
  chapter: CourseChapter
}

export function FilesTab({ chapter }: FilesTabProps) {
  const resources = chapter.resources || []

  const handleDownload = (resource: { name: string; url: string }) => {
    window.open(resource.url, '_blank')
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No files available for this chapter.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Files</h3>
      <div className="space-y-2">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <Download className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{resource.name}</p>
              {resource.size && (
                <p className="text-xs text-muted-foreground">{resource.size}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(resource)}
            >
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}







