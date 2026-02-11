/**
 * Migration Script: Upload Public Assets to Supabase Storage
 * 
 * This script uploads static assets from the public/ folder to Supabase Storage
 * for better performance via CDN. Run this once to migrate your assets.
 * 
 * Usage: npx tsx scripts/migrate-assets-to-supabase.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const BUCKET_NAME = 'static-assets'

// Asset folders to migrate (relative to public/)
const ASSET_FOLDERS = [
  'christmas-icons',
  '3d-icons',
  '3d-ecom-icons-blue',
  '3d-characters-ecom',
  'categories',
  // Add more folders as needed
]

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  console.error('   Set them in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Convert public folder path to storage path
 */
function publicPathToStoragePath(filePath: string, publicDir: string): string {
  // Get relative path from public directory
  const relativePath = path.relative(publicDir, filePath).replace(/\\/g, '/')
  
  if (relativePath.startsWith('christmas-icons/')) {
    return `icons/christmas/${relativePath.replace('christmas-icons/', '')}`
  }
  if (relativePath.startsWith('3d-icons/')) {
    return `icons/3d/${relativePath.replace('3d-icons/', '')}`
  }
  if (relativePath.startsWith('3d-ecom-icons-blue/')) {
    return `icons/3d-ecom/${relativePath.replace('3d-ecom-icons-blue/', '')}`
  }
  if (relativePath.startsWith('3d-characters-ecom/')) {
    return `characters/${relativePath.replace('3d-characters-ecom/', '')}`
  }
  if (relativePath.startsWith('categories/')) {
    return `categories/${relativePath.replace('categories/', '')}`
  }
  
  return `assets/${relativePath}`
}

/**
 * Get content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.json': 'application/json',
  }
  return contentTypes[ext] || 'application/octet-stream'
}

/**
 * Ensure bucket exists and is public
 */
async function ensureBucket() {
  console.log(`📦 Checking bucket: ${BUCKET_NAME}...`)
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error(`   ⚠️  Error listing buckets: ${listError.message}`)
      console.log(`   Attempting to create bucket anyway...`)
      
      // Try to create the bucket directly
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make bucket public for CDN access
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'application/json'],
      })
      
      if (error) {
        // If bucket already exists, that's fine
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`   ✓ Bucket already exists`)
          return
        }
        throw new Error(`Failed to create bucket: ${error.message}`)
      }
      
      console.log(`   ✓ Bucket created`)
      return
    }
    
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME)
    
    if (!bucketExists) {
      console.log(`   Creating bucket: ${BUCKET_NAME}...`)
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true, // Make bucket public for CDN access
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'application/json'],
      })
      
      if (error) {
        // If bucket already exists, that's fine
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`   ✓ Bucket already exists`)
          return
        }
        throw new Error(`Failed to create bucket: ${error.message}`)
      }
      
      console.log(`   ✓ Bucket created`)
    } else {
      console.log(`   ✓ Bucket exists`)
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    console.error(`   Please check:`)
    console.error(`   1. NEXT_PUBLIC_SUPABASE_URL is correct`)
    console.error(`   2. SUPABASE_SERVICE_ROLE_KEY is correct`)
    console.error(`   3. You have network connectivity`)
    throw error
  }
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Upload a single file
 */
async function uploadFile(filePath: string, publicDir: string): Promise<boolean> {
  try {
    const storagePath = publicPathToStoragePath(filePath, publicDir)
    const fileBuffer = fs.readFileSync(filePath)
    const contentType = getContentType(filePath)
    
    // Get directory path for listing
    const dirPath = storagePath.split('/').slice(0, -1).join('/')
    const fileName = storagePath.split('/').pop() || ''
    
    // Check if file already exists (skip check to speed up, just use upsert)
    
    // Upload with retry logic
    let retries = 3
    while (retries > 0) {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, fileBuffer, {
            contentType,
            upsert: true,
            cacheControl: '3600',
          })
        
        if (error) {
          // If it's a duplicate error, that's actually success
          if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            console.log(`   ✓ Already exists: ${storagePath}`)
            return true
          }
          
          // If it's a JSON parse error, might be a permission issue
          if (error.message.includes('JSON') || error.message.includes('<!DOCTYPE')) {
            console.error(`   ✗ Error uploading ${storagePath}: Bucket may not be public or permission issue`)
            console.error(`      Please check: Supabase Dashboard → Storage → ${BUCKET_NAME} → Make it public`)
            return false
          }
          
          // Retry on network errors
          if (error.message.includes('fetch failed') || error.message.includes('network')) {
            retries--
            if (retries > 0) {
              console.log(`   ⏳ Retrying upload (${retries} attempts left)...`)
              await delay(1000) // Wait 1 second before retry
              continue
            }
          }
          
          console.error(`   ✗ Error uploading ${storagePath}: ${error.message}`)
          return false
        }
        
        console.log(`   ✓ Uploaded: ${storagePath}`)
        return true
      } catch (uploadError) {
        retries--
        if (retries > 0) {
          console.log(`   ⏳ Retrying upload (${retries} attempts left)...`)
          await delay(1000)
          continue
        }
        throw uploadError
      }
    }
    
    return false
  } catch (error) {
    console.error(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath)
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })
  
  return arrayOfFiles
}

/**
 * Main migration function
 */
async function migrateAssets() {
  console.log('🚀 Starting asset migration to Supabase Storage...\n')
  
  const publicDir = path.join(process.cwd(), 'public')
  
  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Public directory not found: ${publicDir}`)
    process.exit(1)
  }
  
  // Ensure bucket exists
  await ensureBucket()
  console.log('')
  
  let totalFiles = 0
  let uploadedFiles = 0
  let skippedFiles = 0
  let failedFiles = 0
  
  // Process each asset folder
  for (const folder of ASSET_FOLDERS) {
    const folderPath = path.join(publicDir, folder)
    
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Folder not found: ${folder}`)
      continue
    }
    
    console.log(`📁 Processing: ${folder}/`)
    const files = getAllFiles(folderPath)
    
    for (const file of files) {
      totalFiles++
      const success = await uploadFile(file, publicDir)
      
      if (success) {
        uploadedFiles++
      } else {
        failedFiles++
      }
      
      // Small delay to avoid rate limiting
      await delay(100)
    }
    
    console.log('')
  }
  
  // Summary
  console.log('📊 Migration Summary:')
  console.log(`   Total files: ${totalFiles}`)
  console.log(`   ✓ Uploaded: ${uploadedFiles}`)
  console.log(`   ⏭️  Skipped (already exists): ${skippedFiles}`)
  console.log(`   ✗ Failed: ${failedFiles}`)
  console.log('')
  
  if (failedFiles === 0) {
    console.log('✅ Migration completed successfully!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('   1. Update your components to use getStorageUrl() from src/lib/supabase/storage.ts')
    console.log('   2. Add Supabase Storage domain to next.config.ts remotePatterns')
    console.log('   3. Test your application to ensure images load correctly')
  } else {
    console.log('⚠️  Migration completed with errors. Please review the failed files above.')
  }
}

// Run migration
migrateAssets().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

