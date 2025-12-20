# Error Messages & System Copy

## Purpose
Standardized patterns for error messages, toasts, validation text, and system feedback.

---

## Message Types

| Type | Use For | Tone | Icon |
|------|---------|------|------|
| **Error** | Failed actions, validation | Helpful, not blaming | ⚠️ ❌ |
| **Warning** | Potential issues | Cautionary | ⚠️ |
| **Success** | Completed actions | Celebratory (brief) | ✓ |
| **Info** | Neutral information | Informative | ℹ️ |

---

## Error Message Formula

### Structure
```
What happened + Why (if helpful) + What to do
```

### Short Form (Toasts)
```
"Couldn't save changes. Try again."
"Product deleted successfully."
"Check your email to verify."
```

### Long Form (Inline/Page)
```
Title: What happened
Description: Why it happened + what to do
Action: CTA to resolve
```

---

## Validation Messages

### Field-Level Errors
| Field | Error | Message |
|-------|-------|---------|
| Email | Empty | "Email is required" |
| Email | Invalid | "Enter a valid email address" |
| Password | Too short | "Password must be at least 8 characters" |
| Password | Missing requirements | "Include a number and special character" |
| Name | Empty | "Name is required" |
| URL | Invalid | "Enter a valid URL (https://...)" |
| Number | Out of range | "Enter a number between 1 and 100" |
| File | Too large | "File must be under 10MB" |
| File | Wrong type | "Only PNG, JPG files allowed" |

### Formula
```
[Requirement] + [How to fix]

Bad:  "Invalid"
Good: "Enter a valid email address"

Bad:  "Error in field"
Good: "Price must be a positive number"
```

---

## Toast Messages

### Success
```
✓ Product created
✓ Changes saved
✓ Email sent
✓ Copied to clipboard
✓ [Item] deleted
```

### Error
```
⚠️ Couldn't save changes. Try again.
⚠️ Connection lost. Reconnecting...
⚠️ Failed to load data. Refresh the page.
⚠️ Something went wrong. Please try again.
```

### Info
```
ℹ️ Your session will expire in 5 minutes
ℹ️ New version available. Refresh to update.
ℹ️ This feature is in beta
```

### Warning
```
⚠️ Unsaved changes will be lost
⚠️ This action cannot be undone
⚠️ You're about to delete 5 items
```

---

## System States

### Loading
```
"Loading..."              ← Generic (avoid)
"Loading products..."     ← Specific (better)
"Saving changes..."       ← Action-specific (best)
"Almost there..."         ← For long waits
```

### Empty States
```
"No products yet"
"No results found"
"No notifications"
"You're all caught up"
```

### Offline/Connection
```
"You're offline. Changes will sync when connected."
"Connection lost. Reconnecting..."
"Back online. Syncing changes..."
```

---

## Confirmation Dialogs

### Structure
```
Title:       Are you sure you want to [action]?
Description: [Consequence of action]
Primary:     [Action verb] (destructive style if dangerous)
Secondary:   Cancel
```

### Examples

**Delete Item**
```
Title: Delete this product?
Description: This action cannot be undone. The product will be permanently removed.
[Delete Product] [Cancel]
```

**Discard Changes**
```
Title: Discard unsaved changes?
Description: You have unsaved changes that will be lost.
[Discard] [Keep Editing]
```

**Logout**
```
Title: Sign out?
Description: You'll need to sign in again to access your account.
[Sign Out] [Cancel]
```

---

## Placeholder Text

### Input Placeholders
| Field | Placeholder |
|-------|-------------|
| Email | "you@example.com" |
| Search | "Search products..." |
| URL | "https://example.com" |
| Phone | "(555) 123-4567" |
| Price | "0.00" |

### Rules
- Show format/example, not the label
- Use realistic but fake data
- Don't repeat the label as placeholder
- Keep it short

---

## Tone Guidelines

### DO
- Be specific about what happened
- Tell users how to fix it
- Use "we" for system errors (our fault)
- Use "you" for user actions
- Keep it brief

### DON'T
- Blame the user ("You entered invalid data")
- Use technical jargon ("Error 500", "Null pointer")
- Be vague ("An error occurred")
- Use ALL CAPS or exclamation marks!!!
- Sound robotic ("Operation failed")

---

## Copy Templates

### Success Actions
```typescript
const successMessages = {
  create: (item: string) => `${item} created`,
  update: (item: string) => `${item} updated`,
  delete: (item: string) => `${item} deleted`,
  save: () => 'Changes saved',
  send: () => 'Message sent',
  copy: () => 'Copied to clipboard',
}
```

### Error Actions
```typescript
const errorMessages = {
  generic: 'Something went wrong. Please try again.',
  network: 'Connection error. Check your internet.',
  notFound: (item: string) => `${item} not found`,
  unauthorized: 'Please sign in to continue',
  forbidden: "You don't have permission to do this",
  validation: 'Please check the form for errors',
}
```

---

## Implementation

### Toast Usage
```tsx
import { toast } from 'sonner'

// Success
toast.success('Product created')

// Error
toast.error('Couldn\'t save changes. Try again.')

// With action
toast.error('Connection lost', {
  action: {
    label: 'Retry',
    onClick: () => retry()
  }
})

// Promise (loading → success/error)
toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Changes saved',
  error: 'Couldn\'t save changes'
})
```

---

## References
- [COPYWRITING.md](COPYWRITING.md)
- [EMPTY_STATES.md](../design/EMPTY_STATES.md)
