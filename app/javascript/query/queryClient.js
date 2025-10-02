import { QueryClient } from '@tanstack/react-query'

const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: false,
  retry: 1,
  meta: {
    source: 'react-query'
  }
}

const queryErrorHandler = (error) => {
  if (process.env.NODE_ENV === 'test') {
    return
  }

  // log query errors for observability while keeping console noise manageable
  if (error instanceof Error) {
    console.warn('Query error:', error.message)
  } else {
    console.warn('Query error:', error)
  }
}

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        ...defaultQueryOptions,
        onError: queryErrorHandler
      },
      mutations: {
        onError: queryErrorHandler
      }
    }
  })

const queryClient = createQueryClient()

export { createQueryClient, defaultQueryOptions, queryClient }
