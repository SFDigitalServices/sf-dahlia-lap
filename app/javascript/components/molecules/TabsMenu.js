import React from 'react'
import classNames from 'classnames'

import arrayUtils from '~/utils/arrayUtils'
import keyboard from '~/utils/keyboard'

const Tab = ({ title, url, active, onKeyDown, linkRefs, onFocus }) => {
  const liClassName = classNames({
    'tab-title': true,
    'active': active
  })

  return (
    <li className={liClassName} role='none'>
      <a href={url} role='menuitem' ref={linkRefs} onFocus={onFocus} onKeyDown={onKeyDown} tabIndex={active ? '-1' : '0'} aria-selected={active}>{title}</a>
    </li>
  )
}

class TabsMenu extends React.Component {
  tabRefs = arrayUtils.cycle([])

  handleKeyDown = (e) => {
    keyboard.forEvent(e)
      .on('leftArrow', (e) => this.tabRefs.prev().focus())
      .on('rightArrow', (e) => this.tabRefs.next().focus())
  }

  addTabRef = (node) => {
    this.tabRefs.push(node)
  }

  // NOTE: We need this so arrow navigation and tab navigation play nice together, Fed
  handleOnFocus = (e) => {
    const idx = this.tabRefs.values.indexOf(e.target)
    this.tabRefs.setPosition(idx)
  }

  render () {
    const { items, currentUrl } = this.props

    return (
      <ul className='tabs full-width-small-only' role='menubar'>
        {
          items.map((item) => (
            <Tab
              {...item}
              key={item.url}
              onKeyDown={this.handleKeyDown}
              onFocus={this.handleOnFocus}
              linkRefs={this.addTabRef}
              active={item.url === currentUrl} />)
          )
        }
      </ul>
    )
  }
}

export default TabsMenu
