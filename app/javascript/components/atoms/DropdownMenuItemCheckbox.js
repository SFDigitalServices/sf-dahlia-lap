import React from 'react'

const DropdownMenuItemCheckbox = ({ value, label, onChange, selected }) => {
  return (
    <li className="dropdown-menu_item" role="option" aria-selected={selected} onClick={() => onChange(value, label, !selected) }>
      <div className="checkbox">
        <input id={label} type="checkbox" checked={selected} name={label} tab-index="1" value={value} />
        <label id={`label${label}`}>{label}</label>
      </div>
    </li>
  )
}

export default DropdownMenuItemCheckbox
