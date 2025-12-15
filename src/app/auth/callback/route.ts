import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { handleProfileCreation, ensureProfileForEmailSignup } from '@/lib/utils/profile-helpers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type') // 'recovery', 'signup', 'email_change', 'reauthentication'
  const next = searchParams.get('next') ?? '/'
  const source = searchParams.get('source') || 'email' // 'google', 'email', etc.
  const signupIntent = searchParams.get('signup') === 'true'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    const errorMessage = errorDescription || error
    const errorUrl = `${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorMessage)}`
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      // Handle specific error cases
      let errorType = 'generic'
      let errorMessage = 'The authentication link is invalid or has expired.'

      if (exchangeError.message.includes('expired') || exchangeError.message.includes('Expired')) {
        errorType = 'expired'
        errorMessage = 'This authentication link has expired. Please request a new one.'
      } else if (exchangeError.message.includes('invalid') || exchangeError.message.includes('Invalid')) {
        errorType = 'invalid'
        errorMessage = 'This authentication link is invalid. Please request a new one.'
      } else if (exchangeError.message.includes('already used') || exchangeError.message.includes('used')) {
        errorType = 'used'
        errorMessage = 'This authentication link has already been used. Please request a new one.'
      }

      const errorUrl = `${origin}/auth/auth-code-error?type=${errorType}&error=${encodeURIComponent(errorMessage)}`
      return NextResponse.redirect(errorUrl)
    }
    
    if (data.session?.user) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Handle password reset - redirect to reset password page
      if (type === 'recovery') {
        const redirectUrl = isLocalEnv 
          ? `${origin}/auth/reset-password`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/reset-password`
            : `${origin}/auth/reset-password`
        return NextResponse.redirect(redirectUrl)
      }

      // Handle email change verification
      if (type === 'email_change') {
        // Email change has been verified, redirect to settings or home
        const redirectUrl = isLocalEnv 
          ? `${origin}/settings?email_verified=true`
          : forwardedHost 
            ? `https://${forwardedHost}/settings?email_verified=true`
            : `${origin}/settings?email_verified=true`
        return NextResponse.redirect(redirectUrl)
      }

      // Handle reauthentication
      if (type === 'reauthentication') {
        // Reauthentication successful, redirect back to the page that requested it
        const redirectUrl = isLocalEnv 
          ? `${origin}${next || '/home'}?reauth_success=true`
          : forwardedHost 
            ? `https://${forwardedHost}${next || '/home'}?reauth_success=true`
            : `${origin}${next || '/home'}?reauth_success=true`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Check user status and profile first
      let { data: profile } = await supabase
        .from('profiles')
        .select('internal_role, status, onboarding_completed')
        .eq('id', data.session.user.id)
        .single()
      
      // For OAuth flows (Google), create or update profile
      if (source === 'google') {
        const profileResult = await handleProfileCreation(data.session.user, supabase)
        if (!profileResult.success) {
          console.error('Error creating/updating profile:', profileResult.error)
          // Continue anyway - profile creation failure shouldn't block login
        } else {
          // Re-fetch profile after creation/update
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('internal_role, status, onboarding_completed')
            .eq('id', data.session.user.id)
            .single()
          profile = updatedProfile
        }
      }
      
      // For magic link signup or any new user without a profile, ensure profile exists
      if (!profile && (type === 'signup' || !source || source === 'email')) {
        const profileResult = await ensureProfileForEmailSignup(data.session.user, supabase)
        if (!profileResult.success) {
          console.error('Error creating profile for email signup:', profileResult.error)
          // Continue anyway - profile creation failure shouldn't block login
        } else {
          // Re-fetch profile after creation
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('internal_role, status, onboarding_completed')
            .eq('id', data.session.user.id)
            .single()
          profile = newProfile
        }
      }
      
      // Check if user is suspended
      if (profile?.status === 'suspended') {
        const suspendedUrl = isLocalEnv 
          ? `${origin}/auth/account-suspended`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/account-suspended`
            : `${origin}/auth/account-suspended`
        return NextResponse.redirect(suspendedUrl)
      }
      
      // Check if user is internal (has internal_role in profiles table)
      let finalRedirect = next
      const isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined
      
      // Check if onboarding is needed (for new users or users who haven't completed onboarding)
      const needsOnboarding = !profile?.onboarding_completed && !isInternal
      
      // Override redirect for internal users
      if (isInternal) {
        finalRedirect = '/admin/internal-users'
      } else if (needsOnboarding) {
        // New users or users who haven't completed onboarding go to /home with onboarding flag
        finalRedirect = '/home?onboarding=true'
      } else if (next === '/' || !next || next === '/home') {
        // Default external users to /home
        finalRedirect = '/home'
      }
      
      // Handle other callbacks (email verification, OAuth, magic link, etc.)
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${finalRedirect}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${finalRedirect}`)
      } else {
        return NextResponse.redirect(`${origin}${finalRedirect}`)
      }
    }
  }

  // No code provided or other error - redirect to error page
  const errorUrl = `${origin}/auth/auth-code-error?error=${encodeURIComponent('No authentication code provided')}`
  return NextResponse.redirect(errorUrl)
}
