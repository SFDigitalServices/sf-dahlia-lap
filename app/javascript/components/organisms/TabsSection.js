import React from 'react'
import TabsMenu from '../molecules/TabsMenu'

const TabsSection = ({ item, url, active, itemB, urlB, activeB }) => {
  return (
    <div className="tabs-section tabs-row row full-width inner--3x">
      <TabsMenu item={item} url={url} active={active} itemB={itemB} urlB={urlB} activeB={activeB} />
    </div>
  )
}

export default TabsSection
