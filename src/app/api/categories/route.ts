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

    // Build query
    let query = supabaseAdmin
      .from('categories')
      .select('*')

    // Apply filters
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

    // Order by growth_percentage desc, then by name
    query = query.order('growth_percentage', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      )
    }

    // Transform and add parent category info
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

    // If include_subcategories, fetch and attach subcategories
    if (includeSubcategories) {
      const parentIds = categories.map(c => c.id)
      if (parentIds.length > 0) {
        const { data: subcategories } = await supabaseAdmin
          .from('categories')
          .select('*')
          .in('parent_category_id', parentIds)
          .order('name', { ascending: true })

        if (subcategories) {
          categories = categories.map(cat => ({
            ...cat,
            subcategories: subcategories
              .filter(sub => sub.parent_category_id === cat.id)
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

    // Add parent category info if parent_category_id exists
    const parentIds = [...new Set(categories
      .filter(c => c.parent_category_id)
      .map(c => c.parent_category_id!))]
    
    if (parentIds.length > 0) {
      const { data: parents } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug')
        .in('id', parentIds)

      if (parents) {
        categories = categories.map(cat => ({
          ...cat,
          parent_category: cat.parent_category_id
            ? parents.find(p => p.id === cat.parent_category_id)
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

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    // Insert category
    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        image: image || null,
        thumbnail: thumbnail || null,
        parent_category_id: parent_category_id || null,
        trending: trending || false,
        growth_percentage: growth_percentage || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Failed to create category', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { category },
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

