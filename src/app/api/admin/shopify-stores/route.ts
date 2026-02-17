import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { mapShopifyStoreFromDB } from '@/lib/utils/shopify-store-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('user_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let countQuery = supabaseAdmin.from('shopify_stores').select('*', { count: 'exact', head: true })
    let dataQuery = supabaseAdmin.from('shopify_stores').select('*, profiles(id, email, full_name)')

    if (status) {
      countQuery = countQuery.eq('status', status)
      dataQuery = dataQuery.eq('status', status)
    }
    if (userId) {
      countQuery = countQuery.eq('user_id', userId)
      dataQuery = dataQuery.eq('user_id', userId)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
      dataQuery = dataQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    const allowedSortColumns = ['created_at', 'updated_at', 'name', 'url', 'status', 'products_count']
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'

    dataQuery = dataQuery.order(safeSortBy, { ascending: sortOrder === 'asc' })

    const offset = (page - 1) * pageSize
    dataQuery = dataQuery.range(offset, offset + pageSize - 1)

    const [{ count: totalCount }, { data, error }] = await Promise.all([countQuery, dataQuery])

    if (error) {
      console.error('Error fetching shopify stores:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const total = totalCount || 0

    if (!data || data.length === 0) {
      return NextResponse.json({
        stores: [],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      })
    }

    const stores = data.map((row: any) => mapShopifyStoreFromDB(row))

    return NextResponse.json({
      stores,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/shopify-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
