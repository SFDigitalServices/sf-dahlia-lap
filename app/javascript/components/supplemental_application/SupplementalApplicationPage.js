import React from 'react'

import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import CardLayout from '../layouts/CardLayout'
import { mapApplication, mapFieldUpdateComment } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'

const SupplementalApplicationPage = ({ application, statusHistory, formFields, onSubmit, fileBaseUrl }) => {
  const pageHeader = {
    title: `${application.name}: ${application.applicant.name}`,
    breadcrumbs: [
      { title: 'Lease Ups', link: '/lease_ups' },
      { title: application.listing.name, link: appPaths.toListingLeaseUps(application.listing.id) },
      { title: application.name, link: '#' }
    ]
  }

  const tabSection = {
    items: [
      { title: 'Short Form Application',    url: appPaths.toApplication(application.id) },
      { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.id) }
    ]
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <SupplementalApplicationContainer
        application={application}
        statusHistory={statusHistory}
        formFields={formFields}
        onSubmit={onSubmit}
        fileBaseUrl={fileBaseUrl}
      />
    </CardLayout>
  )
}

const mapProperties = ({application, statusHistory, file_base_url}) => {
  return {
    application: mapApplication(application),
    statusHistory: mapList(mapFieldUpdateComment,statusHistory),
    onSubmit:  (values) => updateApplicationAction(values),
    fileBaseUrl: file_base_url
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
