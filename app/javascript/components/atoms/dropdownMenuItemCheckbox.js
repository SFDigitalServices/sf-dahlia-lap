import React from 'react'

const dropdownMenuItemCheckbox = ({ name, text }) => {
  return (
    <li class="dropdown-menu_item" role="option" aria-selected="false">
      <div class="checkbox">
        <input id="{name}" type="checkbox" name="{name}" tab-index="1" />
        <label for="{name}">{text}</label>
      </div>
    </li>
  )
}

export default dropdownMenuItemCheckbox