import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface GoogleUserData {
  email: string
  full_name?: string | null
  avatar_url?: string | null
}

/**
 * Extracts user data from Google OAuth user metadata
 */
export function extractGoogleUserData(user: User): GoogleUserData {
  const metadata = user.user_metadata || {}
  const appMetadata = user.app_metadata || {}

  return {
    email: user.email || '',
    full_name: metadata.full_name || 
               metadata.name || 
               metadata.display_name ||
               `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() ||
               null,
    avatar_url: metadata.avatar_url || 
                metadata.picture || 
                appMetadata.avatar_url ||
                null,
  }
}

/**
 * Creates or updates a user profile in the profiles table
 * - If profile doesn't exist: Creates new profile with Google data
 * - If profile exists: Updates name/avatar if changed, preserves internal_role
 */
export async function createOrUpdateProfile(
  user: User,
  googleData: GoogleUserData,
  supabase: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, internal_role, status')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error fetching profile:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (existingProfile) {
      // Profile exists - update if needed
      const updates: {
        email?: string
        full_name?: string | null
        avatar_url?: string | null
        updated_at?: string
      } = {
        updated_at: new Date().toISOString(),
      }

      // Update email if it changed
      if (googleData.email && googleData.email !== user.email) {
        updates.email = googleData.email
      }

      // Update name if it changed and we have a new name
      if (googleData.full_name && googleData.full_name !== existingProfile.full_name) {
        updates.full_name = googleData.full_name
      }

      // Update avatar if it changed and we have a new avatar
      if (googleData.avatar_url && googleData.avatar_url !== existingProfile.avatar_url) {
        updates.avatar_url = googleData.avatar_url
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 1) { // More than just updated_at
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile:', updateError)
          return { success: false, error: updateError.message }
        }
      }

      return { success: true }
    } else {
      // Profile doesn't exist - create new one
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: googleData.email || user.email || '',
          full_name: googleData.full_name,
          avatar_url: googleData.avatar_url,
          status: 'active',
          internal_role: null, // Default to external user
          account_type: 'free',
          onboarding_completed: false, // New users need to complete onboarding
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        // If insert fails due to unique constraint (email), try to update instead
        if (insertError.code === '23505') { // Unique violation
          console.warn('Profile insert failed due to unique constraint, attempting update:', insertError)
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: googleData.full_name,
              avatar_url: googleData.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq('email', googleData.email || user.email)

          if (updateError) {
            console.error('Error updating profile after insert conflict:', updateError)
            return { success: false, error: updateError.message }
          }

          return { success: true }
        }

        console.error('Error creating profile:', insertError)
        return { success: false, error: insertError.message }
      }

      return { success: true }
    }
  } catch (error) {
    console.error('Unexpected error in createOrUpdateProfile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Main orchestration function for handling profile creation/update after OAuth
 */
export async function handleProfileCreation(
  user: User,
  supabase: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract Google user data
    const googleData = extractGoogleUserData(user)

    // Validate we have at least an email
    if (!googleData.email && !user.email) {
      return { success: false, error: 'No email found in user data' }
    }

    // Create or update profile
    const result = await createOrUpdateProfile(user, googleData, supabase)

    return result
  } catch (error) {
    console.error('Error in handleProfileCreation:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

/**
 * Creates or ensures a profile exists for email/magic link signups
 * This is used for passwordless signup flows
 */
export async function ensureProfileForEmailSignup(
  user: User,
  supabase: SupabaseClient
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!user.email) {
      return { success: false, error: 'No email found in user data' }
    }

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, internal_role, status, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error fetching profile:', fetchError)
      return { success: false, error: fetchError.message }
    }

    // If profile exists, return success
    if (existingProfile) {
      return { success: true }
    }

    // Profile doesn't exist - create new one for email signup
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        status: 'active',
        internal_role: null, // Default to external user
        account_type: 'free',
        onboarding_completed: false, // New users need to complete onboarding
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      // If insert fails due to unique constraint (email), profile might exist with different ID
      if (insertError.code === '23505') {
        console.warn('Profile insert failed due to unique constraint:', insertError)
        // Try to find existing profile by email
        const { data: existingByEmail } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()
        
        if (existingByEmail) {
          // Profile exists with this email but different user ID - this is a conflict
          console.error('Profile exists with same email but different user ID')
          return { success: false, error: 'Account with this email already exists' }
        }
      }

      console.error('Error creating profile:', insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in ensureProfileForEmailSignup:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}


