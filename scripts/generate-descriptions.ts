/**
 * Batch script to generate short product descriptions using Gemini AI
 * Updates products in Neon DB that have NULL descriptions
 *
 * Usage:
 *   npx tsx scripts/generate-descriptions.ts
 */

import 'dotenv/config'
import postgres from 'postgres'
import { GoogleGenAI } from '@google/genai'

// --- Config ---
const BATCH_SIZE = 50
const RATE_LIMIT_DELAY = 2000

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
  category_name: string | null
}

interface DescriptionResult {
  title: string
  description: string
}

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

// --- AI Description Generation ---
async function generateDescriptions(
  products: Product[]
): Promise<DescriptionResult[]> {
  const productList = products
    .map((p, i) => `${i + 1}. "${p.title}" [${p.category_name || 'Uncategorized'}]`)
    .join('\n')

  const prompt = `You are an e-commerce copywriter for a dropshipping product catalog.

Write a short, compelling product description for each product below. Use the title and category as context.

Rules:
- Each description must be 1-2 sentences, max 150 characters
- Focus on the key benefit or use case
- Write in a direct, appealing tone for online shoppers
- Do NOT repeat the product title in the description
- Do NOT use marketing hype like "amazing" or "revolutionary"

Products:
${productList}

Respond with ONLY a JSON array. Each element must have "title" (exact product title as given) and "description" (your generated description).
Example: [{"title":"LED Book Light","description":"Clip-on reading light with adjustable brightness for comfortable nighttime reading without disturbing others."}]`

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: { parts: [{ text: prompt }] },
    config: {
      responseMimeType: 'application/json',
    },
  })

  const text = response.text
  if (!text) throw new Error('Empty response from Gemini')

  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed: DescriptionResult[] = JSON.parse(cleaned)

  if (!Array.isArray(parsed)) {
    throw new Error('Response is not a JSON array')
  }

  return parsed
}

// --- Main ---
async function main() {
  console.log('Starting product description generation...\n')

  // 1. Fetch products with NULL descriptions
  const products: Product[] = await sql`
    SELECT p.id, p.title, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.description IS NULL
    ORDER BY p.title
  `
  console.log(`Found ${products.length} products without descriptions\n`)

  if (products.length === 0) {
    console.log('All products already have descriptions!')
    await sql.end()
    return
  }

  // 2. Process in batches
  const batches = chunk(products, BATCH_SIZE)
  let totalUpdated = 0
  let totalFailed = 0

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`--- Batch ${i + 1}/${batches.length} (${batch.length} products) ---`)

    let results: DescriptionResult[]
    try {
      results = await generateDescriptions(batch)
      console.log(`  AI returned ${results.length} descriptions`)
    } catch (error) {
      console.error(`  Batch ${i + 1} failed:`, error instanceof Error ? error.message : String(error))

      // Retry once
      console.log('  Retrying after delay...')
      await delay(5000)
      try {
        results = await generateDescriptions(batch)
        console.log(`  Retry succeeded: ${results.length} descriptions`)
      } catch (retryError) {
        console.error(`  Retry failed:`, retryError instanceof Error ? retryError.message : String(retryError))
        totalFailed += batch.length
        continue
      }
    }

    // 3. Match results to products and update DB
    const titleToProduct = new Map(batch.map(p => [p.title, p]))
    // Also build lowercase map for fuzzy matching
    const lowerTitleToProduct = new Map(batch.map(p => [p.title.toLowerCase().trim(), p]))

    for (const result of results) {
      let product = titleToProduct.get(result.title)
      if (!product) {
        product = lowerTitleToProduct.get(result.title.toLowerCase().trim())
      }
      if (!product) {
        console.log(`  Warning: No match for "${result.title.substring(0, 50)}..."`)
        totalFailed++
        continue
      }

      await sql`UPDATE products SET description = ${result.description} WHERE id = ${product.id}`
      totalUpdated++
    }

    console.log(`  Updated ${results.length} products in this batch`)

    if (i < batches.length - 1) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  // 4. Verify
  const remaining = await sql`SELECT COUNT(*) as count FROM products WHERE description IS NULL`

  // 5. Summary
  console.log('\n' + '='.repeat(50))
  console.log('DESCRIPTION GENERATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`  Total updated: ${totalUpdated}`)
  console.log(`  Total failed:  ${totalFailed}`)
  console.log(`  Still missing: ${remaining[0].count}`)
  console.log('='.repeat(50))

  // Show a few samples
  const samples = await sql`
    SELECT title, description FROM products
    WHERE description IS NOT NULL
    ORDER BY random()
    LIMIT 5
  `
  console.log('\nSample descriptions:')
  for (const s of samples) {
    console.log(`  "${s.title}"`)
    console.log(`   -> ${s.description}\n`)
  }

  await sql.end()
}

main().catch(async (error) => {
  console.error('Fatal error:', error)
  await sql.end()
  process.exit(1)
})
