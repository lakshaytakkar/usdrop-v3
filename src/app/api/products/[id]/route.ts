import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string | undefined): boolean {
  return !!id && UUID_REGEX.test(id)
}

function mapRowToProduct(row: any) {
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
      parent_category_id: cat.parent_category_id,
      trending: cat.trending,
      product_count: cat.product_count,
      avg_profit_margin: cat.avg_profit_margin,
      growth_percentage: cat.growth_percentage,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    } : null,
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
      company_name: sup.name,
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
    } : null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    metadata: meta ? {
      id: meta.id,
      product_id: row.id,
      is_winning: meta.is_winning || false,
      is_locked: meta.is_locked || false,
      unlock_price: meta.unlock_price ? parseFloat(meta.unlock_price) : null,
      profit_margin: meta.profit_margin ? parseFloat(meta.profit_margin) : null,
      pot_revenue: meta.pot_revenue ? parseFloat(meta.pot_revenue) : null,
      revenue_growth_rate: meta.revenue_growth_rate ? parseFloat(meta.revenue_growth_rate) : null,
      items_sold: meta.items_sold,
      avg_unit_price: meta.avg_unit_price ? parseFloat(meta.avg_unit_price) : null,
      revenue_trend: meta.revenue_trend || [],
      found_date: meta.found_date,
      detailed_analysis: meta.detailed_analysis,
      filters: meta.filters || [],
      created_at: meta.created_at,
      updated_at: meta.updated_at,
    } : undefined,
    source: src ? {
      id: src.id,
      product_id: row.id,
      source_type: src.source_type,
      source_id: src.source_id,
      standardized_at: src.standardized_at,
      standardized_by: src.standardized_by,
      created_at: src.created_at,
      updated_at: src.updated_at,
    } : undefined,
  }
}

async function fetchCompleteProduct(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, categories(*), suppliers(*), product_metadata(*), product_source(*)')
    .eq('id', id)
    .single()

  return { data, error }
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

    const { data, error } = await fetchCompleteProduct(id)

    if (error || !data) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = mapRowToProduct(data)

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

    const updateFields: Record<string, any> = {}

    if (title !== undefined) updateFields.title = title
    if (image !== undefined) updateFields.image = image
    if (description !== undefined) updateFields.description = description
    if (category_id !== undefined) updateFields.category_id = category_id
    if (buy_price !== undefined) updateFields.buy_price = buy_price
    if (sell_price !== undefined) updateFields.sell_price = sell_price
    if (buy_price !== undefined || sell_price !== undefined) {
      const newBuy = buy_price !== undefined ? parseFloat(buy_price) : null
      const newSell = sell_price !== undefined ? parseFloat(sell_price) : null
      if (newBuy !== null && newSell !== null) {
        updateFields.profit_per_order = newSell - newBuy
      }
    }
    if (additional_images !== undefined) updateFields.additional_images = additional_images
    if (specifications !== undefined) updateFields.specifications = specifications || null
    if (rating !== undefined) updateFields.rating = rating
    if (reviews_count !== undefined) updateFields.reviews_count = reviews_count
    if (trend_data !== undefined) updateFields.trend_data = trend_data
    if (supplier_id !== undefined) updateFields.supplier_id = supplier_id

    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date().toISOString()

      const { data: updateResult, error: updateError } = await supabaseAdmin
        .from('products')
        .update(updateFields)
        .eq('id', id)
        .select()

      if (updateError || !updateResult?.length) {
        return NextResponse.json(
          { error: 'Failed to update product', details: 'Product not found or no rows updated' },
          { status: 500 }
        )
      }
    }

    if (metadata) {
      try {
        const metaUpdate: Record<string, any> = { product_id: id }
        const metaColumns = ['is_winning', 'is_locked', 'unlock_price', 'profit_margin', 'pot_revenue', 'revenue_growth_rate', 'items_sold', 'avg_unit_price', 'revenue_trend', 'found_date', 'detailed_analysis', 'filters']

        for (const col of metaColumns) {
          if (metadata[col] !== undefined) {
            metaUpdate[col] = metadata[col]
          }
        }

        if (Object.keys(metaUpdate).length > 1) {
          metaUpdate.updated_at = new Date().toISOString()
          await supabaseAdmin
            .from('product_metadata')
            .upsert(metaUpdate, { onConflict: 'product_id' })
        }
      } catch (metaError) {
        console.error('Error updating product metadata:', metaError)
      }
    }

    if (source) {
      try {
        const srcUpdate: Record<string, any> = { product_id: id }
        const srcColumns = ['source_type', 'source_id', 'standardized_at', 'standardized_by']

        for (const col of srcColumns) {
          if (source[col] !== undefined) {
            srcUpdate[col] = source[col]
          }
        }

        if (Object.keys(srcUpdate).length > 1) {
          srcUpdate.updated_at = new Date().toISOString()
          await supabaseAdmin
            .from('product_source')
            .upsert(srcUpdate, { onConflict: 'product_id' })
        }
      } catch (sourceError) {
        console.error('Error updating product source:', sourceError)
      }
    }

    const { data: completeResult, error: fetchError } = await fetchCompleteProduct(id)

    if (fetchError || !completeResult) {
      return NextResponse.json(
        { error: 'Product not found after update' },
        { status: 404 }
      )
    }

    const product = mapRowToProduct(completeResult)

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

    await supabaseAdmin.from('product_metadata').delete().eq('product_id', id)
    await supabaseAdmin.from('product_source').delete().eq('product_id', id)
    await supabaseAdmin.from('products').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
