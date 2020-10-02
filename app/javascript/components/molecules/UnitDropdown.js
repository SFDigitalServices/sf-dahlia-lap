import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import classNames from 'classnames'

import Dropdown from '../molecules/Dropdown'
import Icon from '../atoms/Icon'

export const renderUnitOption = (
  { ami_chart_type, id, max_ami_for_qualifying_unit, priority_type, unit_number, unit_type },
  { selectValue }
) => {
  const isSelected = selectValue[0]?.value === id
  let body

  if (id) {
    body = (
      <>
        <p>
          <strong>{unit_number}</strong>
          <strong>{unit_type}</strong>
          {priority_type}
        </p>
        <p>
          {max_ami_for_qualifying_unit}% ({ami_chart_type})
        </p>
      </>
    )
  } else {
    body = <p>Select One...</p>
  }

  return (
    <li className='dropdown-menu_item' aria-selected={isSelected}>
      <a>{body}</a>
    </li>
  )
}

const UnitDropdown = ({ unit, availableUnits, onChange, disabled, placeholder }) => {
  const buttonClasses = [
    'button',
    'dropdown-button',
    'has-icon--right',
    'text-align-left',
    'expand',
    'tertiary'
  ]
  const renderUnitToggle = ({ children, getValue, ...props }) => {
    const val = getValue()[0]

    return (
      <button className={classNames(buttonClasses)} type='button' disabled={disabled}>
        <Icon icon='arrow-down' />
        {val?.unit_number ? val.unit_number : placeholder}
        <div className='ui-icon ui-small'>
          <components.ValueContainer getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </button>
    )
  }
  const mappedUnits = availableUnits.map((unit) => {
    return { value: unit.id, ...unit }
  })
  mappedUnits.unshift({ value: null, id: null })

  return (
    <Dropdown
      classNamePrefix='status-dropdown'
      items={mappedUnits}
      value={unit}
      placeholder={placeholder}
      onChange={onChange}
      renderToggle={renderUnitToggle}
      renderOption={renderUnitOption}
      disabled={disabled}
    />
  )
}

UnitDropdown.propTypes = {
  availableUnits: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  unit: PropTypes.string
}

UnitDropdown.defaultProps = {
  availableUnits: null,
  disabled: false,
  placeholder: 'Select One...',
  unit: null
}

export default UnitDropdown
