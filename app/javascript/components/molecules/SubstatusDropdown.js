import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import classNames from 'classnames'

import {
  LEASE_UP_STATUS_VALUES,
  LEASE_UP_SUBSTATUS_OPTIONS,
  LEASE_UP_SUBSTATUS_VALUES
} from '~/utils/statusUtils'

import Icon from '../atoms/Icon'
import Dropdown from '../molecules/Dropdown'

const renderSubstatusOption = ({ value, label }, { selectValue }) => {
  const isSelected = selectValue[0]?.value === value
  return (
    <li className={'dropdown-menu_item'} aria-selected={isSelected}>
      <a>{label}</a>
    </li>
  )
}

const SubstatusDropdown = ({
  status,
  subStatus,
  onChange,
  disabled,
  placeholder,
  expand,
  hasError
}) => {
  const buttonClasses = [
    'button',
    'dropdown-button',
    'substatus',
    'has-icon--right',
    'text-align-left',
    { 'expand': expand },
    { 'error': hasError }
  ]
  const renderStatusToggle = ({ children, getValue, ...props }) => {
    const val = getValue()[0]

    return (
      <button
        className={classNames(buttonClasses)}
        type='button'
        disabled={disabled}>
        <Icon icon='arrow-down' />
        {val?.label ? val.label : placeholder}
        <div className='ui-icon ui-small'>
          <components.ValueContainer getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </button>
    )
  }

  return (
    <Dropdown
      classNamePrefix='substatus-dropdown'
      items={LEASE_UP_SUBSTATUS_OPTIONS[status]}
      value={subStatus}
      placeholder={placeholder}
      onChange={val => onChange(val, 'subStatus')}
      renderToggle={renderStatusToggle}
      renderOption={renderSubstatusOption}
      disabled={disabled} />
  )
}

SubstatusDropdown.propTypes = {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  subStatus: PropTypes.oneOf(LEASE_UP_SUBSTATUS_VALUES),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  expand: PropTypes.bool,
  hasError: PropTypes.bool
}

SubstatusDropdown.defaultProps = {
  status: null,
  subStatus: null,
  placeholder: 'Select one...',
  expand: false,
  hasError: false
}

export default SubstatusDropdown
