// Client-side storage functions - safe to import in client components
import { supabase } from '@/lib/supabase'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './storage-utils'

// Re-export utility functions for backward compatibility
export { formatFileSize, validateFile } from './storage-utils'

const BUCKET_NAME = 'dev-task-attachments'

// Client-side upload (for browser)
export async function uploadTaskAttachment(
  file: File,
  taskId: string,
  userId: string
): Promise<{ path: string; url: string }> {
  

  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }

  // Generate unique file path
  const fileExt = file.name.split('.').pop()
  const fileName = `${taskId}/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `tasks/${fileName}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading file:', error)
    throw error
  }

  // Get public URL (or signed URL if bucket is private)
  const { data: urlData } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, 31536000) // 1 year expiry

  return {
    path: filePath,
    url: urlData?.signedUrl || ''
  }
}

// Generate signed URL for viewing an attachment
export async function getAttachmentSignedUrl(
  filePath: string,
  expiresIn = 3600
): Promise<string> {
  

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }

  return data.signedUrl
}

// Delete file from storage
export async function deleteAttachmentFile(filePath: string): Promise<void> {
  

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}



