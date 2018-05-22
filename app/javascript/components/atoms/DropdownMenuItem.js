import React from 'react'

const DropdownMenuItem = ({ value, label, selected, style, onChange, onKeyDown }) => {
  let liClassName = 'dropdown-menu_item'
  if (selected)
    liClassName += ' is-selected'
  if (style)
  		liClassName += ` ${style}`
  return (
    <li className={liClassName} role="option" aria-selected={selected}>
      <a tabIndex="0" onKeyDown={(e) => onKeyDown(e, value, label)} onClick={(e) => onChange(e, value, label) }>{label}</a>
    </li>
  )
}

export default DropdownMenuItem
