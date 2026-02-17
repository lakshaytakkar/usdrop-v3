import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { exchangeCodeForToken, fetchShopifyStoreInfo, mapShopifyPlan } from '@/lib/utils/shopify-oauth'
import { normalizeShopifyStoreUrl } from '@/lib/utils/shopify-store-helpers'
import { mapShopifyStoreFromDB } from '@/lib/utils/shopify-store-helpers'

// GET /api/shopify-stores/oauth/callback - Handle Shopify OAuth callback
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const shop = searchParams.get('shop')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Shopify OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/my-store?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code || !shop) {
      return NextResponse.redirect(
        new URL('/my-store?error=missing_parameters', request.url)
      )
    }

    // TODO: Validate state token (should be stored in session/cache)
    // For now, we'll proceed without state validation in development
    // In production, implement proper state validation

    try {
      // Exchange code for access token
      const { access_token } = await exchangeCodeForToken(shop, code, state || '')

      // Fetch store information from Shopify
      const storeInfo = await fetchShopifyStoreInfo(access_token, shop)

      // Normalize store URL
      const normalizedUrl = normalizeShopifyStoreUrl(storeInfo.myshopify_domain)

      // Check if store already exists for this user
      const { data: existingStore } = await supabaseAdmin
        .from('shopify_stores')
        .select('id')
        .eq('user_id', user.id)
        .eq('url', normalizedUrl)
        .single()

      const now = new Date().toISOString()
      const plan = mapShopifyPlan(storeInfo.plan_name)

      if (existingStore) {
        // Update existing store
        const { data: updatedStore, error: updateError } = await supabaseAdmin
          .from('shopify_stores')
          .update({
            name: storeInfo.name,
            access_token: access_token,
            status: 'connected',
            connected_at: now,
            sync_status: 'never',
            currency: storeInfo.currency,
            plan: plan,
            updated_at: now,
          })
          .eq('id', existingStore.id)
          .select(`
            *,
            profiles (
              id,
              email,
              full_name
            )
          `)
          .single()

        if (updateError) {
          console.error('Error updating store:', updateError)
          return NextResponse.redirect(
            new URL('/my-store?error=update_failed', request.url)
          )
        }

        return NextResponse.redirect(
          new URL('/my-store?success=store_updated', request.url)
        )
      } else {
        // Create new store
        const { data: newStore, error: createError } = await supabaseAdmin
          .from('shopify_stores')
          .insert({
            user_id: user.id,
            name: storeInfo.name,
            url: normalizedUrl,
            access_token: access_token,
            shopify_store_id: storeInfo.myshopify_domain,
            status: 'connected',
            connected_at: now,
            sync_status: 'never',
            products_count: 0,
            currency: storeInfo.currency,
            plan: plan,
            created_at: now,
            updated_at: now,
          })
          .select(`
            *,
            profiles (
              id,
              email,
              full_name
            )
          `)
          .single()

        if (createError) {
          console.error('Error creating store:', createError)
          if (createError.code === '23505') {
            return NextResponse.redirect(
              new URL('/my-store?error=store_already_exists', request.url)
            )
          }
          return NextResponse.redirect(
            new URL('/my-store?error=create_failed', request.url)
          )
        }

        return NextResponse.redirect(
          new URL('/my-store?success=store_connected', request.url)
        )
      }
    } catch (oauthError) {
      console.error('OAuth flow error:', oauthError)
      const errorMessage = oauthError instanceof Error ? oauthError.message : 'Unknown error'
      return NextResponse.redirect(
        new URL(`/my-store?error=${encodeURIComponent(errorMessage)}`, request.url)
      )
    }
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/my-store?error=internal_error', request.url)
    )
  }
}
