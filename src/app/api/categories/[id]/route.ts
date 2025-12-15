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
      .select(`
        *,
        parent_category:categories!categories_parent_category_id_fkey(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching category:', error)
      return NextResponse.json(
        { error: 'Failed to fetch category', details: error.message },
        { status: 500 }
      )
    }

    // Fetch subcategories
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
      parent_category_id: data.parent_category_id,
      parent_category: data.parent_category ? {
        id: data.parent_category.id,
        name: data.parent_category.name,
        slug: data.parent_category.slug,
      } : null,
      trending: data.trending || false,
      product_count: data.product_count || 0,
      avg_profit_margin: data.avg_profit_margin ? parseFloat(data.avg_profit_margin) : null,
      growth_percentage: data.growth_percentage ? parseFloat(data.growth_percentage) : null,
      created_at: data.created_at,
      updated_at: data.updated_at,
      subcategories: subcategories?.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        image: sub.image,
        parent_category_id: sub.parent_category_id,
        trending: sub.trending || false,
        product_count: sub.product_count || 0,
        avg_profit_margin: sub.avg_profit_margin ? parseFloat(sub.avg_profit_margin) : null,
        growth_percentage: sub.growth_percentage ? parseFloat(sub.growth_percentage) : null,
        created_at: sub.created_at,
        updated_at: sub.updated_at,
      })) || [],
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
      parent_category_id,
      trending,
      growth_percentage,
    } = body

    // Check if slug is being changed and if new slug exists
    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Build update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (parent_category_id !== undefined) {
      updateData.parent_category_id = parent_category_id || null
    }
    if (trending !== undefined) updateData.trending = trending
    if (growth_percentage !== undefined) updateData.growth_percentage = growth_percentage

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating category:', error)
      return NextResponse.json(
        { error: 'Failed to update category', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ category })
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

    // Check if category has subcategories
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

    // Check if category has products
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

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting category:', error)
      return NextResponse.json(
        { error: 'Failed to delete category', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

