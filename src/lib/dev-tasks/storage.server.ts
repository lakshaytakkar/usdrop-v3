// Server-side storage functions - only import this in server components and API routes
import { createClient as createServerClient } from '@/lib/supabase/server'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './storage-utils'

const BUCKET_NAME = 'dev-task-attachments'

// Server-side upload (for API routes)
export async function uploadTaskAttachmentServer(
  file: File | Buffer,
  fileName: string,
  taskId: string,
  userId: string,
  contentType: string
): Promise<{ path: string; url: string }> {
  const supabase = await createServerClient()

  // Validate file size if File object
  if (file instanceof File && file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  if (file instanceof Buffer && file.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate content type
  if (!ALLOWED_FILE_TYPES.includes(contentType)) {
    throw new Error(`File type ${contentType} is not allowed`)
  }

  // Generate unique file path
  const fileExt = fileName.split('.').pop()
  const uniqueFileName = `${taskId}/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `tasks/${uniqueFileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  // Get signed URL
  const { data: urlData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 31536000) // 1 year expiry

  return {
    path: filePath,
    url: urlData?.signedUrl || ''
  }
}

// Generate signed URL (server-side)
export async function getAttachmentSignedUrlServer(
  filePath: string,
  expiresIn = 3600
): Promise<string> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }

  return data.signedUrl
}

// Delete file from storage (server-side)
export async function deleteAttachmentFileServer(filePath: string): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}
