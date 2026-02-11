/**
 * Supabase Storage Utilities
 * 
 * Use this for managing static assets (images, icons, etc.) in Supabase Storage
 * which provides CDN benefits and faster loading times.
 */

import { createAdminClient } from './server'

const BUCKET_NAME = 'static-assets' // Create this bucket in Supabase Storage

/**
 * Get the public URL for an asset in Supabase Storage
 * @param path - Path to the asset (e.g., 'icons/christmas/Object 01.png')
 * @returns Public CDN URL
 */
export function getStorageUrl(path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  
  // Supabase Storage public URL format
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`
}

/**
 * Upload a file to Supabase Storage
 * @param filePath - Local file path
 * @param storagePath - Path in storage bucket (e.g., 'icons/christmas/Object 01.png')
 * @param fileBuffer - File buffer or Blob
 * @returns Public URL if successful
 */
export async function uploadToStorage(
  storagePath: string,
  fileBuffer: Buffer | Blob,
  contentType: string = 'image/png'
): Promise<string> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType,
      upsert: true, // Overwrite if exists
    })

  if (error) {
    throw new Error(`Failed to upload to storage: ${error.message}`)
  }

  return getStorageUrl(storagePath)
}

/**
 * Check if a file exists in storage
 */
export async function fileExists(storagePath: string): Promise<boolean> {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(storagePath.split('/').slice(0, -1).join('/'), {
      search: storagePath.split('/').pop(),
    })

  return !error && (data?.length ?? 0) > 0
}

/**
 * Delete a file from storage
 */
export async function deleteFromStorage(storagePath: string): Promise<void> {
  const supabase = createAdminClient()
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath])

  if (error) {
    throw new Error(`Failed to delete from storage: ${error.message}`)
  }
}

/**
 * Helper to convert public folder path to storage path
 * Example: '/christmas-icons/Object 01.png' -> 'icons/christmas/Object 01.png'
 */
export function publicPathToStoragePath(publicPath: string): string {
  // Remove leading slash and convert to storage structure
  const cleanPath = publicPath.startsWith('/') ? publicPath.slice(1) : publicPath
  
  // Organize by asset type
  if (cleanPath.startsWith('christmas-icons/')) {
    return `icons/christmas/${cleanPath.replace('christmas-icons/', '')}`
  }
  if (cleanPath.startsWith('3d-icons/')) {
    return `icons/3d/${cleanPath.replace('3d-icons/', '')}`
  }
  if (cleanPath.startsWith('3d-ecom-icons-blue/')) {
    return `icons/3d-ecom/${cleanPath.replace('3d-ecom-icons-blue/', '')}`
  }
  if (cleanPath.startsWith('3d-characters-ecom/')) {
    return `characters/${cleanPath.replace('3d-characters-ecom/', '')}`
  }
  if (cleanPath.startsWith('categories/')) {
    return `categories/${cleanPath.replace('categories/', '')}`
  }
  
  // Default: keep structure but move to assets/
  return `assets/${cleanPath}`
}



