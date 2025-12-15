/**
 * Browser session management for persistent authentication
 * Saves and loads cookies to avoid repeated manual logins
 */

import { promises as fs } from 'fs'
import * as path from 'path'
import type { BrowserContext, Page } from 'playwright'
import { logger } from './logger'
import type { SessionData } from './types'

const SESSION_VERSION = '1.0'
const DEFAULT_SESSION_TTL_DAYS = 7
const SESSION_DIR = path.join(process.cwd(), '.playwright-session')

export class SessionManager {
  private sessionFilePath: string
  private domain: string
  private ttlDays: number

  constructor(domain: string = 'tradelle.io', ttlDays: number = DEFAULT_SESSION_TTL_DAYS) {
    this.domain = domain
    this.ttlDays = ttlDays
    this.sessionFilePath = path.join(SESSION_DIR, `${domain.replace(/\./g, '-')}-session.json`)
  }

  /**
   * Check if a valid session exists
   */
  async hasValidSession(): Promise<boolean> {
    try {
      const exists = await this.fileExists(this.sessionFilePath)
      if (!exists) {
        logger.debug('No session file found')
        return false
      }

      const sessionData = await this.loadSessionData()
      if (!sessionData) {
        logger.debug('Session file is invalid')
        return false
      }

      // Check expiry
      const expiresAt = new Date(sessionData.expiresAt)
      const now = new Date()

      if (now >= expiresAt) {
        logger.debug('Session has expired')
        return false
      }

      const daysRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      logger.success(`Valid session found (${daysRemaining} days remaining)`)
      return true
    } catch (error) {
      logger.debug('Error checking session validity', error)
      return false
    }
  }

