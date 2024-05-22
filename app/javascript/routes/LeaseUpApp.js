import React from 'react'

import FlagProvider from '@unleash/proxy-client-react'
import { BrowserRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'
import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

import LeaseUpRoutes from './LeaseUpRoutes'

const config = {
  url: process.env.UNLEASH_URL,
  clientKey: process.env.UNLEASH_TOKEN,
  refreshInterval: 15, // How often (in seconds) the client should poll the proxy for updates
  appName: 'partners' // The name of your application. It's only used for identifying your application
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
