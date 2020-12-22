import React from 'react'

import { Switch, Route } from 'react-router-dom'

import ApplicationPage from 'components/applications/ApplicationPage'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpListingsPage from 'components/lease_ups/LeaseUpListingsPage'
import ApplicationDetailsContainer from 'components/supplemental_application/ApplicationDetailsContainer'
import appPaths from 'utils/appPaths'

// List of URLs that need to be routed via rails but that conflict with react-routed
// paths. Ex: /applicaitons/flagged matches the /applications/:applicationId route, but
// should be routed via rails instead.
const conflictingPathsWithoutRouting = [
  appPaths.toApplicationsFlaggedIndexBase(),
  appPaths.toApplicationEdit(':applicationId')
]

const LeaseUpRoutes = () => (
  <Switch>
    {/* Rendering null redirects to rails routing */}
    {conflictingPathsWithoutRouting.map((path) => (
      <Route key={path} exact path={path} render={() => null} />
    ))}
    <Route exact path={appPaths.toListingLeaseUps(':listingId')}>
      <LeaseUpApplicationsPage />
    </Route>
    <Route exact path={appPaths.toLeaseUps()}>
      <LeaseUpListingsPage />
    </Route>
    <Route exact path={appPaths.toLeaseUpApplication(':applicationId')}>
      <ApplicationDetailsContainer />
    </Route>
    <Route exact path={appPaths.toApplication(':applicationId')}>
      <ApplicationPage />
    </Route>
  </Switch>
)

export default LeaseUpRoutes
