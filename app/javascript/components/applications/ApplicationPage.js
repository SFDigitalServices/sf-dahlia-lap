import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useEffectOnMount, useQueryParamBoolean } from '~/utils/customHooks'
import { getShortFormApplication } from '~/components/lease_ups/shortFormActions'
import ApplicationDetails from './application_details/ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
import appPaths from '~/utils/appPaths'
import Loading from '~/components/molecules/Loading'
import PropTypes from 'prop-types'

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
  const showAddBtn = useQueryParamBoolean('showAddBtn')

  useEffectOnMount(() => {
    getShortFormApplication(applicationId)
      .then((response) => {
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
    if (application) {
      pageHeader = {
        title: `${application.name}: ${application.applicant.name}`,
        breadcrumbs: [
          { title: 'Lease Ups', link: appPaths.toLeaseUps(), renderAsRouterLink: true },
          {
            title: application.listing.name,
            link: appPaths.toListingLeaseUps(application.listing.id),
            renderAsRouterLink: true
          },
          { title: application.name, link: '#' }
        ]
      }
    } else {
      const emptyBreadCrumb = {
        title: '',
        link: '#'
      }

      pageHeader = {
        // making this a div with a non-blocking space allows us to keep the header height
        // without actually rendering any text.
        title: <div>&nbsp;</div>,
        breadcrumbs: [
          { title: 'Lease Ups', link: appPaths.toLeaseUps(), renderAsRouterLink: true },
          emptyBreadCrumb,
          emptyBreadCrumb
        ]
      }
    }

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
