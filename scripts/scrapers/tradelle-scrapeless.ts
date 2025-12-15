/**
 * Tradelle.io Scraper with Scrapeless Cloud Browser
 * Uses IP rotation for reliable scraping
 *
 * Usage:
 *   npx tsx scripts/scrapers/tradelle-scrapeless.ts --count=100
 *   npx tsx scripts/scrapers/tradelle-scrapeless.ts --count=200 --country=US
 */

import { chromium, type Browser, type Page } from 'playwright'
import { promises as fs } from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

interface IndexProduct {
  title: string
  imageUrl: string
  cost: string
  price: string
  productUrl: string
}

interface ScrapeOptions {
  count: number
  outputFile: string
  proxyCountry: string
  sessionTTL: number
}

function parseArgs(): ScrapeOptions {
  const args = process.argv.slice(2)
  const options: ScrapeOptions = {
    count: 100,
    outputFile: 'tradelle-index-products.json',
    proxyCountry: 'US',
    sessionTTL: 300,
  }

  for (const arg of args) {
    if (arg.startsWith('--count=')) {
      options.count = parseInt(arg.substring(8), 10)
    } else if (arg.startsWith('--output=')) {
      options.outputFile = arg.substring(9)
    } else if (arg.startsWith('--country=')) {
      options.proxyCountry = arg.substring(10)
    } else if (arg.startsWith('--ttl=')) {
      options.sessionTTL = parseInt(arg.substring(6), 10)
    } else if (arg === '--help' || arg === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp(): void {
  console.log(`
Tradelle Scraper with Scrapeless Cloud Browser

Scrapes products with automatic IP rotation via Scrapeless.

Usage:
  npx tsx scripts/scrapers/tradelle-scrapeless.ts [options]

Options:
  --count=<n>       Number of products to scrape (default: 100)
  --output=<file>   Output JSON filename (default: tradelle-index-products.json)
  --country=<code>  Proxy country code (default: US)
  --ttl=<seconds>   Session TTL in seconds (default: 300)
  --help, -h        Show this help message

Examples:
  npx tsx scripts/scrapers/tradelle-scrapeless.ts --count=200
  npx tsx scripts/scrapers/tradelle-scrapeless.ts --count=100 --country=GB
  `)
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info'): void {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
  }
  const reset = '\x1b[0m'
  const prefix = {
    info: '[i]',
    success: '[✓]',
    error: '[✗]',
    warn: '[!]',
  }
  console.log(`${colors[type]}${prefix[type]}${reset} ${message}`)
}

function divider(title?: string): void {
  if (title) {
    console.log(`\n${'='.repeat(20)} ${title} ${'='.repeat(20)}`)
  } else {
    console.log('='.repeat(50))
  }
}

async function connectToScrapeless(options: ScrapeOptions): Promise<{ browser: Browser; page: Page }> {
  const apiKey = process.env.SCRAPELESS_API_KEY

  if (!apiKey) {
    throw new Error('SCRAPELESS_API_KEY not found in .env.local')
  }

  const wsUrl = `wss://browser.scrapeless.com/browser?token=${apiKey}&session_ttl=${options.sessionTTL}&proxy_country=${options.proxyCountry}`

  log(`Connecting to Scrapeless cloud browser...`)
  log(`Proxy country: ${options.proxyCountry}`)
  log(`Session TTL: ${options.sessionTTL}s`)

  const browser = await chromium.connectOverCDP(wsUrl, {
    timeout: 120000,
  })

  log('Connected to cloud browser', 'success')

  // Get or create context and page
  const contexts = browser.contexts()
  const context = contexts.length > 0 ? contexts[0] : await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  })

  const pages = context.pages()
  const page = pages.length > 0 ? pages[0] : await context.newPage()

  page.setDefaultTimeout(60000)

  return { browser, page }
}

async function waitForPageLoad(page: Page): Promise<void> {
  log('Waiting for page to load...')

  const loadingSelectors = [
    'text=Loading user data',
    'text=Loading...',
    '[class*="loading"]',
    '[class*="spinner"]',
  ]

  for (const selector of loadingSelectors) {
    try {
      const el = await page.$(selector)
      if (el) {
        await page.waitForSelector(selector, { state: 'hidden', timeout: 30000 })
      }
    } catch (e) {
      // Ignore
    }
  }

  await page.waitForTimeout(2000)
  log('Page loaded', 'success')
}

