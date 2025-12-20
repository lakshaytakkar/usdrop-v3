# Dashboard UI/UX Audit Template

## Purpose
Atomic prompt for auditing admin dashboards and user dashboard pages.

---

## Prompt

```text
Act as a SENIOR PRODUCT DESIGNER + FRONTEND ENGINEER auditing a dashboard page.

You are reviewing a dashboard in the USDrop platform. Focus on:
- Information hierarchy and scannability
- Widget/card organization and visual balance
- Data visualization clarity
- Action accessibility and discoverability
- Responsive behavior

---

## AUDIT CHECKLIST

### 1. Information Architecture
- [ ] Most important metrics are above the fold
- [ ] Related information is grouped logically
- [ ] Clear visual hierarchy (primary → secondary → tertiary)
- [ ] Page title and context are immediately clear
- [ ] User knows where they are in the app

### 2. Metrics & Stats Cards
- [ ] Key numbers are large and scannable
- [ ] Labels are clear and concise
- [ ] Trend indicators show direction (up/down arrows, colors)
- [ ] Time period is specified ("Last 7 days", "This month")
- [ ] Cards have consistent sizing and spacing
- [ ] Loading states for async data

### 3. Data Visualization
- [ ] Charts have clear titles and legends
- [ ] Axes are labeled appropriately
- [ ] Colors are distinguishable and accessible
- [ ] Tooltips provide additional context on hover
- [ ] Empty states when no data available
- [ ] Appropriate chart type for data (line for trends, bar for comparison)

### 4. Tables & Lists
- [ ] Column headers are clear and sortable where needed
- [ ] Row density is appropriate (not too cramped)
- [ ] Pagination or infinite scroll for long lists
- [ ] Search/filter options if list is long
- [ ] Row actions are discoverable but not cluttered
- [ ] Empty state with helpful message

### 5. Actions & Navigation
- [ ] Primary action is visually prominent
- [ ] Secondary actions are accessible but not competing
- [ ] Quick filters/tabs for common views
- [ ] Breadcrumbs or back navigation if nested
- [ ] Refresh/sync option for real-time data

### 6. Responsive Behavior
- [ ] Cards stack sensibly on mobile
- [ ] Charts remain readable at smaller sizes
- [ ] Tables scroll horizontally or adapt columns
- [ ] Critical actions remain accessible on mobile
- [ ] No horizontal overflow on any breakpoint

### 7. States
- [ ] Loading: Skeletons or spinners for all async content
- [ ] Empty: Clear message + suggested action
- [ ] Error: User-friendly message + retry option
- [ ] Partial: Graceful degradation if some data fails

---

## OUTPUT FORMAT

Provide your audit as:

1. **Summary** (2-3 sentences): Overall assessment
2. **Critical Issues**: Must-fix problems affecting usability
3. **Improvements**: Recommended enhancements
4. **Quick Wins**: Easy fixes with high impact
5. **Code Snippets**: Specific fixes where applicable
```

---

## Usage
Copy the prompt above into Cursor/Claude when reviewing any dashboard page file.
