import React from 'react'

const DropdownMenuItemCheckbox = ({ value, label, onChange, selected }) => {
  const onKeyPressHandler = (e) => {
    if (e.charCode == 13 || e.charCode == 32) {
      onChange(value, label, !selected)
      e.preventDefault()
    }
  }
  return (
    <li className="dropdown-menu_item" tabIndex="0" onKeyPress={onKeyPressHandler} role="option" aria-selected={selected} onClick={() => onChange(value, label, !selected) }>
      <div className="checkbox">
        <input id={label} type="checkbox" checked={selected} tabIndex="-1" name={label} value={value} />
        <label id={`label${label}`}>{label}</label>
      </div>
    </li>
  )
}

export default DropdownMenuItemCheckbox
