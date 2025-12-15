import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUUID(id: string | undefined): boolean {
  return !!id && UUID_REGEX.test(id)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID exists and is a valid UUID
    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        supplier:suppliers(*),
        metadata:product_metadata(*),
        source:product_source(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match Product type
    const product = {
      id: data.id,
      title: data.title,
      image: data.image,
      description: data.description,
      category_id: data.category_id,
      category: data.category ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
        description: data.category.description,
        image: data.category.image,
        parent_category_id: data.category.parent_category_id,
        trending: data.category.trending,
        product_count: data.category.product_count,
        avg_profit_margin: data.category.avg_profit_margin,
        growth_percentage: data.category.growth_percentage,
        created_at: data.category.created_at,
        updated_at: data.category.updated_at,
      } : null,
      buy_price: parseFloat(data.buy_price),
      sell_price: parseFloat(data.sell_price),
      profit_per_order: parseFloat(data.profit_per_order),
      additional_images: data.additional_images || [],
      specifications: data.specifications,
      rating: data.rating ? parseFloat(data.rating) : null,
      reviews_count: data.reviews_count || 0,
      trend_data: data.trend_data || [],
      supplier_id: data.supplier_id,
      supplier: data.supplier ? {
        id: data.supplier.id,
        name: data.supplier.name,
        company_name: data.supplier.company_name,
        logo: data.supplier.logo,
        created_at: data.supplier.created_at,
        updated_at: data.supplier.updated_at,
      } : null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      metadata: data.metadata ? {
        id: data.metadata.id,
        product_id: data.metadata.product_id,
        is_winning: data.metadata.is_winning || false,
        is_locked: data.metadata.is_locked || false,
        unlock_price: data.metadata.unlock_price ? parseFloat(data.metadata.unlock_price) : null,
        profit_margin: data.metadata.profit_margin ? parseFloat(data.metadata.profit_margin) : null,
        pot_revenue: data.metadata.pot_revenue ? parseFloat(data.metadata.pot_revenue) : null,
        revenue_growth_rate: data.metadata.revenue_growth_rate ? parseFloat(data.metadata.revenue_growth_rate) : null,
        items_sold: data.metadata.items_sold,
        avg_unit_price: data.metadata.avg_unit_price ? parseFloat(data.metadata.avg_unit_price) : null,
        revenue_trend: data.metadata.revenue_trend || [],
        found_date: data.metadata.found_date,
        detailed_analysis: data.metadata.detailed_analysis,
        filters: data.metadata.filters || [],
        created_at: data.metadata.created_at,
        updated_at: data.metadata.updated_at,
      } : undefined,
      source: data.source ? {
        id: data.source.id,
        product_id: data.source.product_id,
        source_type: data.source.source_type,
        source_id: data.source.source_id,
        standardized_at: data.source.standardized_at,
        standardized_by: data.source.standardized_by,
        created_at: data.source.created_at,
        updated_at: data.source.updated_at,
      } : undefined,
    }

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
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID exists and is a valid UUID
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

    // Update product
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (image !== undefined) updateData.image = image
    if (description !== undefined) updateData.description = description
    if (category_id !== undefined) updateData.category_id = category_id
    if (buy_price !== undefined) updateData.buy_price = buy_price
    if (sell_price !== undefined) updateData.sell_price = sell_price
    if (additional_images !== undefined) updateData.additional_images = additional_images
    if (specifications !== undefined) updateData.specifications = specifications
    if (rating !== undefined) updateData.rating = rating
    if (reviews_count !== undefined) updateData.reviews_count = reviews_count
    if (trend_data !== undefined) updateData.trend_data = trend_data
    if (supplier_id !== undefined) updateData.supplier_id = supplier_id

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (productError) {
      console.error('Error updating product:', productError)
      return NextResponse.json(
        { error: 'Failed to update product', details: productError.message },
        { status: 500 }
      )
    }

    // Update metadata if provided
    if (metadata) {
      const { error: metadataError } = await supabaseAdmin
        .from('product_metadata')
        .upsert({
          product_id: id,
          ...metadata,
        }, {
          onConflict: 'product_id'
        })

      if (metadataError) {
        console.error('Error updating product metadata:', metadataError)
      }
    }

    // Update source if provided
    if (source) {
      const { error: sourceError } = await supabaseAdmin
        .from('product_source')
        .upsert({
          product_id: id,
          ...source,
        }, {
          onConflict: 'product_id'
        })

      if (sourceError) {
        console.error('Error updating product source:', sourceError)
      }
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
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching updated product:', fetchError)
    }

    return NextResponse.json({ product: completeProduct || product })
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
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    // Validate ID exists and is a valid UUID
    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID', details: 'Product ID is required and must be a valid UUID' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json(
        { error: 'Failed to delete product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

