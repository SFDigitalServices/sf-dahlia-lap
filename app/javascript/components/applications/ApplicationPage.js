import React, { useContext, useState } from 'react'

import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { getShortFormApplication } from 'components/lease_ups/shortFormActions'
import Loading from 'components/molecules/Loading'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import { onApplicationPageLoaded } from 'stores/leaseUpActionCreators'
import { LeaseUpDispatchContext, LeaseUpStateContext } from 'stores/LeaseUpProvider'
import appPaths from 'utils/appPaths'
import { useEffectOnMount, useQueryParamBoolean } from 'utils/customHooks'

import CardLayout from '../layouts/CardLayout'
import ApplicationDetails from './application_details/ApplicationDetails'
import labelMapperFields from './application_details/applicationDetailsFieldsDesc'

const buildActionLinkIfNecessary = (app, showAddBtn) => {
  const actions = []

  if (!app.listing.is_lottery_complete && app.application_submission_type === 'Paper') {
    actions.push(
      <a
        key='edit-application'
        href={appPaths.toApplicationEdit(app.id)}
        className='primary button tiny'
      >
        Edit Application
      </a>
    )
  }

  if (showAddBtn) {
    actions.push(
      <a
        key='add-new-application'
        href={appPaths.toApplicationNew(app.listing.id)}
        className='button tiny margin-left--half'
      >
        Add new application
      </a>
    )
  }

  return actions
}

const ApplicationPage = ({ isLeaseUp = false }) => {
  const [application, setApplication] = useState(null)
  const [fileBaseUrl, setFileBaseUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  const { applicationId } = useParams()
  const { breadcrumbData } = useContext(LeaseUpStateContext)
  const dispatch = useContext(LeaseUpDispatchContext)
  const showAddBtn = useQueryParamBoolean('showAddBtn')

  useEffectOnMount(() => {
    getShortFormApplication(applicationId)
      .then((response) => {
        onApplicationPageLoaded(dispatch, response.application, response.application?.listing)
        setApplication(response.application)
        setFileBaseUrl(response.fileBaseUrl)
      })
      .catch((e) => {
        // Alert window pauses state updates so we set loading to false instead of
        // waiting for the finally block
        setLoading(false)
        window.alert('The application you requested could not be found.')
      })
      .finally(() => setLoading(false))
  })

  let pageHeader = {}
  let tabSection

  if (isLeaseUp) {
    pageHeader = getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)

    tabSection = {
      items: [
        {
          title: 'Short Form Application',
          url: appPaths.toLeaseUpShortForm(applicationId),
          active: true,
          renderAsRouterLink: true
        },
        {
          title: 'Supplemental Information',
          url: appPaths.toApplicationSupplementals(applicationId),
          renderAsRouterLink: true
        }
      ]
    }
  } else {
    pageHeader = {
      title: `Application ${application?.name ?? ''}`,
      content: (
        <span>
          Name of Listing:{' '}
          {application && (
            <a href={appPaths.toListing(application.listing.id)}>{application.listing.name}</a>
          )}
        </span>
      ),
      action: application && buildActionLinkIfNecessary(application, showAddBtn)
    }
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <Loading isLoading={loading} renderChildrenWhileLoading={false} loaderViewHeight='100vh'>
        {!isEmpty(application) && (
          <ApplicationDetails
            application={application}
            fileBaseUrl={fileBaseUrl}
            fields={labelMapperFields}
          />
        )}
      </Loading>
    </CardLayout>
  )
}

ApplicationPage.propTypes = {
  isLeaseUp: PropTypes.bool
}

export default ApplicationPage
