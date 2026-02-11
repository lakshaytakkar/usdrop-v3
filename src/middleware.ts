import { NextResponse, type NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

const JWT_SECRET = process.env.SESSION_SECRET
if (!JWT_SECRET) {
  console.error('FATAL: SESSION_SECRET environment variable is required')
}
const COOKIE_NAME = 'usdrop_session'

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/what-is-dropshipping',
  '/who-is-this-for',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/auth-code-error',
  '/auth/account-suspended',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip auth for API routes (they handle their own auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Skip auth for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // Verify JWT
  try {
    if (!JWT_SECRET) {
      throw new Error('SESSION_SECRET not configured')
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    if (!decoded?.userId) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(url)
    }

    // Add user ID to request headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-id', decoded.userId)
    return response
  } catch {
    // Invalid token - redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    const response = NextResponse.redirect(url)
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)',
  ],
}
