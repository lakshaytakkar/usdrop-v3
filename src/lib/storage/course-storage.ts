import { supabaseAdmin } from '@/lib/supabase/server'

export const STORAGE_BUCKETS = {
  COURSE_VIDEOS: 'course-videos',
  COURSE_ASSETS: 'course-assets',
} as const

export interface UploadVideoOptions {
  file: File | Buffer
  courseId: string
  moduleId: string
  chapterId: string
  filename?: string
  onProgress?: (progress: number) => void
}

export interface UploadAssetOptions {
  file: File | Buffer
  courseId: string
  filename?: string
  folder?: string
}

/**
 * Upload a course video to Supabase Storage
 * Supports temporary uploads when chapterId is "new" or starts with "temp-"
 */
export async function uploadCourseVideo(options: UploadVideoOptions): Promise<{
  url: string
  path: string
  size: number
  isTemp?: boolean
}> {
  const { file, courseId, moduleId, chapterId, filename, onProgress } = options

  // Check if this is a temporary upload
  const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-')
  
  // Generate unique filename if not provided
  const fileExtension = filename?.split('.').pop() || 'mp4'
  const timestamp = Date.now()
  const uniqueFilename = filename || `video_${timestamp}.${fileExtension}`
  
  // Path structure:
  // - Temp: courses/{courseId}/modules/{moduleId}/temp/{chapterId}/{filename}
  // - Final: courses/{courseId}/modules/{moduleId}/chapters/{chapterId}/{filename}
  const filePath = isTempUpload
    ? `courses/${courseId}/modules/${moduleId}/temp/${chapterId}/${uniqueFilename}`
    : `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}/${uniqueFilename}`

  // Convert File to Buffer if needed
  const buffer = file instanceof File 
    ? await file.arrayBuffer().then(buf => Buffer.from(buf))
    : file

  // Upload to Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .upload(filePath, buffer, {
      contentType: file instanceof File ? file.type : 'video/mp4',
      upsert: false, // Don't overwrite existing files
      cacheControl: '3600', // Cache for 1 hour
    })

  if (error) {
    throw new Error(`Failed to upload video: ${error.message}`)
  }

  // Get public URL (for private buckets, we'll use signed URLs)
  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .getPublicUrl(filePath)

  // Get file size
  const listPath = isTempUpload
    ? `courses/${courseId}/modules/${moduleId}/temp/${chapterId}`
    : `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`
  
  const { data: fileData } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .list(listPath, {
      limit: 1,
      search: uniqueFilename,
    })

  const size = fileData?.[0]?.metadata?.size || buffer.length

  return {
    url: urlData.publicUrl,
    path: filePath,
    size,
    isTemp: isTempUpload,
  }
}

/**
 * Get a signed URL for a private course video
 * Valid for specified duration (default 1 hour)
 */
export async function getVideoSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`)
  }

  return data.signedUrl
}

/**
 * Upload a course asset (thumbnail, image, etc.) to Supabase Storage
 */
export async function uploadCourseAsset(options: UploadAssetOptions): Promise<{
  url: string
  path: string
  size: number
}> {
  const { file, courseId, filename, folder = 'assets' } = options

  // Generate unique filename if not provided
  const fileExtension = filename?.split('.').pop() || 'jpg'
  const timestamp = Date.now()
  const uniqueFilename = filename || `asset_${timestamp}.${fileExtension}`
  
  // Path structure: courses/{courseId}/{folder}/{filename}
  const filePath = `courses/${courseId}/${folder}/${uniqueFilename}`

  // Convert File to Buffer if needed
  const buffer = file instanceof File 
    ? await file.arrayBuffer().then(buf => Buffer.from(buf))
    : file

  // Upload to Supabase Storage
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .upload(filePath, buffer, {
      contentType: file instanceof File ? file.type : 'image/jpeg',
      upsert: true, // Allow overwriting
      cacheControl: '86400', // Cache for 24 hours
    })

  if (error) {
    throw new Error(`Failed to upload asset: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .getPublicUrl(filePath)

  const size = buffer.length

  return {
    url: urlData.publicUrl,
    path: filePath,
    size,
  }
}

/**
 * Delete a course video from Supabase Storage
 */
export async function deleteCourseVideo(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .remove([filePath])

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`)
  }
}

/**
 * Delete a course asset from Supabase Storage
 */
export async function deleteCourseAsset(filePath: string): Promise<void> {
  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .remove([filePath])

  if (error) {
    throw new Error(`Failed to delete asset: ${error.message}`)
  }
}

/**
 * Move a video from temporary storage to final chapter location
 */
export async function moveVideoFromTemp(
  tempPath: string,
  courseId: string,
  moduleId: string,
  chapterId: string
): Promise<{
  url: string
  path: string
}> {
  // Extract filename from temp path
  const filename = tempPath.split('/').pop()
  if (!filename) {
    throw new Error('Invalid temp path: filename not found')
  }

  // Construct final path
  const finalPath = `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}/${filename}`

  // Download the file from temp location
  const { data: fileData, error: downloadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .download(tempPath)

  if (downloadError || !fileData) {
    throw new Error(`Failed to download temp video: ${downloadError?.message || 'Unknown error'}`)
  }

  // Convert blob to buffer
  const arrayBuffer = await fileData.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to final location
  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .upload(finalPath, buffer, {
      contentType: 'video/mp4', // Default, could be improved by detecting from original
      upsert: false,
      cacheControl: '3600',
    })

  if (uploadError) {
    throw new Error(`Failed to upload video to final location: ${uploadError.message}`)
  }

  // Delete temp file
  await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .remove([tempPath])
    .catch((err) => {
      console.warn('Failed to delete temp file (non-critical):', err)
      // Non-critical - continue even if temp deletion fails
    })

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .getPublicUrl(finalPath)

  return {
    url: urlData.publicUrl,
    path: finalPath,
  }
}

/**
 * List all videos for a specific chapter
 */
export async function listChapterVideos(
  courseId: string,
  moduleId: string,
  chapterId: string
): Promise<string[]> {
  const folderPath = `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`
  
  const { data, error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .list(folderPath)

  if (error) {
    throw new Error(`Failed to list videos: ${error.message}`)
  }

  return data?.map(file => `${folderPath}/${file.name}`) || []
}

