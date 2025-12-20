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

    // First, get product IDs that match filters from related tables
    let productIds: string[] | null = null

    if (sourceType) {
      const { data: sourceData } = await supabaseAdmin
        .from('product_source')
        .select('product_id')
        .eq('source_type', sourceType)
      productIds = sourceData?.map(s => s.product_id) || []
      if (productIds.length === 0) {
        return NextResponse.json({
          products: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        })
      }
    }

    if (isWinning !== null) {
      const { data: metadataData } = await supabaseAdmin
        .from('product_metadata')
        .select('product_id')
        .eq('is_winning', isWinning === 'true')
      const winningIds = metadataData?.map(m => m.product_id) || []
      if (productIds) {
        productIds = productIds.filter(id => winningIds.includes(id))
      } else {
        productIds = winningIds
      }
      if (productIds.length === 0) {
        return NextResponse.json({
          products: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        })
      }
    }

    if (isLocked !== null) {
      const { data: metadataData } = await supabaseAdmin
        .from('product_metadata')
        .select('product_id')
        .eq('is_locked', isLocked === 'true')
      const lockedIds = metadataData?.map(m => m.product_id) || []
      if (productIds) {
        productIds = productIds.filter(id => lockedIds.includes(id))
      } else {
        productIds = lockedIds
      }
      if (productIds.length === 0) {
        return NextResponse.json({
          products: [],
          total: 0,
          page,
          pageSize,
          totalPages: 0,
        })
      }
    }

    // Build query
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        supplier:suppliers(*),
        metadata:product_metadata(*),
        source:product_source(*)
      `)

    // Apply filters
    if (productIds) {
      query = query.in('id', productIds)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Get total count for pagination (before pagination)
    let countQuery = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    if (productIds) {
      countQuery = countQuery.in('id', productIds)
    }
    if (categoryId) {
      countQuery = countQuery.eq('category_id', categoryId)
    }
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { count } = await countQuery

    // Apply sorting
    const orderColumn = sortBy === 'profit_per_order' ? 'profit_per_order' :
                       sortBy === 'sell_price' ? 'sell_price' :
                       sortBy === 'rating' ? 'rating' :
                       'created_at'
    
    query = query.order(orderColumn, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match Product type
    const products = (data || []).map((product: any) => ({
      id: product.id,
      title: product.title,
      image: product.image,
      description: product.description,
      category_id: product.category_id,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        description: product.category.description,
        image: product.category.image,
        thumbnail: product.category.thumbnail || null,
        parent_category_id: product.category.parent_category_id,
        trending: product.category.trending,
        product_count: product.category.product_count,
        avg_profit_margin: product.category.avg_profit_margin,
        growth_percentage: product.category.growth_percentage,
        created_at: product.category.created_at,
        updated_at: product.category.updated_at,
      } : undefined,
      buy_price: parseFloat(product.buy_price),
      sell_price: parseFloat(product.sell_price),
      profit_per_order: parseFloat(product.profit_per_order),
      additional_images: product.additional_images || [],
      specifications: product.specifications,
      rating: product.rating ? parseFloat(product.rating) : null,
      reviews_count: product.reviews_count || 0,
      trend_data: product.trend_data || [],
      supplier_id: product.supplier_id,
      supplier: product.supplier ? {
        id: product.supplier.id,
        name: product.supplier.name,
        company_name: product.supplier.company_name,
        logo: product.supplier.logo,
        created_at: product.supplier.created_at,
        updated_at: product.supplier.updated_at,
      } : undefined,
      created_at: product.created_at,
      updated_at: product.updated_at,
      metadata: product.metadata ? {
        id: product.metadata.id,
        product_id: product.metadata.product_id,
        is_winning: product.metadata.is_winning || false,
        is_locked: product.metadata.is_locked || false,
        unlock_price: product.metadata.unlock_price ? parseFloat(product.metadata.unlock_price) : null,
        profit_margin: product.metadata.profit_margin ? parseFloat(product.metadata.profit_margin) : null,
        pot_revenue: product.metadata.pot_revenue ? parseFloat(product.metadata.pot_revenue) : null,
        revenue_growth_rate: product.metadata.revenue_growth_rate ? parseFloat(product.metadata.revenue_growth_rate) : null,
        items_sold: product.metadata.items_sold,
        avg_unit_price: product.metadata.avg_unit_price ? parseFloat(product.metadata.avg_unit_price) : null,
        revenue_trend: product.metadata.revenue_trend || [],
        found_date: product.metadata.found_date,
        detailed_analysis: product.metadata.detailed_analysis,
        filters: product.metadata.filters || [],
        created_at: product.metadata.created_at,
        updated_at: product.metadata.updated_at,
      } : undefined,
      source: product.source ? {
        id: product.source.id,
        product_id: product.source.product_id,
        source_type: product.source.source_type,
        source_id: product.source.source_id,
        standardized_at: product.source.standardized_at,
        standardized_by: product.source.standardized_by,
        created_at: product.source.created_at,
        updated_at: product.source.updated_at,
      } : undefined,
    }))

    const total = count || 0
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

    // Validate required fields
    if (!title || !image || !buy_price || !sell_price) {
      return NextResponse.json(
        { error: 'Missing required fields: title, image, buy_price, sell_price' },
        { status: 400 }
      )
    }

    // Insert product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        title,
        image,
        description: description || null,
        category_id: category_id || null,
        buy_price,
        sell_price,
        additional_images: additional_images || [],
        specifications: specifications || null,
        rating: rating || null,
        reviews_count: reviews_count || 0,
        trend_data: trend_data || [],
        supplier_id: supplier_id || null,
      })
      .select()
      .single()

    if (productError) {
      console.error('Error creating product:', productError)
      return NextResponse.json(
        { error: 'Failed to create product', details: productError.message },
        { status: 500 }
      )
    }

    // Insert metadata if provided
    if (metadata && product) {
      await supabaseAdmin
        .from('product_metadata')
        .insert({
          product_id: product.id,
          ...metadata,
        })
    }

    // Insert source if provided
    if (source && product) {
      await supabaseAdmin
        .from('product_source')
        .insert({
          product_id: product.id,
          ...source,
        })
    }

    // Fetch complete product with relations
    const { data: completeProduct, error: fetchError } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        supplier:suppliers(*),
        metadata:product_metadata(*),
        source:product_source(*)
      `)
      .eq('id', product.id)
      .single()

    if (fetchError) {
      console.error('Error fetching created product:', fetchError)
    }

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

