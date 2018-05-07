import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'

const DropdownMenu = ({ items, value, onChange, style }) => {
  return (
    <ul className="dropdown-menu" style={style} role="listbox" aria-hidden="true" aria-activedescendant tabindex="-1">
      {
        items.map((item) => (
          <DropdownMenuItem
            key={item.value}
            {...item}
            selected={item.value == value}
            onChange={onChange} />)
        )
      }
    </ul>
  )
}

export default DropdownMenu
