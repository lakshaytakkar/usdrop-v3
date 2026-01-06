# UX Resilience: Standard States and Hooks

Core goal: every free-facing screen must handle loading, empty, partial, error, and offline states without breaking layout or hiding navigation.

## State → UI mapping
- **Loading**: skeletons/shimmers that match final layout (avoid layout jumps).
- **Empty**: clear copy + CTA; use `EmptyState` (`src/components/ui/empty-state.tsx`).
- **Error (no data)**: top-level `SectionError` with retry.
- **Error (with data / partial)**: local `SectionError` near the failing section; keep loaded sections visible.
- **Offline/timeout**: map network errors to calm “connection trouble” messaging; keep shell intact.

## Hook contract for data fetching
Return a normalized shape so views can render deterministically:
```ts
{ data, isLoading, error, isEmpty, isPartial? }
```
- Use helpers from `src/types/loadable.ts` (`buildLoadableState`, `deriveEmpty`).
- Never throw inside hooks; surface friendly `error` strings and safe `data` defaults (empty arrays/objects).
- For non-OK or non-JSON responses, set `error` + safe defaults instead of crashing.

## Component primitives
- `EmptyState`: empty/no-results, friendly CTA.
- `SectionError`: localized recoverable error with optional retry.
- `SectionErrorBoundary`: catches render-time errors in a section and shows a calm fallback without breaking the page shell.
- Skeletons: align to final layout (lists, cards, tables).
- `LockOverlay` / teaser-lock: show premium items/actions as locked instead of removing them.

## Patterns by layout
- **Lists/grids**: show skeletons on first load; `EmptyState` when empty; `SectionError` when error; overlay locks for premium cards/actions.
- **Tables**: skeleton rows; inline errors or banner above table; keep headers visible.
- **Dashboards**: multiple widgets; if one fails, show `SectionError` inside that widget, not the whole page.

## Offline / slow APIs
- After a threshold (e.g., 8–10s), swap from skeletons to a soft timeout message with retry.
- Keep nav, filters, and page padding visible even when data is missing.

## Role & permissions (frontend)
- Use `useRoleAccess` to read:
  - `role`, `plan`, `isFree`, `isPro`, `capabilities`.
- Do **not** call Supabase directly from components for role/plan; rely on:
  - `UnifiedUserProvider` + `UserPlanProvider` (hydrated from `sessionStorage` once after login, refreshed in background).
  - `getUserPermissions` (`src/lib/auth/get-user-permissions.ts`) to map metadata/plan → capabilities.

## Teaser-lock helpers
- Use `getTeaserLockState(index, isFree, config)` inside `.map()` loops to decide if an item is locked.
- Strategies:
  - `first-n-items`: first N visible; rest locked (Product Hunt, Winning Products, Categories, Competitor Stores).
  - `details-locked`: list visible; deep actions locked (Intelligence “Read more”).
  - `pagination-locked`: page 1 visible; “Load more”/pagination locked (Product Hunt).

