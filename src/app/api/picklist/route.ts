import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: picklistItems, error } = await supabaseAdmin
      .from('user_picklist')
      .select('id, product_id, notes, created_at, products(id, title, image, buy_price, sell_price, profit_per_order, category_id, categories(id, name, slug))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching picklist:', error)
      return NextResponse.json({ error: 'Failed to fetch picklist' }, { status: 500 })
    }

    const transformedItems = (picklistItems || []).map((item: any) => {
      const p = item.products
      const cat = p?.categories
      return {
        id: item.id,
        productId: item.product_id,
        title: p?.title || 'Unknown Product',
        image: p?.image || '/demo-products/Screenshot 2024-07-24 185228.png',
        price: p?.sell_price || 0,
        buyPrice: p?.buy_price || 0,
        profitPerOrder: p?.profit_per_order || 0,
        category: cat?.name || cat?.slug || 'Uncategorized',
        addedDate: item.created_at,
        source: 'product-hunt',
      }
    })

    return NextResponse.json({ items: transformedItems })
  } catch (error) {
    console.error('Error in GET /api/picklist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const { data: result, error: insertError } = await supabaseAdmin
      .from('user_picklist')
      .insert({ user_id: user.id, product_id: productId })
      .select()
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Product already in picklist', alreadyExists: true },
          { status: 409 }
        )
      }

      console.error('Error adding to picklist:', insertError)
      return NextResponse.json(
        { error: 'Failed to add product to picklist' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Product added to picklist',
        item: result
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/picklist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