  /**
   * Save browser session (cookies and storage)
   */
  async saveSession(context: BrowserContext): Promise<void> {
    try {
      logger.info('Saving browser session...')
      logger.startTimer('save-session')

      // Ensure session directory exists
      await this.ensureSessionDir()

      // Get cookies
      const cookies = await context.cookies()
      logger.debug(`Retrieved ${cookies.length} cookies`)

      // Get localStorage (requires a page)
      const pages = context.pages()
      let localStorage: Record<string, string> = {}

      if (pages.length > 0) {
        const page = pages[0]
        try {
          localStorage = await page.evaluate(() => {
            const storage: Record<string, string> = {}
            for (let i = 0; i < window.localStorage.length; i++) {
              const key = window.localStorage.key(i)
              if (key) {
                storage[key] = window.localStorage.getItem(key) || ''
              }
            }
            return storage
          })
          logger.debug(`Retrieved ${Object.keys(localStorage).length} localStorage items`)
        } catch (error) {
          logger.warn('Could not retrieve localStorage', error)
        }
      }

      // Create session data
      const now = new Date()
      const expiresAt = new Date(now.getTime() + this.ttlDays * 24 * 60 * 60 * 1000)

      const sessionData: SessionData = {
        version: SESSION_VERSION,
        domain: this.domain,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        cookies: cookies.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          expires: cookie.expires || -1,
          httpOnly: cookie.httpOnly,
          secure: cookie.secure,
          sameSite: cookie.sameSite as 'Strict' | 'Lax' | 'None' | undefined,
        })),
        localStorage,
      }

      // Write to file
      await fs.writeFile(
        this.sessionFilePath,
        JSON.stringify(sessionData, null, 2),
        'utf-8'
      )

      const duration = logger.endTimer('save-session')
      logger.success(`Session saved to ${this.sessionFilePath}`)
    } catch (error) {
      logger.error('Failed to save session', error)
      throw error
    }
  }

  /**
   * Load saved session into browser context
   */
  async loadSession(context: BrowserContext): Promise<boolean> {
    try {
      logger.info('Loading saved session...')
      logger.startTimer('load-session')

      const sessionData = await this.loadSessionData()
      if (!sessionData) {
        logger.warn('No valid session data to load')
        return false
      }

      // Load cookies
      if (sessionData.cookies && sessionData.cookies.length > 0) {
        await context.addCookies(sessionData.cookies)
        logger.debug(`Loaded ${sessionData.cookies.length} cookies`)
      }

      // Load localStorage (requires navigating to the domain first)
      if (sessionData.localStorage && Object.keys(sessionData.localStorage).length > 0) {
        const pages = context.pages()
        if (pages.length > 0) {
          const page = pages[0]
          try {
            await page.evaluate((storage) => {
              for (const [key, value] of Object.entries(storage)) {
                window.localStorage.setItem(key, value)
              }
            }, sessionData.localStorage)
            logger.debug(`Loaded ${Object.keys(sessionData.localStorage).length} localStorage items`)
          } catch (error) {
            logger.warn('Could not restore localStorage (page may not be loaded yet)', error)
          }
        }
      }

      const duration = logger.endTimer('load-session')
      logger.success('Session loaded successfully')
      return true
    } catch (error) {
      logger.error('Failed to load session', error)
      return false
    }
  }

  /**
   * Clear saved session
   */
  async clearSession(): Promise<void> {
    try {
      logger.info('Clearing saved session...')
      const exists = await this.fileExists(this.sessionFilePath)
      if (exists) {
        await fs.unlink(this.sessionFilePath)
        logger.success('Session cleared')
      } else {
        logger.debug('No session file to clear')
      }
    } catch (error) {
      logger.error('Failed to clear session', error)
    }
  }

  /**
   * Pause execution and wait for manual login
   * Monitors the page for URL changes or authentication indicators
   */
  async pauseForManualLogin(
    page: Page,
    authIndicatorSelector: string = '[data-testid="dashboard"], .user-menu, [class*="avatar"]',
    timeoutMs: number = 300000 // 5 minutes
  ): Promise<void> {
    logger.divider('MANUAL LOGIN REQUIRED')
    logger.info('Please log in to the website in the browser window.')
    logger.info('The script will automatically continue once logged in.')
    logger.info('Detection methods: URL change from /login OR auth indicator appearing')
    logger.divider()

    const startTime = Date.now()
    const checkInterval = 2000 // Check every 2 seconds
    const initialUrl = page.url()

    while (Date.now() - startTime < timeoutMs) {
      // Method 1: Check if URL changed from login page
      const currentUrl = page.url()
      if (initialUrl.includes('/login') && !currentUrl.includes('/login')) {
        logger.success(`Login detected! URL changed to: ${currentUrl}`)
        await page.waitForTimeout(3000) // Wait for page to stabilize
        return
      }

      // Method 2: Check for any auth indicators
      const selectors = authIndicatorSelector.split(', ')
      for (const selector of selectors) {
        try {
          const element = await page.$(selector)
          if (element) {
            logger.success(`Login detected! Found: ${selector}`)
            await page.waitForTimeout(2000)
            return
          }
        } catch {
          // Ignore errors and try next selector
        }
      }

      // Method 3: Check if not on login page and page has meaningful content
      if (!currentUrl.includes('/login')) {
        const bodyText = await page.evaluate(() => document.body?.innerText?.length || 0)
        if (bodyText > 500) { // Page has substantial content
          logger.success(`Login detected! Page has content (${bodyText} chars)`)
          await page.waitForTimeout(2000)
          return
        }
      }

      logger.debug(`Waiting for login... (${Math.floor((Date.now() - startTime) / 1000)}s elapsed)`)
      await page.waitForTimeout(checkInterval)
    }

    logger.error('Login timeout - please try again')
    throw new Error(`Login timeout after ${timeoutMs / 1000}s`)
  }

  /**
   * Get session info for debugging
   */
  async getSessionInfo(): Promise<{
    exists: boolean
    valid: boolean
    createdAt?: string
    expiresAt?: string
    daysRemaining?: number
    cookieCount?: number
  }> {
    const exists = await this.fileExists(this.sessionFilePath)
    if (!exists) {
      return { exists: false, valid: false }
    }

    const sessionData = await this.loadSessionData()
    if (!sessionData) {
      return { exists: true, valid: false }
    }

    const expiresAt = new Date(sessionData.expiresAt)
    const now = new Date()
    const valid = now < expiresAt
    const daysRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      exists: true,
      valid,
      createdAt: sessionData.createdAt,
      expiresAt: sessionData.expiresAt,
      daysRemaining: Math.max(0, daysRemaining),
      cookieCount: sessionData.cookies?.length || 0,
    }
  }

  /**
   * Load session data from file
   */
  private async loadSessionData(): Promise<SessionData | null> {
    try {
      const exists = await this.fileExists(this.sessionFilePath)
      if (!exists) return null

      const content = await fs.readFile(this.sessionFilePath, 'utf-8')
      const data = JSON.parse(content) as SessionData

      // Validate structure
      if (!data.version || !data.domain || !data.expiresAt) {
        logger.warn('Invalid session data structure')
        return null
      }

      return data
    } catch (error) {
      logger.debug('Error loading session data', error)
      return null
    }
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  /**
   * Ensure session directory exists
   */
  private async ensureSessionDir(): Promise<void> {
    try {
      await fs.mkdir(SESSION_DIR, { recursive: true })
    } catch (error) {
      logger.debug('Session directory already exists or could not be created', error)
    }
  }
}

/**
 * Create a default session manager for Tradelle
 */
export function createTradelleSessionManager(): SessionManager {
  return new SessionManager('tradelle.io', DEFAULT_SESSION_TTL_DAYS)
}
