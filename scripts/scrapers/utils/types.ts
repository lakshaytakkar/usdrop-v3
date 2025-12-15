/**
 * Type definitions for the scraper
 */

import type { Product, ProductMetadata, ProductSource } from '../../../src/types/products'

/**
 * Raw extracted data before validation/transformation
 */
export interface RawProductData {
  // Core fields
  title?: string
  imageUrl?: string
  description?: string

  // Pricing (can be strings like "$12.99" or numbers)
  supplierPrice?: string | number
  retailPrice?: string | number

  // Media
  additionalImages?: string[]

  // Product details
  specifications?: Record<string, string>
  rating?: string | number
  reviewsCount?: string | number
  category?: string

  // Trend data (array of numbers or empty)
  trendData?: number[]

  // Tradelle-specific metadata
  isWinning?: boolean
  profitMargin?: string | number
  itemsSold?: string | number
  foundDate?: string
  filters?: string[]

  // Source tracking
  sourceUrl?: string
  sourceId?: string
}

/**
 * Scraper configuration options
 */
export interface ScraperConfig {
  /** Run browser in headless mode (default: false for debugging) */
  headless: boolean

  /** Slow down actions by this many milliseconds */
  slowMo: number

  /** Take screenshot on errors */
  screenshotOnError: boolean

  /** Take screenshot after successful extraction */
  screenshotOnSuccess: boolean

  /** Maximum retry attempts for failed operations */
  maxRetries: number

  /** Page load timeout in milliseconds */
  timeout: number

  /** Browser viewport dimensions */
  viewport: {
    width: number
    height: number
  }

  /** Path to Chrome/Chromium executable (uses system Chrome if not specified) */
  executablePath?: string

  /** User data directory for persistent browser state */
  userDataDir?: string
}

/**
 * Default scraper configuration
 */
export const DEFAULT_CONFIG: ScraperConfig = {
  headless: false,
  slowMo: 100,
  screenshotOnError: true,
  screenshotOnSuccess: true,
  maxRetries: 3,
  timeout: 30000,
  viewport: {
    width: 1280,
    height: 720,
  },
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
}

/**
 * Validation result for extracted data
 */
export interface ValidationResult {
  /** Whether the data passed validation */
  isValid: boolean

  /** Completeness score from 0-100 */
  completenessScore: number

  /** Whether all required fields are present and valid */
  requiredFieldsComplete: boolean

  /** List of missing field names */
  missingFields: string[]

  /** Details about invalid fields */
  invalidFields: Array<{
    field: string
    error: string
    receivedValue: unknown
  }>

  /** Non-critical warnings */
  warnings: string[]

  /** Transformed/cleaned product data if valid */
  transformedProduct?: Partial<Product>

  /** Transformed metadata if valid */
  transformedMetadata?: Partial<ProductMetadata>
}

/**
 * Result of a scraping operation
 */
export interface ScrapeResult {
  /** Whether the scrape was successful */
  success: boolean

  /** Scraped product data (if successful) */
  product?: Product

  /** Product metadata (if available) */
  metadata?: ProductMetadata

  /** Product source information */
  source?: Partial<ProductSource>

  /** Validation results */
  validationResult: ValidationResult

  /** Raw extracted data before transformation */
  rawData: RawProductData

  /** Paths to screenshots taken */
  screenshots: string[]

  /** Timing information */
  timing: {
    startTime: string
    endTime: string
    durationMs: number
  }

  /** Any errors encountered */
  errors: Array<{
    message: string
    context?: string
    recoverable: boolean
  }>
}

/**
 * Session data for browser persistence
 */
export interface SessionData {
  /** Session file format version */
  version: string

  /** Domain this session is for */
  domain: string

  /** When the session was created */
  createdAt: string

  /** When the session expires */
  expiresAt: string

  /** Browser cookies */
  cookies: Array<{
    name: string
    value: string
    domain: string
    path: string
    expires: number
    httpOnly: boolean
    secure: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
  }>

  /** LocalStorage data */
  localStorage?: Record<string, string>
}

/**
 * Credentials for authentication
 */
export interface AuthCredentials {
  email: string
  password: string
}

/**
 * Scraper error with additional context
 */
export class ScraperError extends Error {
  constructor(
    message: string,
    public readonly category: 'NETWORK' | 'AUTH' | 'NAVIGATION' | 'EXTRACTION' | 'VALIDATION',
    public readonly recoverable: boolean,
    public readonly suggestedFix: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ScraperError'
  }
}

/**
 * Field extraction configuration
 */
export interface FieldExtractor {
  name: string
  selectors: string[]
  required: boolean
  transform?: (value: string) => unknown
}

/**
 * Product listing item (for scraping product lists)
 */
export interface ProductListItem {
  title: string
  url: string
  thumbnail?: string
  price?: number
}

/**
 * Options for the test script
 */
export interface TestOptions {
  /** Specific product URL to scrape */
  url?: string

  /** Run in visible mode (non-headless) */
  visible?: boolean

  /** Enable debug logging */
  debug?: boolean

  /** Save extracted data to Supabase */
  save?: boolean

  /** Use stored session (skip login if valid) */
  useSession?: boolean

  /** Force new login (ignore stored session) */
  forceLogin?: boolean
}
