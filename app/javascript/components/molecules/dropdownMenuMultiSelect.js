import React from 'react'
import checkbox from '../atoms/checkbox'

const dropdownMenuMultiSelect = ({ alpha, beta }) => {
  return (
    <ul class="dropdown-menu" role="listbox" aria-hidden="true" aria-multiselectable="true" aria-activedescendant tabindex="-1">
      <li class="dropdown-menu_item" role="option" aria-selected="false"><checkbox/></li>
      <li class="dropdown-menu_item is-selected" role="option" aria-selected="true"><checkbox/></li>
    </ul>
  )
}

export default dropdownMenuMultiSelect
