import React from 'react'

import ApplicationDetails from './application_details/ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import { mapApplication } from '~/components/mappers/soqlToDomain'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const buildActionLinkIfNecessary = (app, fromPage) => {
  const actions = []

  if (!app.is_lottery_complete && app.application_submission_type === 'Paper')
    actions.push(<a key='edit-application' href={appPaths.toApplicationEdit(app.id)} className='primary button tiny '>Edit Application</a>)

  if (fromPage === 'new')
    actions.push(<a key='add-new-application' href={appPaths.toApplicationNew(app.listing.id)} className='button tiny margin-left--half'>Add new application</a>)

  return actions
}

const ApplicationPage = (props) => {
  const { application, fromPage } = props
  const pageHeader = {
    title: `Application ${application.name}`,
    content: (<span>Name of Listing: <a href={appPaths.toListing(application.listing.id)}>{application.listing.name}</a></span>),
    action: buildActionLinkIfNecessary(application, fromPage)
  }

  return (
    <CardLayout pageHeader={pageHeader}>
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

const mapProperties = ({ application, fromPage, fileBaseUrl }) => {
  return {
    application: mapApplication(application),
    fields: labelMapperFields,
    fromPage: fromPage,
    fileBaseUrl: fileBaseUrl
  }
}

export default mapProps(mapProperties)(ApplicationPage)
