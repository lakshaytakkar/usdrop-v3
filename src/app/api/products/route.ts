import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { ProductsQueryParams, ProductsResponse } from '@/types/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sourceType = searchParams.get('source_type')
    const isWinning = searchParams.get('is_winning')
    const isLocked = searchParams.get('is_locked')
    const categoryId = searchParams.get('category_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const offset = (page - 1) * pageSize

    const selectParts = ['*', 'categories(*)', 'suppliers(*)']
    if (isWinning !== null || isLocked !== null) {
      selectParts.push('product_metadata!inner(*)')
    } else {
      selectParts.push('product_metadata(*)')
    }
    if (sourceType) {
      selectParts.push('product_source!inner(*)')
    } else {
      selectParts.push('product_source(*)')
    }

    let query = supabaseAdmin
      .from('products')
      .select(selectParts.join(', '), { count: 'exact' })

    if (sourceType) query = query.eq('product_source.source_type', sourceType)
    if (isWinning !== null) query = query.eq('product_metadata.is_winning', isWinning === 'true')
    if (isLocked !== null) query = query.eq('product_metadata.is_locked', isLocked === 'true')
    if (categoryId) query = query.eq('category_id', categoryId)
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

    const sortColumn = sortBy === 'profit_per_order' ? 'profit_per_order' :
                       sortBy === 'sell_price' ? 'sell_price' :
                       sortBy === 'rating' ? 'rating' :
                       'created_at'
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' })
    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    const total = count || 0

    const products = (data || []).map((row: any) => {
      const cat = row.categories
      const sup = row.suppliers
      const meta = Array.isArray(row.product_metadata) ? row.product_metadata[0] : row.product_metadata
      const src = Array.isArray(row.product_source) ? row.product_source[0] : row.product_source

      return {
        id: row.id,
        title: row.title,
        image: row.image,
        description: row.description,
        category_id: row.category_id,
        category: cat ? {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          image: cat.image,
          thumbnail: cat.thumbnail || null,
          parent_category_id: cat.parent_category_id,
          trending: cat.trending,
          product_count: cat.product_count,
          avg_profit_margin: cat.avg_profit_margin,
          growth_percentage: cat.growth_percentage,
          created_at: cat.created_at,
          updated_at: cat.updated_at,
        } : undefined,
        buy_price: parseFloat(row.buy_price),
        sell_price: parseFloat(row.sell_price),
        profit_per_order: parseFloat(row.profit_per_order),
        additional_images: Array.isArray(row.additional_images) ? row.additional_images : [],
        specifications: row.specifications || null,
        rating: row.rating ? parseFloat(row.rating) : null,
        reviews_count: row.reviews_count || 0,
        trend_data: Array.isArray(row.trend_data) ? row.trend_data : [],
        supplier_id: row.supplier_id,
        supplier: sup ? {
          id: sup.id,
          name: sup.name,
          company_name: sup.name || null,
          logo: null,
          website: sup.website,
          country: sup.country,
          rating: sup.rating,
          verified: sup.verified,
          shipping_time: sup.shipping_time,
          min_order_quantity: sup.min_order_quantity,
          contact_email: sup.contact_email,
          created_at: sup.created_at,
          updated_at: sup.updated_at,
        } : undefined,
        created_at: row.created_at,
        updated_at: row.updated_at,
        metadata: meta ? {
          id: meta.id,
          product_id: meta.product_id,
          is_winning: meta.is_winning || false,
          is_locked: meta.is_locked || false,
          unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
          profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
          pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
          revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
          items_sold: meta.items_sold,
          avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
          revenue_trend: Array.isArray(meta.revenue_trend) ? meta.revenue_trend : [],
          found_date: meta.found_date,
          detailed_analysis: meta.detailed_analysis,
          filters: Array.isArray(meta.filters) ? meta.filters : [],
          created_at: meta.created_at,
          updated_at: meta.updated_at,
        } : undefined,
        source: src ? {
          id: src.id,
          product_id: src.product_id,
          source_type: src.source_type,
          source_id: src.source_id,
          standardized_at: src.standardized_at,
          standardized_by: src.standardized_by,
          created_at: src.created_at,
          updated_at: src.updated_at,
        } : undefined,
      }
    })

    const totalPages = Math.ceil(total / pageSize)

    const response: ProductsResponse = {
      products,
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      image,
      description,
      category_id,
      buy_price,
      sell_price,
      additional_images,
      specifications,
      rating,
      reviews_count,
      trend_data,
      supplier_id,
      metadata,
      source,
    } = body

    if (!title || !image || !buy_price || !sell_price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, image, buy_price, sell_price' },
        { status: 400 }
      )
    }

    const calculatedProfit = parseFloat(sell_price) - parseFloat(buy_price)

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        title,
        image,
        description: description || null,
        category_id: category_id || null,
        buy_price,
        sell_price,
        profit_per_order: calculatedProfit,
        additional_images: additional_images || [],
        specifications: specifications || null,
        rating: rating || null,
        reviews_count: reviews_count || 0,
        trend_data: trend_data || [],
        supplier_id: supplier_id || null,
      })
      .select()
      .single()

    if (productError || !product) {
      console.error('Error creating product:', productError)
      return NextResponse.json(
        { error: 'Failed to create product', details: productError?.message || 'Insert returned no rows' },
        { status: 500 }
      )
    }

    if (metadata && product) {
      await supabaseAdmin
        .from('product_metadata')
        .insert({
          product_id: product.id,
          is_winning: metadata.is_winning || false,
          is_locked: metadata.is_locked || false,
          unlock_price: metadata.unlock_price || null,
          profit_margin: metadata.profit_margin || null,
          pot_revenue: metadata.pot_revenue || null,
          revenue_growth_rate: metadata.revenue_growth_rate || null,
          items_sold: metadata.items_sold || null,
          avg_unit_price: metadata.avg_unit_price || null,
          revenue_trend: metadata.revenue_trend || [],
          found_date: metadata.found_date || null,
          detailed_analysis: metadata.detailed_analysis || null,
          filters: metadata.filters || [],
        })
    }

    if (source && product) {
      await supabaseAdmin
        .from('product_source')
        .insert({
          product_id: product.id,
          source_type: source.source_type || null,
          source_id: source.source_id || null,
          standardized_at: source.standardized_at || null,
          standardized_by: source.standardized_by || null,
        })
    }

    const { data: completeProduct } = await supabaseAdmin
      .from('products')
      .select('*, categories(id, name, slug), suppliers(id, name), product_metadata(id, is_winning), product_source(id, source_type)')
      .eq('id', product.id)
      .single()

    return NextResponse.json(
      { product: completeProduct || product },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
