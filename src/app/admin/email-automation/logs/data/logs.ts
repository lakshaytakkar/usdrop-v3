import { EmailLog } from "@/types/admin/email-automation"

// Helper function to generate random dates in the past
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const now = new Date()
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

const statuses: EmailLog['status'][] = ['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed']
const recipientTypes: EmailLog['recipientType'][] = ['external_user', 'internal_user', 'public_campaign']

function generateLog(id: string, templateId: string, status: EmailLog['status'], recipientType: EmailLog['recipientType'], createdAt: Date, automationId?: string, dripId?: string): EmailLog {
  const sentAt = status !== 'pending' && status !== 'failed' ? new Date(createdAt.getTime() + Math.random() * 60000) : undefined
  const deliveredAt = (status === 'delivered' || status === 'opened' || status === 'clicked') && sentAt ? new Date(sentAt.getTime() + Math.random() * 300000) : undefined
  const openedAt = (status === 'opened' || status === 'clicked') && deliveredAt ? new Date(deliveredAt.getTime() + Math.random() * 3600000) : undefined
  const clickedAt = status === 'clicked' && openedAt ? new Date(openedAt.getTime() + Math.random() * 300000) : undefined

  const subjects = [
    'Welcome to USDrop!',
    'Order Confirmation - ORD-12345',
    'Your Order Has Shipped!',
    'You left items in your cart',
    'Getting Started with USDrop',
    'We miss you!',
    'Congratulations on Your Upgrade!',
    'USDrop Newsletter',
    'Your Subscription is Active!',
    'Reset Your Password',
  ]

  return {
    id,
    recipientEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
    recipientType,
    recipientId: recipientType !== 'public_campaign' ? `user-${Math.floor(Math.random() * 1000)}` : undefined,
    templateId,
    automationId,
    dripId,
    subject: subjects[Math.floor(Math.random() * subjects.length)],
    status,
    sentAt,
    deliveredAt,
    openedAt,
    clickedAt,
    errorMessage: status === 'failed' || status === 'bounced' ? 'Delivery failed: Invalid email address' : undefined,
    metadata: {
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
    createdAt,
  }
}

export const sampleLogs: EmailLog[] = [
  // Recent logs (last 7 days)
  ...Array.from({ length: 30 }, (_, i) => {
    const date = randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const recipientType = recipientTypes[Math.floor(Math.random() * recipientTypes.length)]
    return generateLog(`log-${i + 1}`, `1`, status, recipientType, date, i % 3 === 0 ? '1' : undefined, i % 5 === 0 ? '1' : undefined)
  }),
  // Older logs (8-15 days ago)
  ...Array.from({ length: 25 }, (_, i) => {
    const date = randomDate(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const recipientType = recipientTypes[Math.floor(Math.random() * recipientTypes.length)]
    return generateLog(`log-${i + 31}`, `${Math.floor(Math.random() * 16) + 1}`, status, recipientType, date, i % 4 === 0 ? '2' : undefined, i % 6 === 0 ? '2' : undefined)
  }),
  // Older logs (16-30 days ago)
  ...Array.from({ length: 25 }, (_, i) => {
    const date = randomDate(thirtyDaysAgo, new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000))
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const recipientType = recipientTypes[Math.floor(Math.random() * recipientTypes.length)]
    return generateLog(`log-${i + 56}`, `${Math.floor(Math.random() * 16) + 1}`, status, recipientType, date, i % 3 === 0 ? '3' : undefined, i % 5 === 0 ? '3' : undefined)
  }),
  // Very old logs (30+ days ago)
  ...Array.from({ length: 20 }, (_, i) => {
    const date = randomDate(new Date(thirtyDaysAgo.getTime() - 30 * 24 * 60 * 60 * 1000), thirtyDaysAgo)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const recipientType = recipientTypes[Math.floor(Math.random() * recipientTypes.length)]
    return generateLog(`log-${i + 81}`, `${Math.floor(Math.random() * 16) + 1}`, status, recipientType, date, i % 4 === 0 ? '4' : undefined, i % 6 === 0 ? '4' : undefined)
  }),
]














