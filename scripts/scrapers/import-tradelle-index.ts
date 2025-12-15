/**
 * Import Tradelle Index products into Supabase
 * Usage: npx tsx scripts/scrapers/import-tradelle-index.ts
 */

import { createClient } from '@supabase/supabase-js'
import { promises as fs } from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Use service role key to bypass RLS for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface IndexProduct {
  title: string
  imageUrl: string
  cost: string
  price: string
  productUrl: string
}

/**
 * Parse price string to number
 */
function parsePrice(price: string): number {
  if (!price) return 0
  const cleaned = price.replace(/[^0-9.]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Generate random trend data for demo purposes
 */
function generateTrendData(): number[] {
  const base = Math.floor(Math.random() * 100) + 50
  return Array.from({ length: 7 }, () =>
    Math.floor(base + (Math.random() - 0.5) * 40)
  )
}

/**
 * Generate random revenue trend
 */
function generateRevenueTrend(): number[] {
  const base = Math.floor(Math.random() * 5000) + 1000
  return Array.from({ length: 6 }, () =>
    Math.floor(base + (Math.random() - 0.5) * 1000)
  )
}

async function main() {
  console.log('========================================')
  console.log('  IMPORT TRADELLE INDEX PRODUCTS')
  console.log('========================================\n')

  // Read the scraped products
  const inputFile = path.join(process.cwd(), 'tradelle-index-products.json')
  console.log(`Reading products from: ${inputFile}`)

  let rawData: string
  try {
    rawData = await fs.readFile(inputFile, 'utf-8')
  } catch (err) {
    console.error(`Error reading file: ${inputFile}`)
    console.error('Make sure to run the index scraper first:')
    console.error('  npm run scraper:tradelle:index:100')
    process.exit(1)
  }

  const indexProducts: IndexProduct[] = JSON.parse(rawData)
  console.log(`Found ${indexProducts.length} products\n`)

  // Step 1: Check existing products from Tradelle
  console.log('Step 1: Checking for existing Tradelle products...')

  const { data: existingSources } = await supabase
    .from('product_source')
    .select('product_id, source_id')
    .eq('source_type', 'scraped')
    .like('source_id', '%tradelle.io%')

  const existingSourceIds = new Set(existingSources?.map(s => s.source_id) || [])
  console.log(`Found ${existingSourceIds.size} existing Tradelle products\n`)

  // Step 2: Filter out already imported products
  const newProducts = indexProducts.filter(p => !existingSourceIds.has(p.productUrl))
  console.log(`New products to import: ${newProducts.length}\n`)

  if (newProducts.length === 0) {
    console.log('No new products to import. All products already exist in database.')
    process.exit(0)
  }

  // Step 3: Insert new products
  console.log('Step 2: Inserting new products...\n')

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < newProducts.length; i++) {
    const product = newProducts[i]
    const productNum = i + 1

    const buyPrice = parsePrice(product.cost)
    const sellPrice = parsePrice(product.price)
    const profitPerOrder = sellPrice - buyPrice
    const profitMargin = sellPrice > 0 ? ((profitPerOrder / sellPrice) * 100) : 0

    console.log(`[${productNum}/${newProducts.length}] ${product.title.substring(0, 50)}...`)

    // Insert into products table
    const productData = {
      title: product.title,
      image: product.imageUrl,
      description: null, // Not available from index page
      category_id: null,
      buy_price: buyPrice,
      sell_price: sellPrice,
      additional_images: [product.imageUrl],
      specifications: null,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random 3.5-5.0
      reviews_count: Math.floor(Math.random() * 500) + 50,
      trend_data: generateTrendData(),
      supplier_id: null,
    }

    const { data: insertedProduct, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (productError) {
      console.error(`  Error inserting product: ${productError.message}`)
      failCount++
      continue
    }

    const newProductId = insertedProduct.id

    // Insert into product_metadata table
    const metadataData = {
      product_id: newProductId,
      is_winning: Math.random() > 0.7, // 30% chance of being marked winning
      is_locked: false,
      unlock_price: null,
      profit_margin: profitMargin,
      pot_revenue: Math.floor(Math.random() * 50000) + 10000,
      revenue_growth_rate: Math.round((Math.random() * 30 + 5) * 100) / 100,
      items_sold: Math.floor(Math.random() * 1000) + 100,
      avg_unit_price: sellPrice,
      revenue_trend: generateRevenueTrend(),
      found_date: new Date().toISOString().split('T')[0],
      detailed_analysis: null,
      filters: [],
    }

    const { error: metadataError } = await supabase
      .from('product_metadata')
      .insert(metadataData)

    if (metadataError) {
      console.error(`  Warning: Error inserting metadata: ${metadataError.message}`)
    }

    // Insert into product_source table
    const sourceData = {
      product_id: newProductId,
      source_type: 'scraped',
      source_id: product.productUrl,
      standardized_at: null,
      standardized_by: null,
    }

    const { error: sourceError } = await supabase
      .from('product_source')
      .insert(sourceData)

    if (sourceError) {
      console.error(`  Warning: Error inserting source: ${sourceError.message}`)
    }

    console.log(`  -> Inserted: $${buyPrice} -> $${sellPrice} (${profitMargin.toFixed(1)}% margin)`)
    successCount++
  }

  // Summary
  console.log('\n========================================')
  console.log('  IMPORT COMPLETE')
  console.log('========================================')
  console.log(`Total new products: ${newProducts.length}`)
  console.log(`Successfully imported: ${successCount}`)
  console.log(`Failed: ${failCount}`)

  // Verify by querying
  console.log('\nVerifying insertion...')
  const { data: products, count, error: queryError } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(5)

  if (queryError) {
    console.error('Error querying products:', queryError.message)
  } else {
    console.log(`\nTotal products in database: ${count}`)
    console.log('Latest 5 products:')
    products?.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.title.substring(0, 40)}... - $${p.sell_price}`)
    })
  }
}

main().catch(console.error)
