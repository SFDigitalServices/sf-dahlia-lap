import React from 'react'

const dropdownMenu = ({ alpha, beta }) => {
  return (
    <ul class="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant tabindex="-1">
      <li class="dropdown-menu_item" role="option" aria-selected="false"><a href="#">{alpha}</a></li>
      <li class="dropdown-menu_item is-selected" role="option" aria-selected="true"><a href="#">{beta}</a></li>
    </ul>
  )
}

export default dropdownMenu
