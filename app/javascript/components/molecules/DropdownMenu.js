import React from 'react'
import DropdownMenuItem from '../atoms/DropdownMenuItem'
import formUtils from '~/utils/formUtils'

class DropdownMenu extends React.Component {

  handleOnChange = (e, value, label) => this.props.onChange && this.props.onChange(value, label)

  handleOnKeyDown = (e, value, label) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      this.props.onChange && this.props.onChange(value, label)
      e.preventDefault()
    }
  }

  render() {
    const { items, value, style } = this.props

    return (
      <ul className="dropdown-menu" style={style} role="listbox" aria-activedescendant tabIndex="-1">
        {
          items &&
          items.map(formUtils.toOption).map((item, idx) => (
            <DropdownMenuItem
              key={item.value}
              {...item}
              selected={item.value === value}
              onChange={this.handleOnChange}
              onKeyDown={this.handleOnKeyDown} />)
          )
        }
      </ul>
    )
  }
}

export default DropdownMenu
