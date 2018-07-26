import React from 'react'

import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication, mapFieldUpdateComment } from '~/components/mappers/soqlToDomain'
import { updateApplicationAction } from './actions'
import { mapList } from '~/components/mappers/utils'
import CardLayout from '../layouts/CardLayout'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

const SupplementalApplicationPage = ({
  application,
  statusHistory,
  formFields,
  onSubmit,
  fileBaseUrl,
  onSavePreference,
}) => {
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
        onSavePreference={onSavePreference}
        fileBaseUrl={fileBaseUrl}
      />
    </CardLayout>
  )
}

const mapProperties = ({application, statusHistory, file_base_url}) => {
  return {
    application: mapApplication(application),
    statusHistory: mapList(mapFieldUpdateComment,statusHistory),
    fileBaseUrl: file_base_url,
    onSubmit:  (values) => updateApplicationAction(values),
    onSavePreference: (values) => (console.log('xxxx'))
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
