import React from 'react'
import PropTypes from 'prop-types'

// Visible for testing only.
export const Item = ({ item, current }) => {
  if (current) {
    return (
      <li className='current'>
        <a href={item.link} aria-current='page'>
          {item.title}
        </a>
      </li>
    )
  } else {
    return (
      <li>
        <a href={item.link}>{item.title}</a>
      </li>
    )
  }
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
  link: PropTypes.string.isRequired
})

Item.propTypes = {
  item: itemShape
}

BreadCrumbs.propTypes = {
  items: PropTypes.arrayOf(itemShape)
}

export default BreadCrumbs
