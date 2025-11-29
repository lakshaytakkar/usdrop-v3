"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
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
import { sampleInternalUsers } from "../data/users"

export default function InternalUserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<InternalUser | null>(null)
  const [allUsers, setAllUsers] = useState<InternalUser[]>(sampleInternalUsers)

  useEffect(() => {
    // Find current user
    const currentUser = allUsers.find((u) => u.id === userId)
    setUser(currentUser || null)
  }, [userId, allUsers])

  // Find previous and next users
  const { prevUser, nextUser } = useMemo(() => {
    if (!user) return { prevUser: null, nextUser: null }
    
    const currentIndex = allUsers.findIndex((u) => u.id === user.id)
    const prev = currentIndex > 0 ? allUsers[currentIndex - 1] : null
    const next = currentIndex < allUsers.length - 1 ? allUsers[currentIndex + 1] : null
    
    return { prevUser: prev, nextUser: next }
  }, [user, allUsers])

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

  // Handler functions (placeholder - should be connected to actual handlers)
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit user:", user.id)
  }

  const handleSendEmail = () => {
    // TODO: Implement send email
    console.log("Send email to:", user.email)
  }

  const handleManagePermissions = () => {
    // TODO: Implement manage permissions
    console.log("Manage permissions for:", user.id)
  }

  const handleSuspend = () => {
    // TODO: Implement suspend
    console.log("Suspend user:", user.id)
  }

  const handleActivate = () => {
    // TODO: Implement activate
    console.log("Activate user:", user.id)
  }

  const handleDelete = () => {
    // TODO: Implement delete
    console.log("Delete user:", user.id)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Topbar with Back Button, Breadcrumbs and Navigation */}
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex h-14 items-center gap-2 px-3">
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
      <div className="flex-1 overflow-y-auto p-3">

      {/* User Header */}
      <Card className="mb-2">
        <CardHeader className="pb-2 px-4 pt-4">
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

          <TabsContent value="role" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role & Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Activity log will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Settings and preferences will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      </div>
    </div>
  )
}

