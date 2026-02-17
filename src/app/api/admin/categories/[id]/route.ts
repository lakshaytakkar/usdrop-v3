import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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
      const { data: existing } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', generatedSlug)
        .neq('id', id)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, any> = {}

    if (name !== undefined) updateData.name = name
    if (generatedSlug !== undefined) updateData.slug = generatedSlug
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (parent_category_id !== undefined) updateData.parent_category_id = parent_category_id || null
    if (trending !== undefined) updateData.trending = trending
    if (growth_percentage !== undefined) updateData.growth_percentage = growth_percentage

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams

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
