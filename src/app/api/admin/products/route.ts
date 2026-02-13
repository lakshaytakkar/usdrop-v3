import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'
import { ProductsQueryParams, ProductsResponse } from '@/types/products'

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

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

    const whereClauses: string[] = []
    const values: any[] = []
    let paramIndex = 0

    if (sourceType) {
      paramIndex++
      whereClauses.push(`ps.source_type = $${paramIndex}`)
      values.push(sourceType)
    }

    if (isWinning !== null && isWinning !== undefined) {
      paramIndex++
      whereClauses.push(`pm.is_winning = $${paramIndex}`)
      values.push(isWinning === 'true')
    }

    if (isLocked !== null && isLocked !== undefined) {
      paramIndex++
      whereClauses.push(`pm.is_locked = $${paramIndex}`)
      values.push(isLocked === 'true')
    }

    if (categoryId) {
      paramIndex++
      whereClauses.push(`p.category_id = $${paramIndex}`)
      values.push(categoryId)
    }

    if (search) {
      paramIndex++
      const searchParam = `%${search}%`
      whereClauses.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`)
      values.push(searchParam)
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const orderColumn = sortBy === 'profit_per_order' ? 'p.profit_per_order' :
                       sortBy === 'sell_price' ? 'p.sell_price' :
                       sortBy === 'rating' ? 'p.rating' :
                       'p.created_at'
    const orderDir = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const countQuery = `
      SELECT COUNT(*) as count
      FROM products p
      LEFT JOIN product_metadata pm ON pm.product_id = p.id
      LEFT JOIN product_source ps ON ps.product_id = p.id
      ${whereSQL}
    `
    const countResult = await sql.unsafe(countQuery, values)
    const total = parseInt(countResult[0]?.count || '0')

    const offset = (page - 1) * pageSize

    const dataQuery = `
      SELECT
        p.id, p.title, p.image, p.description, p.category_id,
        p.buy_price, p.sell_price, p.profit_per_order,
        p.additional_images, p.specifications, p.rating, p.reviews_count,
        p.trend_data, p.supplier_id, p.created_at, p.updated_at,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
        c.description as cat_description, c.image as cat_image,
        c.thumbnail as cat_thumbnail, c.parent_category_id as cat_parent_category_id,
        c.trending as cat_trending, c.product_count as cat_product_count,
        c.avg_profit_margin as cat_avg_profit_margin, c.growth_percentage as cat_growth_percentage,
        c.created_at as cat_created_at, c.updated_at as cat_updated_at,
        s.id as sup_id, s.name as sup_name, s.website as sup_website,
        s.country as sup_country, s.rating as sup_rating, s.verified as sup_verified,
        s.shipping_time as sup_shipping_time, s.min_order_quantity as sup_min_order_quantity,
        s.contact_email as sup_contact_email,
        s.created_at as sup_created_at, s.updated_at as sup_updated_at,
        pm.id as meta_id, pm.product_id as meta_product_id,
        pm.is_winning as meta_is_winning, pm.is_locked as meta_is_locked,
        pm.unlock_price as meta_unlock_price, pm.profit_margin as meta_profit_margin,
        pm.pot_revenue as meta_pot_revenue, pm.revenue_growth_rate as meta_revenue_growth_rate,
        pm.items_sold as meta_items_sold, pm.avg_unit_price as meta_avg_unit_price,
        pm.revenue_trend as meta_revenue_trend, pm.found_date as meta_found_date,
        pm.detailed_analysis as meta_detailed_analysis, pm.filters as meta_filters,
        pm.created_at as meta_created_at, pm.updated_at as meta_updated_at,
        ps.id as src_id, ps.product_id as src_product_id,
        ps.source_type as src_source_type, ps.source_id as src_source_id,
        ps.standardized_at as src_standardized_at, ps.standardized_by as src_standardized_by,
        ps.created_at as src_created_at, ps.updated_at as src_updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_metadata pm ON pm.product_id = p.id
      LEFT JOIN product_source ps ON ps.product_id = p.id
      ${whereSQL}
      ORDER BY ${orderColumn} ${orderDir}
      LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}
    `

    const data = await sql.unsafe(dataQuery, [...values, pageSize, offset])

    const products = data.map((row: any) => ({
      id: row.id,
      title: row.title,
      image: row.image,
      description: row.description,
      category_id: row.category_id,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        slug: row.cat_slug,
        description: row.cat_description,
        image: row.cat_image,
        thumbnail: row.cat_thumbnail || null,
        parent_category_id: row.cat_parent_category_id,
        trending: row.cat_trending,
        product_count: row.cat_product_count,
        avg_profit_margin: row.cat_avg_profit_margin,
        growth_percentage: row.cat_growth_percentage,
        created_at: row.cat_created_at,
        updated_at: row.cat_updated_at,
      } : undefined,
      buy_price: parseFloat(row.buy_price),
      sell_price: parseFloat(row.sell_price),
      profit_per_order: parseFloat(row.profit_per_order),
      additional_images: row.additional_images || [],
      specifications: row.specifications,
      rating: row.rating ? parseFloat(row.rating) : null,
      reviews_count: row.reviews_count || 0,
      trend_data: row.trend_data || [],
      supplier_id: row.supplier_id,
      supplier: row.sup_id ? {
        id: row.sup_id,
        name: row.sup_name,
        company_name: row.sup_name || null,
        logo: null,
        website: row.sup_website,
        country: row.sup_country,
        rating: row.sup_rating,
        verified: row.sup_verified,
        shipping_time: row.sup_shipping_time,
        min_order_quantity: row.sup_min_order_quantity,
        contact_email: row.sup_contact_email,
        created_at: row.sup_created_at,
        updated_at: row.sup_updated_at,
      } : undefined,
      created_at: row.created_at,
      updated_at: row.updated_at,
      metadata: row.meta_id ? {
        id: row.meta_id,
        product_id: row.meta_product_id,
        is_winning: row.meta_is_winning || false,
        is_locked: row.meta_is_locked || false,
        unlock_price: row.meta_unlock_price ? parseFloat(row.meta_unlock_price) : null,
        profit_margin: row.meta_profit_margin ? parseFloat(row.meta_profit_margin) : null,
        pot_revenue: row.meta_pot_revenue ? parseFloat(row.meta_pot_revenue) : null,
        revenue_growth_rate: row.meta_revenue_growth_rate ? parseFloat(row.meta_revenue_growth_rate) : null,
        items_sold: row.meta_items_sold,
        avg_unit_price: row.meta_avg_unit_price ? parseFloat(row.meta_avg_unit_price) : null,
        revenue_trend: row.meta_revenue_trend || [],
        found_date: row.meta_found_date,
        detailed_analysis: row.meta_detailed_analysis,
        filters: row.meta_filters || [],
        created_at: row.meta_created_at,
        updated_at: row.meta_updated_at,
      } : undefined,
      source: row.src_id ? {
        id: row.src_id,
        product_id: row.src_product_id,
        source_type: row.src_source_type,
        source_id: row.src_source_id,
        standardized_at: row.src_standardized_at,
        standardized_by: row.src_standardized_by,
        created_at: row.src_created_at,
        updated_at: row.src_updated_at,
      } : undefined,
    }))

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
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

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

    const productResult = await sql`
      INSERT INTO products (title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, supplier_id)
      VALUES (${title}, ${image}, ${description || null}, ${category_id || null}, ${buy_price}, ${sell_price}, ${calculatedProfit}, ${JSON.stringify(additional_images || [])}, ${specifications ? JSON.stringify(specifications) : null}, ${rating || null}, ${reviews_count || 0}, ${JSON.stringify(trend_data || [])}, ${supplier_id || null})
      RETURNING *
    `

    if (!productResult.length) {
      console.error('Error creating product: no rows returned')
      return NextResponse.json(
        { error: 'Failed to create product', details: 'Insert returned no rows' },
        { status: 500 }
      )
    }

    const product = productResult[0]

    if (metadata && product) {
      await sql`
        INSERT INTO product_metadata (product_id, is_winning, is_locked, unlock_price, profit_margin, pot_revenue, revenue_growth_rate, items_sold, avg_unit_price, revenue_trend, found_date, detailed_analysis, filters)
        VALUES (${product.id}, ${metadata.is_winning || false}, ${metadata.is_locked || false}, ${metadata.unlock_price || null}, ${metadata.profit_margin || null}, ${metadata.pot_revenue || null}, ${metadata.revenue_growth_rate || null}, ${metadata.items_sold || null}, ${metadata.avg_unit_price || null}, ${JSON.stringify(metadata.revenue_trend || [])}, ${metadata.found_date || null}, ${metadata.detailed_analysis ? JSON.stringify(metadata.detailed_analysis) : null}, ${JSON.stringify(metadata.filters || [])})
      `
    }

    if (source && product) {
      await sql`
        INSERT INTO product_source (product_id, source_type, source_id, standardized_at, standardized_by)
        VALUES (${product.id}, ${source.source_type || null}, ${source.source_id || null}, ${source.standardized_at || null}, ${source.standardized_by || null})
      `
    }

    const completeProduct = await sql`
      SELECT p.*,
        c.id as cat_id, c.name as cat_name, c.slug as cat_slug,
        s.id as sup_id, s.name as sup_name,
        pm.id as meta_id, pm.is_winning as meta_is_winning,
        ps.id as src_id, ps.source_type as src_source_type
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN product_metadata pm ON pm.product_id = p.id
      LEFT JOIN product_source ps ON ps.product_id = p.id
      WHERE p.id = ${product.id}
      LIMIT 1
    `

    return NextResponse.json(
      { product: completeProduct[0] || product },
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
