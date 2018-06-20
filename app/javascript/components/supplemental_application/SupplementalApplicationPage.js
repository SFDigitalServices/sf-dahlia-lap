import React from 'react'

import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapFormFields, mapStatusHistory } from './mapProperties'
import { mapSupplementalApplication } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'


const SupplementalApplicationPage = ({ application, statusHistory, formFields, onSubmit }) => {
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
      <SupplementalApplicationContainer application={application}  statusHistory={statusHistory} formFields={formFields} onSubmit={onSubmit}/>
    </CardLayout>
  )
}

const mapProperties = ({application, statusHistory}) => {
  return {
    formFields: mapFormFields(application),
    application: mapSupplementalApplication(application),
    statusHistory: mapStatusHistory(statusHistory),
    onSubmit: (values) => updateApplicationAction(application, values)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
