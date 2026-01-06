# Free-User Surface: Routes and Access Map

This matrix focuses on user-facing routes under `src/app` and classifies them by authentication, minimum plan/role, and purpose. It highlights the primary free experiences to harden first.

## Legend
- **Auth**: `public` (no session) or `auth` (requires Supabase session; enforced by middleware).
- **Min plan/role**: `free` (external free), `pro` (external paid), `admin` (internal role).
- **Type**: marketing, dashboard, discovery, content, tool, settings, admin.

## Public (no auth)
| Path | Auth | Min plan/role | Type | Notes |
| --- | --- | --- | --- | --- |
| `/` | public | free | marketing | Landing |
| `/login`, `/signup` | public | free | auth | Redirects to onboarding/home when logged in |
| `/pricing` | public | free | marketing | Pricing |
| `/about`, `/contact`, `/privacy`, `/terms`, `/help`, `/help-center`, `/what-is-dropshipping`, `/who-is-this-for` | public | free | marketing/help | Informational |

## Authenticated Free + Pro (external)
| Path | Auth | Min plan/role | Type | Notes |
| --- | --- | --- | --- | --- |
| `/onboarding` | auth | free | dashboard/onboarding | Default redirect for free users |
| `/home` | auth | pro? (currently used for pro redirect) | dashboard | Verify actual usage; ensure free users don’t break here |
| `/product-hunt` (+ detail `[id]`) | auth | free | discovery | Uses teaser-lock (first N visible); lock load more |
| `/winning-products` | auth | free | discovery | Table/grid; teaser-lock rows |
| `/categories` | auth | free | discovery | Teaser-lock after first N |
| `/seasonal-collections` | auth | free | discovery | First collection visible, rest locked |
| `/competitor-stores` | auth | free | discovery | Teaser-lock after first N |
| `/intelligence` (+ `[slug]`) | auth | free | content | Cards visible; “Read more” locked for free |
| `/webinars` | auth | free | content | List of webinars; lock registration/details for free (to do) |
| `/ai-toolkit` (index) | auth | free | tools hub | Mixed free/pro tools; ensure per-tool gating |
| `/ai-toolkit/description-generator` | auth | free | tool | Appears free; keep fully usable for free |
| `/ai-toolkit/profit-calculator` | auth | free | tool | Marked “Free to use” |
| `/ai-toolkit/shipping-calculator` | auth | free | tool | Likely free; confirm |
| `/ai-toolkit/campaign-studio`, `/email-templates`, `/invoice-generator`, `/logo-studio`, `/model-studio`, `/policy-generator`, `/audience-studio`, `/brand-studio` | auth | pro | tools | Should show teasers/locks for free |
| `/research-tools` | auth | free/pro? | discovery/tools | Confirm gating; likely Pro |
| `/prompt-analyzer` | auth | free/pro? | tool | Confirm |
| `/my-products`, `/my-shopify-stores`, `/shopify-stores`, `/store-research`, `/suppliers`, `/selling-channels`, `/meta-ads`, `/fulfillment`, `/ai-fulfillment`, `/shopify-integration`, `/modules`, `/my-journey`, `/learn`, `/academy`, `/intelligence-hub` | auth | varies (mostly free/pro) | mgmt/content/tools | Review per page; treat as secondary after tier-1 |
| `/settings`, `/profile` (within layouts) | auth | free | settings | Ensure resilient states; keep nav visible |

## Admin / Internal
| Path | Auth | Min plan/role | Type | Notes |
| --- | --- | --- | --- | --- |
| `/admin/**` | auth | admin (internal role) | admin | Middleware redirects externals to onboarding/home |
| `/admin` sub-routes (`products`, `orders`, `categories`, `competitor-stores`, etc.) | auth | admin | admin | Out of scope for free hardening |

## Middleware Notes
- Public whitelist: `/`, `/login`, `/signup`, `/api/auth`, `/auth`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`.
- All other non-API routes require auth; unauthenticated → `/login?redirectedFrom=...`.
- Authenticated redirects:
  - Internal roles → `/admin`.
  - External: plan `pro` → `/home`; otherwise → `/onboarding`.

## Tier 1 Free Surfaces to Harden First
1. Dashboard/Onboarding: `/onboarding` (+ `/home` if free can reach)
2. Discovery: `/product-hunt`, `/winning-products`, `/categories`, `/seasonal-collections`, `/competitor-stores`
3. Content: `/intelligence`, `/webinars`
4. AI Toolkit: `/ai-toolkit` hub + per-tool pages (ensure free vs pro behavior)
5. Settings: `/settings`, `/profile` (ensure stable shells, no blank states)

## Observed Gaps / To Confirm
- Verify if `/home` is used by free users; if so, apply same resilience as onboarding.
- Confirm gating for `/research-tools`, `/prompt-analyzer`, and individual AI toolkit tools (free vs pro).
- Ensure detail pages (`/product-hunt/[id]`, `/intelligence/[slug]`) have graceful locked states for free users.

