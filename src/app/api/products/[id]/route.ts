import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string | undefined): boolean {
  return !!id && UUID_REGEX.test(id)
}

function mapRowToProduct(row: any) {
  return {
    id: row.id,
    title: row.title,
    image: row.image,
    description: row.description,
    category_id: row.category_id,
    category: row.cat_id ? {
      id: row.cat_id,
      name: row.cat_name,
      slug: row.cat_slug,
      description: row.cat_desc,
      image: row.cat_image,
      parent_category_id: row.cat_parent_id,
      trending: row.cat_trending,
      product_count: row.cat_product_count,
      avg_profit_margin: row.cat_avg_profit_margin,
      growth_percentage: row.cat_growth_percentage,
      created_at: row.cat_created_at,
      updated_at: row.cat_updated_at,
    } : null,
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
      company_name: row.sup_company_name,
      logo: row.sup_logo,
      website: row.sup_website,
      country: row.sup_country,
      rating: row.sup_rating,
      verified: row.sup_verified,
      shipping_time: row.sup_shipping_time,
      min_order_quantity: row.sup_min_order_quantity,
      contact_email: row.sup_contact_email,
      created_at: row.sup_created_at,
      updated_at: row.sup_updated_at,
    } : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    metadata: row.meta_id ? {
      id: row.meta_id,
      product_id: row.id,
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
      product_id: row.id,
      source_type: row.src_source_type,
      source_id: row.src_source_id,
      standardized_at: row.src_standardized_at,
      standardized_by: row.src_standardized_by,
      created_at: row.src_created_at,
      updated_at: row.src_updated_at,
    } : undefined,
  }
}

