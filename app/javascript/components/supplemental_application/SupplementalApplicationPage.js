import React from 'react'
import moment from 'moment'
import _ from 'lodash'

import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import appPaths from '../../utils/appPaths'
import mapProps from '../../utils/mapProps'
import CardLayout from '../layouts/CardLayout'

const SupplementalApplicationPage = ({ application, statusHistory }) => {
  const pageHeader = {
    title: `${application.number}: ${application.name}`,
    breadcrumbs: [
      { title: 'Lease Ups', link: '/lease_ups' },
      { title: 'Cameo Apartments', link: `/listings/${application.listingId}/lease_ups` },
      { title: application.number, link: '#' }
    ]
  }

  const tabSection = {
    items: [
      { title: 'Short Form Application',    url: appPaths.toApplication(application.id) },
      { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.id) }
    ],
    currentUrl:window.location.pathname
  }

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <SupplementalApplicationContainer statusHistory={statusHistory} />
    </CardLayout>
  )
}

/*********************/
/* Prop mapping      */
/*********************/

// I'm mapping properties passed to react_component to the actual Page Component,
// so we do not propagate salesforce domain objects thru our components three.
// Fed

const mapApplicationProperty = (application) => {
  return {
    id: application.Id,
    number: application.Name,
    name: application.Applicant.Name,
    listingId: application.Listing.Id
  }
}

const mapStatusHistoryItem = (item) => {
  return {
    status: item.Processing_Status,
    note: item.Processing_Comment,
    date: item.Processing_Date_Updated,
    timestamp: moment(item.Processing_Date_Updated).unix()
  }
}

const mapStatusHistoryProperty = (statusHistory) => {
  if (_.isEmpty(statusHistory))
    return []
  return statusHistory.map(mapStatusHistoryItem)
}

const mapProperties = ({application, statusHistory}) => {
  return {
    application: mapApplicationProperty(application),
    statusHistory: mapStatusHistoryProperty(statusHistory)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
