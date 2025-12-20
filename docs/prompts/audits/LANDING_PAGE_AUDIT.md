### Atomic Prompt: Landing Page + Megamenu UX/UI Audit

**Purpose**: Use this atomic prompt in Cursor to perform a comprehensive UI/UX audit of the root marketing landing page and global navigation (including megamenu dropdowns) to achieve a clean, consistent, conversion-focused experience with no UX leakages.

Copy everything in the block below into Cursor when reviewing the landing page (`src/app/page.tsx`) and header/megamenu components.

```text
You are a senior front-end engineer and UX/UI designer.

Your task is to **audit and refine the root landing page and its global navigation (including the full megamenu)** to achieve a clean, consistent, conversion-focused experience with no UX leakages.

### Objectives
- Ensure **clear, logical sequencing** of content from top to bottom (hero → value proposition → social proof → features/benefits → pricing/offer → FAQs → footer, etc.).
- Standardize **patterns, layouts, spacing, and sizing** across all sections and components.
- Improve **copy** for clarity, brevity, and persuasive impact, while keeping tone and brand voice consistent.
- Enhance **megamenu structure and layout** for faster orientation, better sitemap viability, and easy access to key pages.
- Align **fonts, typography scales, colors, icons, and imagery** for visual consistency.
- Eliminate **UI/UX "leakages"**: confusing states, misaligned elements, janky hovers, awkward scroll breaks, unclear CTAs, or dead ends.

### Focus Areas

1. **Content sequence & information architecture**
   - Reorder or regroup sections so the narrative flows logically and supports a single main conversion goal.
   - Ensure every scroll-depth has a clear purpose and a visible next step (CTA, link, or explanation).
   - Remove redundant or low-value sections, or merge overlapping ones.

2. **Copy & messaging**
   - Tighten headlines and subcopy so they:
     - Clearly state what the product does, for whom, and the primary value.
     - Use consistent terminology (no synonym drift for key concepts).
   - Make CTAs action-oriented and consistent (labeling, capitalization, tone).
   - Keep reading level accessible and remove jargon where possible.

3. **Layouts, sizing, spacing**
   - Normalize section padding, column widths, and grid usage across the landing page.
   - Fix inconsistent margins/gaps between related components (cards, headings, lists, buttons).
   - Ensure responsive layouts work smoothly across breakpoints (mobile, tablet, desktop) with no broken wrapping or overflow.

4. **Typography & visual system**
   - Enforce a **consistent type scale** (e.g., H1–H6, body, caption) and apply it strictly.
   - Standardize **font weights, line heights, and letter spacing** for headings and body text.
   - Ensure color usage (brand colors, neutrals, link states, alerts) follows a coherent system with proper contrast (WCAG-friendly where feasible).

5. **Megamenu & sitemap viability**
   - Review the **megamenu categories, labels, and groupings** to:
     - Reflect the actual IA/sitemap clearly.
     - Make the most important and high-intent destinations fastest to reach.
   - Improve column and section alignment, spacing, and icon usage so it reads as a coherent grid.
   - Ensure hover/focus states, open/close behavior, and transitions are smooth and predictable.
   - Remove dead links, duplicates, or overly deep nesting that hurts discoverability.

6. **Images, icons, and media**
   - Use a **consistent illustration/photo and icon style** (line vs filled, stroke widths, colors).
   - Normalize image aspect ratios and sizes to prevent layout jumps.
   - Optimize image usage so no blurry, stretched, or misaligned assets remain.

7. **Interaction, states, and UX polish**
   - Make sure all interactive elements (buttons, links, menu items, accordions, carousels) have:
     - Clear hover/active/focus states.
     - Adequate hit areas and spacing, especially on mobile.
   - Remove or fix any broken or confusing interactions (sticky headers, scroll jank, overlapping elements, unexpected modals).
   - Ensure forms, if present on the landing page, are minimal, clear, and aligned.

### Implementation guidelines
- Prefer **reusing existing design tokens, components, and patterns**; introduce new ones only when necessary and then apply them consistently.
- Maintain or improve **performance and accessibility** (no heavy, unnecessary scripts; sensible aria attributes; keyboard navigability for the megamenu).
- Do not change core brand identity, but **elevate clarity, consistency, and usability** everywhere.

### Output
1. Provide a **brief audit summary** listing:
   - Key issues found in: sequence, copy, layouts, spacing, typography, megamenu, visuals, and interactions.
2. Then propose **specific, concrete changes**:
   - Describe what to change section by section (and in the megamenu), including copy suggestions, layout tweaks, and structural improvements.
   - If applicable, reference the relevant components/sections by name so they can be updated directly in code or the design system.
```









