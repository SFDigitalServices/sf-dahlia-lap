import React from 'react'

import { Switch, Route } from 'react-router-dom'

import ApplicationPage from 'components/applications/ApplicationPage'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpListingsPage from 'components/lease_ups/LeaseUpListingsPage'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import appPaths from 'utils/appPaths'

const LeaseUpRoutes = () => (
  <Switch>
    <Route exact path={appPaths.toListingLeaseUps(':listingId')}>
      <LeaseUpApplicationsPage />
    </Route>
    <Route exact path={appPaths.toLeaseUps()}>
      <LeaseUpListingsPage />
    </Route>
    <Route exact path={appPaths.toApplicationSupplementals(':applicationId')}>
      <SupplementalApplicationPage />
    </Route>
    <Route exact path={appPaths.toLeaseUpShortForm(':applicationId')}>
      <ApplicationPage isLeaseUp />
    </Route>
    <Route exact path={appPaths.toApplication(':applicationId')}>
      <ApplicationPage />
    </Route>
  </Switch>
)

export default LeaseUpRoutes
