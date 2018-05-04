import React from 'react'

const dropdownMenuItemCheckbox = ({ value, label, onChange, selected }) => {
  return (
    <li className="dropdown-menu_item" role="option" aria-selected={selected}>
      <div className="checkbox" onClick={() => onChange && onChange(value, label) }>
        <input id={label} type="checkbox" checked={selected} name={label} tab-index="1" value={value} />
        <label for={label}>{label}</label>
      </div>
    </li>
  )
}

export default dropdownMenuItemCheckbox
