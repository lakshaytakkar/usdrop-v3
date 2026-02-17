import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { sql } from '@/lib/db/index'

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'usdrop-session-secret-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  account_type: string
  internal_role: string | null
  status: string
  onboarding_completed: boolean
  subscription_plan_id: string | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session_token')?.value

    if (!sessionToken) return null

    let payload: any
    try {
      payload = jwt.verify(sessionToken, JWT_SECRET)
    } catch {
      return null
    }

    const userId = payload.userId || payload.sub
    if (!userId) return null

    const result = await sql`
      SELECT id, email, full_name, username, avatar_url, account_type, 
             internal_role, status, onboarding_completed, subscription_plan_id
      FROM profiles 
      WHERE id = ${userId} AND status = 'active'
      LIMIT 1
    `

    if (result.length === 0) return null
    return result[0] as AuthUser
  } catch {
    return null
  }
}

export async function getUserWithPlan(userId: string) {
  const result = await sql`
    SELECT p.id, p.email, p.full_name, p.username, p.avatar_url,
           p.account_type, p.internal_role, p.status, p.onboarding_completed,
           p.subscription_plan_id, p.onboarding_progress,
           sp.slug as plan_slug, sp.name as plan_name, sp.price_monthly
    FROM profiles p
    LEFT JOIN subscription_plans sp ON p.subscription_plan_id = sp.id
    WHERE p.id = ${userId}
    LIMIT 1
  `

  if (result.length === 0) return null

  const data = result[0]
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    username: data.username,
    avatar_url: data.avatar_url,
    account_type: data.account_type,
    internal_role: data.internal_role,
    status: data.status,
    onboarding_completed: data.onboarding_completed,
    subscription_plan_id: data.subscription_plan_id,
    onboarding_progress: data.onboarding_progress,
    plan_slug: data.plan_slug || null,
    plan_name: data.plan_name || null,
    price_monthly: data.price_monthly || null,
  }
}

export function createSessionToken(userId: string): string {
  return jwt.sign({ userId, sub: userId }, JWT_SECRET, { expiresIn: '30d' })
}

export function verifySessionToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    return { userId: payload.userId || payload.sub }
  } catch {
    return null
  }
}
