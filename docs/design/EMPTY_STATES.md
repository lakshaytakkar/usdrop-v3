# Empty States Design Rules

## Purpose
Standardized patterns for empty, loading, and error states across the USDrop platform.

---

## State Types

| State | When | User Feeling | Goal |
|-------|------|--------------|------|
| **Empty** | No data exists yet | Uncertain | Guide to first action |
| **No Results** | Search/filter returns nothing | Frustrated | Help refine search |
| **Loading** | Data is being fetched | Waiting | Show progress |
| **Error** | Something went wrong | Confused | Enable recovery |

---

## Empty State Pattern

### Structure
```
┌─────────────────────────────────────┐
│           [Illustration]            │
│                                     │
│         Primary Message             │
│      Secondary explanation          │
│                                     │
│         [ Primary CTA ]             │
│          Secondary link             │
└─────────────────────────────────────┘
```

### Content Rules
| Element | Rule | Example |
|---------|------|---------|
| Illustration | Simple, relevant icon or graphic | 📦 for products, 📋 for orders |
| Primary Message | What's missing (not technical) | "No products yet" |
| Secondary | Why it matters + what to do | "Add your first product to start selling" |
| Primary CTA | Clear action to resolve | "Add Product" |
| Secondary Link | Alternative or help | "Import from CSV" or "Learn more" |

### Copy Formula
```
Primary: "No [items] yet"
Secondary: "[Action] to [benefit]"
CTA: "[Verb] [Object]"
```

### Examples

**Products Page**
```
📦
No products yet
Add your first product to start selling to customers.
[ Add Product ]
Or import from CSV
```

**Orders Page**
```
📋
No orders yet
Orders will appear here when customers make purchases.
[ View Products ]
```

**Search Results**
```
🔍
No results for "xyz"
Try adjusting your search or filters.
[ Clear Filters ]
```

---

## Loading State Pattern

### Types
| Type | Use When | Component |
|------|----------|-----------|
| **Skeleton** | Layout is known | Gray animated shapes |
| **Spinner** | Layout unknown or small area | Circular spinner |
| **Progress** | Known duration/steps | Progress bar |

### Skeleton Rules
```tsx
// Match the actual content shape
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>
```

### Timing Guidelines
| Duration | User Perception | Action |
|----------|-----------------|--------|
| < 100ms | Instant | No indicator needed |
| 100ms - 1s | Brief delay | Show spinner |
| 1s - 10s | Noticeable wait | Show skeleton + message |
| > 10s | Long wait | Show progress + allow cancel |

### Loading Messages
```
"Loading products..."       ← Specific
"Please wait..."           ← Generic (avoid)
"Fetching latest data..."  ← Action-oriented
"Almost there..."          ← For long waits
```

---

## Error State Pattern

### Structure
```
┌─────────────────────────────────────┐
│         ⚠️ Error Icon               │
│                                     │
│      Something went wrong           │
│   We couldn't load your products.   │
│                                     │
│         [ Try Again ]               │
│        Contact support              │
└─────────────────────────────────────┘
```

### Error Copy Rules

**DO:**
- Be specific about what failed
- Suggest a fix or next step
- Keep it human and apologetic
- Provide escape hatch (retry, go back, contact)

**DON'T:**
- Show technical errors to users
- Blame the user
- Leave them stuck with no action
- Use alarming language

### Error Message Formula
```
What happened: "We couldn't load [thing]"
Why (if helpful): "This might be a connection issue"
What to do: "Try again or contact support"
```

### Examples

**Network Error**
```
⚠️
Couldn't connect
Check your internet connection and try again.
[ Retry ]
```

**Server Error**
```
⚠️
Something went wrong
We're having trouble loading this page. Please try again.
[ Refresh Page ]   Contact Support
```

**Permission Error**
```
🔒
Access denied
You don't have permission to view this page.
[ Go to Dashboard ]
```

---

## No Results State

### Different from Empty
- **Empty**: User hasn't created anything yet
- **No Results**: User searched/filtered, nothing matches

### Pattern
```
🔍
No results for "[search term]"
Try different keywords or [ Clear Filters ]

Suggestions:
• Check spelling
• Use fewer filters
• Try broader terms
```

### When Filters Applied
```
No products match your filters
[ Clear all filters ] to see all products
```

---

## Component Template

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="text-4xl mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {secondaryAction && (
        <Button
          variant="link"
          onClick={secondaryAction.onClick}
          className="mt-2"
        >
          {secondaryAction.label}
        </Button>
      )}
    </div>
  )
}
```

---

## Constraints

### DO
- Always provide a way forward (CTA or navigation)
- Match illustration style to brand
- Keep messages concise (< 2 sentences)
- Test on mobile (centered, readable)

### DON'T
- Leave blank white space with no explanation
- Use technical jargon in error messages
- Show multiple loading spinners at once
- Forget to handle the error state

---

## References
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- [COMPONENT_PATTERNS.md](../code/COMPONENT_PATTERNS.md)
