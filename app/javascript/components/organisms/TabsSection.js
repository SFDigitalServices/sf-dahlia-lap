import React from 'react'

import TabCard from './TabCard'
import TabsMenu from '../molecules/TabsMenu'

const TabsSection = ({ children, background, padding, ...props }) => {
  return (
    <>
      <div className={`tabs-section tabs-row full-width inner--3x bg-${background}`}>
        <TabsMenu {...props} />
      </div>
      <TabCard padding={padding}>{children}</TabCard>
    </>
  )
}

TabsSection.defaultProps = {
  background: 'snow'
}

export default TabsSection
