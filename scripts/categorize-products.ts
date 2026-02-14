/**
 * Batch AI categorization script
 * Classifies uncategorized products into existing categories using Gemini AI
 *
 * Usage:
 *   npx tsx scripts/categorize-products.ts
 */

import 'dotenv/config'
import postgres from 'postgres'
import { GoogleGenAI } from '@google/genai'

// --- Config ---
const BATCH_SIZE = 50
const RATE_LIMIT_DELAY = 2000 // ms between API calls

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
interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  title: string
}

interface ClassificationResult {
  title: string
  category: string
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

// --- AI Classification ---
async function classifyBatch(
  products: Product[],
  categoryNames: string[]
): Promise<ClassificationResult[]> {
  const productList = products
    .map((p, i) => `${i + 1}. ${p.title}`)
    .join('\n')

  const prompt = `You are a product categorization expert for an e-commerce dropshipping platform.

Given these product categories:
${categoryNames.map(c => `- ${c}`).join('\n')}

Classify each product below into exactly ONE category based on its title.
Rules:
- Pick the single most appropriate category
- If a product doesn't clearly fit any specific category, use "Other"
- "Gadgets" is for small tech accessories and novelty tech items
- "Home Decor" is for decorative items (wall art, lighting accents, ornaments)
- "Home & Garden" is for functional home items (organizers, tools, outdoor)
- "Electronics" is for devices with significant electronic components

Products:
${productList}

Respond with ONLY a JSON array. Each element must have "title" (exact product title) and "category" (exact category name from the list above).
Example: [{"title":"Product Name","category":"Electronics"}]`

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
  const parsed: ClassificationResult[] = JSON.parse(cleaned)

  if (!Array.isArray(parsed)) {
    throw new Error('Response is not a JSON array')
  }

  return parsed
}

// --- Main ---
async function main() {
  console.log('Starting product categorization...\n')

  // 1. Fetch categories
  const categories: Category[] = await sql`SELECT id, name FROM categories ORDER BY name`
  console.log(`Found ${categories.length} categories:`)
  for (const c of categories) {
    console.log(`  - ${c.name} (${c.id})`)
  }

  const categoryNames = categories.map(c => c.name)
  const nameToId = new Map(categories.map(c => [c.name, c.id]))

  // 2. Fetch uncategorized products
  const products: Product[] = await sql`
    SELECT id, title FROM products WHERE category_id IS NULL ORDER BY title
  `
  console.log(`\nFound ${products.length} uncategorized products\n`)

  if (products.length === 0) {
    console.log('All products are already categorized!')
    await sql.end()
    return
  }

  // 3. Process in batches
  const batches = chunk(products, BATCH_SIZE)
  let totalUpdated = 0
  let totalFailed = 0
  const categoryCounts = new Map<string, number>()

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`\n--- Batch ${i + 1}/${batches.length} (${batch.length} products) ---`)

    let results: ClassificationResult[]
    try {
      results = await classifyBatch(batch, categoryNames)
      console.log(`  AI returned ${results.length} classifications`)
    } catch (error) {
      console.error(`  Batch ${i + 1} failed:`, error instanceof Error ? error.message : String(error))
      totalFailed += batch.length

      // Retry once after delay
      console.log('  Retrying after delay...')
      await delay(5000)
      try {
        results = await classifyBatch(batch, categoryNames)
        console.log(`  Retry succeeded: ${results.length} classifications`)
      } catch (retryError) {
        console.error(`  Retry failed:`, retryError instanceof Error ? retryError.message : String(retryError))
        continue
      }
    }

    // 4. Map results to DB updates
    // Build a title->product map for this batch
    const titleToProduct = new Map(batch.map(p => [p.title, p]))

    for (const result of results) {
      const product = titleToProduct.get(result.title)
      if (!product) {
        // Try fuzzy match - AI sometimes slightly alters titles
        const match = batch.find(p =>
          p.title.toLowerCase().trim() === result.title.toLowerCase().trim()
        )
        if (!match) {
          console.log(`  Warning: No product match for "${result.title.substring(0, 50)}..."`)
          totalFailed++
          continue
        }
        titleToProduct.delete(result.title)
        // Use the matched product
        const categoryId = nameToId.get(result.category)
        if (!categoryId) {
          console.log(`  Warning: Unknown category "${result.category}" for "${match.title.substring(0, 50)}..."`)
          // Default to "Other"
          const otherId = nameToId.get('Other')
          if (otherId) {
            await sql`UPDATE products SET category_id = ${otherId} WHERE id = ${match.id}`
            totalUpdated++
            categoryCounts.set('Other', (categoryCounts.get('Other') || 0) + 1)
          } else {
            totalFailed++
          }
          continue
        }
        await sql`UPDATE products SET category_id = ${categoryId} WHERE id = ${match.id}`
        totalUpdated++
        categoryCounts.set(result.category, (categoryCounts.get(result.category) || 0) + 1)
        continue
      }

      const categoryId = nameToId.get(result.category)
      if (!categoryId) {
        console.log(`  Warning: Unknown category "${result.category}" for "${product.title.substring(0, 50)}..."`)
        const otherId = nameToId.get('Other')
        if (otherId) {
          await sql`UPDATE products SET category_id = ${otherId} WHERE id = ${product.id}`
          totalUpdated++
          categoryCounts.set('Other', (categoryCounts.get('Other') || 0) + 1)
        } else {
          totalFailed++
        }
        continue
      }

      await sql`UPDATE products SET category_id = ${categoryId} WHERE id = ${product.id}`
      totalUpdated++
      categoryCounts.set(result.category, (categoryCounts.get(result.category) || 0) + 1)
    }

    console.log(`  Updated ${results.length} products in this batch`)

    // Rate limit
    if (i < batches.length - 1) {
      await delay(RATE_LIMIT_DELAY)
    }
  }

  // 5. Update category product_count
  console.log('\nUpdating category product counts...')
  await sql`
    UPDATE categories c
    SET product_count = (
      SELECT COUNT(*) FROM products p WHERE p.category_id = c.id
    )
  `
  console.log('  Category counts updated')

  // 6. Verify
  const remaining = await sql`SELECT COUNT(*) as count FROM products WHERE category_id IS NULL`
  const distribution = await sql`
    SELECT c.name, COUNT(p.id) as count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    GROUP BY c.name
    ORDER BY count DESC
  `

  // 7. Summary
  console.log('\n' + '='.repeat(50))
  console.log('CATEGORIZATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`  Total updated: ${totalUpdated}`)
  console.log(`  Total failed:  ${totalFailed}`)
  console.log(`  Still uncategorized: ${remaining[0].count}`)
  console.log('\nCategory Distribution:')
  for (const row of distribution) {
    console.log(`  ${row.name}: ${row.count} products`)
  }
  console.log('='.repeat(50))

  await sql.end()
}

main().catch(async (error) => {
  console.error('Fatal error:', error)
  await sql.end()
  process.exit(1)
})
