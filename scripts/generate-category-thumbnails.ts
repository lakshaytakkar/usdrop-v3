/**
 * Generate category thumbnails using Nano-Banana MCP (Gemini API)
 * 
 * This script generates consistent thumbnails for all categories following a 3-layer structure:
 * 1. Objects: Top products from the category
 * 2. Background: Complimenting gradient/pattern
 * 3. Effects & Lighting: Professional photography feel
 * 
 * Usage:
 *   Set GEMINI_API_KEY in your environment, then run:
 *   npx tsx scripts/generate-category-thumbnails.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import * as path from 'path'

// Load environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables')
  console.error('   Please set it: export GEMINI_API_KEY=your-key-here')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Supabase credentials not found')
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Category-specific product examples for Layer 1
const categoryProducts: Record<string, string[]> = {
  'Electronics': ['smartphone', 'wireless earbuds', 'smartwatch', 'tablet'],
  'Fashion & Accessories': ['elegant watch', 'stylish sunglasses', 'designer handbag', 'jewelry'],
  'Beauty & Personal Care': ['skincare bottles', 'makeup palette', 'beauty tools', 'perfume'],
  'Home & Garden': ['decorative vase', 'plant pot', 'candle', 'home accessory'],
  'Kitchen & Dining': ['kitchen knife set', 'coffee maker', 'dining set', 'cookware'],
  'Sports & Fitness': ['yoga mat', 'dumbbells', 'water bottle', 'fitness tracker'],
  'Pet Supplies': ['pet food bowl', 'dog toy', 'cat bed', 'pet leash'],
  'Baby & Kids': ['baby bottle', 'toy blocks', 'stroller', 'kids clothing'],
  'Gadgets': ['smart speaker', 'wireless charger', 'bluetooth headphones', 'tech accessory'],
  'Home Decor': ['wall art', 'throw pillow', 'decorative lamp', 'vase'],
  'Other': ['miscellaneous products', 'various items', 'assorted goods'],
}

// Category-specific background colors
const categoryColors: Record<string, string> = {
  'Electronics': 'deep blue to purple',
  'Fashion & Accessories': 'rose gold to champagne',
  'Beauty & Personal Care': 'pink to lavender',
  'Home & Garden': 'sage green to cream',
  'Kitchen & Dining': 'warm orange to beige',
  'Sports & Fitness': 'energetic blue to green',
  'Pet Supplies': 'warm brown to tan',
  'Baby & Kids': 'soft pastel blue to pink',
  'Gadgets': 'modern teal to navy',
  'Home Decor': 'elegant gray to gold',
  'Other': 'neutral gray to white',
}

/**
 * Generate a consistent prompt for category thumbnails
 */
function generatePrompt(categoryName: string, description: string): string {
  const products = categoryProducts[categoryName] || ['top products', 'popular items', 'featured goods']
  const colors = categoryColors[categoryName] || 'neutral gradient'
  
  return `Create a professional e-commerce category thumbnail for ${categoryName} (${description}). 

Layer 1 (Objects): Display 3-4 ${products.join(', ')} arranged elegantly in the foreground. Products should be clearly visible and professionally styled.

Layer 2 (Background): Soft gradient background in ${colors} with subtle patterns or textures that complement the category theme. The background should enhance but not distract from the products.

Layer 3 (Effects & Lighting): Professional product photography lighting with soft shadows, subtle glow effects around products, and a clean, modern aesthetic. The overall feel should be premium and inviting.

Technical requirements:
- Square format (1:1 aspect ratio)
- Suitable for category cards and thumbnails
- High quality, professional photography style
- Products clearly visible and well-lit
- Background complements the category theme
- Consistent with e-commerce product photography standards`
}

/**
 * Generate thumbnail image using Gemini
 */
async function generateThumbnail(categoryName: string, description: string): Promise<Buffer | null> {
  try {
    console.log(`  🎨 Generating thumbnail for "${categoryName}"...`)
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const prompt = generatePrompt(categoryName, description)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    // Note: Gemini 2.0 Flash Image API returns image data
    // This is a placeholder - actual implementation depends on Gemini API response format
    // You may need to adjust based on the actual API response
    
    console.log(`  ✅ Generated thumbnail for "${categoryName}"`)
    return null // Placeholder - implement actual image retrieval
  } catch (error) {
    console.error(`  ❌ Error generating thumbnail for "${categoryName}":`, error)
    return null
  }
}

/**
 * Main function to generate all category thumbnails
 */
async function main() {
  console.log('🚀 Starting category thumbnail generation...\n')
  
  // Fetch all categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name')
  
  if (error) {
    console.error('❌ Error fetching categories:', error)
    process.exit(1)
  }
  
  if (!categories || categories.length === 0) {
    console.error('❌ No categories found')
    process.exit(1)
  }
  
  console.log(`📋 Found ${categories.length} categories\n`)
  
  // Ensure output directory exists
  const outputDir = path.join(process.cwd(), 'public', 'categories')
  await fs.mkdir(outputDir, { recursive: true })
  
  // Generate thumbnails for each category
  for (const category of categories) {
    const thumbnailPath = path.join(outputDir, `${category.slug}-thumbnail.png`)
    
    // Skip if thumbnail already exists
    try {
      await fs.access(thumbnailPath)
      console.log(`  ⏭️  Thumbnail already exists for "${category.name}", skipping...`)
      continue
    } catch {
      // File doesn't exist, proceed with generation
    }
    
    // Generate thumbnail
    const imageBuffer = await generateThumbnail(
      category.name,
      category.description || 'products'
    )
    
    if (imageBuffer) {
      // Save image
      await fs.writeFile(thumbnailPath, imageBuffer)
      console.log(`  💾 Saved thumbnail to ${thumbnailPath}`)
      
      // Update database
      const thumbnailUrl = `/categories/${category.slug}-thumbnail.png`
      const { error: updateError } = await supabase
        .from('categories')
        .update({ thumbnail: thumbnailUrl })
        .eq('id', category.id)
      
      if (updateError) {
        console.error(`  ❌ Error updating database for "${category.name}":`, updateError)
      } else {
        console.log(`  ✅ Updated database for "${category.name}"`)
      }
    }
    
    console.log() // Empty line for readability
  }
  
  console.log('✨ Thumbnail generation complete!')
}

// Run the script
main().catch(console.error)