async function fetchCompleteProduct(id: string) {
  const result = await sql`
    SELECT p.*,
      c.id as cat_id, c.name as cat_name, c.slug as cat_slug, c.description as cat_desc, c.image as cat_image, c.parent_category_id as cat_parent_id, c.trending as cat_trending, c.product_count as cat_product_count, c.avg_profit_margin as cat_avg_profit_margin, c.growth_percentage as cat_growth_percentage, c.created_at as cat_created_at, c.updated_at as cat_updated_at,
      s.id as sup_id, s.name as sup_name, s.website as sup_website, s.country as sup_country, s.rating as sup_rating, s.verified as sup_verified, s.shipping_time as sup_shipping_time, s.min_order_quantity as sup_min_order_quantity, s.contact_email as sup_contact_email, s.created_at as sup_created_at, s.updated_at as sup_updated_at,
      pm.id as meta_id, pm.is_winning as meta_is_winning, pm.is_locked as meta_is_locked, pm.unlock_price as meta_unlock_price, pm.profit_margin as meta_profit_margin, pm.pot_revenue as meta_pot_revenue, pm.revenue_growth_rate as meta_revenue_growth_rate, pm.items_sold as meta_items_sold, pm.avg_unit_price as meta_avg_unit_price, pm.revenue_trend as meta_revenue_trend, pm.found_date as meta_found_date, pm.detailed_analysis as meta_detailed_analysis, pm.filters as meta_filters, pm.created_at as meta_created_at, pm.updated_at as meta_updated_at,
      ps.id as src_id, ps.source_type as src_source_type, ps.source_id as src_source_id, ps.standardized_at as src_standardized_at, ps.standardized_by as src_standardized_by, ps.created_at as src_created_at, ps.updated_at as src_updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN product_metadata pm ON pm.product_id = p.id
    LEFT JOIN product_source ps ON ps.product_id = p.id
    WHERE p.id = ${id}
    LIMIT 1
  `
  return result
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' },
        { status: 400 }
      )
    }

    const result = await fetchCompleteProduct(id)

    if (!result.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = mapRowToProduct(result[0])

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Unexpected error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' },
        { status: 400 }
      )
    }

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

    const setClauses: string[] = []
    const values: any[] = []
    let paramIndex = 0

    if (title !== undefined) { paramIndex++; setClauses.push(`title = $${paramIndex}`); values.push(title) }
    if (image !== undefined) { paramIndex++; setClauses.push(`image = $${paramIndex}`); values.push(image) }
    if (description !== undefined) { paramIndex++; setClauses.push(`description = $${paramIndex}`); values.push(description) }
    if (category_id !== undefined) { paramIndex++; setClauses.push(`category_id = $${paramIndex}`); values.push(category_id) }
    if (buy_price !== undefined) { paramIndex++; setClauses.push(`buy_price = $${paramIndex}`); values.push(buy_price) }
    if (sell_price !== undefined) { paramIndex++; setClauses.push(`sell_price = $${paramIndex}`); values.push(sell_price) }
    if (additional_images !== undefined) { paramIndex++; setClauses.push(`additional_images = $${paramIndex}`); values.push(JSON.stringify(additional_images)) }
    if (specifications !== undefined) { paramIndex++; setClauses.push(`specifications = $${paramIndex}`); values.push(specifications ? JSON.stringify(specifications) : null) }
    if (rating !== undefined) { paramIndex++; setClauses.push(`rating = $${paramIndex}`); values.push(rating) }
    if (reviews_count !== undefined) { paramIndex++; setClauses.push(`reviews_count = $${paramIndex}`); values.push(reviews_count) }
    if (trend_data !== undefined) { paramIndex++; setClauses.push(`trend_data = $${paramIndex}`); values.push(JSON.stringify(trend_data)) }
    if (supplier_id !== undefined) { paramIndex++; setClauses.push(`supplier_id = $${paramIndex}`); values.push(supplier_id) }

    if (setClauses.length > 0) {
      paramIndex++
      setClauses.push(`updated_at = NOW()`)
      const updateQuery = `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`
      values.push(id)
      const updateResult = await sql.unsafe(updateQuery, values)

      if (!updateResult.length) {
        return NextResponse.json(
          { error: 'Failed to update product', details: 'Product not found or no rows updated' },
          { status: 500 }
        )
      }
    }

    if (metadata) {
      try {
        const metaFields: string[] = []
        const metaValues: any[] = [id]
        let metaIdx = 1

        const metaColumns = ['is_winning', 'is_locked', 'unlock_price', 'profit_margin', 'pot_revenue', 'revenue_growth_rate', 'items_sold', 'avg_unit_price', 'revenue_trend', 'found_date', 'detailed_analysis', 'filters']
        const insertCols = ['product_id']
        const insertVals = [`$1`]
        const updateSets: string[] = []

        for (const col of metaColumns) {
          if (metadata[col] !== undefined) {
            metaIdx++
            insertCols.push(col)
            let val = metadata[col]
            if (['revenue_trend', 'filters'].includes(col)) val = JSON.stringify(val || [])
            if (col === 'detailed_analysis' && val) val = JSON.stringify(val)
            insertVals.push(`$${metaIdx}`)
            updateSets.push(`${col} = $${metaIdx}`)
            metaValues.push(val)
          }
        }

        if (updateSets.length > 0) {
          const upsertQuery = `
            INSERT INTO product_metadata (${insertCols.join(', ')})
            VALUES (${insertVals.join(', ')})
            ON CONFLICT (product_id) DO UPDATE SET ${updateSets.join(', ')}, updated_at = NOW()
          `
          await sql.unsafe(upsertQuery, metaValues)
        }
      } catch (metaError) {
        console.error('Error updating product metadata:', metaError)
      }
    }

    if (source) {
      try {
        const srcCols = ['product_id']
        const srcVals = [`$1`]
        const srcUpdateSets: string[] = []
        const srcValues: any[] = [id]
        let srcIdx = 1

        const srcColumns = ['source_type', 'source_id', 'standardized_at', 'standardized_by']
        for (const col of srcColumns) {
          if (source[col] !== undefined) {
            srcIdx++
            srcCols.push(col)
            srcVals.push(`$${srcIdx}`)
            srcUpdateSets.push(`${col} = $${srcIdx}`)
            srcValues.push(source[col])
          }
        }

        if (srcUpdateSets.length > 0) {
          const upsertQuery = `
            INSERT INTO product_source (${srcCols.join(', ')})
            VALUES (${srcVals.join(', ')})
            ON CONFLICT (product_id) DO UPDATE SET ${srcUpdateSets.join(', ')}, updated_at = NOW()
          `
          await sql.unsafe(upsertQuery, srcValues)
        }
      } catch (sourceError) {
        console.error('Error updating product source:', sourceError)
      }
    }

    const completeResult = await fetchCompleteProduct(id)

    if (!completeResult.length) {
      return NextResponse.json(
        { error: 'Product not found after update' },
        { status: 404 }
      )
    }

    const product = mapRowToProduct(completeResult[0])

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Unexpected error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' },
        { status: 400 }
      )
    }

    await sql`DELETE FROM product_metadata WHERE product_id = ${id}`
    await sql`DELETE FROM product_source WHERE product_id = ${id}`
    await sql`DELETE FROM products WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
