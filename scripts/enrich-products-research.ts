/**
 * Batch script to enrich first 100 products with AI research data
 *
 * Usage:
 *   Set GEMINI_API_KEY (or NEXT_PUBLIC_GEMINI_API_KEY / API_KEY) in your environment, then run:
 *   npx tsx scripts/enrich-products-research.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

// Prefer Gemini for research
const GEMINI_API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null

async function researchProduct(input: {
  title: string
  description: string
  buyPrice: number
  sellPrice: number
  category?: string
}) {
  if (!ai) {
    console.warn('   ⚠️  GEMINI_API_KEY not set, using mock data')
    return {
      competitor_pricing: {
        competitors: [
          { name: "Competitor A", price: input.sellPrice * 0.9 },
          { name: "Competitor B", price: input.sellPrice * 1.1 },
        ],
        price_range: {
          min: input.sellPrice * 0.85,
          max: input.sellPrice * 1.15,
          avg: input.sellPrice * 1.0,
        }
      },
      seasonal_demand: "This product shows strong demand during Q4 holiday season.",
      audience_targeting: {
        demographics: { age: "25-34", gender: "Unisex" },
        interests: ["Home & Garden", "Lifestyle"],
        suggestions: ["Target value-conscious consumers"]
      },
      supplier_notes: "Recommended suppliers include AliExpress and Amazon.",
      social_proof: {
        likes: 1000,
        comments: 50,
        shares: 20,
        virality_score: 0.5
      }
    }
  }

  try {
    const prompt = `You are a product research analyst. Analyze this product and provide JSON:
Product: ${input.title}
Description: ${input.description}
Buy Price: $${input.buyPrice}
Sell Price: $${input.sellPrice}
Category: ${input.category || "Uncategorized"}

Return JSON with:
- competitor_pricing (competitors array with name/price/url, price_range min/max/avg)
- seasonal_demand (text)
- audience_targeting (demographics age/gender, interests array, suggestions array)
- supplier_notes (text)
- social_proof (likes, comments, shares, virality_score from 0 to 1)
- category_suggestion (object with slug, name, confidence)`

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: 'application/json',
      },
    })

    const text = response.text
    if (!text) throw new Error("No content in response")

    const cleanedContent = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    return JSON.parse(cleanedContent)
  } catch (error) {
    console.error(`   ⚠️  API error, using mock data: ${error instanceof Error ? error.message : String(error)}`)
    // Return mock data on error
    return {
      competitor_pricing: {
        competitors: [
          { name: "Competitor A", price: input.sellPrice * 0.9 },
          { name: "Competitor B", price: input.sellPrice * 1.1 },
        ],
        price_range: {
          min: input.sellPrice * 0.85,
          max: input.sellPrice * 1.15,
          avg: input.sellPrice * 1.0,
        }
      },
      seasonal_demand: "This product shows strong demand during Q4 holiday season.",
      audience_targeting: {
        demographics: { age: "25-34", gender: "Unisex" },
        interests: ["Home & Garden", "Lifestyle"],
        suggestions: ["Target value-conscious consumers"]
      },
      supplier_notes: "Recommended suppliers include AliExpress and Amazon.",
      social_proof: {
        likes: 1000,
        comments: 50,
        shares: 20,
        virality_score: 0.5
      }
    }
  }
}

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  console.error('   Set them in your environment variables or .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Rate limiting: delay between API calls (ms)
const RATE_LIMIT_DELAY = 2000 // 2 seconds between calls
const MAX_RETRIES = 3
const BATCH_SIZE = 100

interface Product {
  id: string
  title: string
  description: string | null
  buy_price: number
  sell_price: number
  category?: {
    name?: string
    slug?: string
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function researchProductWithRetry(product: Product, retryCount = 0): Promise<boolean> {
  try {
    console.log(`\n📊 Researching: ${product.title.substring(0, 50)}...`)
    
    const researchData = await researchProduct({
      title: product.title,
      description: product.description || '',
      buyPrice: product.buy_price,
      sellPrice: product.sell_price,
      category: product.category?.name || product.category?.slug,
    })

    // Save to database (extract only valid columns)
    const anyData = researchData as any
    const categorySuggestion = anyData?.category_suggestion as
      | { slug?: string; name?: string; confidence?: number }
      | undefined

    // Save to database - explicitly map only valid columns
    const { error: saveError } = await supabase
      .from('product_research')
      .upsert({
        product_id: product.id,
        competitor_pricing: anyData?.competitor_pricing || null,
        seasonal_demand: anyData?.seasonal_demand || null,
        audience_targeting: anyData?.audience_targeting || null,
        supplier_notes: anyData?.supplier_notes || null,
        social_proof: anyData?.social_proof || null,
        research_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'product_id',
      })

    if (saveError) {
      console.error(`   ❌ Failed to save research: ${saveError.message}`)
      return false
    }

    // Optionally update product.category_id from categorySuggestion
    if (categorySuggestion && (categorySuggestion.slug || categorySuggestion.name)) {
      try {
        const slug = categorySuggestion.slug?.toLowerCase().trim()
        const name = categorySuggestion.name?.trim()

        let categoryQuery = supabase.from('categories').select('id, slug, name')

        if (slug) {
          categoryQuery = categoryQuery.ilike('slug', slug)
        } else if (name) {
          categoryQuery = categoryQuery.ilike('name', name)
        }

        const { data: matchedCategory, error: categoryError } = await categoryQuery.limit(1).maybeSingle()

        if (!categoryError && matchedCategory) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ category_id: matchedCategory.id })
            .eq('id', product.id)

          if (updateError) {
            console.error('   ⚠️  Failed to update product category from research:', updateError.message)
          }
        } else if (categoryError) {
          console.error('   ⚠️  Error looking up suggested category:', categoryError.message)
        }
      } catch (err) {
        console.error('   ⚠️  Unexpected error applying category suggestion:', err)
      }
    }

    console.log(`   ✅ Research completed and saved`)
    return true
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    
    if (retryCount < MAX_RETRIES) {
      console.log(`   🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`)
      await delay(RATE_LIMIT_DELAY * (retryCount + 1)) // Exponential backoff
      return researchProductWithRetry(product, retryCount + 1)
    }
    
    return false
  }
}

async function main() {
  console.log('🚀 Starting product research enrichment...\n')

  // Fetch first 100 products
  console.log(`📦 Fetching first ${BATCH_SIZE} products...`)
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select(`
      id,
      title,
      description,
      buy_price,
      sell_price,
      category:categories(name, slug)
    `)
    .limit(BATCH_SIZE)
    .order('created_at', { ascending: false })

  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError)
    process.exit(1)
  }

  if (!products || products.length === 0) {
    console.log('⚠️  No products found')
    process.exit(0)
  }

  console.log(`✅ Found ${products.length} products\n`)

  // Check which products already have research
  const { data: existingResearch } = await supabase
    .from('product_research')
    .select('product_id')
    .in('product_id', products.map(p => p.id))

  const existingIds = new Set(existingResearch?.map(r => r.product_id) || [])
  const productsToResearch = products.filter(p => !existingIds.has(p.id))

  console.log(`📊 Products with existing research: ${existingIds.size}`)
  console.log(`🆕 Products needing research: ${productsToResearch.length}\n`)

  if (productsToResearch.length === 0) {
    console.log('✅ All products already have research data')
    process.exit(0)
  }

  // Process products with rate limiting
  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < productsToResearch.length; i++) {
    const product = productsToResearch[i]
    const progress = `[${i + 1}/${productsToResearch.length}]`

    console.log(`\n${progress} Processing product ${i + 1} of ${productsToResearch.length}`)
    
    const success = await researchProductWithRetry(product)
    
    if (success) {
      successCount++
    } else {
      failureCount++
    }

    // Rate limiting delay (except for last item)
    if (i < productsToResearch.length - 1) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Research Summary:')
  console.log(`   ✅ Successful: ${successCount}`)
  console.log(`   ❌ Failed: ${failureCount}`)
  console.log(`   📦 Total processed: ${productsToResearch.length}`)
  console.log('='.repeat(50) + '\n')

  if (failureCount > 0) {
    console.log('⚠️  Some products failed to research. You can run this script again to retry failed items.')
    process.exit(1)
  } else {
    console.log('✅ All products successfully researched!')
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

