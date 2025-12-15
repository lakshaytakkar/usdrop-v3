"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const hasRendered = useRef(false)

  // Prevent any redirect loops by ensuring this page doesn't trigger redirects
  useEffect(() => {
    // Mark that we've rendered to prevent re-renders
    if (!hasRendered.current) {
      hasRendered.current = true
      // Mark this page as a 404 page so auth context can detect it
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-not-found', 'true')
      }
    }

    // Prevent any navigation or refresh attempts
    return () => {
      // Cleanup on unmount
    }
  }, [])

  // Prevent re-renders by using a stable reference
  const handleGoHome = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-not-found')
    }
    router.push("/")
  }

  const handleGoBack = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-not-found')
    }
    router.back()
  }

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4"
      data-not-found="true"
    >
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <span className="text-4xl font-bold text-destructive">404</span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We couldn't find the page you requested. It may have been deleted, moved, or the URL might be incorrect.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={handleGoHome}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

