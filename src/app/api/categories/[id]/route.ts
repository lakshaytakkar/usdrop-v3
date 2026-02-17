import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    let parentCategory = null
    if (data.parent_category_id) {
      const { data: parentResult } = await supabaseAdmin
        .from('categories')
        .select('id, name, slug')
        .eq('id', data.parent_category_id)
        .single()

      if (parentResult) {
        parentCategory = {
          id: parentResult.id,
          name: parentResult.name,
          slug: parentResult.slug,
        }
      }
    }

    const { data: subcategories } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('parent_category_id', id)
      .order('name', { ascending: true })

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
      subcategories: (subcategories || []).map((sub: any) => ({
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateFields: Record<string, any> = {}

    if (name !== undefined) updateFields.name = name
    if (slug !== undefined) updateFields.slug = slug
    if (description !== undefined) updateFields.description = description
    if (image !== undefined) updateFields.image = image
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail
    if (parent_category_id !== undefined) updateFields.parent_category_id = parent_category_id || null
    if (trending !== undefined) updateFields.trending = trending
    if (growth_percentage !== undefined) updateFields.growth_percentage = growth_percentage

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateFields.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('categories')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: result })
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: subcategories } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('parent_category_id', id)
      .limit(1)

    if (subcategories && subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.' },
        { status: 400 }
      )
    }

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Please reassign or delete products first.' },
        { status: 400 }
      )
    }

    await supabaseAdmin.from('categories').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
