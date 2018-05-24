import React from 'react'

import ApplicationDetails from './ApplicationDetails'
import CardLayout from '../layouts/CardLayout'

const ApplicationPage = (props) => {
  const { application } = props
  const pageHeader = {
    title: `Application ${application.Name}`,
    content: (<span>Name of Listing: <a href={`/listings/${application.Listing.Id}`}>{application.Listing.Name}</a></span>)
  }

  const tabSection = null

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

export default ApplicationPage
