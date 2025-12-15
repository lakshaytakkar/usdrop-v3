/**
 * Abstract base class for web scrapers
 * Provides common infrastructure: browser management, screenshots, error handling
 */

import { chromium, type Browser, type BrowserContext, type Page, type ElementHandle } from 'playwright'
import * as path from 'path'
import { logger } from './utils/logger'
import { SessionManager } from './utils/session-manager'
import { Validator } from './utils/validator'
import type { ScraperConfig, ScrapeResult, DEFAULT_CONFIG } from './utils/types'

export abstract class BaseScraper {
  protected browser: Browser | null = null
  protected context: BrowserContext | null = null
  protected page: Page | null = null
  protected logger = logger
  protected sessionManager: SessionManager
  protected validator: Validator
  protected config: ScraperConfig

  private screenshotCounter = 0
  private screenshotDir = path.join(process.cwd(), 'scripts', 'scrapers', 'output', 'screenshots')

  constructor(config: Partial<ScraperConfig> = {}, sessionManager: SessionManager) {
    // Merge with defaults
    const DEFAULT_CONFIG: ScraperConfig = {
      headless: false,
      slowMo: 100,
      screenshotOnError: true,
      screenshotOnSuccess: true,
      maxRetries: 3,
      timeout: 30000,
      viewport: { width: 1280, height: 720 },
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    }

    this.config = { ...DEFAULT_CONFIG, ...config }
    this.sessionManager = sessionManager
    this.validator = new Validator()
  }

  /**
   * Initialize the scraper (launch browser, create context)
   */
  async initialize(): Promise<void> {
    logger.info('Initializing scraper...')
    logger.startTimer('initialize')

    await this.launchBrowser()
    await this.createContext()
    await this.createPage()

    logger.endTimer('initialize')
    logger.success('Scraper initialized')
  }

  /**
   * Cleanup resources (close browser)
   */
  async cleanup(): Promise<void> {
    logger.info('Cleaning up resources...')

    try {
      if (this.page) {
        await this.page.close()
        this.page = null
      }

      if (this.context) {
        await this.context.close()
        this.context = null
      }

      if (this.browser) {
        await this.browser.close()
        this.browser = null
      }

      logger.success('Cleanup complete')
    } catch (error) {
      logger.error('Error during cleanup', error)
    }
  }

