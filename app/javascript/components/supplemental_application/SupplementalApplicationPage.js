import React from 'react'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

import TabsMenu from '../molecules/TabsMenu'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

const SupplementalApplicationPage = ({ application }) => {
  const items = [
    { title: 'Short Form Application',    url: '/url1' },
    { title: 'Supplemental Information',  url: '/supplemental_applications' }
  ]

  const currentUrl = window.location.pathname

  return (
    <div>
      <SupplementalApplicationHeader
        applicationId={application.application_id}
        applicantName={application.applicant_name}
        listingId={application.listing_id}/>
      <TabsSection items={items} currentUrl={currentUrl}>
        <SupplementalApplicationContainer />
      </TabsSection>
    </div>
  )
}


export default SupplementalApplicationPage
