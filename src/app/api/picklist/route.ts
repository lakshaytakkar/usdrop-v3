import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
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

    const picklistItems = await sql`
      SELECT
        up.id,
        up.product_id,
        up.notes,
        up.created_at,
        p.id as prod_id,
        p.title as prod_title,
        p.image as prod_image,
        p.buy_price as prod_buy_price,
        p.sell_price as prod_sell_price,
        p.profit_per_order as prod_profit_per_order,
        p.category_id as prod_category_id,
        c.id as cat_id,
        c.name as cat_name,
        c.slug as cat_slug
      FROM user_picklist up
      LEFT JOIN products p ON up.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE up.user_id = ${user.id}
      ORDER BY up.created_at DESC
    `

    const transformedItems = picklistItems.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      title: item.prod_title || 'Unknown Product',
      image: item.prod_image || '/demo-products/Screenshot 2024-07-24 185228.png',
      price: item.prod_sell_price || 0,
      buyPrice: item.prod_buy_price || 0,
      profitPerOrder: item.prod_profit_per_order || 0,
      category: item.cat_name || item.cat_slug || 'Uncategorized',
      addedDate: item.created_at,
      source: 'product-hunt',
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

    const product = await sql`
      SELECT id FROM products WHERE id = ${productId} LIMIT 1
    `

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    try {
      const result = await sql`
        INSERT INTO user_picklist (user_id, product_id)
        VALUES (${user.id}, ${productId})
        RETURNING *
      `

      return NextResponse.json(
        {
          message: 'Product added to picklist',
          item: result[0]
        },
        { status: 201 }
      )
    } catch (insertErr: any) {
      if (insertErr.code === '23505') {
        return NextResponse.json(
          { error: 'Product already in picklist', alreadyExists: true },
          { status: 409 }
        )
      }

      console.error('Error adding to picklist:', insertErr)
      return NextResponse.json(
        { error: 'Failed to add product to picklist' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in POST /api/picklist:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
