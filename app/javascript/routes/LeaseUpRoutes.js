import React from 'react'

import { Routes, Route } from 'react-router-dom'

import ApplicationPage from 'components/applications/ApplicationPage'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpListingsPage from 'components/lease_ups/LeaseUpListingsPage'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import appPaths from 'utils/appPaths'

// List of URLs that need to be routed via rails but that conflict with react-routed
// paths. Ex: /applications/flagged matches the /applications/:applicationId route, but
// should be routed via rails instead.
const conflictingPathsWithoutRouting = [
  appPaths.toApplicationsFlaggedIndexBase(),
  appPaths.toApplicationEdit(':applicationId')
]

const LeaseUpRoutes = () => (
  <Routes>
    {/* Rendering null redirects to rails routing */}
    {conflictingPathsWithoutRouting.map((path) => (
      <Route key={path} exact path={path} render={() => null} />
    ))}
    <Route
      exact
      path={appPaths.toListingLeaseUps(':listingId')}
      element={<LeaseUpApplicationsPage />}
    />
    <Route exact path={appPaths.toLeaseUps()} element={<LeaseUpListingsPage />} />
    <Route
      exact
      path={appPaths.toLeaseUpApplication(':applicationId')}
      element={<SupplementalApplicationPage />}
    />
    <Route exact path={appPaths.toApplication(':applicationId')} element={<ApplicationPage />} />
  </Routes>
)

export default LeaseUpRoutes
