import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import Provider from 'context/Provider'

import LeaseUpRoutes from './LeaseUpRoutes'

const LeaseUpApp = () => (
  <Provider>
    <Router>
      <LeaseUpRoutes />
    </Router>
  </Provider>
)

export default LeaseUpApp
