import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    const result = await sql`SELECT * FROM categories WHERE id = ${id} LIMIT 1`

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const data = result[0]

    let parentCategory = null
    if (data.parent_category_id) {
      const parentResult = await sql`SELECT id, name, slug FROM categories WHERE id = ${data.parent_category_id} LIMIT 1`
      if (parentResult.length > 0) {
        parentCategory = {
          id: parentResult[0].id,
          name: parentResult[0].name,
          slug: parentResult[0].slug,
        }
      }
    }

    const subcategories = await sql`SELECT * FROM categories WHERE parent_category_id = ${id} ORDER BY name ASC`

    const category = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      thumbnail: data.thumbnail,
      parent_category_id: data.parent_category_id,
      parent_category: parentCategory,
      trending: data.trending || false,
      product_count: data.product_count || 0,
      avg_profit_margin: data.avg_profit_margin ? parseFloat(data.avg_profit_margin) : null,
      growth_percentage: data.growth_percentage ? parseFloat(data.growth_percentage) : null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      subcategories: subcategories.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        image: sub.image,
        thumbnail: sub.thumbnail,
        parent_category_id: sub.parent_category_id,
        trending: sub.trending || false,
        product_count: sub.product_count || 0,
        avg_profit_margin: sub.avg_profit_margin ? parseFloat(sub.avg_profit_margin) : null,
        growth_percentage: sub.growth_percentage ? parseFloat(sub.growth_percentage) : null,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
      })),
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Unexpected error fetching category:', error)
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
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    const body = await request.json()

    const {
      name,
      slug,
      description,
      image,
      thumbnail,
      parent_category_id,
      trending,
      growth_percentage,
    } = body

    const generatedSlug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined)

    if (generatedSlug) {
      const existing = await sql`SELECT id FROM categories WHERE slug = ${generatedSlug} AND id != ${id} LIMIT 1`
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const setClauses: string[] = []
    const params_arr: (string | number | boolean | null)[] = []
    let paramIndex = 1

    if (name !== undefined) { setClauses.push(`name = $${paramIndex++}`); params_arr.push(name) }
    if (generatedSlug !== undefined) { setClauses.push(`slug = $${paramIndex++}`); params_arr.push(generatedSlug) }
    if (description !== undefined) { setClauses.push(`description = $${paramIndex++}`); params_arr.push(description) }
    if (image !== undefined) { setClauses.push(`image = $${paramIndex++}`); params_arr.push(image) }
    if (thumbnail !== undefined) { setClauses.push(`thumbnail = $${paramIndex++}`); params_arr.push(thumbnail) }
    if (parent_category_id !== undefined) { setClauses.push(`parent_category_id = $${paramIndex++}`); params_arr.push(parent_category_id || null) }
    if (trending !== undefined) { setClauses.push(`trending = $${paramIndex++}`); params_arr.push(trending) }
    if (growth_percentage !== undefined) { setClauses.push(`growth_percentage = $${paramIndex++}`); params_arr.push(growth_percentage) }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE categories SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(id)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: result[0] })
  } catch (error) {
    console.error('Unexpected error updating category:', error)
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
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

    const subcategories = await sql`SELECT id FROM categories WHERE parent_category_id = ${id} LIMIT 1`
    if (subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.' },
        { status: 400 }
      )
    }

    const products = await sql`SELECT id FROM products WHERE category_id = ${id} LIMIT 1`
    if (products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Please reassign or delete products first.' },
        { status: 400 }
      )
    }

    await sql`DELETE FROM categories WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
