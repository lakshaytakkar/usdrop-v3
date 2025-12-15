import { EmailTouchpoint } from "@/types/admin/email-automation"

export const EMAIL_TOUCHPOINTS: EmailTouchpoint[] = [
  // Utility Touchpoints
  {
    id: 'welcome',
    name: 'Welcome Email',
    description: 'First email sent immediately after user signup to welcome them to the platform',
    trigger: 'user_signup',
    category: 'welcome',
    priority: 'high',
    userJourneyStage: 'awareness',
    recommendedTemplate: 'welcome-email-template',
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Sent when user requests password reset with secure reset link',
    trigger: 'custom_event',
    category: 'password-reset',
    priority: 'high',
    userJourneyStage: 'retention',
    recommendedTemplate: 'password-reset-template',
  },
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    description: 'Sent immediately after order placement with order details and receipt',
    trigger: 'order_placed',
    category: 'order-confirmation',
    priority: 'high',
    userJourneyStage: 'purchase',
    recommendedTemplate: 'order-confirmation-template',
  },
  {
    id: 'shipping-notification',
    name: 'Shipping Notification',
    description: 'Sent when order is shipped with tracking information',
    trigger: 'order_shipped',
    category: 'shipping-notification',
    priority: 'medium',
    userJourneyStage: 'purchase',
    recommendedTemplate: 'shipping-notification-template',
  },
  {
    id: 'order-delivered',
    name: 'Order Delivered',
    description: 'Sent when order is delivered to confirm receipt and request feedback',
    trigger: 'order_delivered',
    category: 'order-confirmation',
    priority: 'medium',
    userJourneyStage: 'purchase',
    recommendedTemplate: 'order-delivered-template',
  },
  // Marketing Touchpoints
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart',
    description: 'Sent 1 hour after cart abandonment to encourage completion',
    trigger: 'cart_abandoned',
    category: 'abandoned-cart',
    priority: 'high',
    userJourneyStage: 'consideration',
    recommendedTemplate: 'abandoned-cart-template',
  },
  {
    id: 'onboarding-drip',
    name: 'Onboarding Series',
    description: 'Multi-email series for new users to guide them through platform features',
    trigger: 'user_signup',
    category: 'onboarding',
    priority: 'high',
    userJourneyStage: 'awareness',
    recommendedTemplate: 'onboarding-drip-template',
  },
  {
    id: 're-engagement',
    name: 'Re-engagement',
    description: 'Sent to inactive users to bring them back to the platform',
    trigger: 'custom_event',
    category: 're-engagement',
    priority: 'medium',
    userJourneyStage: 'retention',
    recommendedTemplate: 're-engagement-template',
  },
  {
    id: 'plan-upgrade',
    name: 'Plan Upgrade',
    description: 'Sent when user upgrades plan with new features and benefits',
    trigger: 'plan_upgraded',
    category: 'promotional',
    priority: 'medium',
    userJourneyStage: 'retention',
    recommendedTemplate: 'plan-upgrade-template',
  },
  {
    id: 'plan-downgrade',
    name: 'Plan Downgrade',
    description: 'Sent when user downgrades plan with retention offer',
    trigger: 'plan_downgraded',
    category: 're-engagement',
    priority: 'medium',
    userJourneyStage: 'retention',
    recommendedTemplate: 'plan-downgrade-template',
  },
  {
    id: 'subscription-started',
    name: 'Subscription Started',
    description: 'Sent when user starts a subscription with welcome and setup guide',
    trigger: 'subscription_started',
    category: 'welcome',
    priority: 'high',
    userJourneyStage: 'purchase',
    recommendedTemplate: 'subscription-started-template',
  },
  {
    id: 'subscription-cancelled',
    name: 'Subscription Cancelled',
    description: 'Sent when user cancels subscription with feedback request and retention offer',
    trigger: 'subscription_cancelled',
    category: 're-engagement',
    priority: 'high',
    userJourneyStage: 'retention',
    recommendedTemplate: 'subscription-cancelled-template',
  },
]

export function getTouchpointsByStage(stage: EmailTouchpoint['userJourneyStage']): EmailTouchpoint[] {
  return EMAIL_TOUCHPOINTS.filter(tp => tp.userJourneyStage === stage)
}

export function getTouchpointsByCategory(category: EmailTouchpoint['category']): EmailTouchpoint[] {
  return EMAIL_TOUCHPOINTS.filter(tp => tp.category === category)
}

export function getTouchpointsByPriority(priority: EmailTouchpoint['priority']): EmailTouchpoint[] {
  return EMAIL_TOUCHPOINTS.filter(tp => tp.priority === priority)
}

export function getTouchpointById(id: string): EmailTouchpoint | undefined {
  return EMAIL_TOUCHPOINTS.find(tp => tp.id === id)
}














