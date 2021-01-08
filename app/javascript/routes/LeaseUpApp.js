import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'
import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

import LeaseUpRoutes from './LeaseUpRoutes'

const LeaseUpApp = () => (
  <Provider>
    <Router>
      <LeaseUpRoutes />

      {/* Tracker must be placed outside of LeaseUpRoutes' Switch component. */}
      <GoogleAnalyticsTracker />
    </Router>
  </Provider>
)

export default LeaseUpApp
