'use client'

interface AuthClient {
  auth: {
    getSession: () => Promise<{ data: { session: any }, error: any }>
    onAuthStateChange: (callback: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } }
    signOut: () => Promise<{ error: any }>
  }
  from: (table: string) => any
}

export function createClient(): AuthClient {
  return {
    auth: {
      getSession: async () => {
        try {
          const res = await fetch('/api/auth/user')
          if (!res.ok) return { data: { session: null }, error: null }
          const user = await res.json()
          return { data: { session: { user } }, error: null }
        } catch {
          return { data: { session: null }, error: null }
        }
      },
      onAuthStateChange: (callback) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signOut: async () => {
        try {
          await fetch('/api/auth/signout', { method: 'POST' })
          return { error: null }
        } catch (err: any) {
          return { error: { message: err.message } }
        }
      },
    },
    from: (_table: string) => {
      console.warn('Client-side database queries are not supported. Use API routes instead.')
      return {
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }
    }
  }
}
