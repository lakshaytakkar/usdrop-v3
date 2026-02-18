import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoISO = sevenDaysAgo.toISOString()

    const [
      usersResult,
      productsResult,
      coursesResult,
      competitorStoresResult,
      activePlansResult,
      recentSignupsResult,
      freeUsersResult,
      proUsersResult,
      leadsResult,
      suppliersResult,
      shopifyStoresResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .is('internal_role', null),

      supabaseAdmin
        .from('products')
        .select('id', { count: 'exact', head: true }),

      supabaseAdmin
        .from('courses')
        .select('id', { count: 'exact', head: true }),

      supabaseAdmin
        .from('competitor_stores')
        .select('id', { count: 'exact', head: true }),

      supabaseAdmin
        .from('subscription_plans')
        .select('id', { count: 'exact', head: true })
        .eq('active', true),

      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .is('internal_role', null)
        .gte('created_at', sevenDaysAgoISO),

      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .is('internal_role', null)
        .eq('account_type', 'free'),

      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .is('internal_role', null)
        .eq('account_type', 'pro'),

      supabaseAdmin
        .from('leads')
        .select('id', { count: 'exact', head: true }),

      supabaseAdmin
        .from('suppliers')
        .select('id', { count: 'exact', head: true }),

      supabaseAdmin
        .from('shopify_stores')
        .select('id', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      totalExternalUsers: usersResult.count ?? 0,
      totalProducts: productsResult.count ?? 0,
      totalCourses: coursesResult.count ?? 0,
      totalCompetitorStores: competitorStoresResult.count ?? 0,
      activeSubscriptionPlans: activePlansResult.count ?? 0,
      recentSignups: recentSignupsResult.count ?? 0,
      usersByAccountType: {
        free: freeUsersResult.count ?? 0,
        pro: proUsersResult.count ?? 0,
      },
      totalLeads: leadsResult.count ?? 0,
      totalSuppliers: suppliersResult.count ?? 0,
      totalShopifyStores: shopifyStoresResult.count ?? 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
