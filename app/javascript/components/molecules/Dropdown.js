import React from 'react'
import { find } from 'lodash'
import Select, { components } from 'react-select'

const formatOptionLabel = ({ value, label, style }) => {
  let liClassName = 'dropdown-menu_item'
  // if (selected) { liClassName += ' is-selected' }
  if (style) { liClassName += ` ${style}` }
  return (
    <li className={liClassName}>
      <a>
        {label}
      </a>
    </li>
  )
}

const Dropdown = ({
  prompt,
  items,
  value,
  styles,
  buttonClasses,
  wrapperClasses,
  menuClasses = [],
  disabled,
  multiple,
  onChange
}) => {
  let selectedItem = find(items, { value })

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 0
    })
  }

  const customValueContainer = ({ children, getValue, ...props }) => {
    const val = getValue()[0]
    return (
      <button
        className={`button dropdown-button has-icon--right text-align-left ${buttonClasses ? buttonClasses.join(' ') : ''} ${val?.style ? val.style : 'tertiary'}`}
        disabled={disabled}
        type='button'>
        <span className='ui-icon ui-small'>
          <svg>
            <use xlinkHref='#i-arrow-down' />
          </svg>
        </span>
        {val?.label ? val.label : 'status'}
        <div className='ui-icon ui-small'>
          <components.ValueContainer getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </button>
    )
  }

  return (
    <Select
      placeholder={null}
      isClearable={false}
      isSearchable={false}
      className='dropdown'
      onChange={(value) => onChange(value.value)}
      defaultValue={selectedItem}
      styles={customStyles}
      formatOptionLabel={formatOptionLabel}
      components={{
        ValueContainer: customValueContainer,
        SingleValue: () => null,
        IndicatorsContainer: () => null
      }}
      options={items}
    />
  )
}

export default Dropdown
