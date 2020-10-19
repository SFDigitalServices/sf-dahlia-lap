import React from 'react'
import { Switch, Route } from 'react-router-dom'

import LeaseUpApplicationsPage from '~/components/lease_ups/LeaseUpApplicationsPage'
import SupplementalApplicationPage from '~/components/supplemental_application/SupplementalApplicationPage'
import LeaseUpListingsPage from '~/components/lease_ups/LeaseUpListingsPage'
import ApplicationPage from '~/components/applications/ApplicationPage'

const LeaseUpRoutes = () => (
  <Switch>
    <Route exact path='/lease-ups/listings/:listingId'>
      <LeaseUpApplicationsPage />
    </Route>
    <Route exact path='/lease-ups/listings'>
      <LeaseUpListingsPage />
    </Route>
    <Route
      exact
      path='/lease-ups/applications/:applicationId/supplemental'
      render={({ match }) => (
        // TODO: Convert SupplementalApplicationPage to functional components and use
        // hooks to get path params.
        <SupplementalApplicationPage applicationId={match.params.applicationId} />
      )}
    />
    <Route exact path='/lease-ups/applications/:applicationId'>
      <ApplicationPage isLeaseUp />
    </Route>
    <Route exact path='/applications/:applicationId'>
      <ApplicationPage />
    </Route>
  </Switch>
)

export default LeaseUpRoutes
