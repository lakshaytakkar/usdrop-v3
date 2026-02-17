import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100)
    const offset = (page - 1) * pageSize

    let countQuery = supabaseAdmin.from('orders').select('*', { count: 'exact', head: true })
    let dataQuery = supabaseAdmin.from('orders').select('*, profiles(full_name, email, avatar_url)')

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
      dataQuery = dataQuery.eq('status', status)
    }
    if (search) {
      countQuery = countQuery.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`)
      dataQuery = dataQuery.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`)
    }

    dataQuery = dataQuery.order('created_at', { ascending: false })
    dataQuery = dataQuery.range(offset, offset + pageSize - 1)

    const [{ count: total }, { data: ordersData, error }] = await Promise.all([countQuery, dataQuery])

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const orders = (ordersData || []).map((o: any) => {
      const profile = o.profiles
      const { profiles: _, ...orderFields } = o
      return {
        ...orderFields,
        user_name: profile?.full_name || null,
        user_email: profile?.email || null,
        user_avatar: profile?.avatar_url || null,
      }
    })

    const totalCount = total || 0

    return NextResponse.json({
      orders,
      total: totalCount,
      page,
      pageSize,
      pageCount: Math.ceil(totalCount / pageSize),
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
