import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"

interface UserPlanContextType {
  plan: string | null
  isFree: boolean
  isPro: boolean
  isAdmin: boolean
  internalRole: string | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const UserPlanContext = createContext<UserPlanContextType | null>(null)

interface UserPlanProviderProps {
  children: ReactNode
}

const ADMIN_ROLES = ["admin", "super_admin", "editor", "moderator"]

export function UserPlanProvider({ children }: UserPlanProviderProps) {
  const [plan, setPlan] = useState<string | null>(null)
  const [internalRole, setInternalRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading: authLoading, authData, refreshUser } = useAuth()

  useEffect(() => {
    if (authLoading) return

    if (user && authData) {
      const userRole = user.internal_role || null
      const isAdminUser = userRole != null && ADMIN_ROLES.includes(userRole)
      const userPlan = authData.plan || (isAdminUser ? "pro" : (user.account_type || "free"))
      setPlan(userPlan)
      setInternalRole(userRole)
      setIsLoading(false)
    } else if (!user) {
      setPlan(null)
      setInternalRole(null)
      setIsLoading(false)
    }
  }, [user, authLoading, authData])

  const isAdmin = internalRole != null && ADMIN_ROLES.includes(internalRole)
  const isFree = !isAdmin && (plan === "free" || plan === null)
  const isPro = isAdmin || plan === "pro"

  const value: UserPlanContextType = {
    plan,
    isFree,
    isPro,
    isAdmin,
    internalRole,
    isLoading,
    error: null,
    refetch: refreshUser,
  }

  return (
    <UserPlanContext.Provider value={value}>
      {children}
    </UserPlanContext.Provider>
  )
}

export function useUserPlanContext(): UserPlanContextType {
  const context = useContext(UserPlanContext)
  if (!context) {
    return {
      plan: "free",
      isFree: true,
      isPro: false,
      isAdmin: false,
      internalRole: null,
      isLoading: false,
      error: null,
      refetch: async () => {},
    }
  }
  return context
}
