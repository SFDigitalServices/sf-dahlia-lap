import React from 'react'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

import TabsMenu from '../molecules/TabsMenu'
import TabsSection from '../organisms/TabsSection'
import TabCard from '../organisms/TabCard'

import appPaths from '../../utils/appPaths'

const SupplementalApplicationPage = ({ application }) => {
  const items = [
    { title: 'Short Form Application',    url: appPaths.toApplication(application.Id) },
    { title: 'Supplemental Information',  url: appPaths.toApplicationSupplementals(application.Id) }
  ]

  const currentUrl = window.location.pathname

  return (
    <div>
      <SupplementalApplicationHeader
        applicationNumber={application.Name}
        applicantName={application.Applicant.Name}
        listing={application.Listing}/>
      <TabsSection items={items} currentUrl={currentUrl}>
        <SupplementalApplicationContainer />
      </TabsSection>
    </div>
  )
}


export default SupplementalApplicationPage
