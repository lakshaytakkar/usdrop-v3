/**
 * Scrapeless Browser Integration
 * Provides cloud browser with automatic IP rotation
 */

import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

export interface ScrapelessConfig {
  apiKey?: string
  sessionTTL?: number // 60-900 seconds, default 180
  sessionName?: string
  proxyCountry?: string // ISO country code or 'ANY'
  proxyState?: string
  proxyCity?: string
  sessionRecording?: boolean
}

const DEFAULT_CONFIG: ScrapelessConfig = {
  sessionTTL: 300, // 5 minutes
  proxyCountry: 'US',
  sessionRecording: false,
}

/**
 * Build Scrapeless WebSocket connection URL
 */
export function buildScrapelessUrl(config: ScrapelessConfig = {}): string {
  const apiKey = config.apiKey || process.env.SCRAPELESS_API_KEY

  if (!apiKey) {
    throw new Error('SCRAPELESS_API_KEY not found in environment variables')
  }

  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const params = new URLSearchParams({
    token: apiKey,
    sessionTTL: String(mergedConfig.sessionTTL),
  })

  if (mergedConfig.sessionName) {
    params.append('sessionName', mergedConfig.sessionName)
  }

  if (mergedConfig.proxyCountry) {
    params.append('proxyCountry', mergedConfig.proxyCountry)
  }

  if (mergedConfig.proxyState) {
    params.append('proxyState', mergedConfig.proxyState)
  }

  if (mergedConfig.proxyCity) {
    params.append('proxyCity', mergedConfig.proxyCity)
  }

  if (mergedConfig.sessionRecording) {
    params.append('sessionRecording', 'true')
  }

  return `wss://browser.scrapeless.com/browser?token=${apiKey}&session_ttl=${mergedConfig.sessionTTL}&proxy_country=${mergedConfig.proxyCountry || 'ANY'}`
}

/**
 * Connect to Scrapeless browser service
 */
export async function connectScrapeless(config: ScrapelessConfig = {}): Promise<{
  browser: Browser
  context: BrowserContext
  page: Page
}> {
  const wsUrl = buildScrapelessUrl(config)

  console.log('[Scrapeless] Connecting to cloud browser...')
  console.log(`[Scrapeless] Proxy country: ${config.proxyCountry || 'US'}`)
  console.log(`[Scrapeless] Session TTL: ${config.sessionTTL || 300}s`)

  try {
    // Connect via Chrome DevTools Protocol
    const browser = await chromium.connectOverCDP(wsUrl, {
      timeout: 60000, // 60 second connection timeout
    })

    console.log('[Scrapeless] Connected to cloud browser')

    // Get or create context
    const contexts = browser.contexts()
    let context: BrowserContext

    if (contexts.length > 0) {
      context = contexts[0]
      console.log('[Scrapeless] Using existing browser context')
    } else {
      context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      })
      console.log('[Scrapeless] Created new browser context')
    }

    // Get or create page
    const pages = context.pages()
    let page: Page

    if (pages.length > 0) {
      page = pages[0]
      console.log('[Scrapeless] Using existing page')
    } else {
      page = await context.newPage()
      console.log('[Scrapeless] Created new page')
    }

    // Set default timeout
    page.setDefaultTimeout(60000)

    console.log('[Scrapeless] Browser ready with IP rotation enabled')

    return { browser, context, page }
  } catch (error) {
    console.error('[Scrapeless] Connection failed:', error)
    throw error
  }
}

/**
 * Test Scrapeless connection and IP
 */
export async function testScrapelessConnection(): Promise<void> {
  console.log('========================================')
  console.log('  SCRAPELESS CONNECTION TEST')
  console.log('========================================\n')

  const { browser, context, page } = await connectScrapeless({
    sessionTTL: 120,
    proxyCountry: 'US',
  })

  try {
    // Check IP address
    console.log('Checking IP address...')
    await page.goto('https://api.ipify.org?format=json', { waitUntil: 'domcontentloaded' })
    const ipText = await page.textContent('body')
    console.log(`Current IP: ${ipText}`)

    // Check geo location
    console.log('\nChecking geolocation...')
    await page.goto('https://ipapi.co/json/', { waitUntil: 'domcontentloaded' })
    const geoText = await page.textContent('body')
    const geoData = JSON.parse(geoText || '{}')
    console.log(`Country: ${geoData.country_name}`)
    console.log(`City: ${geoData.city}`)
    console.log(`ISP: ${geoData.org}`)

    console.log('\n[SUCCESS] Scrapeless connection working!')
  } finally {
    await browser.close()
  }
}

// Run test if executed directly
if (require.main === module) {
  testScrapelessConnection().catch(console.error)
}
