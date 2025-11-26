"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createInternalUsersColumns } from "./components/internal-users-columns"
import { InternalUser, InternalUserRole, UserStatus } from "@/types/admin/users"
import { sampleInternalUsers } from "./data/users"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import { QuickViewModal } from "@/components/ui/quick-view-modal"

export default function AdminInternalUsersPage() {
  const [users, setUsers] = useState<InternalUser[]>(sampleInternalUsers)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<InternalUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<InternalUser | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedUserForQuickView, setSelectedUserForQuickView] = useState<InternalUser | null>(null)

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    let result = users

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply column filters
    filters.forEach((filter) => {
      if (filter.id === "role" && Array.isArray(filter.value) && filter.value.length > 0) {
        result = result.filter((user) => filter.value.includes(user.role))
      }
      if (filter.id === "status" && Array.isArray(filter.value) && filter.value.length > 0) {
        result = result.filter((user) => filter.value.includes(user.status))
      }
    })

    return result
  }, [users, search, filters])

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredUsers.slice(start, end)
  }, [filteredUsers, page, pageSize])

  useEffect(() => {
    setPageCount(Math.ceil(filteredUsers.length / pageSize))
    setInitialLoading(false)
  }, [filteredUsers.length, pageSize])

  const handleViewDetails = (user: InternalUser) => {
    setSelectedUserForQuickView(user)
    setQuickViewOpen(true)
  }

  const handleRowClick = (user: InternalUser) => {
    setSelectedUserForQuickView(user)
    setQuickViewOpen(true)
  }

  const handleEdit = (user: InternalUser) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const handleDelete = (user: InternalUser) => {
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUsers(users.filter((u) => u.id !== userToDelete.id))
    setDeleteConfirmOpen(false)
    setUserToDelete(null)
  }

  const columns = useMemo(
    () =>
      createInternalUsersColumns({
        onViewDetails: handleViewDetails,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    []
  )

  const filterConfig = [
    {
      columnId: "role",
      title: "Role",
      options: [
        { label: "Superadmin", value: "superadmin" },
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Executive", value: "executive" },
      ],
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

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
      <div>
          <h1 className="text-lg font-semibold tracking-tight">Internal Users</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage internal users and their roles. Internal users have role-based access (admin, manager, executive).
          </p>
          </div>
        <Button onClick={() => {
          setEditingUser(null)
          setFormOpen(true)
        }}>
            <Plus className="h-4 w-4 mr-2" />
            Create User
          </Button>
      </div>

      {initialLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading users...</div>
              </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedUsers}
          pageCount={pageCount}
          onPaginationChange={(p, s) => {
            setPage(p)
            setPageSize(s)
          }}
          onSortingChange={setSorting}
          onFilterChange={setFilters}
          onSearchChange={setSearch}
          loading={loading}
          initialLoading={initialLoading}
          filterConfig={filterConfig}
          searchPlaceholder="Search users..."
          page={page}
          pageSize={pageSize}
          onAdd={() => {
            setEditingUser(null)
            setFormOpen(true)
          }}
          addButtonText="Create User"
          addButtonIcon={<Plus className="h-4 w-4" />}
          enableRowSelection={true}
          onRowSelectionChange={(selectedRows) => {
            // Handle bulk actions if needed
            console.log("Selected rows:", selectedRows)
          }}
          onRowClick={handleRowClick}
            />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {userToDelete.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {userToDelete.email}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit User Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update user information and role."
                : "Create a new internal user account."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              User form implementation would go here (name, email, role, password fields).
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFormOpen(false)
              setEditingUser(null)
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              // TODO: Handle form submission
              setFormOpen(false)
              setEditingUser(null)
            }}>
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick View Modal */}
      {selectedUserForQuickView && (
        <QuickViewModal
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
          title={selectedUserForQuickView.name}
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm font-medium">{selectedUserForQuickView.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="text-sm font-medium capitalize">{selectedUserForQuickView.role}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium capitalize">{selectedUserForQuickView.status}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleEdit(selectedUserForQuickView)
                }}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setQuickViewOpen(false)
                  handleViewDetails(selectedUserForQuickView)
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </QuickViewModal>
      )}
    </div>
  )
}
