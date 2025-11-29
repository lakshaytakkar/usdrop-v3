# External Users Page Documentation

## Overview
This document provides a complete summary and copy of the External Users admin page layout and system. The page was located at `/admin/external-users` and provided comprehensive user management functionality for external users.

## Page Structure

### Route
- **Path**: `/admin/external-users`
- **File**: `src/app/admin/external-users/page.tsx`
- **Type**: Client Component (`"use client"`)

## Key Features

### 1. User Management
- View, create, edit, and delete external users
- Manage user subscriptions and plans
- Handle user status (active, inactive, suspended)
- Credit management system
- Trial period tracking

### 2. Data Table Features
- Sortable columns (name, email, plan, status, dates, credits)
- Filterable by plan and status
- Search functionality (name and email)
- Pagination with configurable page sizes (10, 20, 30, 40, 50)
- Row selection for bulk operations
- Responsive design

### 3. User Actions
- **Individual Actions**:
  - View Details (Quick View & Full Details)
  - Edit User
  - Delete User
  - Suspend/Activate User
  - Upsell Plan
  - Send Email
  - Send WhatsApp (if phone number available)
  - Manage Credits

- **Bulk Actions**:
  - Delete Selected
  - Suspend Selected
  - Activate Selected
  - Export Selected

### 4. Assignee Management
- Assign owner to manage external users
- Add multiple members with access
- Search and filter internal users for assignment
- View assignee details (quick view and full details)
- Remove assignees

## State Management

### Core State Variables
```typescript
// Data
const [users, setUsers] = useState<ExternalUser[]>(sampleExternalUsers)
const [initialLoading, setInitialLoading] = useState(true)

// Pagination
const [page, setPage] = useState(1)
const [pageSize, setPageSize] = useState(10)
const [pageCount, setPageCount] = useState(0)

// Table State
const [sorting, setSorting] = useState<SortingState>([])
const [filters, setFilters] = useState<ColumnFiltersState>([])
const [search, setSearch] = useState("")

// Selection
const [selectedUsers, setSelectedUsers] = useState<ExternalUser[]>([])

// Modals
const [formOpen, setFormOpen] = useState(false)
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
const [quickViewOpen, setQuickViewOpen] = useState(false)
const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false)
const [creditsModalOpen, setCreditsModalOpen] = useState(false)
const [addAssigneeOpen, setAddAssigneeOpen] = useState(false)
const [assigneeQuickModalOpen, setAssigneeQuickModalOpen] = useState(false)
const [assigneeDetailsModalOpen, setAssigneeDetailsModalOpen] = useState(false)

// Form Data
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  plan: "free" as ExternalUserPlan,
  phoneNumber: "",
  credits: 0,
})

// Assignees
const [assignees, setAssignees] = useState<{
  owner: InternalUser | null
  members: InternalUser[]
}>({
  owner: null,
  members: [],
})
```

## Data Processing

### Filtering Logic
```typescript
const filteredUsers = useMemo(() => {
  let result = users
  
  // Search filter (name or email)
  if (search) {
    const searchLower = search.toLowerCase()
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    )
  }
  
  // Column filters (plan, status)
  filters.forEach((filter) => {
    if (filter.id === "plan") {
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      result = result.filter((user) => filterValues.includes(user.plan))
    }
    if (filter.id === "status") {
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      result = result.filter((user) => filterValues.includes(user.status))
    }
  })
  
  return result
}, [users, search, filters])
```

### Sorting Logic
Supports sorting by:
- Name (alphabetical)
- Email (alphabetical)
- Plan
- Status
- Subscription Date
- Expiry Date (considers trial end date if applicable)
- Credits

### Pagination Logic
```typescript
const paginatedUsers = useMemo(() => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return sortedUsers.slice(start, end)
}, [sortedUsers, page, pageSize])
```

## User Plans
Available subscription plans:
- `free`
- `trial`
- `basic`
- `pro`
- `premium`
- `enterprise`

## User Status
- `active`
- `inactive`
- `suspended`

## UI Components Used

### Core Components
- `DataTable` - Main table component with toolbar and pagination
- `Dialog` - Modal dialogs for forms and confirmations
- `Button` - Action buttons
- `Input` - Form inputs
- `Select` - Dropdown selects
- `Avatar` - User avatars
- `Badge` - Status and plan badges
- `Card` - Content cards
- `Label` - Form labels

