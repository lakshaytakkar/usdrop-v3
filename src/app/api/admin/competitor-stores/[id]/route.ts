import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStore } from '@/types/competitor-stores'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('competitor_stores')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Competitor store not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to fetch competitor store', details: error.message },
        { status: 500 }
      )
    }

    const store: CompetitorStore = {
      id: data.id,
      name: data.name,
      url: data.url,
      logo: data.logo,
      category_id: data.category_id,
      category: data.category,
      country: data.country,
      monthly_traffic: data.monthly_traffic,
      monthly_revenue: data.monthly_revenue ? parseFloat(data.monthly_revenue) : null,
      growth: parseFloat(data.growth),
      products_count: data.products_count,
      rating: data.rating ? parseFloat(data.rating) : null,
      verified: data.verified,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return NextResponse.json({ store }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in GET competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()

    const {
      name,
      url,
      logo,
      category_id,
      country,
      monthly_traffic,
      monthly_revenue,
      growth,
      products_count,
      rating,
      verified,
    } = body

    // Build update object (only include provided fields)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (url !== undefined) updateData.url = url
    if (logo !== undefined) updateData.logo = logo || null
    if (category_id !== undefined) updateData.category_id = category_id || null
    if (country !== undefined) updateData.country = country || null
    if (monthly_traffic !== undefined) updateData.monthly_traffic = monthly_traffic
    if (monthly_revenue !== undefined) updateData.monthly_revenue = monthly_revenue || null
    if (growth !== undefined) updateData.growth = growth
    if (products_count !== undefined) updateData.products_count = products_count || null
    if (rating !== undefined) updateData.rating = rating || null
    if (verified !== undefined) updateData.verified = verified

    const { data, error } = await supabaseAdmin
      .from('competitor_stores')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Competitor store not found' },
          { status: 404 }
        )
      }
      console.error('Error updating competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to update competitor store', details: error.message },
        { status: 500 }
      )
    }

    const store: CompetitorStore = {
      id: data.id,
      name: data.name,
      url: data.url,
      logo: data.logo,
      category_id: data.category_id,
      category: data.category,
      country: data.country,
      monthly_traffic: data.monthly_traffic,
      monthly_revenue: data.monthly_revenue ? parseFloat(data.monthly_revenue) : null,
      growth: parseFloat(data.growth),
      products_count: data.products_count,
      rating: data.rating ? parseFloat(data.rating) : null,
      verified: data.verified,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }

    return NextResponse.json({ store }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in PATCH competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { error } = await supabaseAdmin
      .from('competitor_stores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting competitor store:', error)
      return NextResponse.json(
        { error: 'Failed to delete competitor store', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

