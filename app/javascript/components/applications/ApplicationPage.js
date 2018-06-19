import React from 'react'

import ApplicationDetails from './ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication } from '~/components/mappers/soqlToDomain'

const buildActionLinkIfNecessary = (app) => {
  if (!app.isLotterComplete && app.submissionType === 'Paper') {
    return { title: 'Edit Application', link: appPaths.toApplicationEdit(app.id) }
  } else {
    return undefined
  }
}

const ApplicationPage = (props) => {
  const { application } = props
  const pageHeader = {
    title: `Application ${application.number}`,
    content: (<span>Name of Listing: <a href={appPaths.toListing(application.listing.id)}>{application.listing.name}</a></span>),
    action: buildActionLinkIfNecessary(application)
  }

  return (
    <CardLayout pageHeader={pageHeader} >
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

const mapProperties = ({application}) => {
  return {
    application: mapApplication(application)
  }
}

export default mapProps(mapProperties)(ApplicationPage)