### Icons (from lucide-react)
- `Plus`, `Trash2`, `Check`, `Lock`, `UserPlus`, `Search`, `X`
- `Mail`, `MessageCircle`, `Coins`, `Copy`, `Eye`, `EyeOff`
- `RefreshCw`, `ArrowLeft`, `ChevronLeft`, `ChevronRight`
- `Download`, `Edit`, `MoreVertical`

## Modal Dialogs

### 1. Create/Edit User Dialog
**Fields**:
- Name (required)
- Email (required, validated)
- Password (required for new users, min 8 characters)
  - Password generation
  - Password strength indicator
  - Show/hide password
  - Copy password
- Phone Number (optional)
- Subscription Plan (required)
- Initial Credits (optional)

**Features**:
- Form validation
- Error messages
- Loading states
- Password strength meter

### 2. Delete Confirmation Dialog
- Shows user name and email
- Confirmation required
- Loading state during deletion

### 3. Suspend Confirmation Dialog
- Shows user name and email
- Confirmation required
- Loading state during suspension

### 4. Manage Credits Dialog
- Add or remove credits
- Shows current credit balance
- Amount input validation
- Loading state

### 5. Add Assignee Dialog
**Sections**:
- Owner Selection
  - Dropdown with internal users
  - Shows avatar, name, and email
- Members Section
  - Search functionality
  - Add/remove members
  - Shows selected members as badges
  - Search results with user details

### 6. Assignee Quick View Modal
- Small centered modal
- Shows avatar, name, email
- Role and status badges
- Link to full details

### 7. Assignee Full Details Modal
- Large modal with scroll
- Profile information
- Account details (created/updated dates)
- Permissions section
- Actions: Close, Edit, Remove

### 8. User Quick View Modal
- Small centered modal
- Shows avatar, name, email
- Plan and status badges
- Credits display (if available)
- Link to full details

### 9. Full User Details Modal
**Features**:
- Breadcrumb navigation
- Previous/Next user navigation
- Profile card with avatar and badges
- Subscription details card
- Credits card (if available)
- Account information card
- Action buttons:
  - Edit
  - Send Email
  - Send WhatsApp (if phone available)
  - Manage Credits
  - Suspend/Activate
  - Delete

## Data Table Columns

1. **Name** (sortable)
   - Avatar + name
   - Clickable for quick view
   - Truncated with max width

2. **Email** (sortable)
   - Truncated with tooltip
   - Max width constraint

3. **Plan** (sortable, filterable)
   - Badge with plan name
   - Clock icon for trial plans

4. **Trial Status**
   - Shows days remaining
   - Expired/Ending soon indicators
   - Clock icon

5. **Status** (sortable, filterable)
   - Badge with status
   - Color-coded variants

6. **Subscription Date** (sortable)
   - Formatted date

7. **Expiry Date** (sortable)
   - Considers trial end date if applicable
   - Formatted date

8. **Credits** (sortable)
   - Coin icon + amount
   - Formatted number

9. **Actions**
   - Dropdown menu with all actions
   - MoreVertical icon

## Event Handlers

### User Management
- `handleViewDetails` - Opens full details modal
- `handleEdit` - Opens edit form with user data
- `handleDelete` - Opens delete confirmation
- `handleSuspend` - Opens suspend confirmation
- `handleActivate` - Activates user (no confirmation)
- `handleUpsell` - Upgrades user to next plan tier
- `handleNameClick` - Opens quick view modal

### Communication
- `handleSendEmail` - TODO: Implement email sending
- `handleSendWhatsApp` - Opens WhatsApp with user's phone

### Credits
- `handleManageCredits` - Opens credits management dialog
- `handleCreditsSubmit` - Adds or removes credits

### Form
- `handleFormSubmit` - Validates and submits user form
- `handleGeneratePassword` - Generates secure password
- `handleCopyPassword` - Copies password to clipboard

## Filter Configuration

```typescript
const filterConfig = [
  {
    columnId: "plan",
    title: "Plan",
    options: plans.map((plan) => ({
      label: plan.charAt(0).toUpperCase() + plan.slice(1),
      value: plan,
    })),
  },
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Suspended", value: "suspended" },
    ],
  },
]
```

