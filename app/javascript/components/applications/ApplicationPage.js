import React from 'react'
import { isEmpty } from 'lodash'
import ApplicationDetails from './application_details/ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import mapProps from '~/utils/mapProps'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const buildActionLinkIfNecessary = (app, showAddBtn) => {
  const actions = []

  if (!app.listing.is_lottery_complete && app.application_submission_type === 'Paper') { actions.push(<a key='edit-application' href={appPaths.toApplicationEdit(app.id)} className='primary button tiny'>Edit Application</a>) }

  if (showAddBtn === 'true') { actions.push(<a key='add-new-application' href={appPaths.toApplicationNew(app.listing.id)} className='button tiny margin-left--half'>Add new application</a>) }

  return actions
}

const ApplicationPage = (props) => {
  const { application, showAddBtn, isLeaseUp } = props

  let pageHeader = {}
  let tabSection = false

  if (!application) {
    pageHeader = {
      title: 'Application',
      content: (<span>Name of Listing:</span>)
    }
  // If the lease_up=true param is passed in the url, then we should display the application as if it's
  // a part of the lease up section.
  } else if (isLeaseUp) {
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

  if (!application) window.alert('The application you requested could not be found.')

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      {!isEmpty(application) && <ApplicationDetails {...props} />}
    </CardLayout>
  )
}

const mapProperties = ({ application, showAddBtn, fileBaseUrl, isLeaseUp }) => {
  return {
    application: application,
    fields: labelMapperFields,
    showAddBtn: showAddBtn,
    fileBaseUrl: fileBaseUrl,
    isLeaseUp: isLeaseUp
  }
}

export default mapProps(mapProperties)(ApplicationPage)
