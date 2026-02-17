import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CategoriesResponse } from '@/types/categories'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const parentCategoryId = searchParams.get('parent_category_id')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')
    const includeSubcategories = searchParams.get('include_subcategories') === 'true'

    let query = supabaseAdmin.from('categories').select('*')

    if (parentCategoryId === 'null' || parentCategoryId === '') {
      query = query.is('parent_category_id', null)
    } else if (parentCategoryId) {
      query = query.eq('parent_category_id', parentCategoryId)
    }

    if (trending === 'true') {
      query = query.eq('trending', true)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query.order('growth_percentage', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

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
        const { data: subcategories } = await supabaseAdmin
          .from('categories')
          .select('*')
          .in('parent_category_id', parentIds)
          .order('name', { ascending: true })

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
      const { data: parents } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug')
        .in('id', parentIds)

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
