/**
 * Schema validation for extracted product data
 * Uses Zod for runtime validation with detailed error reporting
 */

import { z } from 'zod'
import { logger } from './logger'
import type { RawProductData, ValidationResult } from './types'
import type { Product, ProductMetadata } from '../../../src/types/products'

/**
 * Zod schema for Product matching src/types/products.ts
 */
const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(500),
  image: z.string().url('Image must be a valid URL'),
  description: z.string().nullable(),
  category_id: z.string().uuid().nullable(),
  buy_price: z.number().positive('Buy price must be positive'),
  sell_price: z.number().positive('Sell price must be positive'),
  profit_per_order: z.number(),
  additional_images: z.array(z.string().url()).default([]),
  specifications: z.record(z.string(), z.any()).nullable(),
  rating: z.number().min(0).max(5).nullable(),
  reviews_count: z.number().int().min(0).default(0),
  trend_data: z.array(z.number()).default([]),
  supplier_id: z.string().uuid().nullable(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

/**
 * Zod schema for ProductMetadata
 */
const MetadataSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional(),
  is_winning: z.boolean().default(false),
  is_locked: z.boolean().default(false),
  unlock_price: z.number().nullable(),
  profit_margin: z.number().nullable(),
  pot_revenue: z.number().nullable(),
  revenue_growth_rate: z.number().nullable(),
  items_sold: z.number().int().nullable(),
  avg_unit_price: z.number().nullable(),
  revenue_trend: z.array(z.number()).default([]),
  found_date: z.string().nullable(),
  detailed_analysis: z.string().nullable(),
  filters: z.array(z.string()).default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

/**
 * Field weights for completeness scoring
 */
const FIELD_WEIGHTS = {
  // Required fields (60% total)
  title: 15,
  image: 15,
  buy_price: 15,
  sell_price: 15,

  // Important fields (25% total)
  description: 8,
  profit_per_order: 7,
  category_id: 5,
  additional_images: 5,

  // Optional fields (15% total)
  specifications: 4,
  rating: 3,
  reviews_count: 3,
  trend_data: 3,
  supplier_id: 2,
}

/**
 * Parse price string to number
 * Handles formats like "$12.99", "12.99", "12,99", etc.
 */
export function parsePrice(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'number') return value

  // Remove currency symbols and whitespace
  const cleaned = String(value)
    .replace(/[^0-9.,]/g, '')
    .replace(',', '.') // Handle European format

  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

/**
 * Parse rating value (could be "4.5/5", "4.5 stars", "4.5", etc.)
 */
export function parseRating(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'number') return Math.min(5, Math.max(0, value))

  const match = String(value).match(/(\d+\.?\d*)/)
  if (!match) return null

  const num = parseFloat(match[1])
  return isNaN(num) ? null : Math.min(5, Math.max(0, num))
}

/**
 * Parse integer value (reviews count, items sold, etc.)
 */
export function parseInteger(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === 'number') return Math.floor(value)

  // Handle formats like "1,234", "1.2K", "1.2M"
  let str = String(value).replace(/,/g, '')

  const multipliers: Record<string, number> = {
    k: 1000,
    m: 1000000,
  }

  const match = str.match(/^(\d+\.?\d*)\s*([kmKM])?$/)
  if (!match) {
    const num = parseInt(str, 10)
    return isNaN(num) ? null : num
  }

  let num = parseFloat(match[1])
  const suffix = match[2]?.toLowerCase()
  if (suffix && multipliers[suffix]) {
    num *= multipliers[suffix]
  }

  return Math.floor(num)
}

/**
 * Normalize URL (ensure it's absolute)
 */
export function normalizeUrl(url: string | undefined, baseUrl?: string): string | null {
  if (!url) return null

  try {
    // Already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url).href
    }

    // Protocol-relative
    if (url.startsWith('//')) {
      return new URL('https:' + url).href
    }

    // Relative URL
    if (baseUrl) {
      return new URL(url, baseUrl).href
    }

    return null
  } catch {
    return null
  }
}

/**
 * Transform raw extracted data into Product format
 */
export function transformToProduct(raw: RawProductData): Partial<Product> {
  const buyPrice = parsePrice(raw.supplierPrice)
  const sellPrice = parsePrice(raw.retailPrice)
  const profitPerOrder = buyPrice !== null && sellPrice !== null
    ? sellPrice - buyPrice
    : 0

  return {
    title: raw.title?.trim() || '',
    image: normalizeUrl(raw.imageUrl) || '',
    description: raw.description?.trim() || null,
    category_id: null, // Would need to lookup/create category
    buy_price: buyPrice || 0,
    sell_price: sellPrice || 0,
    profit_per_order: profitPerOrder,
    additional_images: (raw.additionalImages || [])
      .map(url => normalizeUrl(url))
      .filter((url): url is string => url !== null),
    specifications: raw.specifications || null,
    rating: parseRating(raw.rating),
    reviews_count: parseInteger(raw.reviewsCount) || 0,
    trend_data: raw.trendData || [],
    supplier_id: null,
  }
}

/**
 * Transform raw data into ProductMetadata format
 */
export function transformToMetadata(raw: RawProductData): Partial<ProductMetadata> {
  return {
    is_winning: raw.isWinning || false,
    is_locked: false,
    unlock_price: null,
    profit_margin: parsePrice(raw.profitMargin),
    pot_revenue: null,
    revenue_growth_rate: null,
    items_sold: parseInteger(raw.itemsSold),
    avg_unit_price: null,
    revenue_trend: [],
    found_date: raw.foundDate || null,
    detailed_analysis: null,
    filters: raw.filters || [],
  }
}

