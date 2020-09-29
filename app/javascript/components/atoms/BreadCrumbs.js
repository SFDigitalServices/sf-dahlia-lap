import React from 'react'
import PropTypes from 'prop-types'

const Item = ({ item, current }) => {
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

  const lastItem = items[items.length - 1]
  return (
    <nav aria-label='breadcrumb'>
      <ol className='breadcrumbs'>
        {items.slice(0, items.length - 1).map((item) => (
          <Item key={item.title} item={item} />
        ))}
        <Item key={lastItem.name} item={lastItem} current />
      </ol>
    </nav>
  )
}

Item.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
  })
}

BreadCrumbs.propTypes = {
  items: PropTypes.array.isRequired
}

export default BreadCrumbs
