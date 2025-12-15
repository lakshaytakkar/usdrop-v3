import { ResetPasswordForm } from "@/components/reset-password-form"
import { Logo } from "@/components/logo"

export default function ResetPasswordPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
