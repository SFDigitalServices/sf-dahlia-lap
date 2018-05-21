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

// I'm mapping properties passest to react_component to the actual Page,
// so we do not propagte salesforce domain specific objects thru our react components three.
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
