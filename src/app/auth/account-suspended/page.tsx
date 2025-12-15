"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function AccountSuspendedPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3">
                  <svg
                    className="h-6 w-6 text-amber-600 dark:text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Account Suspended</h1>
                  <p className="text-muted-foreground mt-2">
                    Your account has been suspended. If you believe this is an error, please contact support for assistance.
                  </p>
                </div>
                <Field>
                  <div className="space-y-2 w-full">
                    <Link href="/contact">
                      <Button className="w-full">
                        Contact Support
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Back to login
                      </Button>
                    </Link>
                  </div>
                </Field>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your account status, our support team is here to help.
                </p>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





