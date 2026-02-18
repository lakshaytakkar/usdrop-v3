

import { apiFetch } from '@/lib/supabase'
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, Download, Trash2, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatFileSize } from "@/lib/dev-tasks/storage"

async function fetchAttachments(taskId: string) {
  const response = await apiFetch(`/api/dev/tasks/${taskId}/attachments`)
  if (!response.ok) {
    throw new Error("Failed to fetch attachments")
  }
  return response.json()
}

export function TaskAttachments({ taskId }: { taskId: string }) {
  const [isUploading, setIsUploading] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()

  const { data: attachments, isLoading } = useQuery({
    queryKey: ["dev-task-attachments", taskId],
    queryFn: () => fetchAttachments(taskId),
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await apiFetch(`/api/dev/tasks/${taskId}/attachments`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      queryClient.invalidateQueries({ queryKey: ["dev-task-attachments", taskId] })
      showSuccess("The file has been uploaded successfully.")
      e.target.value = "" // Reset input
    } catch (error) {
      console.error("Error uploading file:", error)
      showError("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (attachmentId: string) => {
    if (!confirm("Are you sure you want to delete this attachment?")) {
      return
    }

    try {
      const response = await apiFetch(`/api/dev/tasks/${taskId}/attachments/${attachmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete attachment")
      }

      queryClient.invalidateQueries({ queryKey: ["dev-task-attachments", taskId] })
      showSuccess("The attachment has been deleted successfully.")
    } catch (error) {
      console.error("Error deleting attachment:", error)
      showError("Failed to delete attachment. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="space-y-3">
        <label htmlFor="file-upload" className="block">
          <div className="flex items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Click to upload or drag and drop</span>
          </div>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
        {isUploading && (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        )}
      </div>

      {/* Attachments List */}
      <div className="space-y-3">
        {attachments && attachments.length > 0 ? (
          attachments.map((attachment: any) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <File className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{attachment.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.file_size)} • {new Date(attachment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {attachment.signed_url && (
                  <a
                    href={attachment.signed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(attachment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No attachments yet. Upload a file to get started.</p>
        )}
      </div>
    </div>
  )
}




