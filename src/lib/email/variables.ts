export interface EmailVariable {
  key: string
  label: string
  description: string
  category: 'user' | 'order' | 'system' | 'company'
  example: string
}

export const EMAIL_VARIABLES: EmailVariable[] = [
  // User Variables
  {
    key: '{{user.name}}',
    label: 'User Name',
    description: 'Full name of the user',
    category: 'user',
    example: 'John Doe',
  },
  {
    key: '{{user.email}}',
    label: 'User Email',
    description: 'Email address of the user',
    category: 'user',
    example: 'john@example.com',
  },
  {
    key: '{{user.plan}}',
    label: 'User Plan',
    description: 'Current subscription plan name',
    category: 'user',
    example: 'Pro',
  },
  {
    key: '{{user.credits}}',
    label: 'User Credits',
    description: 'Current credit balance',
    category: 'user',
    example: '150',
  },
  {
    key: '{{user.signupDate}}',
    label: 'Signup Date',
    description: 'Date when user signed up',
    category: 'user',
    example: 'January 15, 2024',
  },
  {
    key: '{{user.status}}',
    label: 'User Status',
    description: 'Current account status',
    category: 'user',
    example: 'active',
  },
  // Order Variables
  {
    key: '{{order.id}}',
    label: 'Order ID',
    description: 'Unique order identifier',
    category: 'order',
    example: 'ORD-12345',
  },
  {
    key: '{{order.total}}',
    label: 'Order Total',
    description: 'Total amount of the order',
    category: 'order',
    example: '$99.99',
  },
  {
    key: '{{order.items}}',
    label: 'Order Items',
    description: 'List of items in the order',
    category: 'order',
    example: 'Product A, Product B',
  },
  {
    key: '{{order.date}}',
    label: 'Order Date',
    description: 'Date when order was placed',
    category: 'order',
    example: 'January 20, 2024',
  },
  {
    key: '{{order.shippingAddress}}',
    label: 'Shipping Address',
    description: 'Delivery address for the order',
    category: 'order',
    example: '123 Main St, City, State 12345',
  },
  {
    key: '{{order.trackingNumber}}',
    label: 'Tracking Number',
    description: 'Shipping tracking number',
    category: 'order',
    example: 'TRACK123456789',
  },
  // System Variables
  {
    key: '{{company.name}}',
    label: 'Company Name',
    description: 'Name of your company',
    category: 'company',
    example: 'USDrop',
  },
  {
    key: '{{company.email}}',
    label: 'Company Email',
    description: 'Support email address',
    category: 'company',
    example: 'support@usdrop.com',
  },
  {
    key: '{{company.website}}',
    label: 'Company Website',
    description: 'Company website URL',
    category: 'company',
    example: 'https://usdrop.com',
  },
  {
    key: '{{currentDate}}',
    label: 'Current Date',
    description: 'Current date formatted',
    category: 'system',
    example: 'January 25, 2024',
  },
  {
    key: '{{unsubscribeLink}}',
    label: 'Unsubscribe Link',
    description: 'Link to unsubscribe from emails',
    category: 'system',
    example: 'https://usdrop.com/unsubscribe',
  },
]

export function getVariablesByCategory(category: EmailVariable['category']): EmailVariable[] {
  return EMAIL_VARIABLES.filter(v => v.category === category)
}

export function getAllVariables(): EmailVariable[] {
  return EMAIL_VARIABLES
}

export function getVariableByKey(key: string): EmailVariable | undefined {
  return EMAIL_VARIABLES.find(v => v.key === key)
}

export function extractVariablesFromHtml(html: string): string[] {
  const variableRegex = /\{\{([^}]+)\}\}/g
  const matches = html.match(variableRegex)
  return matches ? [...new Set(matches)] : []
}














