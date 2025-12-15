"use client"

import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border bg-card p-0 md:grid md:grid-cols-2">
        <div className="p-[18px] md:p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-pulse h-6 w-32 bg-muted rounded" />
            <div className="animate-pulse h-4 w-48 bg-muted rounded" />
            <div className="animate-pulse h-9 w-full bg-muted rounded mt-4" />
            <div className="animate-pulse h-9 w-full bg-muted rounded" />
            <div className="animate-pulse h-9 w-full bg-muted rounded" />
          </div>
        </div>
        <div className="bg-muted relative hidden md:block min-h-[300px]" />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-[18px] md:p-[30px]">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
