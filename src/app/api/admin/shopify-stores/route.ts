import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { mapShopifyStoreFromDB } from '@/lib/utils/shopify-store-helpers'

// GET /api/admin/shopify-stores - List all stores with user relationship
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('user_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Use service role for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    let query = supabaseAdmin
      .from('shopify_stores')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name
        )
      `)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching shopify stores:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        stores: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0
      })
    }

    // Transform to match ShopifyStore interface using helper
    const stores = data.map((store) => mapShopifyStoreFromDB(store))

    // Get total count for pagination
    let countQuery = supabaseAdmin
      .from('shopify_stores')
      .select('*', { count: 'exact', head: true })

    if (status) {
      countQuery = countQuery.eq('status', status)
    }
    if (userId) {
      countQuery = countQuery.eq('user_id', userId)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    const { count: totalCount } = await countQuery

    return NextResponse.json({
      stores,
      total: totalCount || 0,
      page,
      pageSize,
      totalPages: Math.ceil((totalCount || 0) / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

