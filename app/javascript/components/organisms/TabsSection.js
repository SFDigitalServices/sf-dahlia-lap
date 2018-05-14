import React from 'react'
import TabsMenu from '../molecules/TabsMenu'
import TabCard from './TabCard'

const TabsSection = ({ children, ...props }) => {
  return (
    <React.Fragment>
      <div className="tabs-section tabs-row row full-width inner--3x">
        <TabsMenu {...props} />
      </div>
      <TabCard>
        {children}
      </TabCard>
    </React.Fragment>
  )
}

export default TabsSection
