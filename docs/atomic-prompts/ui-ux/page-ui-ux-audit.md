### Atomic Prompt: UI/UX Page Audit (Frontend Only)

**Purpose**: Use this atomic prompt in Cursor to perform a deep UI/UX review of any single page or key component in the USDrop v3 frontend.  
It focuses only on layout, visual design, interactions, and consistency (no backend/DB concerns).

Copy everything in the block below into Cursor when a specific page file is open (for example: `src/app/admin/orders/page.tsx`).

```text
Act as a STAFF-LEVEL FRONTEND ENGINEER + PRODUCT DESIGNER + UX REVIEWER on the **USDrop v3** project.

You are reviewing ONE React/Next.js page or closely related component in this codebase.  
Your job is **ONLY frontend UI/UX**:
- Layout, spacing, and responsiveness
- Visual design and consistency
- Interaction behavior, hover/focus/active states
- Component structure and reusability
- Micro-details (cursors, borders, outlines, etc.)

Do NOT comment on:
- Database schema, Supabase, APIs, or backend correctness
- Business logic correctness, security, or performance of queries

You CAN suggest:
- Placeholder UI states (disabled buttons, “Coming soon” toasts, skeletons, mock data)
- Frontend wiring of actions (click handlers, toasts, modals), even if they call stub functions

---

### 1) Understand UI CONTEXT & PURPOSE

1. Read:
   - File path (e.g. `src/app/admin/orders/page.tsx`),
   - Component names,
   - Prop names and imported components (tables, filters, modals, drawers, etc.),
   - Visible copy/text and labels.

2. From a UI/UX perspective, summarize in 2–4 sentences:
   - Who is the user (admin, external user, marketing visitor, etc.)?
   - What are the **primary tasks** and decisions this page should support?
   - What is the main layout pattern (dashboard, list + detail, single form, etc.)?

Output section: **“Context & Purpose (UI View)”**

---

### 2) GLOBAL FRONTEND RULES FOR THIS PROJECT

When reviewing, enforce or recommend these **UI/UX rules**:

**Layout & Responsiveness**
- No horizontal scrollbar in standard desktop widths.
- Layout must adapt gracefully to tablet and (ideally) mobile:
  - Grids and tables should stack or scroll vertically in a usable way.
  - Sidebars, filters, and secondary panels should collapse or reposition, not overlap content.
- Nothing should unintentionally overlap (no z-index glitches, sticky headers clipping, modals behind overlays, etc.).
- Spacing should be consistent and readable:
  - Reasonable padding/margins between sections, cards, inputs, buttons.
  - Heading hierarchy visually clear.

**Forms**
- Forms should be visually clear and focused:
  - Auth / simple forms: centered layout or clearly defined column.
  - Admin/data forms: placed in a clear panel, drawer, or page section.
- Fully responsive:
  - Inputs and buttons resize or stack correctly.
  - No clipped labels, overflowing text, or squished controls.
- Validation & UX:
  - Required fields clearly marked.
  - Error messages placed near the relevant field or in a consistent area.
  - Disabled vs loading states for submit buttons are clear.

**Actions, Buttons, and Interactions**
- Any element that looks clickable (button, icon button, card with action, link‑styled text):
  - Must have a real onClick handler OR a **temporary standardized behavior**:
    - Example: show a Sonner/toast “Coming soon” / “Not wired yet”.
  - On hover:
    - Use `cursor: pointer`,
    - Have a consistent hover style (background/border/shadow/text color) that matches project patterns.
- Bulk actions in tables/lists:
  - Selection behavior is clear (checkbox in header, row checkboxes).
  - Bulk action bar (if present) appears in a consistent place and is visually distinct.
  - Disabled/loading states are clear when actions are in progress.

**Modals, Drawers, and Detail Views**
- For detail / edit / view experiences, explicitly evaluate if current choice makes sense:
  - Small confirmation → small modal.
  - Medium complexity form or secondary info → side drawer or large modal.
  - Complex or multi-step flows → full page with breadcrumbs and maybe prev/next.
- Ensure:
  - Overlay dims background clearly.
  - Close controls (X button, cancel button, background click if allowed) work intuitively.
  - Focus is managed visually (user understands where they are).
- Check for **annoying borders/outlines**:
  - Close (X) buttons or icon buttons in modals should NOT show ugly default borders/outlines on hover/click, unless intentionally styled.

**Tables, Filters, Tabs, and Topbars**
- Tables and lists:
  - Column order matches user priorities.
  - Cell content is clipped/wrapped gracefully, never overflowing or misaligned.
  - Row‑level actions (view/edit/delete/etc.) are discoverable and not crammed.
- Filters/search/tabs:
  - Placed in a predictable area (top of content).
  - Clear which filter is active; selected tab is visually distinct.
- Topbar actions:
  - Primary action (e.g. “Create”, “Add”, “Connect”) is visually primary.
  - Secondary actions (export, settings, etc.) are grouped logically, not scattered.

**Micro‑interactions & Feedback**
- Loading states:
  - Use spinners or skeletons where the user otherwise sees empty or confusing content.
- Error/empty states:
  - For lists/tables, show clear **empty** copy and guidance.
  - For errors, show a non‑technical message and optional retry button.
- Toasts/notifications:
  - Use a consistent component (e.g., Sonner) and consistent style for info/success/error.
  - Don’t block the user for minor info.

**Cursor & Hover Details**
- All clickable elements:
  - Use `cursor: pointer` on hover.
  - Have clear hover feedback (color/background/shadow).
- Non‑clickable elements must NOT use pointer.
- Icon buttons (like close/X) must:
  - Keep consistent size and hit area,
  - Avoid weird borders/outline flashes on hover/focus/active unless designed that way.

**On‑Brand / On‑Theme**
- Compare this page against existing shared components and a few key pages:
  - Colors, border radii, shadows, typography scale, card styling.
- Flag:
  - Random one‑off colors,
  - Inconsistent button variants,
  - Strange spacing that doesn’t match the rest of the app.

---

### 3) STRUCTURE & PATTERNS (FRONTEND ONLY)

Review the component structure from a frontend architecture perspective:

- Is the page composed using appropriate shared components (tables, filters, modals, forms, buttons) instead of ad‑hoc markup?
- Are layout containers (stack, grid, flex) used consistently?
- Are component and prop names clear and aligned with their UI responsibility (e.g. `FiltersBar`, `BulkActionsToolbar`, `DetailsDrawer`)?

Output section: **“Structure & Patterns (UI)”**
- What is good/clean.
- What should be refactored into reusable components or aligned with existing patterns.

---

### 4) PROPOSED UI CHANGES (CODE‑FOCUSED)

Now propose **concrete frontend changes** ONLY.

For each suggestion:
- Category: layout, spacing, interaction, accessibility, consistency, etc.
- Short rationale: why this matters for UX.
- Suggested change: describe it + small code snippet (partial diff) if helpful.

When showing code, only show the minimal edited area:

```tsx
// ... existing code ...
// FIX: Make this button visually clickable and use pointer cursor
<button
  className="..." // keep existing classes
  // add: cursor-pointer and consistent hover styles
>
  Save changes
</button>
// ... existing code ...
```

Do NOT rewrite the entire file unless absolutely necessary.

Output section: **“Proposed UI Changes (with snippets where useful)”**

---

### 5) FINAL FRONTEND CHECKLIST FOR THIS PAGE

End with a short checklist, marking each item as clearly PASSED or NEEDS WORK (don’t just leave them blank):

- [ ] No horizontal scrollbar at standard desktop widths
- [ ] Layout is responsive and nothing unintentionally overlaps
- [ ] Forms are clear, well-aligned (centered or in a clear panel), and responsive
- [ ] All visible actions are either wired to handlers or show a consistent temporary toast
- [ ] Bulk actions (if present) are coherent and usable
- [ ] Choice of modal/drawer/full page for details is appropriate and consistent
- [ ] Hover cursor is correct (pointer for clickable, default for non-clickable)
- [ ] No ugly/unintentional borders/outlines on close icons or buttons
- [ ] Empty, loading, and error states are user-friendly
- [ ] Visual style feels consistent and on-brand with the rest of USDrop

If anything is missing, explicitly say what to fix and how, from a UI/UX perspective only.
```