/**
 * Calculate completeness score based on field weights
 */
export function calculateCompletenessScore(product: Partial<Product>): number {
  let score = 0
  let maxScore = 0

  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    maxScore += weight
    const value = product[field as keyof Product]

    // Check if field has a meaningful value
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' && value.length > 0) {
        score += weight
      } else if (typeof value === 'number' && value > 0) {
        score += weight
      } else if (Array.isArray(value) && value.length > 0) {
        score += weight
      } else if (typeof value === 'object' && Object.keys(value).length > 0) {
        score += weight
      }
    }
  }

  return Math.round((score / maxScore) * 100)
}

/**
 * Validate extracted product data
 */
export function validateProduct(rawData: RawProductData): ValidationResult {
  const transformedProduct = transformToProduct(rawData)
  const transformedMetadata = transformToMetadata(rawData)

  const missingFields: string[] = []
  const invalidFields: ValidationResult['invalidFields'] = []
  const warnings: string[] = []

  // Validate with Zod
  const productResult = ProductSchema.safeParse({
    ...transformedProduct,
    // These are required for Zod but generated later
    id: undefined,
    created_at: undefined,
    updated_at: undefined,
  })

  if (!productResult.success) {
    for (const issue of productResult.error.issues) {
      const field = issue.path.join('.')
      if (issue.code === 'too_small' || issue.code === 'invalid_type') {
        missingFields.push(field)
      }
      invalidFields.push({
        field,
        error: issue.message,
        receivedValue: transformedProduct[field as keyof typeof transformedProduct],
      })
    }
  }

  // Check required fields explicitly
  const requiredFields = ['title', 'image', 'buy_price', 'sell_price']
  let requiredFieldsComplete = true

  for (const field of requiredFields) {
    const value = transformedProduct[field as keyof typeof transformedProduct]
    if (!value || (typeof value === 'string' && value.length === 0)) {
      if (!missingFields.includes(field)) {
        missingFields.push(field)
      }
      requiredFieldsComplete = false
    }
  }

  // Add warnings for optional but recommended fields
  if (!transformedProduct.description) {
    warnings.push('Missing description - product may lack important details')
  }
  if ((transformedProduct.additional_images || []).length === 0) {
    warnings.push('No additional images - consider adding gallery images')
  }
  if (!transformedProduct.specifications) {
    warnings.push('No specifications - product details may be incomplete')
  }
  if ((transformedProduct.trend_data || []).length === 0) {
    warnings.push('No trend data available')
  }

  const completenessScore = calculateCompletenessScore(transformedProduct)
  const isValid = requiredFieldsComplete && invalidFields.length === 0

  return {
    isValid,
    completenessScore,
    requiredFieldsComplete,
    missingFields,
    invalidFields,
    warnings,
    transformedProduct: isValid ? transformedProduct : undefined,
    transformedMetadata,
  }
}

/**
 * Print validation report to console
 */
export function reportValidation(result: ValidationResult): void {
  logger.divider('VALIDATION REPORT')

  // Completeness score
  const scoreColor = result.completenessScore >= 80 ? 'green' :
    result.completenessScore >= 50 ? 'yellow' : 'red'

  console.log(`\nCompleteness Score: ${result.completenessScore}%`)
  console.log(`Required Fields: ${result.requiredFieldsComplete ? 'COMPLETE' : 'INCOMPLETE'}`)
  console.log(`Overall Status: ${result.isValid ? 'VALID' : 'INVALID'}`)

  // Missing fields
  if (result.missingFields.length > 0) {
    console.log('\nMissing Fields:')
    for (const field of result.missingFields) {
      console.log(`  - ${field}`)
    }
  }

  // Invalid fields
  if (result.invalidFields.length > 0) {
    console.log('\nInvalid Fields:')
    for (const { field, error, receivedValue } of result.invalidFields) {
      console.log(`  - ${field}: ${error}`)
      console.log(`    Received: ${JSON.stringify(receivedValue)}`)
    }
  }

  // Warnings
  if (result.warnings.length > 0) {
    console.log('\nWarnings:')
    for (const warning of result.warnings) {
      console.log(`  ! ${warning}`)
    }
  }

  logger.divider()
}

/**
 * Validator class for object-oriented usage
 */
export class Validator {
  validateProduct(rawData: RawProductData): ValidationResult {
    return validateProduct(rawData)
  }

  validateMetadata(rawData: RawProductData): ValidationResult {
    const metadata = transformToMetadata(rawData)
    const result = MetadataSchema.safeParse(metadata)

    return {
      isValid: result.success,
      completenessScore: 100, // Metadata is all optional
      requiredFieldsComplete: true,
      missingFields: [],
      invalidFields: result.success ? [] : result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        error: issue.message,
        receivedValue: metadata[issue.path[0] as keyof typeof metadata],
      })),
      warnings: [],
      transformedMetadata: metadata,
    }
  }

  calculateCompletenessScore(product: Partial<Product>): number {
    return calculateCompletenessScore(product)
  }

  reportValidation(result: ValidationResult): void {
    reportValidation(result)
  }
}

// Export singleton
export const validator = new Validator()
