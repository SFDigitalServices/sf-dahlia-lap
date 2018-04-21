import React from 'react'

const dropdownMenuItem = ({ item, selected, name, url }) => {
  return (
    <li className="dropdown-menu_item" role="option" aria-selected={selected}>
      <a href={url}>{item}</a>
    </li>
  )
}

export default dropdownMenuItem