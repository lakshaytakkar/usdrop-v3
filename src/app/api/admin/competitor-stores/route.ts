import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStore } from '@/types/competitor-stores'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

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

    let query = supabaseAdmin
      .from('competitor_stores')
      .select(`
        *,
        category:categories(id, name, slug)
      `, { count: 'exact' })

    // Admin API: Show all stores (no verified filter by default)
    if (verified !== null) {
      query = query.eq('verified', verified === 'true')
    }

    // Apply filters
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (country) {
      query = query.eq('country', country)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,url.ilike.%${search}%`)
    }

    // Apply sorting
    const orderColumn = sortBy === 'name' ? 'name' :
                       sortBy === 'monthly_revenue' ? 'monthly_revenue' :
                       sortBy === 'monthly_traffic' ? 'monthly_traffic' :
                       sortBy === 'growth' ? 'growth' :
                       sortBy === 'rating' ? 'rating' :
                       'created_at'

    query = query.order(orderColumn, { ascending: sortOrder === 'asc', nullsFirst: false })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching competitor stores:', error)
      return NextResponse.json(
        { error: 'Failed to fetch competitor stores', details: error.message },
        { status: 500 }
      )
    }

    const stores: CompetitorStore[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      logo: item.logo,
      category_id: item.category_id,
      category: item.category,
      country: item.country,
      monthly_traffic: item.monthly_traffic,
      monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
      growth: parseFloat(item.growth),
      products_count: item.products_count,
      rating: item.rating ? parseFloat(item.rating) : null,
      verified: item.verified,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }))

    return NextResponse.json({ stores, totalCount: count || 0 }, { status: 200 })
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

    // Validation
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
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
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Error creating competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to create competitor store', details: error.message },
        { status: 500 }
      )
    }

    const store: CompetitorStore = {
      id: data.id,
      name: data.name,
      url: data.url,
      logo: data.logo,
      category_id: data.category_id,
      category: data.category,
      country: data.country,
      monthly_traffic: data.monthly_traffic,
      monthly_revenue: data.monthly_revenue ? parseFloat(data.monthly_revenue) : null,
      growth: parseFloat(data.growth),
      products_count: data.products_count,
      rating: data.rating ? parseFloat(data.rating) : null,
      verified: data.verified,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return NextResponse.json({ store }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error in POST admin competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

