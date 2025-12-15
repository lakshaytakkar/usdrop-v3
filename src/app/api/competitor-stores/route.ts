import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStore } from '@/types/competitor-stores'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified') // Default to true for public
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'monthly_revenue'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    let query = supabaseAdmin
      .from('competitor_stores')
      .select(`
        *,
        category:categories(id, name, slug)
      `, { count: 'exact' })

    // Public API: Only show verified stores by default
    const isVerified = verified === null ? true : verified === 'true'
    query = query.eq('verified', isVerified)

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
    console.error('Unexpected error in GET competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

