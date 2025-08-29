"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Bug, Copy, Download } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showToast?: boolean
  componentName?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || "Component"
    console.error(`${componentName} ErrorBoundary caught an error:`, error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Show toast notification if enabled
    if (this.props.showToast) {
      // We'll show toast in the fallback component
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo)

    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      this.reportError(error, errorInfo)
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In a real app, you would send this to an error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // For now, just store in localStorage for debugging
    const existingReports = JSON.parse(localStorage.getItem("errorReports") || "[]")
    existingReports.push(errorReport)
    // Keep only last 10 reports
    if (existingReports.length > 10) {
      existingReports.shift()
    }
    localStorage.setItem("errorReports", JSON.stringify(existingReports))
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  resetError: () => void
}

export function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  const handleCopyError = async () => {
    if (!error) return

    const errorDetails = {
      component: "Unknown",
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
    } catch (err) {
      console.error("Failed to copy error details:", err)
    }
  }

  const handleExportReport = () => {
    if (!error) return

    const errorReport = {
      component: "Unknown",
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      environment: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        nodeEnv: process.env.NODE_ENV,
      },
    }

    const blob = new Blob([JSON.stringify(errorReport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `error-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An unexpected error occurred in the application. Please try refreshing the page or
            contact support if the problem persists.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-destructive text-sm">Error Details:</div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyError}
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportReport}
                    className="h-6 px-2 text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="text-sm font-mono text-muted-foreground break-all bg-background p-2 rounded">
                {error.message}
              </div>
              {process.env.NODE_ENV === "development" && error.stack && (
                <details className="mt-2">
                  <summary className="text-sm font-medium cursor-pointer text-muted-foreground">
                    Stack Trace
                  </summary>
                  <pre className="text-xs mt-2 p-2 bg-background rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Bug className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  Troubleshooting Tips:
                </p>
                <ul className="text-blue-600 dark:text-blue-400 mt-1 space-y-1 text-xs">
                  <li>• Try refreshing the page</li>
                  <li>• Clear your browser cache</li>
                  <li>• Check your internet connection</li>
                  <li>• Try restarting the application</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={resetError}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo)

    // In a real app, you might want to send this to an error reporting service
    // reportError(error, errorInfo)
  }
}

// Async error boundary for handling promise rejections
export function withAsyncErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
) {
  return class AsyncErrorBoundary extends React.Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error("AsyncErrorBoundary caught an error:", error, errorInfo)
    }

    resetError = () => {
      this.setState({ hasError: false, error: undefined })
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          const FallbackComponent = fallback
          return <FallbackComponent error={this.state.error} resetError={this.resetError} />
        }
        return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
      }

      return <Component {...this.props} />
    }
  }
}
