import React from 'react'
import TabsMenu from '../molecules/TabsMenu'

const TabsSection = (props) => {
  return (
    <div className="tabs-section tabs-row row full-width inner--3x">
      <TabsMenu {...props} />
    </div>
  )
}

export default TabsSection
