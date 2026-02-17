import { NextResponse, type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { sql } from '@/lib/db/index'

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'usdrop-session-secret-key-change-in-production'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  const sessionToken = request.cookies.get('session_token')?.value
  
  let user: { id: string; email?: string } | null = null
  let profile: { internal_role: string | null } | null = null

  if (sessionToken) {
    try {
      const payload = jwt.verify(sessionToken, JWT_SECRET) as any
      const userId = payload.userId || payload.sub

      if (userId) {
        const result = await sql`
          SELECT id, email, internal_role FROM profiles WHERE id = ${userId} AND status = 'active' LIMIT 1
        `
        if (result.length > 0) {
          user = { id: result[0].id, email: result[0].email }
          profile = { internal_role: result[0].internal_role }
        }
      }
    } catch {
      // Invalid token - user stays null
    }
  }

  return { user, profile, supabaseResponse }
}
