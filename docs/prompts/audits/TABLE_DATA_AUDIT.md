# Data Table UI/UX Audit Template

## Purpose
Atomic prompt for auditing data tables, filters, and list views.

---

## Prompt

```text
Act as a SENIOR PRODUCT DESIGNER + FRONTEND ENGINEER auditing a data table.

You are reviewing a data table/list view in the USDrop platform. Focus on:
- Column relevance and ordering
- Filtering and search functionality
- Pagination and performance
- Row actions and bulk operations
- Responsive behavior

---

## AUDIT CHECKLIST

### 1. Column Design
- [ ] Most important columns are leftmost
- [ ] Column headers are clear and concise
- [ ] Sortable columns have sort indicators
- [ ] Active sort direction is visible
- [ ] Column widths appropriate for content
- [ ] No unnecessary columns (remove clutter)
- [ ] Sticky header on scroll (for long tables)

### 2. Cell Content
- [ ] Text is truncated gracefully with ellipsis
- [ ] Full content available on hover/click
- [ ] Dates/times formatted consistently
- [ ] Numbers aligned right, text aligned left
- [ ] Status badges are clear and color-coded
- [ ] Links/actions are visually distinct
- [ ] Empty cells show "-" or "N/A" (not blank)

### 3. Search & Filters
- [ ] Search input is prominently placed
- [ ] Search has clear placeholder text
- [ ] Filters are logically grouped
- [ ] Active filters are visible (chips/badges)
- [ ] Clear all filters option
- [ ] Filter changes update URL (shareable)
- [ ] Debounced search (not on every keystroke)

### 4. Pagination
- [ ] Clear indication of total items
- [ ] Current page/range displayed
- [ ] Page size selector (10, 25, 50, 100)
- [ ] Previous/Next navigation
- [ ] Jump to page option for large datasets
- [ ] Preserves filters when paginating

### 5. Row Actions
- [ ] Primary action is most accessible (click row or button)
- [ ] Secondary actions in dropdown/menu
- [ ] Actions have clear icons + labels
- [ ] Destructive actions require confirmation
- [ ] Row hover state indicates interactivity
- [ ] Keyboard navigation between rows

### 6. Bulk Operations
- [ ] Select all checkbox in header
- [ ] Individual row checkboxes
- [ ] Selection count displayed
- [ ] Bulk action bar appears on selection
- [ ] Clear selection option
- [ ] Bulk actions are clearly labeled
- [ ] Confirmation for destructive bulk actions

### 7. States
- [ ] Loading: Skeleton rows or spinner
- [ ] Empty: Clear message + suggested action
- [ ] Error: Retry option available
- [ ] No results: "No matches" + clear filters suggestion
- [ ] Partial loading: Show available data

### 8. Responsive
- [ ] Horizontal scroll on mobile (not broken layout)
- [ ] Most important columns visible first
- [ ] Row actions accessible on mobile
- [ ] Filters collapse to modal/drawer on mobile
- [ ] Touch targets are adequate size

---

## COLUMN PRIORITY GUIDE

For most data tables, prioritize columns:

| Priority | Column Type | Example |
|----------|-------------|---------|
| 1 | Identifier | Name, Title, ID |
| 2 | Status | Active, Pending, etc. |
| 3 | Key Metric | Price, Count, Amount |
| 4 | Date | Created, Updated |
| 5 | Actions | Edit, Delete, View |
| Lower | Secondary Info | Description, Notes |

---

## OUTPUT FORMAT

Provide your audit as:

1. **Summary**: Overall table UX assessment
2. **Column Recommendations**: Add/remove/reorder columns
3. **Filter Improvements**: Search and filter enhancements
4. **Action Flow**: Row and bulk action improvements
5. **Responsive Fixes**: Mobile-specific issues
6. **Code Snippets**: Implementation examples
```

---

## Usage
Copy the prompt above into Cursor/Claude when reviewing any data table component.
