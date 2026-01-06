import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/picklist - Get user's picklist items
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's picklist items with product details
    const { data: picklistItems, error } = await supabase
      .from('user_picklist')
      .select(`
        id,
        product_id,
        source,
        created_at,
        products (
          id,
          title,
          image,
          buy_price,
          sell_price,
          profit_per_order,
          category_id,
          categories (
            id,
            name,
            slug
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching picklist:', error)
      return NextResponse.json(
        { error: 'Failed to fetch picklist items' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend interface
    const transformedItems = (picklistItems || []).map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      title: item.products?.title || 'Unknown Product',
      image: item.products?.image || '/demo-products/Screenshot 2024-07-24 185228.png',
      price: item.products?.sell_price || 0,
      buyPrice: item.products?.buy_price || 0,
      profitPerOrder: item.products?.profit_per_order || 0,
      category: item.products?.categories?.name || item.products?.categories?.slug || 'Uncategorized',
      addedDate: item.created_at,
      source: item.source || 'product-hunt',
    }))

    return NextResponse.json({ items: transformedItems })
  } catch (error) {
    console.error('Error in GET /api/picklist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/picklist - Add product to user's picklist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, source = 'product-hunt' } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Validate product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Insert into picklist (UNIQUE constraint will prevent duplicates)
    const { data: picklistItem, error: insertError } = await supabase
      .from('user_picklist')
      .insert({
        user_id: user.id,
        product_id: productId,
        source: source,
      })
      .select()
      .single()

    if (insertError) {
      // Check if it's a duplicate key error
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
        item: picklistItem 
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

