"use client"

import React from "react"
import { SectionError } from "@/components/ui/section-error"

interface SectionErrorBoundaryProps {
  children: React.ReactNode
  className?: string
}

interface SectionErrorBoundaryState {
  hasError: boolean
  errorMessage: string | null
}

/**
 * Section-level error boundary.
 * Catches render-time errors in a subtree and replaces it with a calm `SectionError`,
 * keeping the surrounding page shell intact.
 */
export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error: unknown): SectionErrorBoundaryState {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return { hasError: true, errorMessage: message }
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("SectionErrorBoundary caught an error:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <SectionError
          description="We couldn’t load this section right now. You can try again or continue using the rest of the page."
          onRetry={this.handleReset}
          className={this.props.className}
        />
      )
    }

    return this.props.children
  }
}


