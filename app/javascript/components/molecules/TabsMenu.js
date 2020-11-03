import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import arrayUtils from 'utils/arrayUtils'
import keyboard from 'utils/keyboard'

// visible for testing
export const Tab = ({ tabItem, onKeyDown, onFocus, linkRefs }) => {
  const { active, url, title, onClick, renderAsRouterLink } = tabItem
  const liClassName = classNames({
    'tab-title': true,
    active: active
  })

  let tabContent
  if (onClick) {
    tabContent = (
      <button
        type='button'
        className='button-unstyled'
        onClick={onClick}
        role='menuitem'
        ref={linkRefs}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? '-1' : '0'}
        aria-selected={active}
      >
        {title}
      </button>
    )
  } else {
    tabContent = renderAsRouterLink ? (
      <Link
        to={url}
        className='button-unstyled'
        role='menuitem'
        ref={linkRefs}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? '-1' : '0'}
        aria-selected={active}
      >
        {title}
      </Link>
    ) : (
      <a
        href={url}
        className='button-unstyled'
        role='menuitem'
        ref={linkRefs}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? '-1' : '0'}
        aria-selected={active}
      >
        {title}
      </a>
    )
  }

  return (
    <li className={liClassName} role='none'>
      {tabContent}
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
  onClick: PropTypes.func
})

Tab.propTypes = {
  item: tabItemShape
}

TabsMenu.propTypes = {
  items: PropTypes.arrayOf(tabItemShape)
}

export default TabsMenu
