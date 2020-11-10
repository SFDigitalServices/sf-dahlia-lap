import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

// Visible for testing only.
export const Item = ({ item, current }) => {
  const ariaCurrentValue = current ? 'page' : undefined

  return (
    <li className={classNames({ current: current })}>
      {item.renderAsRouterLink ? (
        <NavLink to={item.link} aria-current={ariaCurrentValue}>
          {item.title}
        </NavLink>
      ) : (
        <a href={item.link} aria-current={ariaCurrentValue}>
          {item.title}
        </a>
      )}
    </li>
  )
}

const BreadCrumbs = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumbs'>
        {items.map((item, idx) => (
          <Item key={idx} item={item} current={idx === items.length - 1} />
        ))}
      </ol>
    </nav>
  )
}

const itemShape = PropTypes.shape({
  title: PropTypes.node.isRequired,
  link: PropTypes.node.isRequired,
  renderAsRouterLink: PropTypes.bool
})

Item.propTypes = {
  item: itemShape
}

BreadCrumbs.propTypes = {
  items: PropTypes.arrayOf(itemShape)
}

export default BreadCrumbs
