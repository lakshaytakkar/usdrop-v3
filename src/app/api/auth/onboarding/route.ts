import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validatePhoneNumber } from '@/lib/utils/onboarding'

export async function POST(request: Request) {
  try {
    const { phone_number, ecommerce_experience, preferred_niche } = await request.json()

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!phone_number) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!ecommerce_experience) {
      return NextResponse.json(
        { error: 'Ecommerce experience is required' },
        { status: 400 }
      )
    }

    if (!preferred_niche) {
      return NextResponse.json(
        { error: 'Preferred niche is required' },
        { status: 400 }
      )
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phone_number)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    // Validate ecommerce experience
    const validExperiences = ['none', 'beginner', 'intermediate', 'advanced', 'expert']
    if (!validExperiences.includes(ecommerce_experience)) {
      return NextResponse.json(
        { error: 'Invalid ecommerce experience value' },
        { status: 400 }
      )
    }

    // Validate preferred niche
    const validNiches = ['fashion', 'electronics', 'home-garden', 'health-beauty', 'sports', 'toys-games', 'automotive', 'pet-supplies', 'food-beverage', 'other']
    if (!validNiches.includes(preferred_niche)) {
      return NextResponse.json(
        { error: 'Invalid preferred niche value' },
        { status: 400 }
      )
    }

    // Check if profile exists first
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error('Error fetching profile:', fetchError)
      return NextResponse.json(
        { error: 'Profile not found. Please contact support.' },
        { status: 404 }
      )
    }

    // If profile doesn't exist, create it first
    if (!existingProfile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          status: 'active',
          account_type: 'free',
          phone_number,
          ecommerce_experience,
          preferred_niche,
          // Note: onboarding_completed is NOT set here - it's controlled by video onboarding completion
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (createError) {
        console.error('Error creating profile:', createError)
        return NextResponse.json(
          { error: `Failed to create profile: ${createError.message}` },
          { status: 500 }
        )
      }
    } else {
      // Update existing profile with onboarding data
      // Note: onboarding_completed is NOT set here - it's controlled by video onboarding completion
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_number,
          ecommerce_experience,
          preferred_niche,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile with onboarding data:', updateError)
        console.error('Update error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
        })
        return NextResponse.json(
          { error: `Failed to save onboarding data: ${updateError.message || 'Database error'}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      message: 'Profile setup completed successfully',
      profile_setup_completed: true,
    })
  } catch (error) {
    console.error('Onboarding error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}

