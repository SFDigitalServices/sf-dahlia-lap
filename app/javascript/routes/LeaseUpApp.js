import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import LeaseUpApplicationsPage from '~/components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpListingsPage from '~/components/lease_ups/LeaseUpListingsPage'
import ApplicationPage from '~/components/applications/ApplicationPage'

const LeaseUpApp = () => {
  return (
    <div>
      <Switch>
        <Route path='/lease-ups/listings/:listing_id'>
          <LeaseUpApplicationsPage />
        </Route>
        <Route path='/lease-ups/listings'>
          <LeaseUpListingsPage />
        </Route>
        <Route path='/lease-ups/applications/:application_id/supplemental'>
          <LeaseUpListingsPage />
        </Route>
        <Route path='/lease-ups/applications/:application_id'>
          <ApplicationPage />
        </Route>
      </Switch>
    </div>
  )
}

ReactDOM.render(
  <Router>
    <LeaseUpApp />
  </Router>,
  document.getElementById('root')
)
