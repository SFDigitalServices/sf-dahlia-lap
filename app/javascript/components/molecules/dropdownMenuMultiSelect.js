import React from 'react'
import DropdownMenuItemCheckbox from '../atoms/dropdownMenuItemCheckbox'

const dropdownMenuMultiSelect = ({ name, item, selected }) => {
  return (
    <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-multiselectable="true" aria-activedescendant tabindex="-1">
      <DropdownMenuItemCheckbox item={item} selected={selected} name={name}/>
    </ul>
  )
}

export default dropdownMenuMultiSelect
