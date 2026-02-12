import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapProduct(item: any) {
  return {
    id: item.id,
    competitor_store_id: item.competitor_store_id,
    product_id: item.product_id,
    discovered_at: item.discovered_at,
    last_seen_at: item.last_seen_at,
    product: item.product_id_ref ? { id: item.product_id_ref, title: item.product_title, image: item.product_image } : null,
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

    const result = await sql.unsafe(
      `SELECT csp.*, p.id as product_id_ref, p.title as product_title, p.image as product_image
       FROM competitor_store_products csp
       LEFT JOIN products p ON csp.product_id = p.id
       WHERE csp.competitor_store_id = $1`,
      [id]
    )

    const products = result.map(mapProduct)

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

    let insertResult
    try {
      insertResult = await sql.unsafe(
        `INSERT INTO competitor_store_products (competitor_store_id, product_id)
         VALUES ($1, $2)
         RETURNING id`,
        [id, product_id]
      )
    } catch (err: any) {
      if (err.code === '23505') {
        return NextResponse.json(
          { error: 'Product is already linked to this store' },
          { status: 409 }
        )
      }
      throw err
    }

    const newId = insertResult[0].id

    const result = await sql.unsafe(
      `SELECT csp.*, p.id as product_id_ref, p.title as product_title, p.image as product_image
       FROM competitor_store_products csp
       LEFT JOIN products p ON csp.product_id = p.id
       WHERE csp.id = $1`,
      [newId]
    )

    const product = mapProduct(result[0])

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

    await sql.unsafe(
      `DELETE FROM competitor_store_products WHERE competitor_store_id = $1 AND product_id = $2`,
      [id, productId]
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store product:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
