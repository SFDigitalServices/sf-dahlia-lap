import React from 'react'

import ApplicationDetails from './ApplicationDetails'
import CardLayout from '../layouts/CardLayout'

const buildActionLinkIfNecessary = (application) => {
  if (!application.Is_Lottery_Complete &&
      application.Application_Submission_Type === 'Paper') {
    return { title: 'Edit Application', link: `/applications/${application.Id}/edit` }
  }
}

const ApplicationPage = (props) => {
  const { application } = props
  const pageHeader = {
    title: `Application ${application.Name}`,
    content: (<span>Name of Listing: <a href={`/listings/${application.Listing.Id}`}>{application.Listing.Name}</a></span>),
    action: buildActionLinkIfNecessary(application)
  }

  const tabSection = null // TODO: do wee need tabs here?

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

export default ApplicationPage
