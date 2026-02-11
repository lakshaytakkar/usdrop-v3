import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import sql from '@/lib/db'

const JWT_SECRET = process.env.SESSION_SECRET
if (!JWT_SECRET) {
  console.error('FATAL: SESSION_SECRET environment variable is required')
}
const TOKEN_EXPIRY = '7d'
const COOKIE_NAME = 'usdrop_session'

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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  if (!JWT_SECRET) throw new Error('SESSION_SECRET not configured')
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): { userId: string } | null {
  if (!JWT_SECRET) return null
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as { userId: string }
  } catch {
    return null
  }
}

export async function createSession(userId: string, request?: Request): Promise<string> {
  const token = generateToken(userId)
  const tokenHash = await bcrypt.hash(token, 4)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  const ipAddress = request?.headers?.get('x-forwarded-for')?.split(',')[0] || null
  const userAgent = request?.headers?.get('user-agent') || null

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
    VALUES (${userId}, ${tokenHash}, ${expiresAt}, ${ipAddress}, ${userAgent})
  `

  return token
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSessionToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value || null
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getSessionToken()
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded) return null

  const users = await sql`
    SELECT id, email, full_name, username, avatar_url, account_type, 
           internal_role, status, onboarding_completed, subscription_plan_id
    FROM profiles 
    WHERE id = ${decoded.userId} AND status = 'active'
    LIMIT 1
  `

  if (users.length === 0) return null
  return users[0] as AuthUser
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
  return result[0]
}

export async function invalidateSession(token: string) {
  const decoded = verifyToken(token)
  if (decoded) {
    await sql`DELETE FROM sessions WHERE user_id = ${decoded.userId}`
  }
}
