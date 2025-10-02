import React from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import FlagProvider from '@unleash/proxy-client-react'
import { BrowserRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'
import { queryClient } from 'query/queryClient'
import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

import LeaseUpRoutes from './LeaseUpRoutes'

const config = {
  url: process.env.UNLEASH_URL,
  clientKey: process.env.UNLEASH_TOKEN,
  refreshInterval: 0,
  appName: 'partners'
}

const isDevToolsEnabled = process.env.NODE_ENV !== 'production'

const LeaseUpApp = () => (
  <QueryClientProvider client={queryClient}>
    <FlagProvider config={config}>
      <Provider>
        <Router>
          <LeaseUpRoutes />

          {/* Tracker must be placed outside of LeaseUpRoutes' Switch component. */}
          <GoogleAnalyticsTracker />
        </Router>
      </Provider>
    </FlagProvider>
    {isDevToolsEnabled ? (
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
    ) : null}
  </QueryClientProvider>
)

export default LeaseUpApp