## Dependencies

### External Libraries
- `@tanstack/react-table` - Table functionality
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives

### Internal Components
- `@/components/data-table/data-table`
- `@/components/data-table/data-table-pagination`
- `@/components/ui/*` - UI components
- `@/lib/utils/password` - Password utilities

### Types
- `ExternalUser` - External user type
- `ExternalUserPlan` - Plan type
- `InternalUser` - Internal user type
- `SortingState`, `ColumnFiltersState` - TanStack Table types

## Data Sources

### Sample Data
- `sampleExternalUsers` - From `./data/users.ts`
- `sampleInternalUsers` - From `../internal-users/data/users.ts`

## Styling

### Layout Classes
- Flexbox layouts for responsive design
- Grid layouts for form sections
- Responsive breakpoints (sm, md, lg)
- Overflow handling for modals
- Truncation for long text

### Color Scheme
- Uses theme colors (muted-foreground, destructive, etc.)
- Badge variants for status indication
- Hover states and transitions

## Known Issues

### Infinite Loop Issue
The page had a "Maximum update depth exceeded" error related to pagination state management. This was caused by circular updates between:
1. DataTablePagination component
2. DataTable component
3. Page component state

**Attempted Fixes**:
- Added refs to track internal updates
- Used functional setState updates
- Added guards to prevent unnecessary updates
- Simplified useEffect dependencies

**Status**: Issue persisted, page was deleted to prevent blocking development.

## Future Improvements (TODOs)

1. **Email Sending**: Implement actual email sending functionality
2. **Export**: Implement export functionality for selected users
3. **API Integration**: Replace sample data with real API calls
4. **Edit Assignee**: Implement edit functionality for assignees
5. **Toast Notifications**: Add toast notifications for actions
6. **Error Handling**: Add comprehensive error handling
7. **Loading States**: Improve loading state management
8. **Optimistic Updates**: Add optimistic UI updates

## Column Definitions Component

The `external-users-columns.tsx` component defines all table columns with their renderers and configurations.

### Column Configuration Interface
```typescript
interface CreateExternalUsersColumnsProps {
  onViewDetails: (user: ExternalUser) => void
  onEdit: (user: ExternalUser) => void
  onDelete: (user: ExternalUser) => void
  onSuspend?: (user: ExternalUser) => void
  onActivate?: (user: ExternalUser) => void
  onUpsell?: (user: ExternalUser) => void
  onSendEmail?: (user: ExternalUser) => void
  onSendWhatsApp?: (user: ExternalUser) => void
  onManageCredits?: (user: ExternalUser) => void
  onNameClick?: (user: ExternalUser) => void
}
```

### Helper Functions
- `getPlanBadgeVariant(plan)` - Returns badge variant based on plan type
- `getStatusBadgeVariant(status)` - Returns badge variant based on status
- `getTrialStatus(user)` - Calculates trial status (days remaining, expired, ending soon)
- `getInitials(name)` - Extracts initials from name for avatar fallback

### Column Details

Each column includes:
- `accessorKey` or `id` - Data field identifier
- `enableSorting` - Boolean for sortability
- `header` - Header renderer with sorting controls
- `cell` - Cell renderer with data display
- `filterFn` - Custom filter function (for plan and status)

## File Structure

```
src/app/admin/external-users/
├── page.tsx                    # Main page component (DELETED)
├── components/
│   ├── external-users-columns.tsx  # Table column definitions
│   └── external-users-table.tsx     # (if exists)
└── data/
    └── users.ts                # Sample user data
```

## Related Files

- `src/types/admin/users.ts` - Type definitions
- `src/components/data-table/*` - Table components
- `src/lib/utils/password.ts` - Password utilities
- `src/app/admin/internal-users/data/users.ts` - Internal users data

## Notes

- All API calls are currently simulated with `setTimeout`
- Avatar images use external service (avatar.iran.liara.run)
- Password generation uses utility function from `@/lib/utils/password`
- Form validation includes email regex and password length checks
- Trial status calculation considers trial end date vs current date
- Page uses manual pagination, sorting, and filtering (not server-side)

---

**Documentation Created**: 2024
**Page Status**: Deleted due to infinite loop issue
**Last Updated**: When page was documented and removed