async function navigateToProducts(page: Page): Promise<void> {
  log('Navigating to Tradelle...')

  await page.goto('https://app.tradelle.io', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(3000)

  // Check current URL
  let currentUrl = page.url()
  log(`Current URL: ${currentUrl}`)

  // Check if we need to login
  if (currentUrl.includes('/login') || currentUrl.includes('/sign-in') || currentUrl.includes('account.tradelle')) {
    log('Login page detected - logging in...', 'warn')

    const email = process.env.TRADELLE_EMAIL
    const password = process.env.TRADELLE_PASSWORD

    if (email && password) {
      log(`Using email: ${email}`)

      // Wait for page to fully load
      await page.waitForTimeout(3000)

      // Try multiple selectors for email input
      const emailSelectors = [
        'input[type="email"]',
        'input[name="email"]',
        'input[id="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        '#identifier-field',
        'input[name="identifier"]',
      ]

      let emailInput = null
      for (const selector of emailSelectors) {
        try {
          emailInput = await page.$(selector)
          if (emailInput) {
            log(`Found email input: ${selector}`)
            break
          }
        } catch (e) {
          // Continue
        }
      }

      if (!emailInput) {
        // Take screenshot for debugging
        log('Could not find email input, taking screenshot...')
        await page.screenshot({ path: 'login-page-debug.png' })
        throw new Error('Could not find email input on login page')
      }

      // Fill email
      await emailInput.fill(email)
      await page.waitForTimeout(1000)

      // Try to find password input
      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        'input[id="password"]',
      ]

      let passwordInput = null
      for (const selector of passwordSelectors) {
        try {
          passwordInput = await page.$(selector)
          if (passwordInput) {
            log(`Found password input: ${selector}`)
            break
          }
        } catch (e) {
          // Continue
        }
      }

      if (passwordInput) {
        await passwordInput.fill(password)
        await page.waitForTimeout(500)
      } else {
        // Some login flows have email first, then password on next screen
        log('No password field yet, clicking continue...')
        const continueBtn = await page.$('button[type="submit"], button:has-text("Continue"), button:has-text("Next")')
        if (continueBtn) {
          await continueBtn.click()
          await page.waitForTimeout(2000)

          // Now look for password
          const pwdInput = await page.$('input[type="password"]')
          if (pwdInput) {
            await pwdInput.fill(password)
            await page.waitForTimeout(500)
          }
        }
      }

      // Click login/submit button
      const submitBtn = await page.$('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Continue")')
      if (submitBtn) {
        await submitBtn.click()
        log('Submitted login form...')
      }

      // Wait for navigation
      await page.waitForTimeout(8000)
      await waitForPageLoad(page)

      currentUrl = page.url()
      log(`After login URL: ${currentUrl}`)

      if (currentUrl.includes('/sign-in') || currentUrl.includes('/login')) {
        throw new Error('Login failed - still on login page')
      }

      log('Login successful!', 'success')
    } else {
      throw new Error('Not logged in and no TRADELLE_EMAIL/TRADELLE_PASSWORD in .env.local')
    }
  }

  // Wait for dashboard to load
  await page.waitForTimeout(3000)

  // Navigate to products via sidebar
  log('Looking for Product Research menu...')

  // Try clicking Product Research in sidebar
  try {
    const productResearchMenu = await page.$('text=Product Research')
    if (productResearchMenu) {
      log('Found Product Research menu, clicking...')
      await productResearchMenu.click()
      await page.waitForTimeout(2000)
    }
  } catch (e) {
    log('Could not find Product Research menu', 'warn')
  }

  // Click Product Picks or similar submenu
  log('Looking for products submenu...')
  const submenuSelectors = [
    'text=Product Picks',
    'text=Hand-Picked',
    'text=Winning Products',
    'text=All Products',
    'a[href*="/products"]',
    'a[href*="/picks"]',
  ]

  let foundMenu = false
  for (const selector of submenuSelectors) {
    try {
      const menuItem = await page.$(selector)
      if (menuItem) {
        log(`Found menu item: ${selector}`)
        await menuItem.click()
        await page.waitForTimeout(3000)
        foundMenu = true
        break
      }
    } catch (e) {
      // Continue to next selector
    }
  }

  if (!foundMenu) {
    log('Could not find products menu, trying direct URL...', 'warn')
    await page.goto('https://app.tradelle.io/products', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
  }

  currentUrl = page.url()
  log(`Final URL: ${currentUrl}`)
  log('On products page', 'success')
}

async function scrollToLoadProducts(page: Page, targetCount: number): Promise<number> {
  log(`Scrolling to load ${targetCount} products...`)

  // Wait for page to stabilize first
  await page.waitForTimeout(5000)

  let previousHeight = 0
  let currentCount = 0
  let scrollAttempts = 0
  const maxScrollAttempts = 50

  while (currentCount < targetCount && scrollAttempts < maxScrollAttempts) {
    try {
      const scrollHeight = await page.evaluate(() => document.body.scrollHeight)

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(2000)

      currentCount = await page.evaluate(() => {
        const links = document.querySelectorAll('a[href*="/products/"]')
        const uniqueUrls = new Set<string>()
        links.forEach(link => {
          const href = (link as HTMLAnchorElement).href
          if (href.match(/\/products\/\d+/)) {
            uniqueUrls.add(href)
          }
        })
        return uniqueUrls.size
      })

      if (scrollHeight === previousHeight) {
        log(`Reached end of page at ${currentCount} products`, 'warn')
        break
      }

      previousHeight = scrollHeight
      scrollAttempts++

      if (scrollAttempts % 5 === 0) {
        log(`Loaded ${currentCount} products so far...`)
      }
    } catch (e) {
      log(`Scroll error (attempt ${scrollAttempts}): ${e}`, 'warn')
      await page.waitForTimeout(2000)
      scrollAttempts++
    }
  }

  log(`Loaded ${currentCount} products after ${scrollAttempts} scrolls`, 'success')
  return currentCount
}

async function extractProducts(page: Page, maxCount: number): Promise<IndexProduct[]> {
  log('Extracting product data...')

  const products = await page.evaluate((max: number) => {
    const results: IndexProduct[] = []
    const seenUrls = new Set<string>()

    const allLinks = document.querySelectorAll('a[href*="/products/"]')

    for (const link of allLinks) {
      if (results.length >= max) break

      const href = (link as HTMLAnchorElement).href
      if (!href.match(/\/products\/\d+/) || seenUrls.has(href)) continue
      seenUrls.add(href)

      let card = link.closest('div')
      let attempts = 0
      while (card && attempts < 5) {
        const cardText = card.textContent || ''
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

      // Extract title
      let title = ''
      const textElements = card.querySelectorAll('h2, h3, h4, p, span, div')
      for (const el of textElements) {
        const text = el.textContent?.trim() || ''
        if (text.length > 10 && text.length < 200 && !text.startsWith('$') &&
            !text.includes('Product Cost') && !text.includes('Selling Price') &&
            !text.includes('Profit') && !text.includes('Added to')) {
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

      // Extract prices
      const priceRegex = /\$[\d,]+\.?\d*/g
      const cardText = card.textContent || ''
      const prices = cardText.match(priceRegex) || []
      const cost = prices[0] || ''
      const price = prices[1] || ''

      // Clean title
      if (title) {
        const costIndex = title.indexOf('Cost')
        if (costIndex > 0) {
          title = title.substring(0, costIndex)
        }
        title = title
          .replace(/^Loading\.{0,3}/gi, '')
          .replace(/Price\$[\d,.]+/g, '')
          .replace(/Show\s*details/gi, '')
          .replace(/\$[\d,.]+/g, '')
          .trim()
      }

      if (title || imageUrl) {
        results.push({ title, imageUrl, cost, price, productUrl: href })
      }
    }

    return results
  }, maxCount)

  log(`Extracted ${products.length} products`, 'success')
  return products
}

async function main() {
  const options = parseArgs()

  divider('TRADELLE SCRAPELESS SCRAPER')
  log(`Target: ${options.count} products`)
  log(`Output: ${options.outputFile}`)
  log(`Using Scrapeless cloud browser with IP rotation`)
  divider()

  let browser: Browser | null = null

  try {
    // Connect to Scrapeless
    const connection = await connectToScrapeless(options)
    browser = connection.browser
    const page = connection.page

    // Check IP
    log('Verifying IP rotation...')
    await page.goto('https://api.ipify.org?format=json', { waitUntil: 'domcontentloaded' })
    const ipText = await page.textContent('body')
    log(`Current IP: ${ipText}`, 'success')

    // Navigate to Tradelle products
    await navigateToProducts(page)

    // Scroll to load products
    await scrollToLoadProducts(page, options.count)

    // Extract products
    const products = await extractProducts(page, options.count)

    // Save results
    divider('SAVING RESULTS')

    const outputPath = path.join(process.cwd(), options.outputFile)
    await fs.writeFile(outputPath, JSON.stringify(products, null, 2), 'utf-8')
    log(`JSON saved: ${outputPath}`, 'success')

    // Also save CSV
    const csvPath = outputPath.replace('.json', '.csv')
    const csvHeader = 'title,image_url,cost,selling_price,product_url,scraped_at'
    const csvRows = products.map(p => [
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${p.imageUrl}"`,
      `"${p.cost}"`,
      `"${p.price}"`,
      `"${p.productUrl}"`,
      `"${new Date().toISOString()}"`,
    ].join(','))
    await fs.writeFile(csvPath, [csvHeader, ...csvRows].join('\n'), 'utf-8')
    log(`CSV saved: ${csvPath}`, 'success')

    // Summary
    divider('COMPLETE')
    log(`Total products: ${products.length}`)

    const withTitle = products.filter(p => p.title).length
    const withImage = products.filter(p => p.imageUrl).length
    const withCost = products.filter(p => p.cost).length
    const withPrice = products.filter(p => p.price).length

    log(`With title: ${withTitle}/${products.length}`)
    log(`With image: ${withImage}/${products.length}`)
    log(`With cost: ${withCost}/${products.length}`)
    log(`With price: ${withPrice}/${products.length}`)

  } catch (error) {
    log(`Error: ${error}`, 'error')
    throw error
  } finally {
    if (browser) {
      await browser.close()
      log('Browser closed')
    }
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
