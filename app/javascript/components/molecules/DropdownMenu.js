import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'
import formUtils from '~/utils/formUtils'

const DropdownMenu = ({ items, value, style, classes, onChange }) => {
  const handleOnChange = (e, val, label) => onChange && onChange(val, label)

  const handleOnKeyDown = (e, val, label) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onChange && onChange(val, label)
      e.preventDefault()
    }
  }

  return (
    <ul
      className={`dropdown-menu ${classes ? classes.join(' ') : ''}`}
      style={style}
      role='listbox'
      tabIndex='-1'
      aria-activedescendant>
      {
        items &&
        items.map(formUtils.toOption).map((item, idx) => (
          <DropdownMenuItem
            key={item.value}
            {...item}
            style={item.style}
            selected={item.value === value}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown} />
        ))
      }
    </ul>
  )
}

export default DropdownMenu
