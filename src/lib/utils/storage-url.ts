/**
 * Storage URL Helper
 * 
 * Utility to get asset URLs from either Supabase Storage (CDN) or local public folder
 * Use this in your components for flexible asset loading.
 */

import { getStorageUrl, publicPathToStoragePath } from '@/lib/supabase/storage'

// Set to true after running migration script
// Default to true since we've migrated the assets
const USE_SUPABASE_STORAGE = process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE !== 'false'

/**
 * Get the URL for a static asset
 * Automatically uses Supabase Storage if enabled, otherwise falls back to public folder
 * 
 * @param publicPath - Path relative to public folder (e.g., '/christmas-icons/Object 01.png')
 * @returns Full URL to the asset
 */
export function getAssetUrl(publicPath: string): string {
  if (USE_SUPABASE_STORAGE) {
    // Use Supabase Storage CDN
    const storagePath = publicPathToStoragePath(publicPath)
    return getStorageUrl(storagePath)
  }
  
  // Fallback to local public folder
  return publicPath
}

/**
 * Check if Supabase Storage is enabled
 */
export function isStorageEnabled(): boolean {
  return USE_SUPABASE_STORAGE
}

