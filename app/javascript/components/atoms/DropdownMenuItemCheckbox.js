import React from 'react'

const DropdownMenuItemCheckbox = ({ name, item, selected }) => {
  return (
    <li className="dropdown-menu_item" role="option" aria-selected={selected}>
      <div className="checkbox">
        <input id={name} type="checkbox" name={name} tab-index="1" />
        <label htmlFor={name}>{item}</label>
      </div>
    </li>
  )
}

export default DropdownMenuItemCheckbox
