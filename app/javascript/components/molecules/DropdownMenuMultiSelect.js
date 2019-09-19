import React from 'react'
import DropdownMenuItemCheckbox from '../atoms/DropdownMenuItemCheckbox'
import { includes, remove, uniq } from 'lodash'

const DropdownMenuMultiSelect = ({ items, values, style, onChange }) => {
  // I chose to keep the state out of the component,
  // so we might be able to integrate it with mobx
  // Fed
  const onChangeHandler = (value, label, selected) => {
    let newValues = []

    // Add original values
    if (values) { newValues = [...newValues, ...values] }

    if (selected) { // add new value if selected
      newValues.push(value)
    } else { // remove value if unslected
      newValues = remove(newValues, v => v !== value)
    }

    const uniqValues = uniq(newValues) // remove duplications

    onChange(uniqValues)
  }

  return (
    <ul className='dropdown-menu' style={style} role='listbox' aria-multiselectable='true' aria-activedescendant tabIndex='-1'>
      {
        items &&
        items.map((item) => (
          <DropdownMenuItemCheckbox
            key={item.value}
            {...item}
            selected={includes(values, item.value)}
            onChange={onChangeHandler} />
        ))
      }
    </ul>
  )
}

export default DropdownMenuMultiSelect
