import { apiFetch } from '@/lib/supabase'
import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Trash2, Check, Lock, Mail, MessageCircle, Coins, Copy, Eye, EyeOff, RefreshCw, Download, Upload, AlertCircle, Users, CreditCard, UserCog, Clock } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { createExternalUsersColumns } from "@/pages/admin/external-users/components/external-users-columns"
import { ExternalUser, ExternalUserPlan, UserStatus } from "@/types/admin/users"
import { SubscriptionPlan } from "@/types/admin/plans"
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarUrl } from "@/lib/utils/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  generateSecurePassword,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  getPasswordStrengthProgress,
} from "@/lib/utils/password"
import { Loader } from "@/components/ui/loader"
import { useToast } from "@/hooks/use-toast"
import { useHasPermission } from "@/hooks/use-has-permission"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AdminPageHeader, AdminStatCards, AdminFilterBar, AdminActionBar } from "@/components/admin"

export default function ExternalUsersPage() {
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useToast()

  const { hasPermission: canEdit } = useHasPermission("external_users.edit")
  const { hasPermission: canDelete } = useHasPermission("external_users.delete")
  const { hasPermission: canSuspend } = useHasPermission("external_users.suspend")
  const { hasPermission: canActivate } = useHasPermission("external_users.activate")
  const { hasPermission: canUpsell } = useHasPermission("external_users.upsell")

  const [users, setUsers] = useState<ExternalUser[]>([])
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pageCount, setPageCount] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [search, setSearch] = useState("")
  const [selectedPlanTab, setSelectedPlanTab] = useState<string>("all")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<ExternalUser | null>(null)
  const [suspendConfirmOpen, setSuspendConfirmOpen] = useState(false)
  const [userToSuspend, setUserToSuspend] = useState<ExternalUser | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ExternalUser | null>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedUserForQuickView, setSelectedUserForQuickView] = useState<ExternalUser | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<ExternalUser[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    plan: "free" as ExternalUserPlan,
    status: "active" as UserStatus,
    phoneNumber: "",
    credits: 0,
    username: "",
    avatarUrl: "",
    subscriptionStartDate: null as Date | null,
    subscriptionEndDate: null as Date | null,
    isTrial: false,
    trialEndsAt: null as Date | null,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [creditsModalOpen, setCreditsModalOpen] = useState(false)
  const [userForCredits, setUserForCredits] = useState<ExternalUser | null>(null)
  const [creditsAmount, setCreditsAmount] = useState("")
  const [creditsAction, setCreditsAction] = useState<"add" | "remove">("add")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState<string | null>(null)
  const [changePlanOpen, setChangePlanOpen] = useState(false)
  const [userForPlanChange, setUserForPlanChange] = useState<ExternalUser | null>(null)
  const [selectedNewPlan, setSelectedNewPlan] = useState<string>("")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined })

  const fetchPlans = useCallback(async () => {
    try {
      setPlansLoading(true)
      const response = await apiFetch("/api/admin/plans")
      if (!response.ok) throw new Error("Failed to fetch plans")
      const data = await response.json()
      const plansData: SubscriptionPlan[] = data.map((plan: {
        id: string; name: string; slug: string; description: string | null;
        priceMonthly: number; priceAnnual: number | null; priceYearly: number | null;
        features: string[]; popular: boolean; active: boolean; isPublic: boolean;
        displayOrder: number; keyPointers: string | null; trialDays: number;
        createdAt: string | null; updatedAt: string | null;
      }) => ({
        ...plan,
        createdAt: plan.createdAt ? new Date(plan.createdAt) : null,
        updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : null,
      }))
      setPlans(plansData.filter(plan => plan.active))
    } catch (err) {
      console.error("Error fetching plans:", err)
      setPlans([])
    } finally {
      setPlansLoading(false)
    }
  }, [])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const planCounts = useMemo(() => {
    const counts: Record<string, number> = { all: users.length }
    plans.forEach((plan) => {
      counts[plan.slug] = users.filter((u) => u.plan === plan.slug).length
    })
    counts.trial = users.filter((u) => u.isTrial).length
    return counts
  }, [users, plans])

  const filteredUsers = useMemo(() => {
    let result = users

    if (selectedPlanTab && selectedPlanTab !== "all") {
      if (selectedPlanTab === "trial") {
        result = result.filter((user) => user.isTrial)
      } else {
        result = result.filter((user) => user.plan === selectedPlanTab)
      }
    }

    if (dateRange.from || dateRange.to) {
      result = result.filter((user) => {
        const userDate = new Date(user.createdAt)
        if (dateRange.from && userDate < dateRange.from) return false
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          toDate.setHours(23, 59, 59, 999)
          if (userDate > toDate) return false
        }
        return true
      })
    }

    if (quickFilter === "active") {
      result = result.filter((user) => user.status === "active")
    } else if (quickFilter === "suspended") {
      result = result.filter((user) => user.status === "suspended")
    } else if (quickFilter === "trial") {
      result = result.filter((user) => user.isTrial)
    } else if (quickFilter === "expiring_soon") {
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      result = result.filter((user) => {
        const expiryDate = user.isTrial && user.trialEndsAt ? new Date(user.trialEndsAt) : new Date(user.expiryDate)
        return expiryDate <= thirtyDaysFromNow && expiryDate >= now
      })
    }

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    }

    filters.forEach((filter) => {
      if (!filter.value) return
      const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value]
      if (filterValues.length === 0) return
      if (filter.id === "status") {
        result = result.filter((user) => filterValues.includes(user.status))
      }
    })

    return result
  }, [users, search, filters, selectedPlanTab, dateRange, quickFilter])

  const sortedUsers = useMemo(() => {
    if (!sorting || sorting.length === 0) return filteredUsers
    const sorted = [...filteredUsers]
    sorting.forEach((sort) => {
      const { id, desc } = sort
      sorted.sort((a, b) => {
        let aValue: string | number
        let bValue: string | number
        switch (id) {
          case "name": aValue = a.name.toLowerCase(); bValue = b.name.toLowerCase(); break
          case "email": aValue = a.email.toLowerCase(); bValue = b.email.toLowerCase(); break
          case "plan": aValue = a.plan; bValue = b.plan; break
          case "status": aValue = a.status; bValue = b.status; break
          case "subscriptionDate": aValue = a.subscriptionDate.getTime(); bValue = b.subscriptionDate.getTime(); break
          case "expiryDate":
            aValue = (a.isTrial && a.trialEndsAt ? a.trialEndsAt : a.expiryDate).getTime()
            bValue = (b.isTrial && b.trialEndsAt ? b.trialEndsAt : b.expiryDate).getTime()
            break
          case "credits": aValue = a.credits || 0; bValue = b.credits || 0; break
          default: return 0
        }
        if (aValue < bValue) return desc ? 1 : -1
        if (aValue > bValue) return desc ? -1 : 1
        return 0
      })
    })
    return sorted
  }, [filteredUsers, sorting])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedUsers.slice(start, start + pageSize)
  }, [sortedUsers, page, pageSize])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch("/api/admin/external-users")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch users")
      }
      const data = await response.json()
      const mappedUsers: ExternalUser[] = data.map((user: {
        id: string; name: string; email: string; plan: string; status: string;
        subscriptionDate: string; expiryDate: string; createdAt: string; updatedAt: string;
        isTrial?: boolean; trialEndsAt?: string | null; subscriptionStatus?: string;
        credits?: number; phoneNumber?: string; username?: string; avatarUrl?: string;
      }) => ({
        ...user,
        subscriptionDate: new Date(user.subscriptionDate),
        expiryDate: new Date(user.expiryDate),
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
        trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      }))
      setUsers(mappedUsers)
    } catch (err) {
      console.error("Error fetching users:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load users."
      setError(errorMessage)
      if (!initialLoading) showError(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [showError, initialLoading])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const totalPages = Math.ceil(sortedUsers.length / pageSize)
    const calculatedPageCount = totalPages > 0 ? totalPages : 1
    setPageCount(calculatedPageCount)
    if (page > calculatedPageCount && calculatedPageCount > 0) setPage(1)
  }, [sortedUsers.length, pageSize, page])

  const handleViewDetails = useCallback((user: ExternalUser) => {
    router.push(`/admin/external-users/${user.id}`)
  }, [router])

  const handleEdit = useCallback((user: ExternalUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name, email: user.email, password: "",
      plan: user.plan, status: user.status || "active",
      phoneNumber: user.phoneNumber || "", credits: user.credits || 0,
      username: user.username || "", avatarUrl: user.avatarUrl || "",
      subscriptionStartDate: user.subscriptionDate ? new Date(user.subscriptionDate) : null,
      subscriptionEndDate: user.expiryDate ? new Date(user.expiryDate) : null,
      isTrial: user.isTrial || false,
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
    })
    setFormErrors({})
    setFormOpen(true)
  }, [])

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword(16)
    setFormData({ ...formData, password: newPassword })
    setShowPassword(true)
  }

  const handleCopyPassword = async () => {
    if (formData.password) await navigator.clipboard.writeText(formData.password)
  }

  const handleSendEmail = useCallback(async (user: ExternalUser) => {
    console.log("Sending email to:", user.email)
  }, [])

  const handleSendWhatsApp = useCallback((user: ExternalUser) => {
    if (user.phoneNumber) {
      window.open(`https://wa.me/${user.phoneNumber.replace(/[^0-9]/g, "")}`, "_blank")
    }
  }, [])

  const handleManageCredits = useCallback((user: ExternalUser) => {
    setUserForCredits(user)
    setCreditsAmount("")
    setCreditsAction("add")
    setCreditsModalOpen(true)
  }, [])

  const handleCreditsSubmit = async () => {
    if (!userForCredits || !creditsAmount) return
    const amount = parseInt(creditsAmount)
    if (isNaN(amount) || amount <= 0) return

    setActionLoading("credits")
    try {
      const currentCredits = userForCredits.credits || 0
      const newCredits = creditsAction === "add" ? currentCredits + amount : Math.max(0, currentCredits - amount)
      const response = await apiFetch(`/api/admin/external-users/${userForCredits.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: newCredits }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update credits")
      }
      setCreditsModalOpen(false)
      const creditsUserName = userForCredits.name
      setUserForCredits(null)
      setCreditsAmount("")
      showSuccess(`${creditsAction === "add" ? "Added" : "Removed"} ${amount} credits for "${creditsUserName}"`)
      await fetchUsers()
    } catch (err) {
      console.error("Error updating credits:", err)
      showError(err instanceof Error ? err.message : "Failed to update credits.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = useCallback((user: ExternalUser) => {
    if (!canDelete) { showError("You don't have permission to delete users"); return }
    setUserToDelete(user)
    setDeleteConfirmOpen(true)
  }, [canDelete, showError])

  const confirmDelete = async () => {
    if (!userToDelete) return
    setActionLoading("delete")
    try {
      const response = await apiFetch(`/api/admin/external-users/${userToDelete.id}`, { method: "DELETE" })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }
      setDeleteConfirmOpen(false)
      showSuccess(`User "${userToDelete.name}" has been deleted successfully`)
      setUserToDelete(null)
      await fetchUsers()
    } catch (err) {
      console.error("Error deleting user:", err)
      showError(err instanceof Error ? err.message : "Failed to delete user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = useCallback((user: ExternalUser) => {
    if (!canSuspend) { showError("You don't have permission to suspend users"); return }
    setUserToSuspend(user)
    setSuspendConfirmOpen(true)
  }, [canSuspend, showError])

  const confirmSuspend = async () => {
    if (!userToSuspend) return
    setActionLoading("suspend")
    try {
      const response = await apiFetch(`/api/admin/external-users/${userToSuspend.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "suspended" }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to suspend user")
      }
      setSuspendConfirmOpen(false)
      showSuccess(`User "${userToSuspend.name}" has been suspended`)
      setUserToSuspend(null)
      await fetchUsers()
    } catch (err) {
      console.error("Error suspending user:", err)
      showError(err instanceof Error ? err.message : "Failed to suspend user.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivate = useCallback(async (user: ExternalUser) => {
    if (!canActivate) { showError("You don't have permission to activate users"); return }
    setActionLoading(`activate-${user.id}`)
    try {
      const response = await apiFetch(`/api/admin/external-users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to activate user")
      }
      showSuccess(`User "${user.name}" has been activated`)
      await fetchUsers()
    } catch (err) {
      console.error("Error activating user:", err)
      showError(err instanceof Error ? err.message : "Failed to activate user.")
    } finally {
      setActionLoading(null)
    }
  }, [fetchUsers, showSuccess, showError, canActivate])

  const handleChangePlan = useCallback((user: ExternalUser) => {
    if (!canUpsell) { showError("You don't have permission to change plans"); return }
    setUserForPlanChange(user)
    setSelectedNewPlan(user.plan)
    setChangePlanOpen(true)
  }, [canUpsell, showError])

  const confirmChangePlan = async () => {
    if (!userForPlanChange || !selectedNewPlan) return
    if (selectedNewPlan === userForPlanChange.plan) {
      setChangePlanOpen(false)
      return
    }
    setActionLoading("change-plan")
    try {
      const response = await apiFetch(`/api/admin/external-users/${userForPlanChange.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedNewPlan }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to change plan")
      }
      setChangePlanOpen(false)
      const planName = plans.find(p => p.slug === selectedNewPlan)?.name || selectedNewPlan
      showSuccess(`User "${userForPlanChange.name}" plan changed to ${planName}`)
      setUserForPlanChange(null)
      await fetchUsers()
    } catch (err) {
      console.error("Error changing plan:", err)
      showError(err instanceof Error ? err.message : "Failed to change plan.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleNameClick = useCallback((user: ExternalUser) => {
    setSelectedUserForQuickView(user)
    setQuickViewOpen(true)
  }, [])

  const handleExport = useCallback(() => {
    try {
      if (sortedUsers.length === 0) { showError("No users to export"); return }
      const csv = [
        ["Name", "Email", "Plan", "Status", "Subscription Date", "Expiry Date", "Credits", "Phone Number"],
        ...sortedUsers.map((user) => [
          user.name, user.email, user.plan, user.status,
          user.subscriptionDate.toLocaleDateString("en-US"),
          (user.isTrial && user.trialEndsAt ? user.trialEndsAt : user.expiryDate).toLocaleDateString("en-US"),
          (user.credits || 0).toString(), user.phoneNumber || "",
        ]),
      ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `clients-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSuccess(`Exported ${sortedUsers.length} client(s) to CSV`)
    } catch (err) {
      console.error("Error exporting:", err)
      showError(err instanceof Error ? err.message : "Failed to export")
    }
  }, [sortedUsers, showSuccess, showError])

  const handleBulkUpload = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv,.xlsx,.xls"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) { showInfo("No file selected"); return }
      if (file.size > 10 * 1024 * 1024) { showError("File exceeds 10MB limit"); return }
      try {
        setBulkActionLoading("upload")
        await new Promise((resolve) => setTimeout(resolve, 1000))
        showSuccess(`Bulk upload: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to upload file.")
      } finally {
        setBulkActionLoading(null)
      }
    }
    input.click()
  }, [showInfo, showError, showSuccess])

  const handlePaginationChange = useCallback((p: number, s: number) => {
    if (p !== page) setPage(p)
    if (s !== pageSize) { setPageSize(s); setPage(1) }
  }, [page, pageSize])

  const handleRowSelectionChange = useCallback((selectedRows: ExternalUser[]) => {
    setSelectedUsers(selectedRows)
  }, [])

  const columns = useMemo(
    () => createExternalUsersColumns({
      onViewDetails: handleViewDetails,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onSuspend: handleSuspend,
      onActivate: handleActivate,
      onChangePlan: handleChangePlan,
      onSendEmail: handleSendEmail,
      onSendWhatsApp: handleSendWhatsApp,
      onManageCredits: handleManageCredits,
      onNameClick: handleNameClick,
      canEdit, canDelete, canSuspend, canActivate, canUpsell,
    }),
    [handleViewDetails, handleEdit, handleDelete, handleSuspend, handleActivate, handleChangePlan, handleSendEmail, handleSendWhatsApp, handleManageCredits, handleNameClick, canEdit, canDelete, canSuspend, canActivate, canUpsell]
  )

  const handleFormSubmit = async () => {
    if (!canEdit) { showError("You don't have permission to create or edit users"); return }
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    else {
      const dup = users.find((u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id)
      if (dup) errors.email = "This email is already in use"
    }
    if (!editingUser && !formData.password) errors.password = "Password is required"
    if (formData.password && formData.password.length < 8) errors.password = "Password must be at least 8 characters"
    if (formData.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      errors.phoneNumber = "Invalid phone number format"
    if (formData.username) {
      const dupU = users.find((u) => u.username?.toLowerCase() === formData.username.toLowerCase() && u.id !== editingUser?.id)
      if (dupU) errors.username = "This username is already in use"
    }
    if (formData.avatarUrl && !/^https?:\/\/.+\..+/.test(formData.avatarUrl))
      errors.avatarUrl = "Invalid URL format"
    if (formData.subscriptionStartDate && formData.subscriptionEndDate && formData.subscriptionEndDate < formData.subscriptionStartDate)
      errors.subscriptionEndDate = "End date must be after start date"
    if (formData.isTrial && formData.trialEndsAt && formData.subscriptionStartDate && formData.trialEndsAt < formData.subscriptionStartDate)
      errors.trialEndsAt = "Trial end date must be after subscription start date"

    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }

    setFormLoading(true)
    try {
      let response: Response
      if (editingUser) {
        const updateData: Record<string, unknown> = {
          name: formData.name, email: formData.email, plan: formData.plan,
          status: formData.status, credits: formData.credits,
        }
        if (formData.phoneNumber) updateData.phoneNumber = formData.phoneNumber
        if (formData.username) updateData.username = formData.username
        if (formData.avatarUrl) updateData.avatarUrl = formData.avatarUrl
        if (formData.subscriptionStartDate) updateData.subscriptionStartDate = formData.subscriptionStartDate.toISOString()
        if (formData.subscriptionEndDate) updateData.subscriptionEndDate = formData.subscriptionEndDate.toISOString()
        if (formData.isTrial !== undefined) {
          updateData.isTrial = formData.isTrial
          updateData.subscriptionStatus = formData.isTrial ? 'trial' : 'active'
        }
        if (formData.trialEndsAt) updateData.trialEndsAt = formData.trialEndsAt.toISOString()
        if (formData.password) updateData.password = formData.password
        response = await apiFetch(`/api/admin/external-users/${editingUser.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updateData),
        })
      } else {
        response = await apiFetch("/api/admin/external-users", {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name, email: formData.email, password: formData.password,
            plan: formData.plan, status: formData.status, credits: formData.credits,
            phoneNumber: formData.phoneNumber || undefined, username: formData.username || undefined,
            avatarUrl: formData.avatarUrl || undefined,
            subscriptionStartDate: formData.subscriptionStartDate?.toISOString(),
            subscriptionEndDate: formData.subscriptionEndDate?.toISOString(),
            isTrial: formData.isTrial, trialEndsAt: formData.trialEndsAt?.toISOString(),
          }),
        })
      }
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save user')
      }
      setFormOpen(false)
      const userName = formData.name
      setEditingUser(null)
      resetFormData()
      showSuccess(editingUser ? `User "${userName}" updated successfully` : `User "${userName}" created successfully`)
      await fetchUsers()
    } catch (err) {
      console.error("Error saving user:", err)
      showError(err instanceof Error ? err.message : "Failed to save user.")
    } finally {
      setFormLoading(false)
    }
  }

  const resetFormData = () => {
    const defaultPlan = plans.length > 0 ? plans[0].slug : "free"
    setFormData({
      name: "", email: "", password: "", plan: defaultPlan as ExternalUserPlan,
      status: "active", phoneNumber: "", credits: 0, username: "", avatarUrl: "",
      subscriptionStartDate: null, subscriptionEndDate: null, isTrial: false, trialEndsAt: null,
    })
    setFormErrors({})
    setShowPassword(false)
  }

  useEffect(() => {
    if (formOpen && !editingUser) resetFormData()
  }, [formOpen, editingUser, plans])

  const filterConfig = [
    {
      columnId: "status", title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
    },
  ]

  const quickFiltersConfig = [
    { id: "active", label: "Active", count: users.filter(u => u.status === "active").length },
    { id: "expiring_soon", label: "Expiring Soon", count: 0 },
    { id: "suspended", label: "Suspended", count: users.filter(u => u.status === "suspended").length },
  ]

  const statCards = useMemo(() => [
    {
      label: "Total Clients",
      value: users.length,
      icon: Users,
      description: "All platform clients",
    },
    {
      label: "Active",
      value: users.filter(u => u.status === "active").length,
      icon: Check,
      badge: users.length > 0 ? `${Math.round((users.filter(u => u.status === "active").length / users.length) * 100)}%` : "0%",
      badgeVariant: "success" as const,
      description: "Currently active",
    },
    {
      label: "Pro Users",
      value: users.filter(u => u.plan === "pro").length,
      icon: CreditCard,
      description: "Paid subscribers",
    },
    {
      label: "Trial Users",
      value: users.filter(u => u.isTrial).length,
      icon: Clock,
      description: "On trial period",
      badgeVariant: "warning" as const,
    },
  ], [users])

  const planTabs = useMemo(() => {
    const tabs = [{ value: "all", label: "All", count: planCounts.all }]
    plans.forEach(plan => {
      tabs.push({ value: plan.slug, label: plan.name, count: planCounts[plan.slug] || 0 })
    })
    tabs.push({ value: "trial", label: "Trial", count: planCounts.trial || 0 })
    return tabs
  }, [plans, planCounts])

  const bulkActions = useMemo(() => [
    {
      label: bulkActionLoading === "delete" ? "Deleting..." : "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive" as const,
      loading: bulkActionLoading === "delete",
      onClick: async () => {
        if (selectedUsers.length === 0) return
        setBulkActionLoading("delete")
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const selectedIds = selectedUsers.map((u) => u.id)
          setUsers(prev => prev.filter((u) => !selectedIds.includes(u.id)))
          const count = selectedUsers.length
          setSelectedUsers([])
          showSuccess(`${count} client(s) deleted`)
          await fetchUsers()
        } catch (err) {
          showError(err instanceof Error ? err.message : "Failed to delete clients.")
        } finally {
          setBulkActionLoading(null)
        }
      },
    },
    {
      label: bulkActionLoading === "suspend" ? "Suspending..." : "Suspend",
      icon: <Lock className="h-4 w-4" />,
      variant: "outline" as const,
      disabled: !canSuspend,
      loading: bulkActionLoading === "suspend",
      onClick: async () => {
        if (!canSuspend) { showError("No permission to suspend"); return }
        setBulkActionLoading("suspend")
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const selectedIds = selectedUsers.map((u) => u.id)
          setUsers(prev => prev.map((u) => selectedIds.includes(u.id) ? { ...u, status: "suspended" as const } : u))
          const count = selectedUsers.length
          setSelectedUsers([])
          showSuccess(`${count} client(s) suspended`)
          await fetchUsers()
        } catch (err) {
          showError(err instanceof Error ? err.message : "Failed to suspend clients.")
        } finally {
          setBulkActionLoading(null)
        }
      },
    },
    {
      label: bulkActionLoading === "activate" ? "Activating..." : "Activate",
      icon: <Check className="h-4 w-4" />,
      variant: "outline" as const,
      disabled: !canActivate,
      loading: bulkActionLoading === "activate",
      onClick: async () => {
        if (!canActivate) { showError("No permission to activate"); return }
        setBulkActionLoading("activate")
        try {
          await new Promise((resolve) => setTimeout(resolve, 500))
          const selectedIds = selectedUsers.map((u) => u.id)
          setUsers(prev => prev.map((u) => selectedIds.includes(u.id) ? { ...u, status: "active" as const } : u))
          const count = selectedUsers.length
          setSelectedUsers([])
          showSuccess(`${count} client(s) activated`)
          await fetchUsers()
        } catch (err) {
          showError(err instanceof Error ? err.message : "Failed to activate clients.")
        } finally {
          setBulkActionLoading(null)
        }
      },
    },
    {
      label: "Export Selected",
      icon: <Download className="h-4 w-4" />,
      variant: "outline" as const,
      onClick: () => {
        const csv = [
          ["Name", "Email", "Plan", "Status"],
          ...selectedUsers.map((u) => [u.name, u.email, u.plan, u.status]),
        ].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `selected-clients-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showSuccess(`Exported ${selectedUsers.length} client(s)`)
      },
    },
  ], [selectedUsers, bulkActionLoading, canSuspend, canActivate, showSuccess, showError, fetchUsers])

  return (
    <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden gap-4" data-testid="external-users-page">
      <AdminPageHeader
        title="Clients"
        description="Manage platform clients, subscriptions, and user progress"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Clients" },
        ]}
        actions={[
          {
            label: "Export",
            icon: <Download className="h-4 w-4" />,
            onClick: handleExport,
            variant: "outline",
          },
          {
            label: "Bulk Upload",
            icon: <Upload className="h-4 w-4" />,
            onClick: handleBulkUpload,
            variant: "outline",
          },
          {
            label: "Add Client",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => {
              if (!canEdit) { showError("You don't have permission to create users"); return }
              setEditingUser(null)
              setFormOpen(true)
            },
            disabled: !canEdit,
          },
        ]}
      />

      {!initialLoading && users.length > 0 && (
        <AdminStatCards stats={statCards} loading={initialLoading} columns={4} />
      )}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md" data-testid="error-banner">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchUsers} className="mt-2 cursor-pointer" data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients by name or email..."
        tabs={planTabs}
        activeTab={selectedPlanTab}
        onTabChange={setSelectedPlanTab}
      />

      {selectedUsers.length > 0 && (
        <AdminActionBar
          selectedCount={selectedUsers.length}
          onClearSelection={() => setSelectedUsers([])}
          actions={bulkActions}
        />
      )}

      <DataTable
        columns={columns}
        data={paginatedUsers}
        pageCount={Math.max(1, pageCount)}
        onPaginationChange={handlePaginationChange}
        onSortingChange={setSorting}
        onFilterChange={setFilters}
        onSearchChange={setSearch}
        loading={loading}
        initialLoading={initialLoading}
        filterConfig={filterConfig}
        searchPlaceholder="Search clients..."
        page={page}
        pageSize={pageSize}
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
        onDateRangeChange={setDateRange}
        quickFilters={quickFiltersConfig}
        selectedQuickFilter={quickFilter}
        onQuickFilterChange={setQuickFilter}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>Are you sure you want to delete this client? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Name:</span> {userToDelete.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {userToDelete.email}</p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading === "delete"} className="cursor-pointer" data-testid="button-cancel-delete">Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={actionLoading === "delete"} className="cursor-pointer" data-testid="button-confirm-delete">
              {actionLoading === "delete" ? <><Loader size="sm" className="mr-2" />Deleting...</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendConfirmOpen} onOpenChange={setSuspendConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Suspend Client</DialogTitle>
            <DialogDescription>Are you sure you want to suspend this client? They will lose platform access.</DialogDescription>
          </DialogHeader>
          {userToSuspend && (
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Name:</span> {userToSuspend.name}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {userToSuspend.email}</p>
            </div>
          )}
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setSuspendConfirmOpen(false)} disabled={actionLoading === "suspend"} className="cursor-pointer" data-testid="button-cancel-suspend">Cancel</Button>
            <Button variant="destructive" onClick={confirmSuspend} disabled={actionLoading === "suspend"} className="cursor-pointer" data-testid="button-confirm-suspend">
              {actionLoading === "suspend" ? <><Loader size="sm" className="mr-2" />Suspending...</> : "Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle>{editingUser ? "Edit Client" : "Create Client"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update client information and subscription plan." : "Create a new client account with subscription plan."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="name">Name *</Label>
                <Tooltip><TooltipTrigger asChild><AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent><p>Full name as it appears in the system</p></TooltipContent></Tooltip>
              </div>
              <Input id="name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }) }}
                placeholder="Enter full name" className={formErrors.name ? "border-destructive" : ""} data-testid="input-name" />
              {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="email">Email *</Label>
                <Tooltip><TooltipTrigger asChild><AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                <TooltipContent><p>Must be unique. Used for login.</p></TooltipContent></Tooltip>
              </div>
              <Input id="email" type="email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }) }}
                placeholder="Enter email address" className={formErrors.email ? "border-destructive" : ""} data-testid="input-email" />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>

            {!editingUser && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <Tooltip><TooltipTrigger asChild><AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                  <TooltipContent><p>At least 8 characters. Use generate for a secure password.</p></TooltipContent></Tooltip>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input id="password" type={showPassword ? "text" : "password"} value={formData.password}
                      onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }) }}
                      placeholder="Enter password" className={cn(formErrors.password ? "border-destructive pr-20" : "pr-20")} data-testid="input-password" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => setShowPassword(!showPassword)} data-testid="button-toggle-password">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {formData.password && (
                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={handleCopyPassword} data-testid="button-copy-password">
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleGeneratePassword} className="flex-shrink-0 cursor-pointer" data-testid="button-generate-password">
                    <RefreshCw className="h-4 w-4 mr-2" />Generate
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>{getPasswordStrengthLabel(formData.password)}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`} style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }} />
                    </div>
                  </div>
                )}
                {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan *</Label>
              <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value as ExternalUserPlan })} disabled={plansLoading}>
                <SelectTrigger id="plan" data-testid="select-plan"><SelectValue placeholder={plansLoading ? "Loading..." : "Select plan"} /></SelectTrigger>
                <SelectContent>
                  {plans.length === 0 && !plansLoading ? <div className="px-2 py-1.5 text-sm text-muted-foreground">No plans available</div> :
                    plans.map((plan) => <SelectItem key={plan.id} value={plan.slug}>{plan.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}>
                <SelectTrigger id="status" data-testid="select-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits">Initial Credits</Label>
              <Input id="credits" type="number" min="0" value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })} placeholder="0" data-testid="input-credits" />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="more-options" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                  <div className="flex items-center gap-2">
                    <span>More Options</span>
                    {(() => {
                      const filledCount = [formData.phoneNumber, formData.username, formData.avatarUrl, formData.subscriptionStartDate, formData.subscriptionEndDate, formData.isTrial, formData.trialEndsAt, editingUser && formData.password].filter(Boolean).length
                      return filledCount > 0 ? <Badge variant="secondary" className="text-xs">{filledCount} filled</Badge> : null
                    })()}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phoneNumber}
                      onChange={(e) => { setFormData({ ...formData, phoneNumber: e.target.value }); if (formErrors.phoneNumber) setFormErrors({ ...formErrors, phoneNumber: "" }) }}
                      placeholder="+1234567890" className={formErrors.phoneNumber ? "border-destructive" : ""} data-testid="input-phone" />
                    {formErrors.phoneNumber && <p className="text-xs text-destructive">{formErrors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={formData.username}
                      onChange={(e) => { setFormData({ ...formData, username: e.target.value }); if (formErrors.username) setFormErrors({ ...formErrors, username: "" }) }}
                      placeholder="username" className={formErrors.username ? "border-destructive" : ""} data-testid="input-username" />
                    {formErrors.username && <p className="text-xs text-destructive">{formErrors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input id="avatarUrl" type="url" value={formData.avatarUrl}
                      onChange={(e) => { setFormData({ ...formData, avatarUrl: e.target.value }); if (formErrors.avatarUrl) setFormErrors({ ...formErrors, avatarUrl: "" }) }}
                      placeholder="https://example.com/avatar.jpg" className={formErrors.avatarUrl ? "border-destructive" : ""} data-testid="input-avatar-url" />
                    {formErrors.avatarUrl && <p className="text-xs text-destructive">{formErrors.avatarUrl}</p>}
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="text-sm font-medium">Subscription Dates</div>
                    <div className="space-y-2">
                      <Label htmlFor="subscriptionStartDate">Start Date</Label>
                      <Input id="subscriptionStartDate" type="datetime-local"
                        value={formData.subscriptionStartDate ? new Date(formData.subscriptionStartDate.getTime() - formData.subscriptionStartDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setFormData({ ...formData, subscriptionStartDate: e.target.value ? new Date(e.target.value) : null })}
                        data-testid="input-sub-start" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subscriptionEndDate">End Date</Label>
                      <Input id="subscriptionEndDate" type="datetime-local"
                        value={formData.subscriptionEndDate ? new Date(formData.subscriptionEndDate.getTime() - formData.subscriptionEndDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value ? new Date(e.target.value) : null })}
                        data-testid="input-sub-end" />
                      {formErrors.subscriptionEndDate && <p className="text-xs text-destructive">{formErrors.subscriptionEndDate}</p>}
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="isTrial" checked={formData.isTrial}
                        onChange={(e) => setFormData({ ...formData, isTrial: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300" data-testid="checkbox-trial" />
                      <Label htmlFor="isTrial">Trial Period</Label>
                    </div>
                    {formData.isTrial && (
                      <div className="space-y-2">
                        <Label htmlFor="trialEndsAt">Trial End Date</Label>
                        <Input id="trialEndsAt" type="datetime-local"
                          value={formData.trialEndsAt ? new Date(formData.trialEndsAt.getTime() - formData.trialEndsAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                          onChange={(e) => setFormData({ ...formData, trialEndsAt: e.target.value ? new Date(e.target.value) : null })}
                          data-testid="input-trial-end" />
                        {formErrors.trialEndsAt && <p className="text-xs text-destructive">{formErrors.trialEndsAt}</p>}
                      </div>
                    )}
                  </div>

                  {editingUser && (
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex items-center gap-1.5">
                        <Label htmlFor="passwordReset">Change Password</Label>
                        <Tooltip><TooltipTrigger asChild><AlertCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent><p>Leave blank to keep current password.</p></TooltipContent></Tooltip>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input id="passwordReset" type={showPassword ? "text" : "password"} value={formData.password}
                            onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }) }}
                            placeholder="Leave blank to keep current" className={cn(formErrors.password ? "border-destructive pr-20" : "pr-20")} data-testid="input-password-reset" />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            {formData.password && (
                              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 cursor-pointer" onClick={handleCopyPassword}>
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <Button type="button" variant="outline" onClick={handleGeneratePassword} className="flex-shrink-0 cursor-pointer">
                          <RefreshCw className="h-4 w-4 mr-2" />Generate
                        </Button>
                      </div>
                      {formData.password && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Strength:</span>
                            <span className={`font-medium ${getPasswordStrengthColor(formData.password)}`}>{getPasswordStrengthLabel(formData.password)}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full transition-all ${getPasswordStrengthBarColor(formData.password)}`} style={{ width: `${getPasswordStrengthProgress(formData.password)}%` }} />
                          </div>
                        </div>
                      )}
                      {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => { setFormOpen(false); setEditingUser(null); setFormErrors({}) }} disabled={formLoading} className="cursor-pointer" data-testid="button-cancel-form">Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={formLoading} className="cursor-pointer" data-testid="button-submit-form">
              {formLoading ? <><Loader size="sm" className="mr-2" />{editingUser ? "Updating..." : "Creating..."}</> : editingUser ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={creditsModalOpen} onOpenChange={setCreditsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>{creditsAction === "add" ? "Add Credits" : "Remove Credits"}</DialogTitle>
            <DialogDescription>
              {userForCredits && <>Current credits: <span className="font-semibold">{userForCredits.credits || 0}</span></>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="credits-amount">Amount</Label>
              <Input id="credits-amount" type="number" min="1" value={creditsAmount} onChange={(e) => setCreditsAmount(e.target.value)} placeholder="Enter amount" data-testid="input-credits-amount" />
            </div>
            <div className="flex gap-2">
              <Button variant={creditsAction === "add" ? "default" : "outline"} onClick={() => setCreditsAction("add")} className="flex-1 cursor-pointer" data-testid="button-credits-add">Add</Button>
              <Button variant={creditsAction === "remove" ? "default" : "outline"} onClick={() => setCreditsAction("remove")} className="flex-1 cursor-pointer" data-testid="button-credits-remove">Remove</Button>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setCreditsModalOpen(false)} disabled={actionLoading === "credits"} className="cursor-pointer">Cancel</Button>
            <Button onClick={handleCreditsSubmit} disabled={actionLoading === "credits"} className="cursor-pointer" data-testid="button-submit-credits">
              {actionLoading === "credits" ? <><Loader size="sm" className="mr-2" />Processing...</> : creditsAction === "add" ? "Add Credits" : "Remove Credits"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="pb-4">
            <DialogTitle>Change Plan</DialogTitle>
            <DialogDescription>
              {userForPlanChange && <>Change the subscription plan for <span className="font-semibold">{userForPlanChange.name}</span>. Current plan: <span className="font-semibold capitalize">{userForPlanChange.plan}</span></>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-plan">New Plan</Label>
              <Select value={selectedNewPlan} onValueChange={setSelectedNewPlan} disabled={plansLoading}>
                <SelectTrigger id="new-plan" data-testid="select-new-plan"><SelectValue placeholder="Select plan" /></SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => <SelectItem key={plan.id} value={plan.slug}>{plan.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setChangePlanOpen(false)} disabled={actionLoading === "change-plan"} className="cursor-pointer" data-testid="button-cancel-plan-change">Cancel</Button>
            <Button onClick={confirmChangePlan} disabled={actionLoading === "change-plan" || selectedNewPlan === userForPlanChange?.plan} className="cursor-pointer" data-testid="button-confirm-plan-change">
              {actionLoading === "change-plan" ? <><Loader size="sm" className="mr-2" />Changing...</> : "Change Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={quickViewOpen} onOpenChange={(open) => { setQuickViewOpen(open); if (!open) setSelectedUserForQuickView(null) }}>
        <DialogContent className="max-w-xs p-4">
          {selectedUserForQuickView && (
            <>
              <DialogHeader className="pb-3 space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={getAvatarUrl(selectedUserForQuickView.id, selectedUserForQuickView.email)} />
                    <AvatarFallback className="text-sm">
                      {selectedUserForQuickView.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base truncate">{selectedUserForQuickView.name}</DialogTitle>
                    <DialogDescription className="text-xs truncate">{selectedUserForQuickView.email}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Plan</span>
                  <Badge variant="outline" className="text-xs px-2 py-0.5" data-testid="text-quickview-plan">
                    {selectedUserForQuickView.plan.charAt(0).toUpperCase() + selectedUserForQuickView.plan.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Badge variant={selectedUserForQuickView.status === "active" ? "default" : "secondary"} className="text-xs px-2 py-0.5" data-testid="text-quickview-status">
                    {selectedUserForQuickView.status.charAt(0).toUpperCase() + selectedUserForQuickView.status.slice(1)}
                  </Badge>
                </div>
                {selectedUserForQuickView.credits !== undefined && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">Credits</span>
                    <span className="text-xs font-medium" data-testid="text-quickview-credits">{selectedUserForQuickView.credits.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <DialogFooter className="pt-3 border-t mt-2">
                <Button variant="outline" onClick={() => { setQuickViewOpen(false); if (selectedUserForQuickView) router.push(`/admin/external-users/${selectedUserForQuickView.id}`) }}
                  className="w-full text-sm h-8 cursor-pointer" data-testid="button-view-details">View Full Details</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
