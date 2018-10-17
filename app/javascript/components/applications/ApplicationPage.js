import React from 'react'

import ApplicationDetails from './application_details/ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const buildActionLinkIfNecessary = (app, showAddBtn) => {
  const actions = []

  if (!app.is_lottery_complete && app.application_submission_type === 'Paper') { actions.push(<a key='edit-application' href={appPaths.toApplicationEdit(app.id)} className='primary button tiny'>Edit Application</a>) }

  if (showAddBtn === 'true') { actions.push(<a key='add-new-application' href={appPaths.toApplicationNew(app.listing.id)} className='button tiny margin-left--half'>Add new application</a>) }

  return actions
}

const ApplicationPage = (props) => {
  const { application, showAddBtn } = props

  let pageHeader = {}
  let tabSection = false

  if (application.is_snapshot) {
    pageHeader = {
      title: `${application.name}: ${application.applicant.name}`,
      breadcrumbs: [
        { title: 'Lease Ups', link: appPaths.toLeaseUps() },
        { title: application.listing.name, link: appPaths.toListingLeaseUps(application.listing.id) },
        { title: application.name, link: '#' }
      ]
    }

    tabSection = {
      items: [
        { title: 'Short Form Application', url: appPaths.toApplication(application.id) },
        { title: 'Supplemental Information', url: appPaths.toApplicationSupplementals(application.id) }
      ]
    }
  } else {
    pageHeader = {
      title: `Application ${application.name}`,
      content: (<span>Name of Listing: <a href={appPaths.toListing(application.listing.id)}>{application.listing.name}</a></span>),
      action: buildActionLinkIfNecessary(application, showAddBtn)
    }
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

const mapProperties = ({ application, showAddBtn, fileBaseUrl }) => {
  return {
    application: application,
    fields: labelMapperFields,
    showAddBtn: showAddBtn,
    fileBaseUrl: fileBaseUrl
  }
}

export default mapProps(mapProperties)(ApplicationPage)
