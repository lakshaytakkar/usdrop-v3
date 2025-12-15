/**
 * Scrape multiple products from Tradelle.io and export to CSV
 * Usage:
 *   npx tsx scripts/scrapers/scrape-multiple.ts --count=10
 *   npx tsx scripts/scrapers/scrape-multiple.ts --count=10 --output=products.csv
 */

import { TradelleScraper } from './tradelle-scraper'
import { logger } from './utils/logger'
import type { ScraperConfig, ScrapeResult, RawProductData } from './utils/types'
import { promises as fs } from 'fs'
import * as path from 'path'

interface MultiScrapeOptions {
  count: number
  outputFile: string
  debug: boolean
  visible: boolean
}

/**
 * Parse command-line arguments
 */
function parseArgs(): MultiScrapeOptions {
  const args = process.argv.slice(2)
  const options: MultiScrapeOptions = {
    count: 10,
    outputFile: 'products.csv',
    debug: false,
    visible: true,
  }

  for (const arg of args) {
    if (arg.startsWith('--count=')) {
      options.count = parseInt(arg.substring(8), 10)
    } else if (arg.startsWith('--output=')) {
      options.outputFile = arg.substring(9)
    } else if (arg === '--debug') {
      options.debug = true
    } else if (arg === '--headless') {
      options.visible = false
    } else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp(): void {
  console.log(`
Tradelle Multi-Product Scraper

Usage:
  npx tsx scripts/scrapers/scrape-multiple.ts [options]

Options:
  --count=<n>       Number of products to scrape (default: 10)
  --output=<file>   Output CSV filename (default: products.csv)
  --debug           Enable debug logging
  --headless        Run browser in headless mode
  --help, -h        Show this help message

Examples:
  npx tsx scripts/scrapers/scrape-multiple.ts --count=10
  npx tsx scripts/scrapers/scrape-multiple.ts --count=50 --output=tradelle-products.csv --headless
  `)
}

/**
 * Convert product data to CSV row
 */
function productToCSVRow(data: RawProductData, sourceUrl: string): string {
  const fields = [
    escapeCSV(data.title || ''),
    escapeCSV(data.description || ''),
    escapeCSV(data.imageUrl || ''),
    escapeCSV(data.supplierPrice || ''),
    escapeCSV(data.retailPrice || ''),
    escapeCSV(data.profitMargin || ''),
    escapeCSV(data.rating || ''),
    escapeCSV(data.reviewsCount || ''),
    escapeCSV(data.isWinning ? 'Yes' : 'No'),
    escapeCSV(data.category || ''),
    escapeCSV((data.additionalImages || []).join(';')),
    escapeCSV(sourceUrl),
    escapeCSV(new Date().toISOString()),
  ]
  return fields.join(',')
}

/**
 * Escape CSV field
 */
function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""'
  const str = String(value)
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

/**
 * Get CSV header row
 */
function getCSVHeader(): string {
  return [
    'title',
    'description',
    'image_url',
    'buy_price',
    'sell_price',
    'profit_margin',
    'rating',
    'reviews_count',
    'is_winning',
    'category',
    'additional_images',
    'source_url',
    'scraped_at',
  ].join(',')
}

/**
 * Extended scraper class with multi-product support
 */
class MultiProductScraper extends TradelleScraper {
  /**
   * Get all product URLs from the listing page
   */
  async getProductUrls(maxCount: number): Promise<string[]> {
    if (!this.page) return []

    try {
      // Wait for products to load
      await this.page.waitForTimeout(2000)

      // Get all product links
      const productLinks = await this.page.$$eval(
        'a[href*="/product"]',
        (elements, max) => {
          const urls: string[] = []
          const seen = new Set<string>()

          for (const el of elements) {
            const href = (el as HTMLAnchorElement).href
            // Only include product detail pages (not listing pages)
            if (href && href.match(/\/products\/\d+/) && !seen.has(href)) {
              seen.add(href)
              urls.push(href)
              if (urls.length >= max) break
            }
          }
          return urls
        },
        maxCount
      )

      return productLinks
    } catch (error) {
      logger.error('Error getting product URLs', error)
      return []
    }
  }

  /**
   * Navigate to products listing page
   */
  async navigateToProductsListing(): Promise<void> {
    logger.info('Navigating to products listing...')

    // Navigate to main site
    await this.navigateTo('https://app.tradelle.io', 'networkidle')
    await this['waitForPageLoad']()

    // Navigate via sidebar
    await this['navigateToProductsViaSidebar']()
  }

  /**
   * Expose the page for direct access
   */
  getPage() {
    return this.page
  }
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs()

  // Configure logger
  if (options.debug) {
    logger.setDebug(true)
  }

  // Print banner
  logger.divider('TRADELLE MULTI-PRODUCT SCRAPER')
  logger.info(`Scraping ${options.count} products...`)
  logger.info(`Output file: ${options.outputFile}`)
  logger.divider()

  // Create scraper configuration
  const config: Partial<ScraperConfig> = {
    headless: !options.visible,
    slowMo: options.visible ? 50 : 0,
    screenshotOnError: true,
    screenshotOnSuccess: false,
    timeout: 30000,
  }

  const scraper = new MultiProductScraper(config)
  const results: { data: RawProductData; url: string; success: boolean }[] = []

  try {
    // Initialize browser
    logger.info('Initializing scraper...')
    await scraper.initialize()
    logger.success('Browser launched')

    // Check session
    const hasSession = await scraper['sessionManager'].hasValidSession()
    if (hasSession && scraper['context']) {
      await scraper['sessionManager'].loadSession(scraper['context'])
    }

    // Navigate to products listing
    await scraper.navigateToProductsListing()
    logger.success('Navigated to products page')

    // Get product URLs
    logger.info(`Looking for ${options.count} products...`)
    const productUrls = await scraper.getProductUrls(options.count)
    logger.success(`Found ${productUrls.length} products`)

    if (productUrls.length === 0) {
      logger.error('No products found!')
      process.exit(1)
    }

    // Scrape each product
    logger.divider('SCRAPING PRODUCTS')

    for (let i = 0; i < productUrls.length; i++) {
      const url = productUrls[i]
      const productNum = i + 1

      logger.info(`[${productNum}/${productUrls.length}] Scraping: ${url}`)

      try {
        // Navigate to product
        await scraper['navigateTo'](url)
        await scraper['waitForPageLoad']()

        // Check for error page
        const pageText = await scraper.getPage()?.evaluate(() => document.body?.textContent || '') || ''
        if (pageText.includes('Something went wrong')) {
          logger.warn(`[${productNum}] Page error, retrying...`)
          await scraper.getPage()?.waitForTimeout(2000)
          await scraper.getPage()?.reload({ waitUntil: 'networkidle' })
          await scraper['waitForPageLoad']()
        }

        // Extract data
        const rawData = await scraper['extractProductData']()

        results.push({
          data: rawData,
          url: url,
          success: !!(rawData.title && rawData.imageUrl),
        })

        if (rawData.title) {
          logger.success(`[${productNum}] ${rawData.title.substring(0, 50)}...`)
        } else {
          logger.warn(`[${productNum}] Failed to extract title`)
        }

        // Small delay between products
        await scraper.getPage()?.waitForTimeout(1000)

      } catch (error) {
        logger.error(`[${productNum}] Error scraping product`, error)
        results.push({
          data: {},
          url: url,
          success: false,
        })
      }
    }

    // Generate CSV
    logger.divider('GENERATING CSV')

    const csvRows = [getCSVHeader()]
    let successCount = 0

    for (const result of results) {
      if (result.success) {
        csvRows.push(productToCSVRow(result.data, result.url))
        successCount++
      }
    }

    // Save CSV file
    const outputPath = path.join(process.cwd(), options.outputFile)
    await fs.writeFile(outputPath, csvRows.join('\n'), 'utf-8')

    logger.success(`CSV saved to: ${outputPath}`)
    logger.info(`Total products: ${results.length}`)
    logger.info(`Successfully scraped: ${successCount}`)
    logger.info(`Failed: ${results.length - successCount}`)

    // Also save as JSON for reference
    const jsonPath = outputPath.replace('.csv', '.json')
    await fs.writeFile(
      jsonPath,
      JSON.stringify(results.filter(r => r.success).map(r => ({ ...r.data, source_url: r.url })), null, 2),
      'utf-8'
    )
    logger.success(`JSON saved to: ${jsonPath}`)

    logger.divider('SCRAPING COMPLETE')

  } catch (error) {
    logger.error('Fatal error', error)
    process.exit(1)
  } finally {
    await scraper.cleanup()
  }
}

// Run
main().catch(error => {
  logger.error('Unhandled error', error)
  process.exit(1)
})
