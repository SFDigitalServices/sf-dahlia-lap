import React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

/**
 * Creates a QueryClient configured for testing.
 * Disables retries and sets minimal cache times for predictable test behavior.
 *
 * @returns {QueryClient} A QueryClient instance configured for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0
      },
      mutations: {
        retry: false
      }
    }
  })
}

/**
 * Creates a wrapper component that provides QueryClient context for testing hooks.
 *
 * @param {QueryClient} queryClient - Optional QueryClient instance. Creates a new test client if not provided.
 * @returns {Function} A wrapper component for use with renderHook
 */
export function createQueryWrapper(queryClient = createTestQueryClient()) {
  return function QueryWrapper({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

/**
 * Renders a hook with QueryClient context for testing TanStack Query hooks.
 *
 * @param {Function} hook - The hook function to render
 * @param {object} options - Additional options for renderHook
 * @param {QueryClient} options.queryClient - Optional QueryClient instance
 * @returns {object} The result from renderHook with additional queryClient reference
 */
export function renderHookWithQuery(hook, options = {}) {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options
  const wrapper = createQueryWrapper(queryClient)

  const result = renderHook(hook, { wrapper, ...renderOptions })

  return {
    ...result,
    queryClient
  }
}

export { waitFor }
