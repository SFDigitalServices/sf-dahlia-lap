import React from 'react'
import DropdownMenuItem from '../atoms/dropdownMenuItem'

const dropdownMenu = ({ item, selected, name, url }) => {
  return (
    <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant tabindex="-1">
      <DropdownMenuItem item={item} selected={selected} name={name} url={url}/>
    </ul>
  )
}

export default dropdownMenu
