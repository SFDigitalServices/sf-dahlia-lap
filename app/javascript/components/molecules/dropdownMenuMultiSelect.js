import React from 'react'
import DropdownMenuItemCheckbox from '../atoms/dropdownMenuItemCheckbox'
import _ from 'lodash'

// const dropdownMenuMultiSelect = ({ items, values, onChange, style }) => {

class dropdownMenuMultiSelect extends React.Component {
  // state = { values: {} }
  //
  // onChangeHandler = (key, value) => {
  //   this.setState((prevState) => {
  //     let newValues = {...prevState.values }
  //     newValues[key] = value
  //     return { values: newValues }
  //   })
  // }

  render() {
    const { items, values, onChange, style } = this.props
    return (
      <ul className="dropdown-menu" style={style} role="listbox" aria-hidden="true" aria-multiselectable="true" aria-activedescendant tabindex="-1">
        {
          items &&
          items.map((item) => (
            <DropdownMenuItemCheckbox
              key={item.value}
              {...item}
              selected={_.includes(values, item.value)}
              onChange={onChange} />
          ))
        }
      </ul>
    )
  }
}

export default dropdownMenuMultiSelect
