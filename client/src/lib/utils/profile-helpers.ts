export interface GoogleUserData {
  email: string
  full_name?: string | null
  avatar_url?: string | null
}

interface UserLike {
  id: string
  email?: string
  user_metadata?: Record<string, string>
  app_metadata?: Record<string, string>
}

interface QueryBuilder {
  from(table: string): {
    select(columns: string): {
      eq(column: string, value: string): {
        single(): Promise<{ data: Record<string, unknown> | null; error: { code?: string; message?: string } | null }>
      }
    }
    insert(data: Record<string, unknown>): Promise<{ error: { code?: string; message?: string } | null }>
    update(data: Record<string, unknown>): {
      eq(column: string, value: string): Promise<{ error: { code?: string; message?: string } | null }>
    }
  }
}

export function extractGoogleUserData(user: UserLike): GoogleUserData {
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

export async function createOrUpdateProfile(
  user: UserLike,
  googleData: GoogleUserData,
  supabase: QueryBuilder
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, internal_role, status')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (existingProfile) {
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (googleData.email && googleData.email !== user.email) {
        updates.email = googleData.email
      }

      if (googleData.full_name && googleData.full_name !== existingProfile.full_name) {
        updates.full_name = googleData.full_name
      }

      if (googleData.avatar_url && googleData.avatar_url !== existingProfile.avatar_url) {
        updates.avatar_url = googleData.avatar_url
      }

      if (Object.keys(updates).length > 1) {
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
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: googleData.email || user.email || '',
          full_name: googleData.full_name,
          avatar_url: googleData.avatar_url,
          status: 'active',
          internal_role: null,
          account_type: 'free',
          onboarding_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (insertError) {
        if (insertError.code === '23505') {
          console.warn('Profile insert failed due to unique constraint:', insertError)
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: googleData.full_name,
              avatar_url: googleData.avatar_url,
              updated_at: new Date().toISOString(),
            })
            .eq('email', googleData.email || user.email || '')

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

export async function handleProfileCreation(
  user: UserLike,
  supabase: QueryBuilder
): Promise<{ success: boolean; error?: string }> {
  try {
    const googleData = extractGoogleUserData(user)

    if (!googleData.email && !user.email) {
      return { success: false, error: 'No email found in user data' }
    }

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

export async function ensureProfileForEmailSignup(
  user: UserLike,
  supabase: QueryBuilder
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!user.email) {
      return { success: false, error: 'No email found in user data' }
    }

    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, internal_role, status, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError)
      return { success: false, error: fetchError.message }
    }

    if (existingProfile) {
      return { success: true }
    }

    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        status: 'active',
        internal_role: null,
        account_type: 'free',
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      if (insertError.code === '23505') {
        console.warn('Profile insert failed due to unique constraint:', insertError)
        const { data: existingByEmail } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()
        
        if (existingByEmail) {
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
