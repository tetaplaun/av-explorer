import { useState, useCallback, useRef } from "react"

interface AsyncOperationState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retryCount: number
}

interface UseAsyncOperationOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error) => void
  onSuccess?: (data: any) => void
}

export function useAsyncOperation<T = any>(options: UseAsyncOperationOptions = {}) {
  const { maxRetries = 3, retryDelay = 1000, onError, onSuccess } = options

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null,
    retryCount: 0,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState({
      data: null,
      loading: false,
      error: null,
      retryCount: 0,
    })
  }, [])

  const execute = useCallback(
    async (operation: () => Promise<T>, retryCount = 0): Promise<T | null> => {
      // Cancel any ongoing operation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller for this operation
      abortControllerRef.current = new AbortController()

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        retryCount,
      }))

      try {
        const result = await operation()

        setState({
          data: result,
          loading: false,
          error: null,
          retryCount,
        })

        onSuccess?.(result)
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))

        // Don't retry if operation was aborted
        if (err.name === "AbortError") {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: null,
          }))
          return null
        }

        console.error(`Async operation failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, err)

        // Check if we should retry
        if (retryCount < maxRetries) {
          timeoutRef.current = setTimeout(() => {
            execute(operation, retryCount + 1)
          }, retryDelay * Math.pow(2, retryCount)) // Exponential backoff

          return null
        }

        // Max retries reached, set error state
        setState({
          data: null,
          loading: false,
          error: err,
          retryCount,
        })

        onError?.(err)
        return null
      }
    },
    [maxRetries, retryDelay, onError, onSuccess]
  )

  const retry = useCallback(() => {
    if (state.error && !state.loading) {
      // Retry with the same operation (this assumes the operation is stored somewhere)
      // In practice, you'd want to pass the operation to retry
      console.warn("Retry called but no operation to retry. Use execute() instead.")
    }
  }, [state.error, state.loading])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    ...state,
    execute,
    retry,
    reset,
    cleanup,
    isAborted: abortControllerRef.current?.signal.aborted ?? false,
  }
}

// Specialized hook for file operations with better error handling
export function useFileOperation() {
  return useAsyncOperation({
    maxRetries: 2,
    retryDelay: 500,
    onError: (error) => {
      console.error("File operation failed:", error)
      // Could show a toast notification here
    },
  })
}

// Hook for debounced operations
export function useDebouncedOperation<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { execute, ...asyncState } = useAsyncOperation()

  const debouncedExecute = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      return new Promise<ReturnType<T> | null>((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const result = await execute(() => operation(...args))
          resolve(result as ReturnType<T> | null)
        }, delay)
      })
    },
    [operation, delay, execute]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  return {
    ...asyncState,
    execute: debouncedExecute,
    cancel,
  }
}
