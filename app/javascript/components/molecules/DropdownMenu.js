import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'

class DropdownMenu extends React.Component {

  handleOnChange = (e, value, label) => this.props.onChange && this.props.onChange(value, label)

  handleOnKeyDown = (e, value, label) => {
    if (e.keyCode == 13 || e.keyCode == 32) {
      this.props.onChange && this.props.onChange(value, label)
      e.preventDefault()
    }
  }

  render() {
    const { items, value, style } = this.props

    return (
      <ul className="dropdown-menu" style={style} role="listbox" aria-hidden="false" aria-activedescendant tabindex="-1">
        {
          items &&
          items.map((item, idx) => (
            <DropdownMenuItem
              key={item.value}
              {...item}
              selected={item.value == value}
              onChange={this.handleOnChange}
              onKeyDown={this.handleOnKeyDown} />)
          )
        }
      </ul>
    )
  }
}

export default DropdownMenu
