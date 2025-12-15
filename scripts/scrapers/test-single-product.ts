/**
 * Test script for scraping a single product from Tradelle.io
 * Usage:
 *   npx tsx scripts/scrapers/test-single-product.ts
 *   npx tsx scripts/scrapers/test-single-product.ts --url="https://app.tradelle.io/products/123"
 *   npx tsx scripts/scrapers/test-single-product.ts --debug --visible
 */

import { TradelleScraper } from './tradelle-scraper'
import { logger } from './utils/logger'
import type { ScraperConfig, TestOptions } from './utils/types'
import { promises as fs } from 'fs'
import * as path from 'path'

/**
 * Parse command-line arguments
 */
function parseArgs(): TestOptions {
  const args = process.argv.slice(2)
  const options: TestOptions = {
    visible: true, // Default to visible for debugging
    debug: false,
    save: false,
    useSession: true,
    forceLogin: false,
  }

  for (const arg of args) {
    if (arg.startsWith('--url=')) {
      options.url = arg.substring(6)
    } else if (arg === '--debug') {
      options.debug = true
    } else if (arg === '--visible') {
      options.visible = true
    } else if (arg === '--headless') {
      options.visible = false
    } else if (arg === '--save') {
      options.save = true
    } else if (arg === '--no-session') {
      options.useSession = false
    } else if (arg === '--force-login') {
      options.forceLogin = true
    } else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

/**
 * Print usage help
 */
function printHelp(): void {
  console.log(`
Tradelle Product Scraper - Test Script

Usage:
  npx tsx scripts/scrapers/test-single-product.ts [options]

Options:
  --url=<url>       Specific product URL to scrape
  --debug           Enable debug logging (shows selectors, HTML snippets)
  --visible         Run browser in visible mode (default)
  --headless        Run browser in headless mode
  --save            Save extracted data to Supabase
  --no-session      Don't use saved session (always login)
  --force-login     Force new login (clear existing session)
  --help, -h        Show this help message

Examples:
  # Scrape first product with visible browser
  npx tsx scripts/scrapers/test-single-product.ts

  # Scrape specific product with debug logging
  npx tsx scripts/scrapers/test-single-product.ts --url="https://app.tradelle.io/products/123" --debug

  # Force new login and save to database
  npx tsx scripts/scrapers/test-single-product.ts --force-login --save
  `)
}

/**
 * Save scrape result to JSON file
 */
async function saveResultToFile(result: any, outputDir: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
  const filename = `product-${timestamp}.json`
  const filepath = path.join(outputDir, filename)

  await fs.writeFile(
    filepath,
    JSON.stringify(result, null, 2),
    'utf-8'
  )

  return filepath
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
  logger.divider('TRADELLE SCRAPER - TEST MODE')
  logger.info('Starting single product scrape test...')
  if (options.url) {
    logger.info(`Target URL: ${options.url}`)
  }
  if (options.debug) {
    logger.info('Debug mode: ENABLED')
  }
  logger.divider()

  // Create scraper configuration
  const config: Partial<ScraperConfig> = {
    headless: !options.visible,
    slowMo: options.visible ? 100 : 0,
    screenshotOnError: true,
    screenshotOnSuccess: true,
    timeout: 30000,
  }

  // Initialize scraper
  const scraper = new TradelleScraper(config)

  try {
    // Initialize browser
    await scraper.initialize()
    logger.success('Scraper initialized')

    // Force login if requested
    if (options.forceLogin) {
      logger.info('Clearing existing session (--force-login)')
      await scraper['sessionManager'].clearSession()
    }

    // Run scrape
    let result

    if (options.url) {
      // Scrape specific URL
      result = await scraper.scrapeProduct(options.url)
    } else {
      // Scrape first available product
      result = await scraper.scrape()
    }

    // Print results summary
    logger.divider('RESULTS SUMMARY')

    if (result.success) {
      logger.success('Scraping completed successfully!')
    } else {
      logger.error('Scraping completed with errors')
    }

    logger.info(`Completeness Score: ${result.validationResult.completenessScore}%`)
    logger.info(`Required Fields: ${result.validationResult.requiredFieldsComplete ? 'Complete' : 'Incomplete'}`)
    logger.info(`Screenshots Taken: ${result.screenshots.length}`)
    logger.info(`Duration: ${(result.timing.durationMs / 1000).toFixed(2)}s`)

    // Print extracted data
    logger.divider('EXTRACTED DATA')
    console.log(JSON.stringify(result.rawData, null, 2))

    // Save to file
    const outputDir = path.join(process.cwd(), 'scripts', 'scrapers', 'output', 'data')
    const filepath = await saveResultToFile(result, outputDir)
    logger.success(`Data saved to: ${filepath}`)

    // Save to Supabase if requested
    if (options.save) {
      logger.divider('SAVING TO DATABASE')
      logger.info('Database save functionality not yet implemented')
      logger.info('You can manually import the JSON file into Supabase')
      logger.info(`File: ${filepath}`)
    }

    // Print validation warnings
    if (result.validationResult.warnings.length > 0) {
      logger.divider('WARNINGS')
      for (const warning of result.validationResult.warnings) {
        logger.warn(warning)
      }
    }

    // Print missing fields
    if (result.validationResult.missingFields.length > 0) {
      logger.divider('MISSING FIELDS')
      logger.warn('The following fields were not extracted:')
      for (const field of result.validationResult.missingFields) {
        console.log(`  - ${field}`)
      }
      logger.info('\nTo fix: Update selectors in tradelle-scraper.ts after inspecting the page')
    }

    logger.divider('TEST COMPLETE')

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1)
  } catch (error) {
    logger.error('Fatal error during scraping', error)
    process.exit(1)
  } finally {
    // Cleanup
    try {
      await scraper.cleanup()
    } catch (error) {
      logger.error('Error during cleanup', error)
    }
  }
}

// Run main function
main().catch(error => {
  logger.error('Unhandled error', error)
  process.exit(1)
})
