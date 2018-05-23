import React from 'react'

// import PageHeader from '../organisms/PageHeader'
import ApplicationDetails from './ApplicationDetails'
import CardLayout from '../layouts/CardLayout'
// import mapProps from '../../utils/mapProps'

// const ApplicationPageHeader = ({ application }) => {
//   return (
//     <div>
//       <PageHeader
//         title={`Application ${application.Name}`}
//         content={<span>Name of Listing: <a href={`/listings/${application.Listing.Id}`}>{application.Listing.Name}</a></span>} />
//     </div>
//   )
// }

const ApplicationPage = (props) => {
  const { application } = props
  const pageHeader = {
    title: `Application ${application.Name}`,
    content: (<span>Name of Listing: <a href={`/listings/${application.Listing.Id}`}>{application.Listing.Name}</a></span>)
  }

  const tabSection = null

  return (
    <CardLayout pageHeader={pageHeader} tabSection={tabSection}>
      <ApplicationDetails {...props} />
    </CardLayout>
  )
}

// const mapProperties = ({application, statusHistory}) => {
//   return {
//     application: mapApplicationProperty(application),
//     statusHistory: mapStatusHistoryProperty(statusHistory)
//   }
// }

export default ApplicationPage
