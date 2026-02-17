import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapStore(item: any) {
  const cat = item.categories
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    logo: item.logo,
    category_id: item.category_id,
    category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
    country: item.country,
    monthly_traffic: item.monthly_traffic,
    monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
    growth: parseFloat(item.growth),
    products_count: item.products_count,
    rating: item.rating ? parseFloat(item.rating) : null,
    verified: item.verified,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let countQuery = supabaseAdmin.from('competitor_stores').select('*', { count: 'exact', head: true })
    let dataQuery = supabaseAdmin.from('competitor_stores').select('*, categories(id, name, slug)')

    if (verified !== null) {
      countQuery = countQuery.eq('verified', verified === 'true')
      dataQuery = dataQuery.eq('verified', verified === 'true')
    }
    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId)
      dataQuery = dataQuery.eq('category_id', categoryId)
    }
    if (country) {
      countQuery = countQuery.eq('country', country)
      dataQuery = dataQuery.eq('country', country)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
      dataQuery = dataQuery.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    const allowedSortColumns: Record<string, string> = {
      name: 'name',
      monthly_revenue: 'monthly_revenue',
      monthly_traffic: 'monthly_traffic',
      growth: 'growth',
      rating: 'rating',
      created_at: 'created_at',
    }
    const orderCol = allowedSortColumns[sortBy] || 'created_at'
    dataQuery = dataQuery.order(orderCol, { ascending: sortOrder === 'asc', nullsFirst: false })

    const offset = (page - 1) * pageSize
    dataQuery = dataQuery.range(offset, offset + pageSize - 1)

    const [{ count: totalCount }, { data, error }] = await Promise.all([
      countQuery,
      dataQuery,
    ])

    if (error) {
      console.error('Error fetching competitor stores:', error)
      return NextResponse.json({ error: 'An unexpected error occurred', details: error.message }, { status: 500 })
    }

    const stores = (data || []).map(mapStore)

    return NextResponse.json({ stores, totalCount: totalCount || 0 }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET admin competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()
    const {
      name,
      url,
      logo,
      category_id,
      country,
      monthly_traffic,
      monthly_revenue,
      growth,
      products_count,
      rating,
      verified,
    } = body

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('competitor_stores')
      .insert({
        name,
        url,
        logo: logo || null,
        category_id: category_id || null,
        country: country || null,
        monthly_traffic: monthly_traffic || 0,
        monthly_revenue: monthly_revenue || null,
        growth: growth || 0,
        products_count: products_count || null,
        rating: rating || null,
        verified: verified || false,
      })
      .select('*, categories(id, name, slug)')
      .single()

    if (insertError || !inserted) {
      console.error('Error creating competitor store:', insertError)
      return NextResponse.json(
        { error: 'An unexpected error occurred', details: insertError?.message },
        { status: 500 }
      )
    }

    const store = mapStore(inserted)

    return NextResponse.json({ store }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error in POST admin competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
