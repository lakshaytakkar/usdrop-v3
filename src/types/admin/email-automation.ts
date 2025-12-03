// Email Template Types
export type EmailTemplateType = 'utility' | 'marketing' | 'transactional'
export type EmailTemplateCategory = 
  | 'welcome' 
  | 'onboarding' 
  | 'password-reset' 
  | 'order-confirmation'
  | 'shipping-notification'
  | 'abandoned-cart'
  | 're-engagement'
  | 'promotional'
  | 'newsletter'
  | 'custom'

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: EmailTemplateType
  category: EmailTemplateCategory
  description: string | null
  htmlContent: string
  textContent: string | null
  variables: string[] // e.g., ['{{user.name}}', '{{user.email}}']
  previewImage?: string
  isActive: boolean
  isPublic: boolean
  level?: 'free' | 'pro' | 'enterprise' // For plan-based templates
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

export interface EmailTemplateBlock {
  id: string
  type: 'header' | 'content' | 'button' | 'image' | 'divider' | 'footer' | 'custom'
  content: string
  styles?: Record<string, string>
  variables?: string[]
}

// Email Automation Types
export type AutomationTrigger = 
  | 'user_signup'
  | 'user_login'
  | 'order_placed'
  | 'order_shipped'
  | 'order_delivered'
  | 'cart_abandoned'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'plan_upgraded'
  | 'plan_downgraded'
  | 'custom_event'

export type AutomationConditionOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'

export interface AutomationCondition {
  id: string
  field: string
  operator: AutomationConditionOperator
  value: string | number
}

export interface AutomationStats {
  totalSent: number
  totalOpened: number
  totalClicked: number
  openRate: number
  clickRate: number
  lastSent?: Date
}

export interface EmailAutomation {
  id: string
  name: string
  description: string | null
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  templateId: string
  delay?: number // Delay in hours/days
  delayUnit?: 'minutes' | 'hours' | 'days'
  isActive: boolean
  targetAudience?: 'all' | 'external' | 'internal' | 'plan_based'
  planLevels?: string[] // Plan IDs
  createdAt: Date
  updatedAt: Date
  stats?: AutomationStats
}

// Email Drip Campaign Types
export interface DripEmail {
  id: string
  order: number
  templateId: string
  delay: number
  delayUnit: 'minutes' | 'hours' | 'days'
  conditions?: AutomationCondition[]
}

export interface DripStats {
  totalSubscribers: number
  totalSent: number
  totalOpened: number
  totalClicked: number
  completionRate: number
}

export interface EmailDrip {
  id: string
  name: string
  description: string | null
  type: 'utility' | 'marketing'
  targetAudience: 'external' | 'public' | 'plan_based'
  planLevels?: string[]
  isActive: boolean
  emails: DripEmail[]
  createdAt: Date
  updatedAt: Date
  stats?: DripStats
}

// Email Log Types
export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed'
export type EmailRecipientType = 'external_user' | 'internal_user' | 'public_campaign'

export interface EmailLog {
  id: string
  recipientEmail: string
  recipientType: EmailRecipientType
  recipientId?: string
  templateId: string
  automationId?: string
  dripId?: string
  subject: string
  status: EmailStatus
  sentAt?: Date
  deliveredAt?: Date
  openedAt?: Date
  clickedAt?: Date
  errorMessage?: string
  metadata?: Record<string, any>
  createdAt: Date
}

// Touchpoint Types
export interface EmailTouchpoint {
  id: string
  name: string
  description: string
  trigger: AutomationTrigger
  category: EmailTemplateCategory
  recommendedTemplate?: string
  priority: 'high' | 'medium' | 'low'
  userJourneyStage: 'awareness' | 'consideration' | 'purchase' | 'retention' | 'advocacy'
}





