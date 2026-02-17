import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all stats in parallel
    const [
      productsResult,
      storesResult,
      activeStoresResult,
      onboardingResult,
      coursesResult,
      winningProductsResult
    ] = await Promise.allSettled([
      // Products count - get total products available (not user-specific for now)
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true }),
      
      // Shopify stores count
      supabase
        .from('shopify_stores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      
      // Active stores count
      supabase
        .from('shopify_stores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active'),
      
      // Onboarding status - replicate logic from onboarding/status route
      (async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
          .eq('id', user.id)
          .single()

        const { count: totalVideos } = await supabase
          .from('onboarding_videos')
          .select('*', { count: 'exact', head: true })
          .then(res => res.count !== null ? res : { count: 0 })

        const { count: totalModules } = await supabase
          .from('onboarding_modules')
          .select('*', { count: 'exact', head: true })
          .then(res => res.count !== null ? res : { count: 0 })

        const { count: completedVideos } = await supabase
          .from('onboarding_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('completed', true)
          .then(res => res.count !== null ? res : { count: 0 })

        return {
          onboarding_completed: profile?.onboarding_completed || false,
          onboarding_progress: profile?.onboarding_progress || 0,
          completed_videos: completedVideos || 0,
          total_videos: totalVideos || 0,
          total_modules: totalModules || 0
        }
      })(),
      
      supabase
        .from('user_picklist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      
      // Winning products count
      supabase
        .from('product_metadata')
        .select('product_id', { count: 'exact', head: true })
        .eq('is_winning', true)
    ])

    // Extract results with safe defaults
    const productsCount = productsResult.status === 'fulfilled' 
      ? (productsResult.value.count || 0)
      : 0

    const storesCount = storesResult.status === 'fulfilled'
      ? (storesResult.value.count || 0)
      : 0

    const activeStoresCount = activeStoresResult.status === 'fulfilled'
      ? (activeStoresResult.value.count || 0)
      : 0

    const onboardingData = onboardingResult.status === 'fulfilled'
      ? onboardingResult.value
      : {
          onboarding_progress: 0,
          completed_videos: 0,
          total_videos: 0,
          total_modules: 0
        }

    const picklistCount = coursesResult.status === 'fulfilled'
      ? (coursesResult.value?.count || 0)
      : 0

    const winningProductsCount = winningProductsResult.status === 'fulfilled'
      ? (winningProductsResult.value?.count || 0)
      : 0

    const stats = {
      products: {
        total: productsCount,
        inPicklist: picklistCount,
        winning: winningProductsCount
      },
      stores: {
        total: storesCount,
        connected: storesCount,
        active: activeStoresCount
      },
      learning: {
        progress: onboardingData.onboarding_progress || 0,
        completedVideos: onboardingData.completed_videos || 0,
        totalVideos: onboardingData.total_videos || 0,
        enrolledCourses: 0
      },
      activity: {
        lastActivityDate: null, // TODO: Track user activity
        streakDays: 0 // TODO: Implement streak tracking
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

