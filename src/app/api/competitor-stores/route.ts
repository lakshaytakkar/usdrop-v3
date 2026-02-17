import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStore } from '@/types/competitor-stores'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('category_id')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortBy = searchParams.get('sortBy') || 'monthly_revenue'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const offset = (page - 1) * pageSize

    const isVerified = verified === null ? true : verified === 'true'

    let countQuery = supabaseAdmin
      .from('competitor_stores')
      .select('id', { count: 'exact', head: true })
      .eq('verified', isVerified)

    let dataQuery = supabaseAdmin
      .from('competitor_stores')
      .select('*, categories(id, name, slug)', { count: 'exact' })
      .eq('verified', isVerified)

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

    const sortColumn = sortBy === 'name' ? 'name' :
                       sortBy === 'monthly_revenue' ? 'monthly_revenue' :
                       sortBy === 'monthly_traffic' ? 'monthly_traffic' :
                       sortBy === 'growth' ? 'growth' :
                       sortBy === 'rating' ? 'rating' :
                       'created_at'

    dataQuery = dataQuery
      .order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false })
      .range(offset, offset + pageSize - 1)

    const [countResult, dataResult] = await Promise.all([countQuery, dataQuery])

    const totalCount = countResult.count || 0

    if (dataResult.error) {
      console.error('Error fetching competitor stores:', dataResult.error)
      return NextResponse.json(
        { error: 'Failed to fetch competitor stores' },
        { status: 500 }
      )
    }

    const stores: CompetitorStore[] = (dataResult.data || []).map((item: any) => {
      const cat = item.categories
      return {
        id: item.id,
        name: item.name,
        url: item.url,
        logo: item.logo,
        category_id: item.category_id,
        category: cat ? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        } : null,
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
    })

    return NextResponse.json({ stores, totalCount }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET competitor stores:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
