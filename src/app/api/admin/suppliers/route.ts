import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')

    const conditions: string[] = []
    const params_arr: any[] = []
    let paramIndex = 1

    if (search) {
      conditions.push(`(name ILIKE $${paramIndex} OR country ILIKE $${paramIndex} OR contact_email ILIKE $${paramIndex})`)
      params_arr.push(`%${search}%`)
      paramIndex++
    }
    if (verified === 'true') {
      conditions.push(`verified = true`)
    } else if (verified === 'false') {
      conditions.push(`verified = false`)
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

    const query = `SELECT * FROM suppliers ${whereClause} ORDER BY created_at DESC`
    const suppliers = await sql.unsafe(query, params_arr)

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()

    const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = body

    if (!name) {
      return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO suppliers (name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email)
      VALUES (${name}, ${website || null}, ${country || null}, ${rating || 0}, ${verified || false}, ${shipping_time || null}, ${min_order_quantity || 1}, ${contact_email || null})
      RETURNING *
    `

    return NextResponse.json({ supplier: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
