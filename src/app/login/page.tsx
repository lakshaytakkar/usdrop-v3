import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
