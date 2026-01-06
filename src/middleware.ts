import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/api/auth',
    '/auth',
    '/pricing',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ]

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Check if current path is an admin route (page routes only, not API routes)
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Check if current path is an API route (API routes should not be redirected)
  const isApiRoute = pathname.startsWith('/api')

  // Protected routes - redirect to login if not authenticated (skip API routes)
  if (!user && !isPublicRoute && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  // Helper function to get user redirect path based on profile
  const getUserRedirectPath = (profile: any): string => {
    const isInternal = profile.internal_role !== null && profile.internal_role !== undefined

    if (isInternal) {
      return '/admin'
    } else {
      // External users: determine plan
      const subscriptionPlanData = profile.subscription_plans as unknown
      const subscriptionPlan = Array.isArray(subscriptionPlanData)
        ? subscriptionPlanData[0] as { slug: string } | undefined
        : subscriptionPlanData as { slug: string } | null

      const plan = subscriptionPlan?.slug || profile.account_type || 'free'
      // External free → /onboarding, External pro → /home
      return plan === 'pro' ? '/home' : '/onboarding'
    }
  }

  // Redirect authenticated users away from auth pages based on user type and plan
  if (user && (pathname === '/login' || pathname === '/signup')) {
    // Check if there's a redirectedFrom parameter first
    const redirectedFrom = request.nextUrl.searchParams.get('redirectedFrom')
    if (redirectedFrom) {
      return NextResponse.redirect(new URL(redirectedFrom, request.url))
    }

    // Fetch user profile to determine redirect path
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        internal_role,
        subscription_plan_id,
        account_type,
        subscription_plans (
          slug,
          name
        )
      `)
      .eq('id', user.id)
      .single()

    const redirectPath = profile ? getUserRedirectPath(profile) : '/onboarding'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Route access control for authenticated users (excluding public routes, auth pages, and API routes)
  // API routes handle their own authentication and authorization
  if (user && !isPublicRoute && !isApiRoute) {
    // Fetch user profile to determine user type
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        internal_role,
        subscription_plan_id,
        account_type,
        subscription_plans (
          slug,
          name
        )
      `)
      .eq('id', user.id)
      .single()

    if (profile) {
      const isInternal = profile.internal_role !== null && profile.internal_role !== undefined

      // Block admin routes from external users
      if (isAdminRoute && !isInternal) {
        // External user trying to access admin route - redirect based on plan
        const redirectPath = getUserRedirectPath(profile)
        return NextResponse.redirect(new URL(redirectPath, request.url))
      }

      // Block normal user routes from internal users
      if (!isAdminRoute && isInternal) {
        // Internal user trying to access normal user route - redirect to admin
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
