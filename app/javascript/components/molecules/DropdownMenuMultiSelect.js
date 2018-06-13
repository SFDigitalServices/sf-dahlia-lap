import React from 'react'
import DropdownMenuItemCheckbox from '../atoms/DropdownMenuItemCheckbox'
import _ from 'lodash'

class DropdownMenuMultiSelect extends React.Component {

  // I chose to keep the state out of the component,
  // so we might be able to integrate it with mobx
  // Fed
  onChangeHandler = (value, label, selected) => {
    let newValues = []

    // Add original values
    if (this.props.values)
      newValues = newValues.concat(this.props.values)

    if (selected) // add new value if selected
      newValues.push(value)
    else          //remove value if unslected
      newValues = _.remove(newValues, v => v != value)

    const uniqValues = _.uniq(newValues) // remove duplications

    this.props.onChange(uniqValues)
  }

  render() {
    const { items, values, onChange, style } = this.props
    return (
      <ul className="dropdown-menu" style={style} role="listbox" aria-multiselectable="true" aria-activedescendant tabIndex="-1">
        {
          items &&
          items.map((item) => (
            <DropdownMenuItemCheckbox
              key={item.value}
              {...item}
              selected={_.includes(values, item.value)}
              onChange={this.onChangeHandler} />
          ))
        }
      </ul>
    )
  }
}

export default DropdownMenuMultiSelect
