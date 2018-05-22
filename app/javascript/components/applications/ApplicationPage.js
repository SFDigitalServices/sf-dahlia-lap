import React from 'react'

import PageHeader from '../organisms/PageHeader'
import ApplicationDetails from './ApplicationDetails'

const ApplicationPageHeader = ({ application }) => {
  return (
    <div>
      <PageHeader
        title={`Application ${application.Name}`}
        content={<span>Name of Listing: <a href={`/listings/${application.Listing.Id}`}>{application.Listing.Name}</a></span>} />
    </div>
  )
}

const ApplicationPage = (props) => {
  return (
    <div>
      <ApplicationPageHeader {...props} />
      <ApplicationDetails {...props} />
    </div>
  )
}

export default ApplicationPage
