import React from 'react'

const TabsMenu = ({ item, url, active, itemB, urlB, activeB }) => {
  return (
    <ul className="tabs full-width-small-only" role="menubar">
      <li className="tab-title active" role="none"><a href="{url}" role="menuitem" tabindex="0" aria-selected={active}>{item}</a></li>
      <li className="tab-title" role="none"><a href="{urlB}" role="menuitem" tabindex="-1" aria-selected={activeB}>{itemB}</a></li>
    </ul>
  )
}

export default TabsMenu