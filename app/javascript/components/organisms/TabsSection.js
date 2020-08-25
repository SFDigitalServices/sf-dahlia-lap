import React from 'react'
import TabsMenu from '../molecules/TabsMenu'
import TabCard from './TabCard'

const TabsSection = ({ children, background, padding, ...props }) => {
  return (
    <React.Fragment>
      <div className={`tabs-section tabs-row full-width inner--3x bg-${background} stretch-to-fill-medium-down`}>
        <TabsMenu {...props} />
      </div>
      <TabCard padding={padding}>
        {children}
      </TabCard>
    </React.Fragment>
  )
}

TabsSection.defaultProps = {
  background: 'snow'
}

export default TabsSection
