import React from 'react'
import dropdownMenuItemCheckbox from '../atoms/dropdownMenuItemCheckbox'

const dropdownMenuMultiSelect = ({ }) => {
  return (
    <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-multiselectable="true" aria-activedescendant tabindex="-1">
      <dropdownMenuItemCheckbox/>
    </ul>
  )
}

export default dropdownMenuMultiSelect
