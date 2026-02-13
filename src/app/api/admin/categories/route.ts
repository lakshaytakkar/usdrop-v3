import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const searchParams = request.nextUrl.searchParams
    const parentCategoryId = searchParams.get('parent_category_id')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')

    const whereClauses: string[] = []
    const values: any[] = []
    let paramIndex = 0

    if (parentCategoryId === 'null' || parentCategoryId === '') {
      whereClauses.push(`c.parent_category_id IS NULL`)
    } else if (parentCategoryId) {
      paramIndex++
      whereClauses.push(`c.parent_category_id = $${paramIndex}`)
      values.push(parentCategoryId)
    }

    if (trending === 'true') {
      whereClauses.push(`c.trending = true`)
    }

    if (search) {
      paramIndex++
      const searchParam = `%${search}%`
      whereClauses.push(`(c.name ILIKE $${paramIndex} OR c.slug ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`)
      values.push(searchParam)
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const query = `
      SELECT c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as actual_product_count
      FROM categories c
      ${whereSQL}
      ORDER BY c.growth_percentage DESC NULLS LAST, c.name ASC
    `

    const data = await sql.unsafe(query, values)

    const categories = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      thumbnail: cat.thumbnail,
      parent_category_id: cat.parent_category_id,
      trending: cat.trending || false,
      product_count: parseInt(cat.actual_product_count) || cat.product_count || 0,
      avg_profit_margin: cat.avg_profit_margin ? parseFloat(cat.avg_profit_margin) : null,
      growth_percentage: cat.growth_percentage ? parseFloat(cat.growth_percentage) : null,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }))

    return NextResponse.json({
      categories,
      total: categories.length,
    })
  } catch (error) {
    console.error('Unexpected error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
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

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const existing = await sql`SELECT id FROM categories WHERE slug = ${generatedSlug} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO categories (name, slug, description, image, thumbnail, parent_category_id, trending, growth_percentage)
      VALUES (${name}, ${generatedSlug}, ${description || null}, ${image || null}, ${thumbnail || null}, ${parent_category_id || null}, ${trending || false}, ${growth_percentage || null})
      RETURNING *
    `

    if (!result.length) {
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { category: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error creating category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
