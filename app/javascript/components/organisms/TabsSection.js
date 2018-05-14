import React from 'react'
import TabsMenu from '../molecules/TabsMenu'
import TabCard from './TabCard'

const TabsSection = ({ children, ...props }) => {
  return (
    <div className="tabs-section tabs-row row full-width inner--3x">
      <TabsMenu {...props} />
      <TabCard>
        {children}
      </TabCard>
    </div>
  )
}

export default TabsSection
