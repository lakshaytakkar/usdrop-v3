/**
 * Enrich All 225 Products with Realistic, Unique Data
 *
 * Phase A: Algorithmic generation (instant) — trend_data, rating, reviews_count,
 *          all product_metadata fields, competitor_pricing, social_proof
 * Phase B: AI-powered (Gemini batches) — specifications, seasonal_demand,
 *          audience_targeting, supplier_notes
 *
 * Usage:
 *   npx tsx scripts/enrich-all-product-data.ts
 */

import 'dotenv/config'
import postgres from 'postgres'
import { GoogleGenAI } from '@google/genai'

// --- Config ---
const AI_BATCH_SIZE = 25
const RATE_LIMIT_DELAY = 3000 // ms between Gemini calls

// --- DB ---
const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required in .env')
  process.exit(1)
}
const sql = postgres(DATABASE_URL, { max: 5, idle_timeout: 20 })

// --- Gemini ---
const GEMINI_API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required in .env')
  process.exit(1)
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

// --- Types ---
interface Product {
  id: string
  title: string
  buy_price: number
  sell_price: number
  profit_per_order: number
  category_name: string | null
}

interface AlgorithmicData {
  // products table
  trend_data: number[]
  rating: number
  reviews_count: number
  // product_metadata
  is_winning: boolean
  is_locked: boolean
  unlock_price: number | null
  profit_margin: number
  pot_revenue: number
  revenue_growth_rate: number
  items_sold: number
  avg_unit_price: number
  revenue_trend: number[]
  found_date: string
  filters: string[]
  // product_research partial
  competitor_pricing: object[]
  social_proof: object
}

interface AIData {
  specifications: Record<string, string>
  seasonal_demand: string
  audience_targeting: object
  supplier_notes: string
}

// --- Seeded RNG (deterministic per product UUID) ---
function seedFromUUID(uuid: string): number {
  let hash = 0
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

class SeededRNG {
  private state: number

  constructor(seed: number) {
    this.state = seed
  }

  // Returns float in [0, 1)
  next(): number {
    this.state = (this.state * 1664525 + 1013904223) & 0x7fffffff
    return this.state / 0x7fffffff
  }

  // Returns int in [min, max] inclusive
  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  // Returns float in [min, max)
  float(min: number, max: number): number {
    return this.next() * (max - min) + min
  }

  // Pick random item from array
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)]
  }

  // Pick N unique items from array
  pickN<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.int(0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, Math.min(n, shuffled.length))
  }

  // Returns true with given probability
  chance(probability: number): boolean {
    return this.next() < probability
  }
}

// --- Seasonal curves by category ---
const SEASONAL_CURVES: Record<string, number[]> = {
  // base monthly multipliers (Jan-Dec) — values are relative search interest
  'Electronics':     [70, 65, 60, 55, 60, 65, 70, 75, 80, 85, 90, 100],
  'Gadgets':         [75, 70, 65, 60, 65, 70, 75, 80, 85, 88, 92, 100],
  'Fashion':         [80, 75, 85, 90, 85, 70, 65, 75, 90, 85, 80, 95],
  'Beauty':          [70, 80, 85, 80, 90, 85, 75, 70, 80, 85, 90, 95],
  'Home & Garden':   [50, 55, 70, 85, 95, 100, 90, 80, 65, 55, 50, 60],
  'Home Decor':      [65, 60, 70, 75, 70, 65, 60, 70, 80, 85, 90, 100],
  'Health':          [100, 90, 80, 70, 65, 60, 65, 70, 75, 80, 75, 70],
  'Sports':          [90, 80, 75, 80, 90, 100, 95, 85, 75, 70, 65, 70],
  'Pet Supplies':    [75, 70, 75, 80, 85, 80, 75, 80, 85, 80, 85, 90],
  'Kids & Baby':     [80, 70, 75, 80, 75, 85, 80, 90, 85, 80, 90, 100],
  'Car Accessories': [60, 65, 75, 85, 90, 95, 100, 90, 80, 70, 60, 55],
  'Other':           [70, 72, 75, 78, 80, 82, 80, 78, 82, 85, 88, 90],
}

