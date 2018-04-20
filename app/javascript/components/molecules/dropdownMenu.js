import React from 'react'
import dropdownMenuItem from '../atoms/dropdownMenuItem'

const dropdownMenu = ({ item }) => {
  return (
    <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant tabindex="-1">
      <dropdownMenuItem item={item}/>
    </ul>
  )
}

export default dropdownMenu
