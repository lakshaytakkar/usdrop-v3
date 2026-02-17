import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapProduct(item: any) {
  const prod = item.products
  return {
    id: item.id,
    competitor_store_id: item.competitor_store_id,
    product_id: item.product_id,
    discovered_at: item.discovered_at,
    last_seen_at: item.last_seen_at,
    product: prod ? { id: prod.id, title: prod.title, image: prod.image } : null,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('competitor_store_products')
      .select('*, products(id, title, image)')
      .eq('competitor_store_id', id)

    if (error) {
      console.error('Error fetching competitor store products:', error)
      return NextResponse.json(
        { error: 'An unexpected error occurred', details: error.message },
        { status: 500 }
      )
    }

    const products = (data || []).map(mapProduct)

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
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id is required' },
        { status: 400 }
      )
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('competitor_store_products')
      .insert({ competitor_store_id: id, product_id })
      .select('*, products(id, title, image)')
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Product is already linked to this store' },
          { status: 409 }
        )
      }
      console.error('Error linking product:', insertError)
      return NextResponse.json(
        { error: 'An unexpected error occurred', details: insertError.message },
        { status: 500 }
      )
    }

    const product = mapProduct(inserted)

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
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('product_id')

    if (!productId) {
      return NextResponse.json(
        { error: 'product_id query parameter is required' },
        { status: 400 }
      )
    }

    await supabaseAdmin
      .from('competitor_store_products')
      .delete()
      .eq('competitor_store_id', id)
      .eq('product_id', productId)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store product:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
