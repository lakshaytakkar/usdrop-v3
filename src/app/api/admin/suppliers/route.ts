import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const verified = searchParams.get('verified')

    let query = supabaseAdmin.from('suppliers').select('*')

    if (search) {
      query = query.or(`name.ilike.%${search}%,country.ilike.%${search}%,contact_email.ilike.%${search}%`)
    }
    if (verified === 'true') {
      query = query.eq('verified', true)
    } else if (verified === 'false') {
      query = query.eq('verified', false)
    }

    query = query.order('created_at', { ascending: false })

    const { data: suppliers, error } = await query

    if (error) {
      console.error('Error fetching suppliers:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ suppliers: suppliers || [] })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()

    const { name, website, country, rating, verified, shipping_time, min_order_quantity, contact_email } = body

    if (!name) {
      return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 })
    }

    const { data: supplier, error } = await supabaseAdmin
      .from('suppliers')
      .insert({
        name,
        website: website || null,
        country: country || null,
        rating: rating || 0,
        verified: verified || false,
        shipping_time: shipping_time || null,
        min_order_quantity: min_order_quantity || 1,
        contact_email: contact_email || null,
      })
      .select()
      .single()

    if (error || !supplier) {
      console.error('Error creating supplier:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json({ supplier }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
