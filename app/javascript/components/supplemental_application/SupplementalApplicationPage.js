import React from 'react'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

import TabsMenu from '../molecules/TabsMenu'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

import appPaths from '../../utils/appPaths'

const SupplementalApplicationPage = ({ application }) => {
  const items = [
    { title: 'Short Form Application',    url: appPaths.toApplication(application.application_id) },
    { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.application_id) }
  ]

  const currentUrl = window.location.pathname

  return (
    <div>
      <SupplementalApplicationHeader
        applicationNumber={application.application_number}
        applicantName={application.applicant_name}
        listingId={application.listing_id}/>
      <TabsSection items={items} currentUrl={currentUrl}>
        <SupplementalApplicationContainer />
      </TabsSection>
    </div>
  )
}


export default SupplementalApplicationPage
