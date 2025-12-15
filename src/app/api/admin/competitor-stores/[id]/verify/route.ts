import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CompetitorStore } from '@/types/competitor-stores'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { verified } = body

    if (typeof verified !== 'boolean') {
      return NextResponse.json(
        { error: 'verified must be a boolean' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('competitor_stores')
      .update({ verified })
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
      console.error('Error updating competitor store verification:', error)
      return NextResponse.json(
        { error: 'Failed to update verification status', details: error.message },
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
    console.error('Unexpected error in PATCH competitor store verification:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    )
  }
}

