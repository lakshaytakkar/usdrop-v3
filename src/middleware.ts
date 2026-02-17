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

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/_next') || pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|mp4|ico|css|js)$/)) {
    return NextResponse.next()
  }

  const { user, supabaseResponse } = await updateSession(request)

  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)',
  ],
}
