import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'

class DropdownMenu extends React.Component {
  render() {
    const { items, value, onChange, style } = this.props
    const onChangeHandler = (e, value, label) => onChange && onChange(value, label)
    const onKeyDownHandler = (idx) => (e, value, label) => {
      if (e.keyCode == 13 || e.keyCode == 32) {
        onChange && onChange(value, label)
        e.preventDefault()
      }
    }

    return (
      <ul className="dropdown-menu" style={style} role="listbox" aria-hidden="true" aria-activedescendant tabindex="-1">
        {
          items &&
          items.map((item, idx) => (
            <DropdownMenuItem
              key={item.value}
              {...item}
              selected={item.value == value}
              onChange={onChangeHandler}
              onKeyDown={onKeyDownHandler(idx)} />)
          )
        }
      </ul>
    )
  }
}

export default DropdownMenu
