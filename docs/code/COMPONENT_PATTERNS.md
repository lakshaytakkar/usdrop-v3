# React/Next.js Component Patterns

## Purpose
Standardized patterns for building React components in the USDrop codebase.

---

## File Structure Rules

```
src/components/
├── ui/                    # Primitive UI components (shadcn)
├── [feature]/             # Feature-specific components
│   ├── component-name.tsx # Component file (kebab-case)
│   ├── index.ts           # Barrel export
│   └── types.ts           # Feature-specific types
└── shared/                # Cross-feature shared components
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files | `kebab-case.tsx` | `product-card.tsx` |
| Components | `PascalCase` | `ProductCard` |
| Props | `PascalCase + Props` | `ProductCardProps` |
| Hooks | `camelCase` with `use` prefix | `useProductData` |

---

## Component Template

```tsx
// product-card.tsx
import { cn } from '@/lib/utils'

// 1. TYPES - Define props interface
interface ProductCardProps {
  /** Product title displayed in card header */
  title: string
  /** Price in cents */
  price: number
  /** Optional click handler */
  onClick?: () => void
  /** Additional CSS classes */
  className?: string
}

// 2. COMPONENT - Single export, named function
export function ProductCard({
  title,
  price,
  onClick,
  className
}: ProductCardProps) {
  // 3. HOOKS - All hooks at top
  const formattedPrice = useMemo(() => formatPrice(price), [price])

  // 4. HANDLERS - Event handlers before return
  const handleClick = () => {
    onClick?.()
  }

  // 5. RENDER - Clean JSX
  return (
    <div
      className={cn("rounded-lg border p-4", className)}
      onClick={handleClick}
    >
      <h3>{title}</h3>
      <p>{formattedPrice}</p>
    </div>
  )
}
```

---

## Props Rules

### Required vs Optional
```tsx
interface Props {
  // Required - no default needed
  id: string
  title: string

  // Optional - provide defaults or handle undefined
  subtitle?: string
  isActive?: boolean
  onClick?: () => void
}

// Destructure with defaults
function Component({
  id,
  title,
  subtitle = '',
  isActive = false,
  onClick
}: Props) {}
```

### Children Pattern
```tsx
// Explicit children typing
interface Props {
  children: React.ReactNode
}

// Or with PropsWithChildren
type Props = React.PropsWithChildren<{
  title: string
}>
```

### Composition Pattern
```tsx
// Compound components
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>

// Implementation
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card">{children}</div>
)
Card.Header = ({ children }) => <div className="card-header">{children}</div>
Card.Body = ({ children }) => <div className="card-body">{children}</div>
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>
```

---

## State Patterns

### Local State
```tsx
// Simple state
const [isOpen, setIsOpen] = useState(false)

// Object state - use reducer for complex
const [filters, setFilters] = useState<Filters>({
  search: '',
  status: 'all',
  sortBy: 'date'
})

// Update pattern
setFilters(prev => ({ ...prev, search: value }))
```

### Derived State
```tsx
// DON'T: Store derived values in state
const [items, setItems] = useState([])
const [filteredItems, setFilteredItems] = useState([]) // BAD

// DO: Compute derived values
const [items, setItems] = useState([])
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
)
```

### Server State
```tsx
// Use React Query / SWR patterns
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => fetchProducts(filters)
})
```

---

## Event Handler Patterns

### Naming
```tsx
// Internal handlers: handle + Event
const handleClick = () => {}
const handleSubmit = () => {}
const handleInputChange = () => {}

// Props callbacks: on + Event
interface Props {
  onClick?: () => void
  onSubmit?: (data: FormData) => void
  onChange?: (value: string) => void
}
```

### Async Handlers
```tsx
const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await submitData()
    toast.success('Saved!')
  } catch (error) {
    toast.error('Failed to save')
  } finally {
    setIsLoading(false)
  }
}
```

---

## Conditional Rendering

### Patterns
```tsx
// Boolean - use &&
{isVisible && <Component />}

// Ternary - for either/or
{isLoading ? <Spinner /> : <Content />}

// Multiple conditions - early return
if (isLoading) return <Spinner />
if (error) return <Error message={error} />
if (!data) return <Empty />
return <Content data={data} />
```

### Constraints
- NO nested ternaries
- NO complex logic in JSX - extract to variables
- ALWAYS handle loading/error/empty states

---

## Import Order

```tsx
// 1. React
import { useState, useEffect } from 'react'

// 2. External libraries
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

// 3. Internal aliases (@/)
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

// 4. Relative imports
import { ProductCardProps } from './types'
import { formatPrice } from './utils'

// 5. Types (if separate)
import type { Product } from '@/types'
```

---

## References
- [TYPESCRIPT_STANDARDS.md](TYPESCRIPT_STANDARDS.md)
- [DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)