  /**
   * Launch browser with configuration
   */
  protected async launchBrowser(): Promise<void> {
    logger.info('Launching browser...')
    logger.debug('Config', {
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      executablePath: this.config.executablePath,
    })

    try {
      // Use Playwright's bundled Chromium if no executablePath specified
      const launchOptions: any = {
        headless: this.config.headless,
        slowMo: this.config.slowMo,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage',
          '--no-sandbox',
        ],
      }

      // Only use custom executable if it exists
      if (this.config.executablePath) {
        const fs = require('fs')
        if (fs.existsSync(this.config.executablePath)) {
          launchOptions.executablePath = this.config.executablePath
        }
      }

      this.browser = await chromium.launch(launchOptions)

      logger.success('Browser launched')
    } catch (error) {
      logger.error('Failed to launch browser', error)
      throw error
    }
  }

  /**
   * Create browser context
   */
  protected async createContext(): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser not initialized')
    }

    logger.info('Creating browser context...')

    this.context = await this.browser.newContext({
      viewport: this.config.viewport,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    })

    logger.success('Browser context created')
  }

  /**
   * Create a new page
   */
  protected async createPage(): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized')
    }

    logger.info('Creating new page...')
    this.page = await this.context.newPage()

    // Set default timeout
    this.page.setDefaultTimeout(this.config.timeout)

    logger.success('Page created')
  }

  /**
   * Navigate to URL with logging
   */
  protected async navigateTo(url: string, waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized')
    }

    logger.info(`Navigating to: ${url}`)
    logger.startTimer('navigation')

    try {
      await this.page.goto(url, { waitUntil })
      const duration = logger.endTimer('navigation')
      logger.success(`Page loaded in ${(duration / 1000).toFixed(2)}s`)
    } catch (error) {
      logger.error('Navigation failed', error)
      if (this.config.screenshotOnError) {
        await this.screenshot('navigation-error')
      }
      throw error
    }
  }

  /**
   * Wait for selector with logging
   */
  protected async waitForSelector(
    selector: string,
    options?: { timeout?: number; state?: 'attached' | 'detached' | 'visible' | 'hidden' }
  ): Promise<ElementHandle | null> {
    if (!this.page) {
      throw new Error('Page not initialized')
    }

    const timeout = options?.timeout || this.config.timeout
    logger.debug(`Waiting for selector: "${selector}" (timeout: ${timeout}ms)`)

    try {
      const element = await this.page.waitForSelector(selector, {
        timeout,
        state: options?.state || 'visible',
      })

      if (element) {
        logger.selector(selector, selector, true)
        return element
      } else {
        logger.selector(selector, selector, false)
        return null
      }
    } catch (error) {
      logger.selector(selector, selector, false)
      logger.debug(`Selector timeout: "${selector}"`)

      // Log page content for debugging
      if (logger.isDebugEnabled()) {
        const html = await this.page.content()
        logger.html('Page content when selector failed', html, 1000)
      }

      return null
    }
  }

  /**
   * Take a screenshot with automatic naming
   */
  protected async screenshot(name: string): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized')
    }

    this.screenshotCounter++
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    const filename = `${String(this.screenshotCounter).padStart(2, '0')}-${name}-${timestamp}.png`
    const filepath = path.join(this.screenshotDir, filename)

    try {
      await this.page.screenshot({
        path: filepath,
        fullPage: false,
      })
      logger.screenshot(filepath)
      return filepath
    } catch (error) {
      logger.error('Failed to take screenshot', error)
      return ''
    }
  }

  /**
   * Take screenshot of specific element
   */
  protected async screenshotElement(selector: string, name: string): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized')
    }

    try {
      const element = await this.page.$(selector)
      if (!element) {
        logger.warn(`Element not found for screenshot: ${selector}`)
        return ''
      }

      this.screenshotCounter++
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
      const filename = `${String(this.screenshotCounter).padStart(2, '0')}-element-${name}-${timestamp}.png`
      const filepath = path.join(this.screenshotDir, filename)

      await element.screenshot({ path: filepath })
      logger.screenshot(filepath)
      return filepath
    } catch (error) {
      logger.error('Failed to take element screenshot', error)
      return ''
    }
  }

  /**
   * Take full page screenshot
   */
  protected async screenshotFullPage(name: string): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized')
    }

    this.screenshotCounter++
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
    const filename = `${String(this.screenshotCounter).padStart(2, '0')}-fullpage-${name}-${timestamp}.png`
    const filepath = path.join(this.screenshotDir, filename)

    try {
      await this.page.screenshot({
        path: filepath,
        fullPage: true,
      })
      logger.screenshot(filepath)
      return filepath
    } catch (error) {
      logger.error('Failed to take full page screenshot', error)
      return ''
    }
  }

  /**
   * Retry an operation with exponential backoff
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
    operationName: string = 'operation'
  ): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`${operationName} - Attempt ${attempt}/${maxRetries}`)
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        logger.warn(`${operationName} - Attempt ${attempt} failed: ${lastError.message}`)

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          logger.debug(`Retrying in ${delay}ms...`)
          await this.page?.waitForTimeout(delay)
        }
      }
    }

    throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`)
  }

  /**
   * Pause for debugging
   */
  protected async pause(message: string, durationMs: number = 3000): Promise<void> {
    logger.info(`⏸️  PAUSE: ${message}`)
    logger.info(`Resuming in ${durationMs / 1000}s...`)
    await this.page?.waitForTimeout(durationMs)
  }

  /**
   * Interactive pause (wait indefinitely for user input)
   */
  protected async interactivePause(message: string = 'Press Ctrl+C to continue...'): Promise<void> {
    logger.divider('PAUSED')
    logger.info(message)
    logger.divider()

    // Wait for user to press Enter
    await new Promise<void>((resolve) => {
      process.stdin.once('data', () => resolve())
    })

    logger.info('Resuming...')
  }

  /**
   * Get current page URL
   */
  protected getCurrentUrl(): string {
    return this.page?.url() || ''
  }

  /**
   * Get page title
   */
  protected async getPageTitle(): Promise<string> {
    return await this.page?.title() || ''
  }

  /**
   * Extract text content from selector
   */
  protected async extractText(selector: string): Promise<string | null> {
    if (!this.page) return null

    try {
      const element = await this.page.$(selector)
      if (!element) {
        logger.selector('text', selector, false)
        return null
      }

      const text = await element.textContent()
      logger.selector('text', selector, true)
      return text?.trim() || null
    } catch (error) {
      logger.debug(`Error extracting text from ${selector}`, error)
      return null
    }
  }

  /**
   * Extract attribute from selector
   */
  protected async extractAttribute(selector: string, attribute: string): Promise<string | null> {
    if (!this.page) return null

    try {
      const element = await this.page.$(selector)
      if (!element) {
        logger.selector(attribute, selector, false)
        return null
      }

      const value = await element.getAttribute(attribute)
      logger.selector(attribute, selector, true)
      return value
    } catch (error) {
      logger.debug(`Error extracting ${attribute} from ${selector}`, error)
      return null
    }
  }

  /**
   * Extract multiple elements matching selector
   */
  protected async extractAll(selector: string): Promise<ElementHandle[]> {
    if (!this.page) return []

    try {
      const elements = await this.page.$$(selector)
      logger.selector('multiple', selector, elements.length > 0)
      logger.debug(`Found ${elements.length} elements`)
      return elements
    } catch (error) {
      logger.debug(`Error extracting multiple elements from ${selector}`, error)
      return []
    }
  }

  // Abstract methods that must be implemented by subclasses
  abstract scrape(): Promise<ScrapeResult>
  abstract isAuthenticated(): Promise<boolean>
}
