import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data considered fresh
      gcTime: 5 * 60 * 1000, // 5 minutes - keep unused data in cache
      refetchOnWindowFocus: true, // Refresh when user returns to tab
      refetchOnReconnect: true, // Refresh on network reconnect
      retry: 1, // Retry failed requests once
      networkMode: 'online' // Only fetch when online
    },
    mutations: {
      retry: 0 // Don't retry failed mutations
    }
  }
})
