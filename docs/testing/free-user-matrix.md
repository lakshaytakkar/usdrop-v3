# Free User Test Matrix (Tier 1 Routes)

Focus: ensure free users never see blank screens, raw errors, or broken layouts on key surfaces.

## Legend
- **State**: normal, no-data, slow, error, perm-mismatch.
- **Expected UI**: layout, messaging, and next step.

## /onboarding (dashboard shell)
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Existing account with stats and modules | Header/sidebar visible, stats cards populated, onboarding accordion shows modules & progress. |
| No data (new user) | New account, no stats/modules | Stats cards show 0s, onboarding card shows “Onboarding is not available yet” `EmptyState`; rest of dashboard usable. |
| Slow stats API | Throttle `/api/dashboard/stats` | Initial loader, then either stats or `SectionError` above widgets; layout remains intact. |
| Onboarding API error | Force `/api/onboarding/course` to 500 | Onboarding card shows `SectionError` message; stats and other content still visible. |
| Role/plan mismatch | Downgrade pro→free while session active | User still lands on `/onboarding` with safe defaults; no crash; premium-only sections stay teaser-locked. |

## /product-hunt
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Products API healthy | Category filter visible, grid of cards, first 6 unlocked for free, remaining cards locked with overlays; “Load More” locked for free with upsell. |
| No products | API returns empty list for category | `EmptyState` explaining “No products found” with refresh CTA; filters and shell visible. |
| Slow API | Throttle `/api/products` | Grid skeletons until load completes; no raw error; eventual data or localized `SectionError` with retry. |
| API error | Force `/api/products` 500 | Top `SectionError` with retry; no crash; previous content preserved if already loaded. |
| Free vs Pro | Free vs Pro user | Free: teaser-lock (+ load more locked). Pro: all items & pagination usable. |

## /winning-products
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | API healthy | Table renders rows, first 6 rows fully visible to free, rest blurred/locked with inline Unlock buttons. |
| No products | Empty response | `EmptyState` above table area, explaining no winning products; filters still usable. |
| Error | 500 from `/api/products?is_winning=true` | `SectionError` above table + safe default stats; shell and banner remain. |

## /categories
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Categories API healthy | Grid of category cards; first 6 unlocked for free, rest teaser-locked; clicking locked opens upsell. |
| No categories | Empty `categories` | `EmptyState` with CTA; layout intact. |
| Error | 500 from `/api/categories` | Inline error/`SectionError` and safe empty grid; no crash. |

## /competitor-stores
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | API healthy | Table populated; first 6 rows fully interactive for free; rest locked with row overlays + upsell. |
| No data | API returns empty list | Row-level “No stores found” empty message; filters intact. |
| Error | 500 from `/api/competitor-stores` | Card-level error with retry; shell intact. |

## /seasonal-collections
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Static config | At least first collection fully clickable for free; remaining banners teaser-locked. |

## /intelligence
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Static articles | Cards always visible; “Read more” locked for free via button overlay; upsell appears. |
| No results | Search/filter yields none | `EmptyState` “No articles found”; filters usable. |

## /webinars
| Scenario | Setup | Expected UI |
| --- | --- | --- |
| Normal data | Sample webinars | Calendar + lists render; free users can see upcoming/past events; joining/recordings may be gated in future via overlays. |


