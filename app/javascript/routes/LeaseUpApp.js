import React from 'react'

import FlagProvider from '@unleash/proxy-client-react'
import { BrowserRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'
import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

import LeaseUpRoutes from './LeaseUpRoutes'

const config = {
  url: process.env.UNLEASH_URL,
  clientKey: process.env.UNLEASH_TOKEN,
  refreshInterval: 0,
  appName: 'partners'
}

const LeaseUpApp = () => (
  <FlagProvider config={config}>
    <Provider>
      <Router>
        <LeaseUpRoutes />

        {/* Tracker must be placed outside of LeaseUpRoutes' Switch component. */}
        <GoogleAnalyticsTracker />
      </Router>
    </Provider>
  </FlagProvider>
)

export default LeaseUpApp
