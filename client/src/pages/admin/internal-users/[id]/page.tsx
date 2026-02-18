

import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "@/hooks/use-router"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  Mail, 
  Calendar, 
  User, 
  MoreVertical,
  Lock,
  Check,
  Trash2,
  UserCog
} from "lucide-react"
import { InternalUser } from "@/types/admin/users"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader } from "@/components/ui/loader"

export default function InternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const { showSuccess, showError, showInfo } = useToast()

  const [user, setUser] = useState<InternalUser | null>(null)
  const [allUsers, setAllUsers] = useState<InternalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch current user from API
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return
      
      try {
        setLoading(true)
        const response = await apiFetch(`/api/admin/internal-users/${userId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setUser(null)
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch user')
        }
        
        const userData = await response.json()
        setUser({
          ...userData,
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt),
        })
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  // Fetch all users for navigation
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await apiFetch("/api/admin/internal-users")
        if (response.ok) {
          const data = await response.json()
          const usersWithDates = data.map((u: InternalUser & { createdAt: string; updatedAt: string }) => ({
            ...u,
            createdAt: new Date(u.createdAt),
            updatedAt: new Date(u.updatedAt),
          }))
          setAllUsers(usersWithDates)
        }
      } catch (err) {
        console.error('Error fetching all users:', err)
      }
    }

    fetchAllUsers()
  }, [])

  // Find previous and next users
  const { prevUser, nextUser } = useMemo(() => {
    if (!user) return { prevUser: null, nextUser: null }
    
    const currentIndex = allUsers.findIndex((u) => u.id === user.id)
    const prev = currentIndex > 0 ? allUsers[currentIndex - 1] : null
    const next = currentIndex < allUsers.length - 1 ? allUsers[currentIndex + 1] : null
    
    return { prevUser: prev, nextUser: next }
  }, [user, allUsers])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <Loader />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">User not found</div>
        </div>
      </div>
    )
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "superadmin":
      case "admin":
        return "default" as const
      case "manager":
        return "secondary" as const
      case "executive":
        return "outline" as const
      default:
        return "outline" as const
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const
      case "suspended":
        return "destructive" as const
      case "inactive":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  // Handler functions
  const handleEdit = () => {
    router.push(`/admin/internal-users?edit=${user.id}`)
  }

  const handleSendEmail = () => {
    showInfo(`Email functionality will be implemented. User: ${user.email}`)
  }

  const handleManagePermissions = () => {
    showInfo(`Manage permissions functionality will be implemented for user: ${user.name}`)
  }

  const handleSuspend = () => {
    setSuspendConfirmOpen(true)
  }

  const confirmSuspend = async () => {
    if (!user) return
    setActionLoading("suspend")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAllUsers(
        allUsers.map((u) =>
          u.id === user.id ? { ...u, status: "suspended" as const, updatedAt: new Date() } : u
        )
      )
      setUser({ ...user, status: "suspended" as const, updatedAt: new Date() })
      setSuspendConfirmOpen(false)
      showSuccess(`User "${user.name}" has been suspended`)
    } catch (err) {
      console.error("Error suspending user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to suspend user. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = async () => {
    if (!user) return
    setActionLoading("activate")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAllUsers(
        allUsers.map((u) =>
          u.id === user.id ? { ...u, status: "active" as const, updatedAt: new Date() } : u
        )
      )
      setUser({ ...user, status: "active" as const, updatedAt: new Date() })
      showSuccess(`User "${user.name}" has been activated`)
    } catch (err) {
      console.error("Error activating user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to activate user. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = () => {
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!user) return
    setActionLoading("delete")
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const deletedUserName = user.name
      router.push("/admin/internal-users")
      showSuccess(`User "${deletedUserName}" has been deleted successfully`)
    } catch (err) {
      console.error("Error deleting user:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user. Please try again."
      showError(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex h-14 items-center gap-2 px-2">
          {/* Back Button - Small Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/internal-users")}
            className="h-8 w-8 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1 min-w-0">
            <Link href="/admin/internal-users" className="hover:text-foreground transition-colors whitespace-nowrap cursor-pointer">
              Internal Users
            </Link>
            <span>/</span>
            <span className="line-clamp-1">{user.name}</span>
          </nav>

          {/* Prev/Next Navigation on Right */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {prevUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/internal-users/${prevUser.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                Prev
              </Button>
            )}
            {nextUser && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/internal-users/${nextUser.id}`)}
                className="cursor-pointer h-7 px-2 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-2 pt-1">

      {/* User Header */}
      <Card className="mb-2">
        <CardHeader className="pb-2 px-4 pt-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(user.id, user.email)} alt={user.name} />
                <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg mb-0.5">{user.name}</CardTitle>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Button Group with Edit and More Actions */}
            <div className="flex items-center gap-1.5">
              <Button onClick={handleEdit} className="cursor-pointer" size="sm" variant="outline">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="cursor-pointer h-8 w-8">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleSendEmail} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleManagePermissions} className="cursor-pointer">
                    <UserCog className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.status === "active" ? (
                    <DropdownMenuItem onClick={handleSuspend} className="cursor-pointer">
                      <Lock className="h-4 w-4 mr-2" />
                      Suspend
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleActivate} className="cursor-pointer">
                      <Check className="h-4 w-4 mr-2" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList>
          <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
          <TabsTrigger value="role" className="cursor-pointer">Role & Permissions</TabsTrigger>
          <TabsTrigger value="activity" className="cursor-pointer">Activity</TabsTrigger>
          <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">
                      {new Date(user.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="role" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Role & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 px-4 pb-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Button onClick={handleManagePermissions} variant="outline" size="sm" className="cursor-pointer">
                    <UserCog className="h-4 w-4 mr-2" />
                    Manage Permissions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <p className="text-sm text-muted-foreground">Activity log will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-2 mt-0">
            <Card>
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">User Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-3">
                <p className="text-sm text-muted-foreground">Settings and preferences will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {user && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {user.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer">
              {actionLoading === "delete" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={suspendConfirmOpen} onOpenChange={setSuspendConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? They will not be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          {user && (
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {user.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"} className="cursor-pointer">
              {actionLoading === "suspend" ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  Suspending...
                </>
              ) : (
                "Suspend"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

