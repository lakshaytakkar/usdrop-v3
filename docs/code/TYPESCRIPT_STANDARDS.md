# TypeScript Standards

## Purpose
Enforce consistent, strict TypeScript patterns across the USDrop codebase.

---

## Strict Mode Rules

### tsconfig.json Requirements
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## Type Definition Patterns

### Interface vs Type
```typescript
// USE INTERFACE for object shapes (extendable)
interface User {
  id: string
  name: string
  email: string
}

// USE TYPE for unions, intersections, primitives
type Status = 'pending' | 'active' | 'archived'
type ID = string | number
type UserWithRole = User & { role: Role }
```

### Props Types
```typescript
// Component props - always interface
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

// Extend HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary'
}
```

### API Response Types
```typescript
// Generic response wrapper
interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

// Error response
interface ApiError {
  error: string
  code?: string
  details?: Record<string, string[]>
}

// Usage
type ProductsResponse = ApiResponse<Product[]>
type ProductResponse = ApiResponse<Product>
```

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Interfaces | PascalCase | `UserProfile` |
| Types | PascalCase | `ButtonVariant` |
| Enums | PascalCase | `OrderStatus` |
| Enum values | UPPER_SNAKE | `OrderStatus.PENDING` |
| Generics | Single uppercase | `T`, `K`, `V` |
| Props | ComponentName + Props | `ButtonProps` |

---

## Strict Null Handling

### Optional Chaining
```typescript
// DO: Use optional chaining
const name = user?.profile?.name

// DO: Provide defaults
const name = user?.profile?.name ?? 'Unknown'

// DON'T: Assume existence
const name = user.profile.name // Error if null
```

### Narrowing
```typescript
// Type guard functions
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  )
}

// Usage
if (isUser(data)) {
  console.log(data.email) // TypeScript knows it's User
}
```

### Assertion Functions
```typescript
function assertDefined<T>(
  value: T | null | undefined,
  message: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

// Usage
assertDefined(user, 'User not found')
console.log(user.name) // TypeScript knows user is defined
```

---

## Generic Patterns

### Basic Generic
```typescript
// Function generic
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

// With constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

### Component Generic
```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

---

## Utility Types

### Common Patterns
```typescript
// Make all properties optional
type PartialUser = Partial<User>

// Make all properties required
type RequiredUser = Required<User>

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>

// Omit specific properties
type UserWithoutEmail = Omit<User, 'email'>

// Make properties readonly
type ReadonlyUser = Readonly<User>

// Record for object maps
type UserMap = Record<string, User>
```

### Custom Utility Types
```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific properties required
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Extract non-nullable
type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>
}
```

---

## Enum Patterns

### String Enums (Preferred)
```typescript
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

// Usage
const status: OrderStatus = OrderStatus.PENDING
```

### Const Objects (Alternative)
```typescript
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped'
} as const

type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]
// Type: 'pending' | 'processing' | 'shipped'
```

---

## Function Types

### Function Signatures
```typescript
// Arrow function type
type Handler = (event: Event) => void

// Function with generics
type Transform<T, R> = (input: T) => R

// Async function
type AsyncHandler = (id: string) => Promise<User>

// Function overloads
function process(input: string): string
function process(input: number): number
function process(input: string | number): string | number {
  return input
}
```

---

## Constraints

### DO
- Enable strict mode in tsconfig
- Define explicit return types for functions
- Use `unknown` instead of `any` when type is truly unknown
- Narrow types before using them
- Export types from dedicated `types.ts` files

### DON'T
- Use `any` (use `unknown` and narrow)
- Use `// @ts-ignore` (fix the type issue)
- Use non-null assertion `!` without good reason
- Define inline object types repeatedly (create interfaces)
- Mix interfaces and types inconsistently

---

## References
- [COMPONENT_PATTERNS.md](COMPONENT_PATTERNS.md)
- [API_DESIGN_RULES.md](API_DESIGN_RULES.md)
