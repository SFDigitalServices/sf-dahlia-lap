import React from 'react'

import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '../../utils/appPaths'
import mapProps from '../../utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import mapProperties from './mapProperties'

const SupplementalApplicationPage = ({ application, statusHistory }) => {
  const pageHeader = {
    title: `${application.number}: ${application.name}`,
    breadcrumbs: [
      { title: 'Lease Ups', link: '/lease_ups' },
      { title: application.listing.name, link: appPaths.toListingLeaseUps(application.listing.id) },
      { title: application.number, link: '#' }
    ]
  }

  const tabSection = {
    items: [
      { title: 'Short Form Application',    url: appPaths.toApplication(application.id) },
      { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.id) }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <SupplementalApplicationContainer statusHistory={statusHistory} />
    </CardLayout>
  )
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
