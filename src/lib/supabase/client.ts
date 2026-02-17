'use client'

export function createClient() {
  return {
    auth: {
      onAuthStateChange: (_callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signOut: async () => {
        await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
      },
      getUser: async () => {
        try {
          const res = await fetch('/api/auth/user', { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            return { data: { user: data.user }, error: null }
          }
          return { data: { user: null }, error: null }
        } catch {
          return { data: { user: null }, error: null }
        }
      },
    },
  }
}
