import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import * as fs from 'fs'
import * as path from 'path'

// Default category mapping (used when file doesn't exist)
const defaultCategoryMapping: Record<string, { name: string }> = {
  "beauty": { name: "Beauty" },
  "electronics": { name: "Electronics" },
  "fashion": { name: "Fashion" },
  "gadgets": { name: "Gadgets" },
  "home-decor": { name: "Home Decor" },
  "home-garden": { name: "Home & Garden" },
  "kitchen": { name: "Kitchen" },
  "mother-kids": { name: "Mother & Kids" },
  "other": { name: "Other" },
  "pets": { name: "Pets" },
  "sports-fitness": { name: "Sports & Fitness" }
}

// Load category mapping lazily
function getCategoryMapping(): Record<string, { name: string }> {
  try {
    const mappingPath = path.join(process.cwd(), 'scripts', 'category-image-mapping.json')
    if (fs.existsSync(mappingPath)) {
      return JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))
    }
  } catch (error) {
    console.warn('Could not load category mapping file, using defaults:', error)
  }
  return defaultCategoryMapping
}

/**
 * POST /api/categories/update-images
 * Updates category images in the database based on the mapping file
 * This endpoint should be called after images are copied to public/categories
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access (optional - add your auth check here)
    // For now, we'll allow it but you may want to add authentication

    const results: Array<{ slug: string; success: boolean; error?: string }> = []

    const categoryMapping = getCategoryMapping()
    for (const [slug, category] of Object.entries(categoryMapping)) {
      const imageUrl = `/categories/${slug}.png`
      
      try {
        // First check if category exists
        const { data: existing } = await supabaseAdmin
          .from('categories')
          .select('id, name, slug')
          .eq('slug', slug)
          .maybeSingle()

        if (!existing) {
          results.push({
            slug,
            success: false,
            error: `Category with slug "${slug}" not found in database`
          })
          continue
        }

        // Update the category
        const { data, error } = await supabaseAdmin
          .from('categories')
          .update({ image: imageUrl })
          .eq('id', existing.id)
          .select('id, name')
          .single()

        if (error) {
          results.push({
            slug,
            success: false,
            error: error.message
          })
          continue
        }

        results.push({
          slug,
          success: true
        })
      } catch (err) {
        results.push({
          slug,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    return NextResponse.json({
      message: 'Category images updated',
      results,
      summary: {
        total: results.length,
        success: successCount,
        errors: errorCount
      }
    })
  } catch (error) {
    console.error('Error updating category images:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

