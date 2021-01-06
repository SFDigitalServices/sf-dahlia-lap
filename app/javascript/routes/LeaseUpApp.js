import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Provider from 'context/Provider'

import LeaseUpRoutes from './LeaseUpRoutes'

/**
 * When the url changes, this will fire a Google Analytics pageview event.
 * Note that this component must be put inside a router but outside of any
 * routing switch components! That's because the path matches on everything,
 * so you don't want it to match and short-circuit the switch.
 */
const GoogleAnalyticsTracker = () => (
  <Route
    path='/'
    render={({ location }) => {
      if (typeof window.ga === 'function') {
        window.ga('set', 'page', location.pathname + location.search)
        window.ga('send', 'pageview')
      }
      return null
    }}
  />
)

const LeaseUpApp = () => (
  <Provider>
    <Router>
      <LeaseUpRoutes />

      {/* Tracker must be placed outside of LeaseUpRoutes. */}
      <GoogleAnalyticsTracker />
    </Router>
  </Provider>
)

export default LeaseUpApp
