import React from 'react'
import DropdownMenuItemCheckbox from '../atoms/dropdownMenuItemCheckbox'

const dropdownMenuMultiSelect = ({ items, value, onChange, style }) => {
  return (
    <ul className="dropdown-menu" style={style} role="listbox" aria-hidden="true" aria-multiselectable="true" aria-activedescendant tabindex="-1">
      {
        items &&
        items.map((item) => (
          <DropdownMenuItemCheckbox
            key={item.value}
            {...item}
            selected={item.value == value}
            onChange={onChange} />
        ))
      }
    </ul>
  )
}

export default dropdownMenuMultiSelect
