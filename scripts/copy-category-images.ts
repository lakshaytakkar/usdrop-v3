/**
 * Copy generated category images to public/categories folder
 * Run this script first, then use the API endpoint to update the database
 */

import * as fs from 'fs'
import * as path from 'path'
import categoryMapping from './category-image-mapping.json'

// Paths
const nanoBananaImagesDir = path.join(process.env.USERPROFILE || '', 'Documents', 'nano-banana-images')
const publicCategoriesDir = path.join(process.cwd(), 'public', 'categories')

// Ensure public/categories directory exists
if (!fs.existsSync(publicCategoriesDir)) {
  fs.mkdirSync(publicCategoriesDir, { recursive: true })
  console.log(`✓ Created directory: ${publicCategoriesDir}`)
}

/**
 * Copy image file to public directory
 */
function copyImageToPublic(sourceFile: string, categorySlug: string): boolean {
  try {
    const sourcePath = path.join(nanoBananaImagesDir, sourceFile)
    const destPath = path.join(publicCategoriesDir, `${categorySlug}.png`)
    
    if (!fs.existsSync(sourcePath)) {
      console.error(`   ✗ Source file not found: ${sourcePath}`)
      return false
    }
    
    // Copy file
    fs.copyFileSync(sourcePath, destPath)
    console.log(`   ✓ Copied: ${categorySlug}.png`)
    return true
  } catch (error) {
    console.error(`   ✗ Error copying image:`, error)
    return false
  }
}

/**
 * Main function
 */
function copyImages() {
  console.log('📁 Copying category images to public/categories...\n')
  console.log(`Source: ${nanoBananaImagesDir}`)
  console.log(`Destination: ${publicCategoriesDir}\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const [slug, category] of Object.entries(categoryMapping)) {
    console.log(`Processing: ${category.name} (${slug})`)
    
    if (copyImageToPublic(category.imageFile, slug)) {
      successCount++
    } else {
      errorCount++
    }
  }
  
  console.log(`\n✅ Complete!`)
  console.log(`   ✓ Successfully copied: ${successCount} images`)
  if (errorCount > 0) {
    console.log(`   ✗ Errors: ${errorCount} images`)
  }
  console.log(`\n📝 Next step: Run the API endpoint to update the database`)
  console.log(`   POST /api/categories/update-images`)
}

// Run the script
copyImages()

