import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const searchParams = request.nextUrl.searchParams
    const stage = searchParams.get('stage')
    const search = searchParams.get('search')
    const priority = searchParams.get('priority')

    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name, avatar_url, account_type, subscription_status, onboarding_completed, onboarding_progress, created_at, updated_at, subscription_plan_id, subscription_plans(name, slug)')
      .is('internal_role', null)
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    const { data: leadsData, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')

    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
      return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
    }

    const leadsMap = new Map((leadsData || []).map((l: any) => [l.user_id, l]))

    const [picklistResult, shopifyResult, roadmapResult] = await Promise.all([
      supabaseAdmin.from('user_picklist').select('user_id'),
      supabaseAdmin.from('shopify_stores').select('user_id'),
      supabaseAdmin.from('roadmap_progress').select('user_id, status'),
    ])

    const picklistByUser = new Map<string, number>()
    ;(picklistResult.data || []).forEach((p: any) => {
      picklistByUser.set(p.user_id, (picklistByUser.get(p.user_id) || 0) + 1)
    })

    const shopifyUsers = new Set((shopifyResult.data || []).map((s: any) => s.user_id))

    const roadmapByUser = new Map<string, { total: number; completed: number }>()
    ;(roadmapResult.data || []).forEach((r: any) => {
      const curr = roadmapByUser.get(r.user_id) || { total: 0, completed: 0 }
      curr.total++
      if (r.status === 'completed') curr.completed++
      roadmapByUser.set(r.user_id, curr)
    })

    let leads = (profiles || []).map((p: any) => {
      const leadRecord = leadsMap.get(p.id)
      const plan = p.subscription_plans
      const planSlug = plan?.slug || 'free'

      let derivedStage = 'new_lead'
      if (p.account_type === 'pro' || planSlug === 'pro') {
        derivedStage = 'converted'
      } else if (p.onboarding_completed || (p.onboarding_progress && p.onboarding_progress > 50)) {
        derivedStage = 'engaged'
      }

      const finalStage = leadRecord?.stage || derivedStage

      const savedProducts = picklistByUser.get(p.id) || 0
      const hasShopify = shopifyUsers.has(p.id)
      const roadmap = roadmapByUser.get(p.id)

      let engagementScore = 0
      if (p.onboarding_completed) engagementScore += 30
      if (savedProducts > 0) engagementScore += 20
      if (hasShopify) engagementScore += 25
      if (roadmap && roadmap.completed > 0) engagementScore += 15
      if (p.onboarding_progress > 0) engagementScore += 10
      engagementScore = Math.min(engagementScore, 100)

      return {
        id: leadRecord?.id || p.id,
        user_id: p.id,
        email: p.email,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        plan: planSlug,
        plan_name: plan?.name || 'Free',
        account_type: p.account_type || 'free',
        stage: finalStage,
        source: leadRecord?.source || 'organic',
        priority: leadRecord?.priority || 'medium',
        assigned_to: leadRecord?.assigned_to || null,
        notes: leadRecord?.notes || null,
        last_contacted_at: leadRecord?.last_contacted_at || null,
        tags: leadRecord?.tags || [],
        signup_date: p.created_at,
        last_active: p.updated_at,
        onboarding_completed: p.onboarding_completed || false,
        onboarding_progress: p.onboarding_progress || 0,
        saved_products: savedProducts,
        has_shopify: hasShopify,
        roadmap_progress: roadmap ? Math.round((roadmap.completed / roadmap.total) * 100) : 0,
        engagement_score: engagementScore,
        subscription_status: p.subscription_status,
      }
    })

    if (stage && stage !== 'all') {
      leads = leads.filter((l: any) => l.stage === stage)
    }
    if (priority && priority !== 'all') {
      leads = leads.filter((l: any) => l.priority === priority)
    }
    if (search) {
      const s = search.toLowerCase()
      leads = leads.filter((l: any) =>
        (l.full_name && l.full_name.toLowerCase().includes(s)) ||
        (l.email && l.email.toLowerCase().includes(s))
      )
    }

    const stats = {
      total: leads.length,
      new_lead: leads.filter((l: any) => l.stage === 'new_lead').length,
      engaged: leads.filter((l: any) => l.stage === 'engaged').length,
      pitched: leads.filter((l: any) => l.stage === 'pitched').length,
      converted: leads.filter((l: any) => l.stage === 'converted').length,
      churned: leads.filter((l: any) => l.stage === 'churned').length,
      avgEngagement: leads.length > 0
        ? Math.round(leads.reduce((sum: number, l: any) => sum + l.engagement_score, 0) / leads.length)
        : 0,
      conversionRate: leads.length > 0
        ? Math.round((leads.filter((l: any) => l.stage === 'converted').length / leads.length) * 100)
        : 0,
    }

    return NextResponse.json({ leads, stats })
  } catch (error) {
    console.error('Error in leads API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const body = await request.json()
    const { user_id, stage, priority, notes, source, last_contacted_at, tags } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const validStages = ['new_lead', 'engaged', 'pitched', 'converted', 'churned']
    const validPriorities = ['low', 'medium', 'high']
    const validSources = ['organic', 'referral', 'campaign', 'manual']

    if (stage && !validStages.includes(stage)) {
      return NextResponse.json({ error: 'Invalid stage value' }, { status: 400 })
    }
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 })
    }
    if (source && !validSources.includes(source)) {
      return NextResponse.json({ error: 'Invalid source value' }, { status: 400 })
    }

    const updateData: any = { updated_at: new Date().toISOString() }
    if (stage) updateData.stage = stage
    if (priority) updateData.priority = priority
    if (notes !== undefined) updateData.notes = notes
    if (source) updateData.source = source
    if (last_contacted_at !== undefined) updateData.last_contacted_at = last_contacted_at
    if (tags !== undefined) updateData.tags = tags

    const upsertData: any = {
      user_id,
      stage: stage || 'new_lead',
      source: source || 'organic',
      priority: priority || 'medium',
      ...updateData,
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .upsert(upsertData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      console.error('Error updating lead:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    return NextResponse.json({ lead: data })
  } catch (error) {
    console.error('Error in leads PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
