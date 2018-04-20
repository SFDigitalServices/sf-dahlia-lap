import React from 'react'

const dropdownMenuItemCheckbox = ({ name, label, selected }) => {
  return (
    <li className="dropdown-menu_item" role="option" aria-selected={selected}>
      <div className="checkbox">
        <input id={name} type="checkbox" name={name} tab-index="1" />
        <label for={name}>{label}</label>
      </div>
    </li>
  )
}

export default dropdownMenuItemCheckbox