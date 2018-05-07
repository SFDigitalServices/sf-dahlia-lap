import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'

const DropdownMenu = ({ children }) => {
  return (
    <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant tabIndex="-1">
      {children}
    </ul>
  )
}

export default DropdownMenu
