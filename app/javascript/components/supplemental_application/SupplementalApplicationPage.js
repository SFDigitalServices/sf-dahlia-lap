import React from 'react'
import moment from 'moment'
import _ from 'lodash'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import TabsSection from '../organisms/TabsSection'
import appPaths from '../../utils/appPaths'
import mapProps from '../../utils/mapProps'

const SupplementalApplicationPage = ({ application, statusHistory }) => {
  const tabNames = [
    { title: 'Short Form Application',    url: appPaths.toApplication(application.id) },
    { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.id) }
  ]

  const currentUrl = window.location.pathname

  return (
    <div>
      <SupplementalApplicationHeader
        applicationNumber={application.number}
        applicantName={application.name}
        listingId={application.listingId}/>
      <TabsSection items={tabNames} currentUrl={currentUrl}>
        <SupplementalApplicationContainer statusHistory={statusHistory} />
      </TabsSection>
    </div>
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
  // console.log(item.Processing_Date_Updated)
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
