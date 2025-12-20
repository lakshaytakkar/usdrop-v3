# API Design Rules

## Purpose
Standardized patterns for designing REST API endpoints in Next.js App Router.

---

## URL Structure

### Pattern
```
/api/[resource]/[id?]/[action?]
```

### Examples
| Method | URL | Purpose |
|--------|-----|---------|
| GET | `/api/products` | List all products |
| GET | `/api/products/123` | Get single product |
| POST | `/api/products` | Create product |
| PATCH | `/api/products/123` | Update product |
| DELETE | `/api/products/123` | Delete product |
| POST | `/api/products/123/duplicate` | Custom action |

### Naming Rules
- Resources: plural nouns (`products`, `users`, `orders`)
- Actions: verbs for non-CRUD (`/duplicate`, `/archive`, `/export`)
- IDs: use path params, not query strings for resource identity
- Filters: use query strings (`?status=active&limit=10`)

---

## File Structure

```
src/app/api/
├── products/
│   ├── route.ts              # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts          # GET, PATCH, DELETE (single)
│       └── duplicate/
│           └── route.ts      # POST (custom action)
├── admin/
│   └── [resource]/
│       └── route.ts          # Admin-specific endpoints
└── auth/
    └── [...nextauth]/
        └── route.ts          # Auth handlers
```

---

## Route Handler Template

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// 1. VALIDATION SCHEMA
const CreateProductSchema = z.object({
  title: z.string().min(1).max(200),
  price: z.number().positive(),
  status: z.enum(['draft', 'active', 'archived']).default('draft')
})

// 2. GET - List resources
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse query params
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status')

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data,
      meta: { total: count, limit, offset }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// 3. POST - Create resource
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate
    const result = CreateProductSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      )
    }

    // Create
    const { data, error } = await supabase
      .from('products')
      .insert(result.data)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
```

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Error Response
```json
{
  "error": "Human readable message",
  "code": "VALIDATION_ERROR",
  "details": { ... }
}
```

### Status Codes
| Code | Use When |
|------|----------|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST) |
| 204 | No content (DELETE with no body) |
| 400 | Bad request / Validation error |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Resource not found |
| 409 | Conflict (duplicate, etc.) |
| 500 | Server error |

---

## Validation Rules

### Always Validate
```typescript
import { z } from 'zod'

// Define schemas for each endpoint
const schema = z.object({
  // Required fields
  title: z.string().min(1, 'Title is required'),

  // Optional with defaults
  status: z.enum(['draft', 'active']).default('draft'),

  // Transform
  email: z.string().email().toLowerCase(),

  // Coerce from string (query params)
  limit: z.coerce.number().min(1).max(100).default(20)
})

// Validate in handler
const result = schema.safeParse(body)
if (!result.success) {
  return NextResponse.json(
    { error: 'Validation failed', details: result.error.flatten() },
    { status: 400 }
  )
}
```

---

## Authentication Pattern

```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check permissions (if needed)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  // Continue with authorized request...
}
```

---

## Query Parameters

### Pagination
```
GET /api/products?limit=20&offset=0
GET /api/products?page=1&per_page=20
```

### Filtering
```
GET /api/products?status=active&category=electronics
GET /api/products?price_min=100&price_max=500
```

### Sorting
```
GET /api/products?sort=created_at&order=desc
GET /api/products?sort=-created_at  # prefix with - for desc
```

### Search
```
GET /api/products?q=search+term
GET /api/products?search=keyword
```

---

## Constraints

### DO
- Always validate input with Zod
- Return consistent response shapes
- Use appropriate status codes
- Log errors server-side
- Handle edge cases (not found, duplicates)

### DON'T
- Expose internal error messages to clients
- Return inconsistent response formats
- Use GET for mutations
- Skip authentication checks
- Return sensitive data unnecessarily

---

## References
- [TYPESCRIPT_STANDARDS.md](TYPESCRIPT_STANDARDS.md)
- [SUPABASE_PATTERNS.md](SUPABASE_PATTERNS.md)
