/**
 * Organize generated category images and update database
 * This script copies images from nano-banana output to public/categories
 * and updates the database with the new image URLs
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import categoryMapping from './category-image-mapping.json'

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znddcikjgrvmltruuvca.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required')
  console.error('Please set it in your environment variables or .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Paths
const nanoBananaImagesDir = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Documents', 'nano-banana-images')
const publicCategoriesDir = path.join(process.cwd(), 'public', 'categories')

// Ensure public/categories directory exists
if (!fs.existsSync(publicCategoriesDir)) {
  fs.mkdirSync(publicCategoriesDir, { recursive: true })
  console.log(`✓ Created directory: ${publicCategoriesDir}`)
}

/**
 * Copy image file and return the public URL
 */
function copyImageToPublic(sourceFile: string, categorySlug: string): string | null {
  try {
    const sourcePath = path.join(nanoBananaImagesDir, sourceFile)
    const destPath = path.join(publicCategoriesDir, `${categorySlug}.png`)
    
    if (!fs.existsSync(sourcePath)) {
      console.error(`   ✗ Source file not found: ${sourcePath}`)
      return null
    }
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath)
    console.log(`   ✓ Copied to: public/categories/${categorySlug}.png`)
    
    // Return public URL
    return `/categories/${categorySlug}.png`
  } catch (error) {
    console.error(`   ✗ Error copying image:`, error)
    return null
  }
}

/**
 * Update category image in database
 */
async function updateCategoryImage(categorySlug: string, imageUrl: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ image: imageUrl })
      .eq('slug', categorySlug)
      .select('id, name')
      .single()
    
    if (error) {
      console.error(`   ✗ Error updating category:`, error.message)
      return false
    }
    
    if (!data) {
      console.error(`   ✗ Category not found: ${categorySlug}`)
      return false
    }
    
    console.log(`   ✓ Updated database: ${data.name} (${data.id})`)
    return true
  } catch (error) {
    console.error(`   ✗ Error updating category:`, error)
    return false
  }
}

/**
 * Main function
 */
async function organizeImages() {
  console.log('🎨 Organizing category images...\n')
  console.log(`Source directory: ${nanoBananaImagesDir}`)
  console.log(`Destination directory: ${publicCategoriesDir}\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const [slug, category] of Object.entries(categoryMapping)) {
    console.log(`\n📦 Processing: ${category.name} (${slug})`)
    
    // Copy image to public directory
    const imageUrl = copyImageToPublic(category.imageFile, slug)
    
    if (!imageUrl) {
      errorCount++
      continue
    }
    
    // Update database
    const updated = await updateCategoryImage(slug, imageUrl)
    
    if (updated) {
      successCount++
    } else {
      errorCount++
    }
  }
  
  console.log(`\n✅ Complete!`)
  console.log(`   ✓ Successfully processed: ${successCount} categories`)
  if (errorCount > 0) {
    console.log(`   ✗ Errors: ${errorCount} categories`)
  }
}

// Run the script
organizeImages().catch(console.error)

