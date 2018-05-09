import React from 'react'
import classNames from 'classnames'

const Tab = ({ title, url, active }) => {
  const liClassName = classNames({
    'tab-title': true,
    'active': active
  })

  return (
    <li className={liClassName} role="none">
      <a href="{url}" role="menuitem" tabindex="0" aria-selected={active}>{title}</a>
    </li>
  )
}

const TabsMenu = ({ items, url }) => {
  return (
    <ul className="tabs full-width-small-only" role="menubar">
      {items.map((item) => <Tab key={item.url} {...item} active={item.url == url} /> )}
    </ul>
  )
}

export default TabsMenu
