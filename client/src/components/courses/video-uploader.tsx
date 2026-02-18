

import { useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Video, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface VideoUploaderProps {
  courseId: string
  moduleId: string
  chapterId: string
  onUploadComplete?: (videoUrl: string, storagePath: string) => void
  onUploadError?: (error: string) => void
  existingVideoUrl?: string | null
  className?: string
}

// Generate a temporary UUID for new chapters
function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

export function VideoUploader({
  courseId,
  moduleId,
  chapterId,
  onUploadComplete,
  onUploadError,
  existingVideoUrl,
  className,
}: VideoUploaderProps) {
  // Generate and memoize temp ID for new chapters
  const tempChapterId = useMemo(() => {
    if (chapterId === 'new') {
      return generateTempId()
    }
    return chapterId
  }, [chapterId])

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(existingVideoUrl || null)
  const [uploadedVideoPath, setUploadedVideoPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = 'Invalid file type. Only MP4, WebM, OGG, and QuickTime videos are allowed.'
        setError(errorMsg)
        if (onUploadError) {
          onUploadError(errorMsg)
        }
        return
      }

      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024
      if (file.size > maxSize) {
        const errorMsg = 'File size exceeds maximum allowed size of 500MB'
        setError(errorMsg)
        if (onUploadError) {
          onUploadError(errorMsg)
        }
        return
      }

      setUploading(true)
      setProgress(0)
      setError(null)

      try {
        // Create FormData
        const formData = new FormData()
        formData.append('file', file)

        // Upload to API
        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            setProgress(percentComplete)
          }
        })

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            setUploadedVideo(response.video.url)
            setUploadedVideoPath(response.video.path)
            setProgress(100)
            setUploading(false)

            if (onUploadComplete) {
              onUploadComplete(response.video.url, response.video.path)
            }
          } else {
            const errorResponse = JSON.parse(xhr.responseText || '{}')
            const errorMsg = errorResponse.error || 'Upload failed'
            setError(errorMsg)
            setUploading(false)
            if (onUploadError) {
              onUploadError(errorMsg)
            }
          }
        })

        // Handle errors
        xhr.addEventListener('error', () => {
          const errorMsg = 'Network error during upload'
          setError(errorMsg)
          setUploading(false)
          if (onUploadError) {
            onUploadError(errorMsg)
          }
        })

        // Send request using temp chapter ID if chapter is new
        xhr.open(
          'POST',
          `/api/admin/courses/${courseId}/modules/${moduleId}/chapters/${tempChapterId}/upload-video`
        )
        xhr.send(formData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMsg)
        setUploading(false)
        if (onUploadError) {
          onUploadError(errorMsg)
        }
      }
    },
    [courseId, moduleId, tempChapterId, onUploadComplete, onUploadError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg', '.mov'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  const handleRemove = () => {
    setUploadedVideo(null)
    setUploadedVideoPath(null)
    setError(null)
    setProgress(0)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {uploadedVideo ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Video uploaded successfully
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {uploadedVideo}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-green-600 hover:text-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary/50',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading video...</p>
                <Progress value={progress} className="w-full max-w-md mx-auto" />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress)}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive
                    ? 'Drop video here'
                    : 'Drag & drop a video file here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse (MP4, WebM, OGG, QuickTime)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum file size: 500MB
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Select Video
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}

