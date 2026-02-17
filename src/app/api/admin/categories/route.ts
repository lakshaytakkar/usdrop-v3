import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const searchParams = request.nextUrl.searchParams
    const parentCategoryId = searchParams.get('parent_category_id')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')

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

    query = query.order('growth_percentage', { ascending: false, nullsFirst: false }).order('name', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const { data: productCounts } = await supabaseAdmin
      .from('products')
      .select('category_id')

    const countMap: Record<string, number> = {}
    if (productCounts) {
      for (const p of productCounts) {
        if (p.category_id) {
          countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
        }
      }
    }

    const categories = (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      thumbnail: cat.thumbnail,
      parent_category_id: cat.parent_category_id,
      trending: cat.trending || false,
      product_count: countMap[cat.id] || cat.product_count || 0,
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

    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', generatedSlug)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    const { data: result, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        slug: generatedSlug,
        description: description || null,
        image: image || null,
        thumbnail: thumbnail || null,
        parent_category_id: parent_category_id || null,
        trending: trending || false,
        growth_percentage: growth_percentage || null,
      })
      .select()
      .single()

    if (error || !result) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { category: result },
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
