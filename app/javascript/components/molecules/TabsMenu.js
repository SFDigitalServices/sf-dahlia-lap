import React from 'react'
import classNames from 'classnames'

import arrayUtils from '~/utils/arrayUtils'
import keyboard from '~/utils/keyboard'

const Tab = ({ title, url, active, onKeyDown, onFocus, onClick, linkRefs }) => {
  const liClassName = classNames({
    'tab-title': true,
    'active': active
  })

  let tabContent
  if (onClick) {
    tabContent =
      <button
        type='button'
        className='button-unstyled'
        onClick={onClick}
        role='menuitem'
        ref={linkRefs}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? '-1' : '0'}
        aria-selected={active}>
        {title}
      </button>
  } else {
    tabContent =
      <a
        href={url}
        role='menuitem'
        ref={linkRefs}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        tabIndex={active ? '-1' : '0'}
        aria-selected={active}>
        {title}
      </a>
  }

  return (
    <li className={liClassName} role='none'>
      {tabContent}
    </li>
  )
}

const TabsMenu = ({ items, currentUrl }) => {
  const tabRefs = arrayUtils.cycle([])

  const handleKeyDown = (e) => {
    keyboard.forEvent(e)
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
    <ul className='tabs full-width-small-only' role='menubar'>
      {
        items.map((item) => (
          <Tab
            {...item}
            key={item.url}
            onKeyDown={handleKeyDown}
            onFocus={handleOnFocus}
            onClick={item.onClick}
            linkRefs={addTabRef}
            active={item.url === currentUrl} />)
        )
      }
    </ul>
  )
}

export default TabsMenu
