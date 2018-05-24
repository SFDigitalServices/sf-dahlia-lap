import React from 'react'

import PaperApplicationForm from './application_form/PaperApplicationForm'
import CardLayout from '../layouts/CardLayout'

const ApplicationNewPageForm = ({ listing }) => {
  return (
    <PaperApplicationForm listing={listing} />
  )
}

const ApplicationNewPage = (props) => {
  const pageHeader = {
    title: `New Application: ${props.listing.Name}`
  }
  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationNewPageForm {...props} />
    </CardLayout>
  )
}

export default ApplicationNewPage
