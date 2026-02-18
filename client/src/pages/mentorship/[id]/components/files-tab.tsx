

import { CourseModule } from "@/types/courses"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilesTabProps {
  module: CourseModule
}

export function FilesTab({ module }: FilesTabProps) {
  const content = module.content
  const downloadableFiles = content?.downloadable_files || []

  if (downloadableFiles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No files available for this module.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Files</h3>
      <div className="space-y-2">
        {downloadableFiles.map((fileUrl, index) => {
          const fileName = fileUrl.split('/').pop() || `File ${index + 1}`
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Download className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(fileUrl, '_blank')}
              >
                Download
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
