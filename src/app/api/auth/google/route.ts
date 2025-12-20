import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectTo = searchParams.get('redirectTo') || '/onboarding'
    const signupIntent = searchParams.get('signup') === 'true'
    const source = searchParams.get('source') || 'google'

    // Validate redirectTo URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    try {
      // Ensure redirectTo is a relative path or same origin
      if (redirectTo.startsWith('http')) {
        const redirectUrl = new URL(redirectTo)
        const siteUrlObj = new URL(siteUrl)
        if (redirectUrl.origin !== siteUrlObj.origin) {
          return NextResponse.json(
            { error: 'Invalid redirect URL' },
            { status: 400 }
          )
        }
      }
    } catch {
      // If redirectTo is not a valid URL, treat it as a relative path (which is fine)
    }

    const supabase = await createClient()

    // Construct callback URL with source and signup intent
    const callbackUrl = `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}&source=${source}${signupIntent ? '&signup=true' : ''}`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: signupIntent ? 'consent' : 'select_account',
        },
      },
    })

    if (error) {
      // Handle specific OAuth errors
      if (error.message.includes('disabled') || error.message.includes('not enabled')) {
        console.error('Google OAuth provider not configured:', error)
        return NextResponse.json(
          { error: 'Google sign-in is currently unavailable. Please contact support.' },
          { status: 503 }
        )
      }

      if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        return NextResponse.json(
          { error: 'Too many sign-in attempts. Please wait a moment and try again.' },
          { status: 429 }
        )
      }

      console.error('Google OAuth initiation error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to initiate Google sign-in. Please try again.' },
        { status: 400 }
      )
    }

    // Redirect to Google OAuth URL
    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    console.error('Google OAuth: No URL returned from Supabase')
    return NextResponse.json(
      { error: 'Failed to get Google OAuth URL. Please try again.' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}
