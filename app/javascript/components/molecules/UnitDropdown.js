import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import Icon from '../atoms/Icon'
import Dropdown from '../molecules/Dropdown'

export const renderUnitOption = (
  { ami_chart_type, id, max_ami_for_qualifying_unit, priority_type, unit_number, unit_type },
  { selectValue }
) => {
  const isSelected = selectValue[0]?.value === id
  let body

  if (id) {
    body = (
      <>
        <div className='columns small-2'>
          <strong>{unit_number}</strong>
        </div>
        <div className='columns small-10'>
          <div>
            <strong className='padding-right'>{unit_type}</strong>
            {priority_type}
          </div>
          <div>
            {max_ami_for_qualifying_unit}% ({ami_chart_type})
          </div>
        </div>
      </>
    )
  } else {
    body = <p className='padding-left padding-right margin-bottom-none'>Select One...</p>
  }

  return (
    <li className='dropdown-menu_item dropdown-menu_unit row' aria-selected={isSelected}>
      <a>{body}</a>
    </li>
  )
}

const UnitDropdown = ({ unit, availableUnits, onChange, disabled, placeholder, id }) => {
  const buttonClasses = [
    'dropdown-button',
    'dropdown-select',
    'has-icon--right',
    'text-align-left',
    'expand'
  ]
  const renderUnitToggle = ({ children, getValue, ...props }) => {
    const val = getValue()[0]

    const callToAction = availableUnits.length > 0 ? placeholder : 'No Units Available'
    return (
      <button className={classNames(buttonClasses)} type='button' disabled={disabled} id={id}>
        <Icon icon='arrow-down' size='small' />
        {val?.unit_number ?? callToAction}
        <div className='ui-icon ui-small'>
          <components.ValueContainer getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </button>
    )
  }

  const mappedUnits = [...availableUnits]
    .sort((unitA, unitB) => (unitA.unit_number > unitB.unit_number ? 1 : -1))
    .map((unit) => {
      return { value: unit.id, ...unit }
    })
  mappedUnits.unshift({ value: null, id: null })

  return (
    <Dropdown
      classNamePrefix='unit-dropdown'
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
  unit: PropTypes.string,
  id: PropTypes.string
}

UnitDropdown.defaultProps = {
  availableUnits: [],
  disabled: false,
  placeholder: 'Select One...',
  unit: null,
  id: 'form-lease_unit'
}

export default UnitDropdown
