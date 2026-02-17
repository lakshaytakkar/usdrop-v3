import { db } from '@/lib/db/query'
import { sql } from '@/lib/db/index'

export { db as supabaseAdmin }

export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Use /api/auth/signin' } }),
      signUp: async () => ({ data: null, error: { message: 'Use /api/auth/signup' } }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: null, error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => db.from(table),
  }
}

export function createAdminClient() {
  return db
}

export { sql }
