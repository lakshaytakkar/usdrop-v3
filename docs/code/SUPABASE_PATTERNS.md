# Supabase Patterns

## Purpose
Standardized patterns for Supabase database queries, authentication, and real-time subscriptions.

---

## Client Setup

### Server Component
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Client Component
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## Query Patterns

### Basic CRUD
```typescript
// SELECT - List
const { data, error } = await supabase
  .from('products')
  .select('*')

// SELECT - Single
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', id)
  .single()

// INSERT
const { data, error } = await supabase
  .from('products')
  .insert({ title, price })
  .select()
  .single()

// UPDATE
const { data, error } = await supabase
  .from('products')
  .update({ title })
  .eq('id', id)
  .select()
  .single()

// DELETE
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', id)
```

### Select with Relations
```typescript
// One-to-many
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    items:order_items(*)
  `)

// Many-to-one
const { data } = await supabase
  .from('products')
  .select(`
    *,
    category:categories(id, name)
  `)

// Nested relations
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    customer:profiles(id, name, email),
    items:order_items(
      *,
      product:products(id, title, price)
    )
  `)
```

### Filtering
```typescript
// Equals
.eq('status', 'active')

// Not equals
.neq('status', 'deleted')

// Greater/Less than
.gt('price', 100)
.gte('price', 100)
.lt('price', 500)
.lte('price', 500)

// In array
.in('status', ['active', 'pending'])

// Contains (array column)
.contains('tags', ['featured'])

// Text search
.ilike('title', '%keyword%')
.textSearch('title', 'keyword')

// Is null
.is('deleted_at', null)

// Range
.range(0, 9) // First 10 items
```

### Ordering & Pagination
```typescript
const { data, count } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(offset, offset + limit - 1)
```

---

## Authentication Patterns

### Get Current User
```typescript
// Server-side
const supabase = await createClient()
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}
```

### Auth Guard Hook
```typescript
// hooks/use-auth.ts
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
```

### Protected Route
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}
```

---

## Real-time Subscriptions

### Subscribe to Changes
```typescript
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeProducts() {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Change:', payload)
          // Update local state
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
```

### Filtered Subscription
```typescript
const channel = supabase
  .channel('my-orders')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Handle new order
    }
  )
  .subscribe()
```

---

## RLS Policies Pattern

### Basic Policies
```sql
-- Users can read own data
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Admin can read all
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
```

---

## Error Handling

### Standard Pattern
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')

if (error) {
  console.error('Database error:', error)
  throw new Error('Failed to fetch products')
}

// data is now guaranteed to exist
return data
```

### With Types
```typescript
import { PostgrestError } from '@supabase/supabase-js'

async function getProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Product not found')
    }
    throw error
  }

  return data
}
```

---

## Constraints

### DO
- Always check for errors after queries
- Use `.single()` when expecting one row
- Use typed responses with generated types
- Unsubscribe from real-time channels on cleanup
- Use RLS policies for security

### DON'T
- Ignore error responses
- Use service role key on client-side
- Skip RLS policies for user data
- Create multiple client instances unnecessarily
- Forget to handle loading states

---

## References
- [API_DESIGN_RULES.md](API_DESIGN_RULES.md)
- [TYPESCRIPT_STANDARDS.md](TYPESCRIPT_STANDARDS.md)
