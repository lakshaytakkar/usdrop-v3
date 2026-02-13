import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CategoriesResponse } from '@/types/categories'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const parentCategoryId = searchParams.get('parent_category_id')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')
    const includeSubcategories = searchParams.get('include_subcategories') === 'true'

    const whereClauses: string[] = []
    const values: any[] = []
    let paramIndex = 0

    if (parentCategoryId === 'null' || parentCategoryId === '') {
      whereClauses.push('parent_category_id IS NULL')
    } else if (parentCategoryId) {
      paramIndex++
      whereClauses.push(`parent_category_id = $${paramIndex}`)
      values.push(parentCategoryId)
    }

    if (trending === 'true') {
      whereClauses.push('trending = true')
    }

    if (search) {
      paramIndex++
      const searchParam = `%${search}%`
      whereClauses.push(`(name ILIKE $${paramIndex} OR slug ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`)
      values.push(searchParam)
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

    const query = `
      SELECT * FROM categories
      ${whereSQL}
      ORDER BY growth_percentage DESC NULLS LAST, name ASC
    `

    const data = await sql.unsafe(query, values)

    let categories = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      thumbnail: cat.thumbnail,
      parent_category_id: cat.parent_category_id,
      trending: cat.trending || false,
      product_count: cat.product_count || 0,
      avg_profit_margin: cat.avg_profit_margin ? parseFloat(cat.avg_profit_margin) : null,
      growth_percentage: cat.growth_percentage ? parseFloat(cat.growth_percentage) : null,
      created_at: cat.created_at,
      updated_at: cat.updated_at,
    }))

    if (includeSubcategories) {
      const parentIds = categories.map((c: any) => c.id)
      if (parentIds.length > 0) {
        const placeholders = parentIds.map((_: any, i: number) => `$${i + 1}`).join(', ')
        const subcategories = await sql.unsafe(
          `SELECT * FROM categories WHERE parent_category_id IN (${placeholders}) ORDER BY name ASC`,
          parentIds
        )

        if (subcategories) {
          categories = categories.map((cat: any) => ({
            ...cat,
            subcategories: subcategories
              .filter((sub: any) => sub.parent_category_id === cat.id)
              .map((sub: any) => ({
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
          }))
        }
      }
    }

    const parentIds = [...new Set(categories
      .filter((c: any) => c.parent_category_id)
      .map((c: any) => c.parent_category_id!))]

    if (parentIds.length > 0) {
      const placeholders = parentIds.map((_: any, i: number) => `$${i + 1}`).join(', ')
      const parents = await sql.unsafe(
        `SELECT id, name, slug FROM categories WHERE id IN (${placeholders})`,
        parentIds
      )

      if (parents) {
        categories = categories.map((cat: any) => ({
          ...cat,
          parent_category: cat.parent_category_id
            ? parents.find((p: any) => p.id === cat.parent_category_id)
            : undefined,
        }))
      }
    }

    const response: CategoriesResponse = {
      categories,
      total: categories.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
