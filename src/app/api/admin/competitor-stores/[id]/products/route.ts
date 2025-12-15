import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStoreProduct } from '@/types/competitor-stores'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('competitor_store_products')
      .select(`
        *,
        product:products(id, title, image)
      `)
      .eq('competitor_store_id', id)

    if (error) {
      console.error('Error fetching competitor store products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    const products: CompetitorStoreProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      competitor_store_id: item.competitor_store_id,
      product_id: item.product_id,
      discovered_at: item.discovered_at,
      last_seen_at: item.last_seen_at,
      product: item.product,
    }))

    return NextResponse.json({ products }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET competitor store products:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('competitor_store_products')
      .insert({
        competitor_store_id: id,
        product_id,
      })
      .select(`
        *,
        product:products(id, title, image)
      `)
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Product is already linked to this store' },
          { status: 409 }
        )
      }
      console.error('Error linking product to competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to link product', details: error.message },
        { status: 500 }
      )
    }

    const product: CompetitorStoreProduct = {
      id: data.id,
      competitor_store_id: data.competitor_store_id,
      product_id: data.product_id,
      discovered_at: data.discovered_at,
      last_seen_at: data.last_seen_at,
      product: data.product,
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    console.error('Unexpected error in POST competitor store product:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('product_id')

    if (!productId) {
      return NextResponse.json(
        { error: 'product_id query parameter is required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('competitor_store_products')
      .delete()
      .eq('competitor_store_id', id)
      .eq('product_id', productId)

    if (error) {
      console.error('Error unlinking product from competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to unlink product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store product:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

