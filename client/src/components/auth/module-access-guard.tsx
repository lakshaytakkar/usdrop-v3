import { useModuleAccess } from "@/hooks/use-module-access"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { BlueSpinner } from "@/components/ui/blue-spinner"
import { Lock, ArrowLeft, ShieldOff } from "lucide-react"

interface ModuleAccessGuardProps {
  moduleId: string
  children: React.ReactNode
}

export function ModuleAccessGuard({ moduleId, children }: ModuleAccessGuardProps) {
  const { user } = useAuth()
  const { getModuleAccess, isLoading } = useModuleAccess()
  const router = useRouter()

  if (!user) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <BlueSpinner size="lg" />
      </div>
    )
  }

  const access = getModuleAccess(moduleId)

  if (access === "hidden") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 border flex items-center justify-center mb-4">
            <ShieldOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Page Not Available</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This section is not available for your account. Contact your administrator if you believe this is an error.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/framework")}
            className="cursor-pointer"
            data-testid="button-back-framework"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Framework
          </Button>
        </div>
      </div>
    )
  }

  if (access === "locked") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Premium Content</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This section requires an upgraded plan. Speak with our team to unlock full access.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/framework")}
              className="cursor-pointer"
              data-testid="button-back-framework-locked"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => window.open("https://calendly.com", "_blank")}
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer"
              data-testid="button-upgrade-access"
            >
              Get a Callback
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
