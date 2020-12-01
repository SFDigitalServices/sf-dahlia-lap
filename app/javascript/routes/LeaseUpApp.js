import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import LeaseUpProvider from 'stores/LeaseUpProvider'

import LeaseUpRoutes from './LeaseUpRoutes'

const LeaseUpApp = () => (
  <LeaseUpProvider>
    <Router>
      <LeaseUpRoutes />
    </Router>
  </LeaseUpProvider>
)

export default LeaseUpApp
