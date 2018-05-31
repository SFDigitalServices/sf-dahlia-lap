import React from 'react'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'
import TabsSection from '../organisms/TabsSection'
import appPaths from '../../utils/appPaths'
import mapProps from '../../utils/mapProps'
import mapProperties from './mapProperties'

const SupplementalApplicationPage = ({ application, statusHistory, formFields }) => {
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
        listing={application.listing}/>
      <TabsSection items={tabNames} currentUrl={currentUrl}>
        <SupplementalApplicationContainer statusHistory={statusHistory} formFields={formFields}/>
      </TabsSection>
    </div>
  )
}

export default mapProps(mapProperties)(SupplementalApplicationPage)