// Default curve for unknown categories
const DEFAULT_CURVE = [70, 72, 75, 78, 80, 82, 80, 78, 82, 85, 88, 90]

// Filter tag options
const FILTER_TAGS = [
  'trending', 'high-margin', 'best-seller', 'new-arrival',
  'staff-pick', 'viral', 'low-competition', 'seasonal',
]

// Competitor store names
const COMPETITORS = ['Amazon', 'eBay', 'AliExpress', 'Walmart', 'Temu']

// --- Helpers ---
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

function roundTo(n: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

// --- Phase A: Algorithmic Data Generation ---
function generateAlgorithmicData(product: Product): AlgorithmicData {
  const rng = new SeededRNG(seedFromUUID(product.id))
  const buyPrice = product.buy_price || 5
  const sellPrice = product.sell_price || 20
  const profit = sellPrice - buyPrice
  const marginPct = buyPrice > 0 ? (profit / sellPrice) * 100 : 50

  // --- trend_data: 12 monthly values ---
  const categoryName = product.category_name || 'Other'
  const baseCurve = SEASONAL_CURVES[categoryName] || DEFAULT_CURVE
  // Shift curve so it starts from a random month offset
  const monthOffset = rng.int(0, 11)
  const trendData: number[] = []
  // Add a per-product growth/decline factor
  const growthFactor = rng.float(-0.15, 0.30) // -15% to +30% over the year
  for (let i = 0; i < 12; i++) {
    const baseVal = baseCurve[(i + monthOffset) % 12]
    const growth = 1 + (growthFactor * (i / 11))
    const noise = rng.float(-8, 8)
    const val = Math.round(Math.max(10, Math.min(100, baseVal * growth + noise)))
    trendData.push(val)
  }

  // --- rating: 3.5-4.9, slightly biased by price tier ---
  const priceBonus = sellPrice > 50 ? 0.2 : sellPrice > 25 ? 0.1 : 0
  const rating = roundTo(Math.min(4.9, Math.max(3.5, rng.float(3.5, 4.7) + priceBonus)), 1)

  // --- reviews_count: 50-5000, correlated with price & rating ---
  const ratingMultiplier = rating > 4.3 ? 1.5 : rating > 4.0 ? 1.2 : 1.0
  const priceMultiplier = sellPrice < 15 ? 1.8 : sellPrice < 30 ? 1.3 : 0.9
  const baseReviews = rng.int(50, 2500)
  const reviews_count = Math.round(baseReviews * ratingMultiplier * priceMultiplier)

  // --- product_metadata ---
  const isHighMargin = marginPct > 45
  const is_winning = rng.chance(isHighMargin ? 0.45 : 0.20)
  const is_locked = is_winning ? false : rng.chance(0.20)
  const unlock_price = is_locked ? (rng.chance(0.6) ? 4.99 : 9.99) : null
  const profit_margin = roundTo(marginPct, 2)

  // pot_revenue: $10k-$500k, correlated with trend strength
  const avgTrend = trendData.reduce((a, b) => a + b, 0) / trendData.length
  const trendMultiplier = avgTrend / 75 // normalize around 1.0
  const pot_revenue = roundTo(rng.float(10000, 300000) * trendMultiplier, 2)

  // revenue_growth_rate: correlated with trend direction
  const trendDirection = (trendData[11] - trendData[0]) / Math.max(1, trendData[0])
  const revenue_growth_rate = roundTo(
    (trendDirection * 200) + rng.float(-20, 40),
    2
  )

  // items_sold: 100-50000
  const items_sold = rng.int(100, 50000)

  // avg_unit_price: near sell_price with variance
  const avg_unit_price = roundTo(sellPrice * rng.float(0.85, 1.15), 2)

  // revenue_trend: 12 monthly revenue values derived from trend_data
  const revenue_trend = trendData.map(val => {
    const estimatedOrders = Math.floor((val / 100) * 150) + rng.int(5, 30)
    return Math.round(estimatedOrders * sellPrice)
  })

  // found_date: random date in last 6 months
  const daysAgo = rng.int(1, 180)
  const foundDate = new Date()
  foundDate.setDate(foundDate.getDate() - daysAgo)
  const found_date = foundDate.toISOString()

  // filters: 1-3 tags
  const filterCount = rng.int(1, 3)
  let filters = rng.pickN(FILTER_TAGS, filterCount)
  // Ensure high-margin products get 'high-margin' tag
  if (isHighMargin && !filters.includes('high-margin')) {
    filters[0] = 'high-margin'
  }
  // Ensure winning products get some premium tags
  if (is_winning && !filters.includes('best-seller') && !filters.includes('trending')) {
    filters.push(rng.pick(['best-seller', 'trending', 'viral']))
  }

  // --- product_research partial: competitor_pricing ---
  const competitorCount = rng.int(3, 5)
  const selectedCompetitors = rng.pickN(COMPETITORS, competitorCount)
  const competitor_pricing = selectedCompetitors.map(name => ({
    store: name,
    price: roundTo(sellPrice * rng.float(0.75, 1.25), 2),
    url: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com/product/${product.id.slice(0, 8)}`,
    in_stock: rng.chance(0.85),
  }))

  // --- social_proof ---
  const likes = rng.int(100, 50000)
  const social_proof = {
    likes,
    comments: rng.int(10, Math.min(2000, Math.round(likes * 0.15))),
    shares: rng.int(5, Math.min(1000, Math.round(likes * 0.08))),
    virality_score: roundTo(rng.float(0.1, 0.95), 2),
  }

  return {
    trend_data: trendData,
    rating,
    reviews_count,
    is_winning,
    is_locked,
    unlock_price,
    profit_margin,
    pot_revenue,
    revenue_growth_rate,
    items_sold,
    avg_unit_price,
    revenue_trend,
    found_date,
    filters,
    competitor_pricing,
    social_proof,
  }
}

// --- Phase B: AI Data Generation ---
async function generateAIBatch(products: Product[]): Promise<Map<string, AIData>> {
  const productList = products
    .map(
      (p, i) =>
        `${i + 1}. "${p.title}" (Category: ${p.category_name || 'General'}, Sell: $${p.sell_price}, Buy: $${p.buy_price})`
    )
    .join('\n')

  const prompt = `You are a product data specialist for a dropshipping e-commerce platform.

For each product below, generate:
1. **specifications**: 4-8 product-specific key-value pairs relevant to the product type (e.g., for electronics: "Battery Life": "8 hours", "Weight": "120g"; for fashion: "Material": "Cotton Blend", "Size Range": "S-XXL")
2. **seasonal_demand**: 2-3 unique sentences describing when this product sells best and seasonal demand patterns
3. **audience_targeting**: An object with:
   - "demographics": a string describing age range, gender, income level
   - "interests": array of 3-5 interest keywords
   - "marketing_suggestions": array of 2-3 short marketing tips
4. **supplier_notes**: 2-3 sentences with sourcing and shipping tips specific to this product

Products:
${productList}

Respond with ONLY a JSON array where each element has:
- "index" (1-based number matching the product list)
- "specifications" (object of key-value string pairs)
- "seasonal_demand" (string)
- "audience_targeting" (object with demographics, interests, marketing_suggestions)
- "supplier_notes" (string)`

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
    },
  })

  const text = response.text
  if (!text) throw new Error('Empty response from Gemini')

  const cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()
  const parsed = JSON.parse(cleaned) as Array<{
    index: number
    specifications: Record<string, string>
    seasonal_demand: string
    audience_targeting: {
      demographics: string
      interests: string[]
      marketing_suggestions: string[]
    }
    supplier_notes: string
  }>

  const result = new Map<string, AIData>()
  for (const item of parsed) {
    const idx = item.index - 1
    if (idx >= 0 && idx < products.length) {
      result.set(products[idx].id, {
        specifications: item.specifications || {},
        seasonal_demand: item.seasonal_demand || '',
        audience_targeting: item.audience_targeting || {
          demographics: 'Adults 18-45',
          interests: ['online shopping'],
          marketing_suggestions: ['Social media ads'],
        },
        supplier_notes: item.supplier_notes || '',
      })
    }
  }

  return result
}

function generateFallbackAIData(product: Product): AIData {
  const cat = product.category_name || 'General'
  const specsByCategory: Record<string, Record<string, string>> = {
    Electronics: { 'Warranty': '12 months', 'Power': 'USB-C rechargeable', 'Weight': '150g', 'Connectivity': 'Bluetooth 5.0' },
    Gadgets: { 'Battery': 'Built-in rechargeable', 'Material': 'ABS Plastic', 'Weight': '85g', 'Compatibility': 'Universal' },
    Fashion: { 'Material': 'Polyester blend', 'Care': 'Machine washable', 'Size Range': 'S-XXL', 'Season': 'All-season' },
    Beauty: { 'Volume': '30ml', 'Skin Type': 'All skin types', 'Ingredients': 'Paraben-free', 'Shelf Life': '24 months' },
    'Home & Garden': { 'Material': 'Durable plastic', 'Dimensions': 'See description', 'Weight': '500g', 'Assembly': 'Easy setup' },
    'Home Decor': { 'Style': 'Modern minimalist', 'Material': 'Mixed materials', 'Color': 'Multiple options', 'Mounting': 'Wall or freestanding' },
    Health: { 'Certification': 'FDA-approved materials', 'Use': 'Daily', 'Material': 'Medical grade', 'Warranty': '6 months' },
    Sports: { 'Material': 'High-density foam', 'Weight Capacity': '120kg', 'Dimensions': 'Standard', 'Suitable For': 'All fitness levels' },
    'Pet Supplies': { 'Material': 'Pet-safe materials', 'Size': 'Adjustable', 'Suitable For': 'Dogs and cats', 'Durability': 'Chew-resistant' },
    'Kids & Baby': { 'Age Range': '3-12 years', 'Material': 'Non-toxic', 'Safety': 'CPSC certified', 'Care': 'Easy to clean' },
    'Car Accessories': { 'Compatibility': 'Universal fit', 'Material': 'Premium ABS', 'Installation': 'Plug and play', 'Warranty': '12 months' },
  }

  return {
    specifications: specsByCategory[cat] || specsByCategory['Gadgets'],
    seasonal_demand: `This ${cat.toLowerCase()} product sees steady demand year-round with peaks during holiday seasons and promotional events. Sales typically increase 20-40% during Q4.`,
    audience_targeting: {
      demographics: 'Adults 18-45, mixed gender, middle income',
      interests: ['online shopping', cat.toLowerCase(), 'deals', 'trending products'],
      marketing_suggestions: [
        'Target social media ads to interest groups',
        'Use before/after or unboxing content',
        `Highlight value compared to retail ${cat.toLowerCase()} alternatives`,
      ],
    },
    supplier_notes: `Source from verified suppliers in Guangdong or Zhejiang province. Standard shipping 7-15 business days via ePacket. Consider ordering samples first to verify quality matches listing photos.`,
  }
}

// --- Main ---
async function main() {
  console.log('='.repeat(60))
  console.log('  PRODUCT DATA ENRICHMENT SCRIPT')
  console.log('  Enriching all products with unique, realistic data')
  console.log('='.repeat(60))
  console.log()

  // 1. Fetch all products with categories
  console.log('[1/6] Fetching all products...')
  const products: Product[] = await sql`
    SELECT p.id, p.title,
      COALESCE(p.buy_price, 5)::float as buy_price,
      COALESCE(p.sell_price, 20)::float as sell_price,
      COALESCE(p.profit_per_order, 15)::float as profit_per_order,
      c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.title
  `
  console.log(`  Found ${products.length} products`)

  if (products.length === 0) {
    console.log('No products found. Exiting.')
    await sql.end()
    return
  }

  // Show category distribution
  const catCounts = new Map<string, number>()
  for (const p of products) {
    const cat = p.category_name || 'Uncategorized'
    catCounts.set(cat, (catCounts.get(cat) || 0) + 1)
  }
  console.log('  Category distribution:')
  for (const [cat, count] of [...catCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${cat}: ${count}`)
  }

  // 2. Ensure UNIQUE constraint on product_metadata.product_id
  console.log('\n[2/6] Ensuring UNIQUE constraint on product_metadata.product_id...')
  try {
    await sql`
      ALTER TABLE product_metadata
      ADD CONSTRAINT product_metadata_product_id_unique UNIQUE (product_id)
    `
    console.log('  Added UNIQUE constraint')
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('  UNIQUE constraint already exists')
    } else {
      console.log(`  Note: ${e.message}`)
    }
  }

  // Also ensure UNIQUE on product_research.product_id
  try {
    await sql`
      ALTER TABLE product_research
      ADD CONSTRAINT product_research_product_id_unique UNIQUE (product_id)
    `
    console.log('  Added UNIQUE constraint on product_research.product_id')
  } catch (e: any) {
    if (e.message?.includes('already exists')) {
      console.log('  UNIQUE constraint on product_research already exists')
    } else {
      console.log(`  Note: ${e.message}`)
    }
  }

  // 3. Phase A: Algorithmic data
  console.log('\n[3/6] Phase A: Generating algorithmic data...')
  const algoDataMap = new Map<string, AlgorithmicData>()
  for (const product of products) {
    algoDataMap.set(product.id, generateAlgorithmicData(product))
  }
  console.log(`  Generated algorithmic data for ${algoDataMap.size} products`)

  // Show sample
  const sampleProduct = products[0]
  const sampleAlgo = algoDataMap.get(sampleProduct.id)!
  console.log(`\n  Sample — "${sampleProduct.title.substring(0, 50)}...":`)
  console.log(`    rating: ${sampleAlgo.rating}, reviews: ${sampleAlgo.reviews_count}`)
  console.log(`    trend_data: [${sampleAlgo.trend_data.join(', ')}]`)
  console.log(`    is_winning: ${sampleAlgo.is_winning}, profit_margin: ${sampleAlgo.profit_margin}%`)
  console.log(`    pot_revenue: $${sampleAlgo.pot_revenue.toLocaleString()}`)

  // 4. Phase B: AI data
  console.log('\n[4/6] Phase B: Generating AI data (Gemini batches)...')
  const aiDataMap = new Map<string, AIData>()
  const batches = chunk(products, AI_BATCH_SIZE)
  console.log(`  ${batches.length} batches of ${AI_BATCH_SIZE} products each`)

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`\n  Batch ${i + 1}/${batches.length} (${batch.length} products)...`)

    let batchResult: Map<string, AIData> | null = null

    // Try with retry
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        batchResult = await generateAIBatch(batch)
        console.log(`    AI returned data for ${batchResult.size}/${batch.length} products`)
        break
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error(`    Attempt ${attempt} failed: ${msg}`)
        if (attempt < 2) {
          console.log('    Retrying after 5s...')
          await delay(5000)
        }
      }
    }

    // Apply results or fallbacks
    for (const product of batch) {
      const aiData = batchResult?.get(product.id) ?? null
      if (aiData && aiData.specifications && Object.keys(aiData.specifications).length > 0) {
        aiDataMap.set(product.id, aiData)
      } else {
        // Fallback
        aiDataMap.set(product.id, generateFallbackAIData(product))
      }
    }

    // Rate limit between batches
    if (i < batches.length - 1) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  const aiCount = [...aiDataMap.values()].filter(
    d => !d.seasonal_demand.includes('steady demand year-round')
  ).length
  console.log(`\n  AI-generated: ${aiCount}, Fallback: ${aiDataMap.size - aiCount}`)

  // 5. Write to DB
  console.log('\n[5/6] Writing to database...')

  let productsUpdated = 0
  let metadataUpserted = 0
  let researchUpserted = 0

  // Process in batches of 25 for DB writes too
  const dbBatches = chunk(products, 25)

  for (let i = 0; i < dbBatches.length; i++) {
    const batch = dbBatches[i]
    console.log(`  DB batch ${i + 1}/${dbBatches.length}...`)

    for (const product of batch) {
      const algo = algoDataMap.get(product.id)!
      const aiData = aiDataMap.get(product.id)!

      // UPDATE products table
      try {
        await sql`
          UPDATE products SET
            trend_data = ${JSON.stringify(algo.trend_data)},
            rating = ${algo.rating},
            reviews_count = ${algo.reviews_count},
            specifications = ${JSON.stringify(aiData.specifications)},
            updated_at = NOW()
          WHERE id = ${product.id}
        `
        productsUpdated++
      } catch (e: any) {
        console.error(`    Failed to update product ${product.id}: ${e.message}`)
      }

      // UPSERT product_metadata
      try {
        await sql`
          INSERT INTO product_metadata (
            product_id, is_winning, is_locked, unlock_price, profit_margin,
            pot_revenue, revenue_growth_rate, items_sold, avg_unit_price,
            revenue_trend, found_date, filters
          ) VALUES (
            ${product.id}, ${algo.is_winning}, ${algo.is_locked}, ${algo.unlock_price},
            ${algo.profit_margin}, ${algo.pot_revenue}, ${algo.revenue_growth_rate},
            ${algo.items_sold}, ${algo.avg_unit_price},
            ${JSON.stringify(algo.revenue_trend)}, ${algo.found_date},
            ${JSON.stringify(algo.filters)}
          )
          ON CONFLICT (product_id) DO UPDATE SET
            is_winning = EXCLUDED.is_winning,
            is_locked = EXCLUDED.is_locked,
            unlock_price = EXCLUDED.unlock_price,
            profit_margin = EXCLUDED.profit_margin,
            pot_revenue = EXCLUDED.pot_revenue,
            revenue_growth_rate = EXCLUDED.revenue_growth_rate,
            items_sold = EXCLUDED.items_sold,
            avg_unit_price = EXCLUDED.avg_unit_price,
            revenue_trend = EXCLUDED.revenue_trend,
            found_date = EXCLUDED.found_date,
            filters = EXCLUDED.filters,
            updated_at = NOW()
        `
        metadataUpserted++
      } catch (e: any) {
        console.error(`    Failed to upsert metadata for ${product.id}: ${e.message}`)
      }

      // UPSERT product_research
      try {
        await sql`
          INSERT INTO product_research (
            product_id, competitor_pricing, seasonal_demand,
            audience_targeting, supplier_notes, social_proof, research_date
          ) VALUES (
            ${product.id},
            ${JSON.stringify(algo.competitor_pricing)},
            ${aiData.seasonal_demand},
            ${JSON.stringify(aiData.audience_targeting)},
            ${aiData.supplier_notes},
            ${JSON.stringify(algo.social_proof)},
            NOW()
          )
          ON CONFLICT (product_id) DO UPDATE SET
            competitor_pricing = EXCLUDED.competitor_pricing,
            seasonal_demand = EXCLUDED.seasonal_demand,
            audience_targeting = EXCLUDED.audience_targeting,
            supplier_notes = EXCLUDED.supplier_notes,
            social_proof = EXCLUDED.social_proof,
            research_date = NOW(),
            updated_at = NOW()
        `
        researchUpserted++
      } catch (e: any) {
        console.error(`    Failed to upsert research for ${product.id}: ${e.message}`)
      }
    }
  }

  // 6. Verification & Summary
  console.log('\n[6/6] Verifying results...')

  const [productsWithTrend] = await sql`
    SELECT COUNT(*) as count FROM products
    WHERE trend_data IS NOT NULL AND trend_data != '[]'::jsonb
  `
  const [productsWithSpecs] = await sql`
    SELECT COUNT(*) as count FROM products
    WHERE specifications IS NOT NULL
  `
  const [productsWithRating] = await sql`
    SELECT COUNT(*) as count FROM products
    WHERE rating > 0 AND reviews_count > 0
  `
  const [metadataCount] = await sql`SELECT COUNT(*) as count FROM product_metadata`
  const [researchCount] = await sql`SELECT COUNT(*) as count FROM product_research`
  const [winningCount] = await sql`SELECT COUNT(*) as count FROM product_metadata WHERE is_winning = true`
  const [lockedCount] = await sql`SELECT COUNT(*) as count FROM product_metadata WHERE is_locked = true`

  // Sample 3 different products to show variety
  const sampleProducts = await sql`
    SELECT p.title, p.rating, p.reviews_count, p.trend_data, p.specifications,
      pm.is_winning, pm.profit_margin, pm.pot_revenue, pm.items_sold, pm.filters,
      pr.seasonal_demand, pr.social_proof
    FROM products p
    LEFT JOIN product_metadata pm ON pm.product_id = p.id
    LEFT JOIN product_research pr ON pr.product_id = p.id
    ORDER BY RANDOM()
    LIMIT 3
  `

  console.log('\n' + '='.repeat(60))
  console.log('  ENRICHMENT SUMMARY')
  console.log('='.repeat(60))
  console.log(`  Products updated:        ${productsUpdated}`)
  console.log(`  Metadata upserted:       ${metadataUpserted}`)
  console.log(`  Research upserted:       ${researchUpserted}`)
  console.log()
  console.log('  Verification:')
  console.log(`    Products with trend_data:    ${productsWithTrend.count}`)
  console.log(`    Products with specifications:${productsWithSpecs.count}`)
  console.log(`    Products with rating:        ${productsWithRating.count}`)
  console.log(`    Total product_metadata rows: ${metadataCount.count}`)
  console.log(`    Total product_research rows: ${researchCount.count}`)
  console.log(`    Winning products:            ${winningCount.count}`)
  console.log(`    Locked products:             ${lockedCount.count}`)
  console.log()
  console.log('  Sample Products (random 3):')
  for (const s of sampleProducts) {
    console.log(`\n  "${s.title.substring(0, 60)}${s.title.length > 60 ? '...' : ''}"`)
    console.log(`    Rating: ${s.rating} (${s.reviews_count} reviews)`)
    console.log(`    Trend: [${Array.isArray(s.trend_data) ? s.trend_data.slice(0, 6).join(', ') + '...' : 'N/A'}]`)
    console.log(`    Winning: ${s.is_winning}, Margin: ${s.profit_margin}%, Revenue: $${Number(s.pot_revenue).toLocaleString()}`)
    console.log(`    Items sold: ${s.items_sold}, Filters: ${JSON.stringify(s.filters)}`)
    console.log(`    Seasonal: ${typeof s.seasonal_demand === 'string' ? s.seasonal_demand.substring(0, 100) + '...' : 'N/A'}`)
    const sp = typeof s.social_proof === 'string' ? JSON.parse(s.social_proof) : s.social_proof
    if (sp) console.log(`    Social: ${sp.likes} likes, ${sp.comments} comments, virality: ${sp.virality_score}`)
  }
  console.log('\n' + '='.repeat(60))
  console.log('  DONE! All products enriched with unique data.')
  console.log('='.repeat(60))

  await sql.end()
}

main().catch(async (error) => {
  console.error('Fatal error:', error)
  await sql.end()
  process.exit(1)
})
