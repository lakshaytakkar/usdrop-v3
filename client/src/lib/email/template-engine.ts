export interface TemplateVariables {
  [key: string]: string | number | Date | undefined
}

export function renderTemplate(html: string, variables: TemplateVariables): string {
  let rendered = html

  Object.keys(variables).forEach(key => {
    const value = variables[key]
    if (value !== undefined && value !== null) {
      let formattedValue = value
      if (value instanceof Date) {
        formattedValue = value.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      rendered = rendered.replace(regex, String(formattedValue))
    }
  })

  return rendered
}

export function getSampleVariables(): TemplateVariables {
  const baseUrl = typeof window !== 'undefined'
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
