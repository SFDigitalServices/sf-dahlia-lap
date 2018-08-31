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

  render () {
    const { items, value, style, classes } = this.props

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
              onChange={this.handleOnChange}
              onKeyDown={this.handleOnKeyDown} />)
          )
        }
      </ul>
    )
  }
}

export default DropdownMenu
