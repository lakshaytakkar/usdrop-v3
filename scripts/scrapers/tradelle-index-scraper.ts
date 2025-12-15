/**
 * Tradelle.io Index Page Scraper
 * Extracts product data directly from the listing/index page without navigating to detail pages
 * Much faster than the detail page scraper
 *
 * Usage:
 *   npx tsx scripts/scrapers/tradelle-index-scraper.ts --count=100
 *   npx tsx scripts/scrapers/tradelle-index-scraper.ts --count=100 --output=tradelle-products.csv
 */

import { TradelleScraper } from './tradelle-scraper'
import { logger } from './utils/logger'
import type { ScraperConfig } from './utils/types'
import { promises as fs } from 'fs'
import * as path from 'path'

interface IndexProduct {
  title: string
  imageUrl: string
  cost: string
  price: string
  productUrl: string
}

interface IndexScrapeOptions {
  count: number
  outputFile: string
  debug: boolean
  visible: boolean
}

/**
 * Parse command-line arguments
 */
function parseArgs(): IndexScrapeOptions {
  const args = process.argv.slice(2)
  const options: IndexScrapeOptions = {
    count: 100,
    outputFile: 'tradelle-index-products.csv',
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
Tradelle Index Page Scraper

Scrapes product data directly from the listing page (fast method).
Extracts: title, image, cost, selling price

Usage:
  npx tsx scripts/scrapers/tradelle-index-scraper.ts [options]

Options:
  --count=<n>       Number of products to scrape (default: 100)
  --output=<file>   Output CSV filename (default: tradelle-index-products.csv)
  --debug           Enable debug logging
  --headless        Run browser in headless mode
  --help, -h        Show this help message

Examples:
  npx tsx scripts/scrapers/tradelle-index-scraper.ts --count=100
  npx tsx scripts/scrapers/tradelle-index-scraper.ts --count=50 --output=products.csv --headless
  `)
}

/**
 * Escape CSV field
 */
function escapeCSV(value: string): string {
  if (value === null || value === undefined) return '""'
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return `"${str}"`
}

/**
 * Get CSV header row
 */
function getCSVHeader(): string {
  return ['title', 'image_url', 'cost', 'selling_price', 'product_url', 'scraped_at'].join(',')
}

/**
 * Convert product to CSV row
 */
function productToCSVRow(product: IndexProduct): string {
  return [
    escapeCSV(product.title),
    escapeCSV(product.imageUrl),
    escapeCSV(product.cost),
    escapeCSV(product.price),
    escapeCSV(product.productUrl),
    escapeCSV(new Date().toISOString()),
  ].join(',')
}

/**
 * Extended scraper class for index page scraping
 */
class IndexPageScraper extends TradelleScraper {
  /**
   * Navigate to products listing page
   */
  async navigateToProductsListing(): Promise<void> {
    logger.info('Navigating to products listing...')

    await this.navigateTo('https://app.tradelle.io', 'domcontentloaded')
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

  /**
   * Scroll down to load more products
   */
  async scrollToLoadProducts(targetCount: number): Promise<void> {
    if (!this.page) return

    logger.info(`Scrolling to load ${targetCount} products...`)

    let previousHeight = 0
    let currentProductCount = 0
    let scrollAttempts = 0
    const maxScrollAttempts = 50

    while (currentProductCount < targetCount && scrollAttempts < maxScrollAttempts) {
      // Get current scroll height
      const scrollHeight = await this.page.evaluate(() => document.body.scrollHeight)

      // Scroll to bottom
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

      // Wait for new content to load
      await this.page.waitForTimeout(1500)

      // Count current products
      currentProductCount = await this.page.evaluate(() => {
        // Look for product cards/links
        const productLinks = document.querySelectorAll('a[href*="/products/"]')
        const uniqueUrls = new Set<string>()
        productLinks.forEach(link => {
          const href = (link as HTMLAnchorElement).href
          if (href.match(/\/products\/\d+/)) {
            uniqueUrls.add(href)
          }
        })
        return uniqueUrls.size
      })

      logger.debug(`Scroll ${scrollAttempts + 1}: Found ${currentProductCount} products`)

      // Check if we've reached the end (no new content)
      if (scrollHeight === previousHeight) {
        logger.info('Reached end of page or no more products loading')
        break
      }

      previousHeight = scrollHeight
      scrollAttempts++
    }

    logger.success(`Loaded ${currentProductCount} products after ${scrollAttempts} scrolls`)
  }

  /**
   * Extract product data directly from the index page
   */
  async extractProductsFromIndex(maxCount: number): Promise<IndexProduct[]> {
    if (!this.page) return []

    logger.info('Extracting product data from index page...')

    const products = await this.page.evaluate((max: number) => {
      const results: IndexProduct[] = []
      const seenUrls = new Set<string>()

      // Find all product card containers
      // Tradelle typically uses a grid of product cards
      const allLinks = document.querySelectorAll('a[href*="/products/"]')

      for (const link of allLinks) {
        if (results.length >= max) break

        const href = (link as HTMLAnchorElement).href

        // Skip if not a product detail link or already seen
        if (!href.match(/\/products\/\d+/) || seenUrls.has(href)) continue
        seenUrls.add(href)

        // Find the card container (parent element containing all product info)
        let card = link.closest('div')

        // Try to find a larger container if the immediate parent is too small
        let attempts = 0
        while (card && attempts < 5) {
          const cardText = card.textContent || ''
          // Check if this container has price info (indicates it's the full card)
          if (cardText.includes('$')) break
          card = card.parentElement as HTMLDivElement | null
          attempts++
        }

        if (!card) continue

        // Extract image
        let imageUrl = ''
        const img = card.querySelector('img')
        if (img) {
          imageUrl = img.src || img.getAttribute('data-src') || ''
        }

        // Extract title - look for the main text that's not a price
        let title = ''
        const textElements = card.querySelectorAll('h2, h3, h4, p, span, div')
        for (const el of textElements) {
          const text = el.textContent?.trim() || ''
          // Title is usually longer than 10 chars, doesn't start with $, and isn't too long
          if (text.length > 10 && text.length < 200 && !text.startsWith('$') &&
              !text.includes('Product Cost') && !text.includes('Selling Price') &&
              !text.includes('Profit') && !text.includes('Added to')) {
            // Check if this element is a direct text node (not containing nested elements with the real content)
            const children = el.children
            let hasOnlyTextContent = true
            for (const child of children) {
              if (child.textContent?.trim() === text) {
                hasOnlyTextContent = false
                break
              }
            }
            if (hasOnlyTextContent || children.length === 0) {
              title = text
              break
            }
          }
        }

        // Extract prices - look for $ amounts in the card
        const priceRegex = /\$[\d,]+\.?\d*/g
        const cardText = card.textContent || ''
        const prices = cardText.match(priceRegex) || []

        // Usually: first price is cost, second is selling price
        const cost = prices[0] || ''
        const price = prices[1] || ''

        // Clean up title - remove "Cost...", "Price...", "Show details", "Loading..." etc.
        if (title) {
          // Remove everything from "Cost" onwards
          const costIndex = title.indexOf('Cost')
          if (costIndex > 0) {
            title = title.substring(0, costIndex)
          }
          // Also clean up other patterns
          title = title
            .replace(/^Loading\.{0,3}/gi, '')  // Remove "Loading..." prefix
            .replace(/Price\$[\d,.]+/g, '')
            .replace(/Show\s*details/gi, '')
            .replace(/\$[\d,.]+/g, '')
            .trim()
        }

        // Only add if we have at least title or image
        if (title || imageUrl) {
          results.push({
            title,
            imageUrl,
            cost,
            price,
            productUrl: href,
          })
        }
      }

      return results
    }, maxCount)

    return products
  }
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs()

  if (options.debug) {
    logger.setDebug(true)
  }

  logger.divider('TRADELLE INDEX PAGE SCRAPER')
  logger.info(`Target: ${options.count} products`)
  logger.info(`Output: ${options.outputFile}`)
  logger.info('Method: Direct extraction from listing page (fast)')
  logger.divider()

  const config: Partial<ScraperConfig> = {
    headless: !options.visible,
    slowMo: options.visible ? 50 : 0,
    screenshotOnError: true,
    screenshotOnSuccess: false,
    timeout: 120000, // 2 minute timeout for slow pages
  }

  const scraper = new IndexPageScraper(config)

  try {
    // Initialize browser
    logger.info('Initializing browser...')
    await scraper.initialize()
    logger.success('Browser launched')

    // Check/load session
    const hasSession = await scraper['sessionManager'].hasValidSession()
    if (hasSession && scraper['context']) {
      logger.info('Loading saved session...')
      await scraper['sessionManager'].loadSession(scraper['context'])
    }

    // Navigate to products listing
    await scraper.navigateToProductsListing()

    // Take screenshot of initial page
    await scraper['screenshot']('index-page-initial')

    // Check authentication
    const isAuth = await scraper.isAuthenticated()
    if (!isAuth) {
      logger.warn('Not authenticated - please login manually')
      logger.divider('MANUAL LOGIN')
      logger.info('Please complete the login process in the browser window.')
      logger.info('The scraper will continue once you are logged in.')
      logger.divider()

      if (scraper.getPage()) {
        await scraper['sessionManager'].pauseForManualLogin(
          scraper.getPage()!,
          'nav, aside, [class*="sidebar"]'
        )

        if (scraper['context']) {
          await scraper['sessionManager'].saveSession(scraper['context'])
          logger.success('Session saved for future runs')
        }
      }

      // Re-navigate after login
      await scraper.navigateToProductsListing()
    }

    // Scroll to load products
    await scraper.scrollToLoadProducts(options.count)

    // Take screenshot after scrolling
    await scraper['screenshot']('index-page-loaded')

    // Extract products directly from index page
    logger.divider('EXTRACTING DATA')
    const products = await scraper.extractProductsFromIndex(options.count)

    logger.success(`Extracted ${products.length} products from index page`)

    // Log sample of data
    if (products.length > 0) {
      logger.divider('SAMPLE DATA')
      for (let i = 0; i < Math.min(3, products.length); i++) {
        const p = products[i]
        logger.info(`[${i + 1}] ${p.title?.substring(0, 50) || 'No title'}...`)
        logger.debug(`    Cost: ${p.cost}, Price: ${p.price}`)
        logger.debug(`    Image: ${p.imageUrl ? 'Yes' : 'No'}`)
      }
    }

    // Generate CSV
    logger.divider('GENERATING CSV')
    const csvRows = [getCSVHeader()]

    let validCount = 0
    for (const product of products) {
      if (product.title || product.imageUrl) {
        csvRows.push(productToCSVRow(product))
        validCount++
      }
    }

    // Save CSV
    const outputPath = path.join(process.cwd(), options.outputFile)
    await fs.writeFile(outputPath, csvRows.join('\n'), 'utf-8')
    logger.success(`CSV saved: ${outputPath}`)

    // Save JSON
    const jsonPath = outputPath.replace('.csv', '.json')
    await fs.writeFile(jsonPath, JSON.stringify(products, null, 2), 'utf-8')
    logger.success(`JSON saved: ${jsonPath}`)

    // Summary
    logger.divider('COMPLETE')
    logger.info(`Total products extracted: ${products.length}`)
    logger.info(`Valid products saved: ${validCount}`)

    // Analyze data quality
    const withTitle = products.filter(p => p.title).length
    const withImage = products.filter(p => p.imageUrl).length
    const withCost = products.filter(p => p.cost).length
    const withPrice = products.filter(p => p.price).length

    logger.divider('DATA QUALITY')
    logger.info(`With title: ${withTitle}/${products.length}`)
    logger.info(`With image: ${withImage}/${products.length}`)
    logger.info(`With cost: ${withCost}/${products.length}`)
    logger.info(`With price: ${withPrice}/${products.length}`)

  } catch (error) {
    logger.error('Fatal error', error)
    await scraper['screenshot']('error')
    process.exit(1)
  } finally {
    await scraper.cleanup()
  }
}

main().catch(error => {
  logger.error('Unhandled error', error)
  process.exit(1)
})
