import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

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
  '/auth/confirm',
  '/auth/callback',
]

const ADMIN_ROLES = ['admin', 'super_admin', 'editor', 'moderator']

const sharedRoutes = [
  '/settings',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

function isSharedRoute(pathname: string): boolean {
  return sharedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

function isAdminRoute(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function isAdminApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/admin/')
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(cookie => {
    to.cookies.set(cookie.name, cookie.value)
  })
  return to
}

function redirectWithCookies(url: URL, supabaseResponse: NextResponse) {
  const redirect = NextResponse.redirect(url)
  return copyCookies(supabaseResponse, redirect)
}

function jsonWithCookies(body: object, status: number, supabaseResponse: NextResponse) {
  const response = NextResponse.json(body, { status })
  return copyCookies(supabaseResponse, response)
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/_next') || pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|mp4|ico|css|js)$/)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api') && !isAdminApiRoute(pathname)) {
    return NextResponse.next()
  }

  const { user, profile, supabaseResponse } = await updateSession(request)

  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  if (!user) {
    if (isAdminApiRoute(pathname)) {
      return jsonWithCookies({ error: 'Authentication required' }, 401, supabaseResponse)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return redirectWithCookies(url, supabaseResponse)
  }

  const isAdmin = profile?.internal_role && ADMIN_ROLES.includes(profile.internal_role)

  if (isSharedRoute(pathname)) {
    return supabaseResponse
  }

  if (isAdmin && !isAdminRoute(pathname) && !isAdminApiRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return redirectWithCookies(url, supabaseResponse)
  }

  if (!isAdmin && isAdminApiRoute(pathname)) {
    return jsonWithCookies({ error: 'Admin access required' }, 403, supabaseResponse)
  }

  if (!isAdmin && isAdminRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/home'
    return redirectWithCookies(url, supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)',
  ],
}
