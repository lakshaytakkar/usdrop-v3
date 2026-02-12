import { getCurrentUser, type AuthUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function requireAdmin(): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  
  const adminRoles = ['admin', 'super_admin', 'editor', 'moderator']
  if (!user.internal_role || !adminRoles.includes(user.internal_role)) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
  
  return { user }
}

export function isAdminResponse(result: any): result is NextResponse {
  return result instanceof NextResponse
}
