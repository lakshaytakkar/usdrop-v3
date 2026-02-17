import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

function mapStore(item: any) {
  const cat = item.categories
  return {
    id: item.id,
    name: item.name,
    url: item.url,
    logo: item.logo,
    category_id: item.category_id,
    category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
    country: item.country,
    monthly_traffic: item.monthly_traffic,
    monthly_revenue: item.monthly_revenue ? parseFloat(item.monthly_revenue) : null,
    growth: parseFloat(item.growth),
    products_count: item.products_count,
    rating: item.rating ? parseFloat(item.rating) : null,
    verified: item.verified,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

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
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Competitor store not found' },
        { status: 404 }
      )
    }

    const store = mapStore(data)

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

    const updateData: Record<string, any> = {}

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

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      )
    }

    updateData.updated_at = new Date().toISOString()

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('competitor_stores')
      .update(updateData)
      .eq('id', id)
      .select('*, categories(id, name, slug)')
      .single()

    if (updateError || !updated) {
      return NextResponse.json(
        { error: 'Competitor store not found' },
        { status: 404 }
      )
    }

    const store = mapStore(updated)

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

    await supabaseAdmin.from('competitor_stores').delete().eq('id', id)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Unexpected error in DELETE competitor store:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}
