import React from 'react'

const TabsMenu = ({ }) => {
  return (
    <ul class="tabs full-width-small-only" role="menubar">
      <li class="tab-title active" role="none"><a href="#" role="menuitem" tabindex="0" aria-selected="true">English</a></li>
      <li class="tab-title" role="none"><a href="#" role="menuitem" tabindex="-1" aria-selected="false">Español</a></li>
    </ul>
  )
}

export default TabsMenu