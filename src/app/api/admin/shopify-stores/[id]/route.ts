import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { mapShopifyStoreFromDB, mapShopifyStoreToDB, normalizeShopifyStoreUrl, validateShopifyStoreUrl } from '@/lib/utils/shopify-store-helpers'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: storeId } = await params

    const data = await sql`
      SELECT s.*, 
        p.id as profile_id, p.email as profile_email, p.full_name as profile_full_name
      FROM shopify_stores s
      LEFT JOIN profiles p ON s.user_id = p.id
      WHERE s.id = ${storeId}
      LIMIT 1
    `

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const row = data[0]
    const store = mapShopifyStoreFromDB({
      ...row,
      profiles: row.profile_id ? {
        id: row.profile_id,
        email: row.profile_email,
        full_name: row.profile_full_name,
      } : null,
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error in GET /api/admin/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: storeId } = await params
    const body = await request.json()

    if (body.url) {
      if (!validateShopifyStoreUrl(body.url)) {
        return NextResponse.json(
          { error: 'Invalid Shopify store URL format' },
          { status: 400 }
        )
      }
      body.url = normalizeShopifyStoreUrl(body.url)
    }

    if (body.status && !['connected', 'disconnected', 'syncing', 'error'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    if (body.sync_status && !['success', 'failed', 'pending', 'never'].includes(body.sync_status)) {
      return NextResponse.json(
        { error: 'Invalid sync_status value' },
        { status: 400 }
      )
    }

    if (body.plan && !['basic', 'shopify', 'advanced', 'plus'].includes(body.plan)) {
      return NextResponse.json(
        { error: 'Invalid plan value' },
        { status: 400 }
      )
    }

    const updateData = mapShopifyStoreToDB(body)
    updateData.updated_at = new Date().toISOString()

    const setClauses: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(updateData)) {
      setClauses.push(`${key} = $${paramIndex++}`)
      values.push(value)
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(storeId)

    try {
      const result = await sql.unsafe(
        `UPDATE shopify_stores SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      )

      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 })
      }

      const row = result[0]
      const profileData = await sql`SELECT id, email, full_name FROM profiles WHERE id = ${row.user_id} LIMIT 1`

      const store = mapShopifyStoreFromDB({
        ...row,
        profiles: profileData.length > 0 ? profileData[0] : null,
      })

      return NextResponse.json(store)
    } catch (err: any) {
      if (err?.code === '23505') {
        return NextResponse.json(
          { error: 'A store with this URL already exists' },
          { status: 409 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('Error in PATCH /api/admin/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: storeId } = await params

    const existing = await sql`SELECT id FROM shopify_stores WHERE id = ${storeId} LIMIT 1`
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    await sql`DELETE FROM shopify_stores WHERE id = ${storeId}`

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/admin/shopify-stores/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
