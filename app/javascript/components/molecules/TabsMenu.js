import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import arrayUtils from 'utils/arrayUtils'
import keyboard from 'utils/keyboard'

// visible for testing
export const Tab = ({ tabItem, onKeyDown, onFocus, linkRefs }) => {
  const { active, url, title, onClick, renderAsRouterLink, isUpdated, className } = tabItem
  const liClassName = classNames({
    'tab-title': true,
    active
  })
  const contact_updated = 'Contact updated'

  const tabControlProps = {
    className: 'button-unstyled',
    role: 'menuitem',
    ref: linkRefs,
    onFocus,
    onKeyDown,
    tabIndex: active ? '-1' : '0',
    'aria-selected': active
  }

  let TabControl
  if (onClick) {
    TabControl = 'button'
    tabControlProps.type = 'button'
    tabControlProps.onClick = onClick
    tabControlProps.className = classNames(tabControlProps.className, className)
  } else if (renderAsRouterLink) {
    TabControl = Link
    tabControlProps.to = url
  } else {
    TabControl = 'a'
    tabControlProps.href = url
  }

  return (
    <li className={liClassName} role='none'>
      <TabControl {...tabControlProps}>
        {title}
        {isUpdated && <span className='application-contact-updated-alert'>{contact_updated}</span>}
      </TabControl>
    </li>
  )
}

const TabsMenu = ({ items }) => {
  const tabRefs = arrayUtils.cycle([])

  const handleKeyDown = (e) => {
    keyboard
      .forEvent(e)
      .on('leftArrow', () => tabRefs.prev().focus())
      .on('rightArrow', () => tabRefs.next().focus())
  }

  const addTabRef = (node) => {
    tabRefs.push(node)
  }

  // NOTE: We need this so arrow navigation and tab navigation play nice together, Fed
  const handleOnFocus = (e) => {
    const idx = tabRefs.values.indexOf(e.target)
    tabRefs.setPosition(idx)
  }

  return (
    <ul className='tabs' role='menubar'>
      {items.map((item) => (
        <Tab
          key={item.title}
          tabItem={item}
          onKeyDown={handleKeyDown}
          onFocus={handleOnFocus}
          linkRefs={addTabRef}
        />
      ))}
    </ul>
  )
}

const tabItemShape = PropTypes.shape({
  title: PropTypes.string,
  url: PropTypes.string,
  active: PropTypes.bool,
  renderAsRouterLink: PropTypes.bool,
  onClick: PropTypes.func,
  isUpdated: PropTypes.bool,
  className: PropTypes.string
})

Tab.propTypes = {
  item: tabItemShape
}

TabsMenu.propTypes = {
  items: PropTypes.arrayOf(tabItemShape)
}

export default TabsMenu
