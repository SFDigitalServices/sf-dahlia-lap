import React from 'react'
// import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import LeaseUpRoutes from './LeaseUpRoutes'

const LeaseUpApp = () => (
  <Router>
    <LeaseUpRoutes />
  </Router>
)

export default LeaseUpApp
