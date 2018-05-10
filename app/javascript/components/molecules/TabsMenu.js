import React from 'react'
import classNames from 'classnames'

import ArrayUtils from '../../utils/ArrayUtils'

const Tab = ({ title, url, active, onKeyDown, linkRefs }) => {
  const liClassName = classNames({
    'tab-title': true,
    'active': active
  })

  return (
    <li className={liClassName} role="none">
      <a href={url} role="menuitem" ref={linkRefs} onKeyDown={onKeyDown} tabIndex="0" aria-selected={active}>{title}</a>
    </li>
  )
}

class TabsMenu extends React.Component {
  tabRefs = ArrayUtils.cycle([])
  keyActiveTab = 0

  handleKeyDown = (e) => {
    if (e.keyCode == 37) {        // left arrow
      this.tabRefs.prev().focus()
    } else if (e.keyCode == 39) { // right arrow
      this.tabRefs.next().focus()
    }
  }

  addTabRef = (node) => {
    this.tabRefs.push(node)
  }

  render() {
    const { items, currentUrl } = this.props

    return (
      <ul className="tabs full-width-small-only" role="menubar">
        {
          items.map((item) => (
            <Tab
              {...item}
              key={item.url}
              onKeyDown={this.handleKeyDown}
              linkRefs={this.addTabRef}
              active={item.url == currentUrl} /> )
          )
        }
      </ul>
    )
  }
}

export default TabsMenu
