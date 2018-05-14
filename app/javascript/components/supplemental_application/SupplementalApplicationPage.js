import React from 'react'

import SupplementalApplicationHeader from './SupplementalApplicationHeader'
import SupplementalApplicationContainer from './SupplementalApplicationContainer'

import TabsMenu from '../molecules/TabsMenu'
import TabsSection from '../organisms/TabsSection'

const SupplementalApplicationPage = ({}) => {
  const items = [
    { title: 'Short Form Application',    url: '/url1' },
    { title: 'Supplemental Information',  url: '/url2' }
  ]

  ]
  return (
    <div>
      <SupplementalApplicationHeader />
      <TabsMenu items={items}>
      <SupplementalApplicationContainer />
    </div>
  )
}


export default SupplementalApplicationPage
