import React from 'react'

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

const mapApplicationProperties = (application) => {
  return {
    id: application.Id,
    number: application.Name,
    name: application.Applicant.Name,
    listingId: application.Listing.Id
  }
}

const mapProcessingStatus = (processingStatus) => {
  //TODO: map with right StatusList types
  switch(processingStatus) {
    case "Withdrawn":
      return "Withdrawn"
    default:
      return 'default'
  }
}

const mapStatusHistoryItem = (item) => {
  return {
    type: mapProcessingStatus(item.Processing_Status),
    note: item.Processing_Comment,
    date: item.Processing_Date_Updated
  }
}

const mapStatusHistoryProperties = (statusHistory) => {
  return statusHistory.map(mapStatusHistoryItem)
}

const mapProperties = ({application, status_history}) => {
  return {
    application: mapApplicationProperties(application),
    statusHistory: mapStatusHistoryProperties(status_history)
  }
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
