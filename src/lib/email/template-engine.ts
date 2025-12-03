import { extractVariablesFromHtml } from "./variables"

export interface TemplateVariables {
  [key: string]: string | number | Date | undefined
}

/**
 * Renders an email template by replacing variables with actual values
 */
export function renderTemplate(html: string, variables: TemplateVariables): string {
  let rendered = html
  
  // Replace all variables in the format {{variable.name}}
  Object.keys(variables).forEach(key => {
    const value = variables[key]
    if (value !== undefined && value !== null) {
      // Format dates
      let formattedValue = value
      if (value instanceof Date) {
        formattedValue = value.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      
      // Replace all occurrences of {{key}} with the value
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      rendered = rendered.replace(regex, String(formattedValue))
    }
  })
  
  return rendered
}

/**
 * Validates that all required variables are present in the template
 */
export function validateTemplateVariables(html: string, providedVariables: TemplateVariables): {
  valid: boolean
  missing: string[]
} {
  const requiredVariables = extractVariablesFromHtml(html)
  const providedKeys = Object.keys(providedVariables)
  
  const missing = requiredVariables
    .map(v => v.replace(/[{}]/g, ''))
    .filter(v => !providedKeys.includes(v))
  
  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Gets sample data for previewing templates
 */
export function getSampleVariables(): TemplateVariables {
  // Use localhost for preview images, production URL for actual emails
  const isPreview = typeof window !== 'undefined'
  const baseUrl = isPreview 
    ? (window.location.origin || 'http://localhost:3000')
    : 'https://usdrop.com'
  
  return {
    'user.name': 'John Doe',
    'user.email': 'john.doe@example.com',
    'user.plan': 'Pro',
    'user.credits': '150',
    'user.signupDate': 'January 15, 2024',
    'user.status': 'active',
    'order.id': 'ORD-12345',
    'order.total': '$99.99',
    'order.items': 'Product A, Product B',
    'order.date': 'January 20, 2024',
    'order.shippingAddress': '123 Main St, City, State 12345',
    'order.trackingNumber': 'TRACK123456789',
    'company.name': 'USDrop',
    'company.email': 'support@usdrop.com',
    'company.website': baseUrl,
    'currentDate': new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    'unsubscribeLink': 'https://usdrop.com/unsubscribe',
  }
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  // This is a simplified version for MVP
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}


