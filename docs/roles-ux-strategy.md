# Role UX Strategy (Hybrid, Shared Pages)

We keep **shared `page.tsx` per functional area** and gate capabilities in-component. Separate route groups are only considered when flows truly diverge (e.g., different step flows for free vs. pro onboarding).

## When to use shared pages (default)
- Functional areas stay in one `page.tsx` (e.g., `/product-hunt`, `/winning-products`, `/categories`, `/competitor-stores`, `/intelligence`, `/ai-toolkit/*`).
- Gate **items** and **actions**, not the whole page:
  - Items: lock individual cards/rows with overlays (teaser-lock).
  - Actions: disable/ghost buttons (load more, export, advanced filters) with calm messaging.
  - Sections: replace a sub-section with an upsell, but keep the page shell intact.
- Never blank the page for free users; always show the layout, some content, and a clear next step (upgrade, retry, or explore).

## When to consider separate route groups (rare)
- Flows have different steps/content per role (e.g., a fundamentally different onboarding or pricing experiment).
- SEO or marketing needs a distinct experience per segment (e.g., `(free)` vs `(pro)` landing variants).
- Admin/internal tools remain in `/admin/**` (already split by middleware).

If unsure, **stay with shared pages** and use guards.

## Guard primitives (to implement)
- **`RoleGate`** (view-level):
  - Props: `requiredPlan?: 'free' | 'pro' | 'admin'`, `requiredRole?: string[]`, `fallback?: ReactNode`.
  - Behavior: renders children when allowed; otherwise shows a full-width, calm upsell/notice while preserving page layout.
- **`CapabilityGuard`** (action-level):
  - Props: `capabilityKey: string`, `fallback?: ReactNode`, `reason?: string`.
  - Behavior: disables or replaces an action (button/control) with a short explanation; never crashes.
- **`FeatureFlagGuard`** (optional/future):
  - For experiment flags; same shape as `CapabilityGuard`.

All guards must read role/plan from context (`useRolePermissions`/`useFeatureAccess`) — never call Supabase directly.

## Locking patterns (apply consistently)
- **Teaser-lock (default)**: first N items visible to free users; remaining items locked with overlays. Detail pages/buttons may also lock.
- **Details-locked**: list is visible; deep actions (e.g., “Read more”, “View details”) lock for free.
- **Pagination-locked**: page 1 visible; “Load more”/pagination locks for free.
- Avoid full-page blur/lock; keep the shell and some content visible.

## Copy and UX tone
- Calm, human, and specific: “Upgrade to Pro to see all results” vs. raw errors.
- Always offer a next step: upgrade, retry, or explore another free area.
- Keep layout stable: no layout jumps when switching states/locks.

## Where to apply soonest
- Discovery: `/product-hunt`, `/winning-products`, `/categories`, `/seasonal-collections`, `/competitor-stores`.
- Content: `/intelligence`, `/webinars` (lock deep actions, not the shell).
- AI Toolkit: per-tool gating; free tools stay fully usable, pro tools show teasers, not blank screens.
- Settings/Profile: must remain stable; show inline errors without breaking layout.

