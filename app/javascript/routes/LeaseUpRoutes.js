import React from 'react'
// import ReactDOM from 'react-dom'
import { Switch, Route } from 'react-router-dom'

import LeaseUpApplicationsPage from '~/components/lease_ups/LeaseUpApplicationsPage'
import SupplementalApplicationPage from '~/components/supplemental_application/SupplementalApplicationPage'
import LeaseUpListingsPage from '~/components/lease_ups/LeaseUpListingsPage'
import ApplicationPage from '~/components/applications/ApplicationPage'

const LeaseUpRoutes = () => (
  <Switch>
    <Route exact path='/listings/lease-ups/:listingId/applications'>
      <LeaseUpApplicationsPage />
    </Route>
    <Route exact path='/listings/lease-ups'>
      <LeaseUpListingsPage />
    </Route>
    <Route
      exact
      path='/applications/:applicationId/supplementals'
      render={({ match }) => (
        // TODO: Convert SupplementalApplicationPage to functional components and use
        // hooks to get path params.
        <SupplementalApplicationPage applicationId={match.params.applicationId} />
      )}
    />
    <Route exact path='/applications/:applicationId'>
      <ApplicationPage />
    </Route>
  </Switch>
)

export default LeaseUpRoutes
