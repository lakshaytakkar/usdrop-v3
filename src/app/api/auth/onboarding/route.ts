import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { validatePhoneNumber } from '@/lib/utils/onboarding'
import sql from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { phone_number, ecommerce_experience, preferred_niche } = await request.json()

    const user = await getCurrentUser()

    if (!user) {
      console.error('User authentication error: not authenticated')
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in first.' },
        { status: 401 }
      )
    }

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

    const phoneValidation = validatePhoneNumber(phone_number)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    const validExperiences = ['none', 'beginner', 'intermediate', 'advanced', 'expert']
    if (!validExperiences.includes(ecommerce_experience)) {
      return NextResponse.json(
        { error: 'Invalid ecommerce experience value' },
        { status: 400 }
      )
    }

    const validNiches = ['fashion', 'electronics', 'home-garden', 'health-beauty', 'sports', 'toys-games', 'automotive', 'pet-supplies', 'food-beverage', 'other']
    if (!validNiches.includes(preferred_niche)) {
      return NextResponse.json(
        { error: 'Invalid preferred niche value' },
        { status: 400 }
      )
    }

    const existingProfile = await sql`SELECT id FROM profiles WHERE id = ${user.id} LIMIT 1`

    if (existingProfile.length === 0) {
      await sql`
        INSERT INTO profiles (id, email, status, account_type, phone_number, ecommerce_experience, preferred_niche, created_at, updated_at)
        VALUES (${user.id}, ${user.email}, 'active', 'free', ${phone_number}, ${ecommerce_experience}, ${preferred_niche}, NOW(), NOW())
      `
    } else {
      await sql`
        UPDATE profiles
        SET phone_number = ${phone_number},
            ecommerce_experience = ${ecommerce_experience},
            preferred_niche = ${preferred_niche},
            updated_at = NOW()
        WHERE id = ${user.id}
      `
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
