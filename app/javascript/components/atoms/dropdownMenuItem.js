import React from 'react'

const dropdownMenuItem = ({ value, label, selected, onChange }) => {
  let liClassName = 'dropdown-menu_item'
  if (selected)
    liClassName += ' is-selected'
  return (
    <li className={liClassName} role="option" aria-selected={selected}>
      <a onClick={() => onChange && onChange(value, label) }>{value}</a>
    </li>
  )
}

export default dropdownMenuItem
