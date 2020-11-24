import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import Button from 'components/atoms/Button'
import { LEASE_UP_STATUS_OPTIONS, LEASE_UP_STATUS_VALUES } from 'utils/statusUtils'

import Icon from '../atoms/Icon'
import Dropdown from '../molecules/Dropdown'

export const renderStatusOption = ({ value, label, statusClassName }, { selectValue }) => {
  const isSelected = selectValue[0]?.value === value
  return (
    <li className={classNames('dropdown-menu_item', statusClassName)} aria-selected={isSelected}>
      <a>{label}</a>
    </li>
  )
}

const StatusDropdown = ({
  status,
  onChange,
  overrideValue = false,
  disabled = false,
  placeholder = 'Status',
  size = null,
  expand = false,
  minWidthPx = null,
  updateOnChange = true
}) => {
  const buttonClasses = [
    'button',
    'dropdown-button',
    'has-icon--right',
    'text-align-left',
    { expand: expand },
    { tiny: size === 'tiny' },
    { small: size === 'small' }
  ]

  const renderStatusToggle = ({ children, getValue, ...props }) => {
    const val = updateOnChange ? getValue()[0] : null

    return (
      <Button
        className={classNames(buttonClasses.concat(val?.statusClassName || 'tertiary'))}
        type='button'
        disabled={disabled}
        minWidthPx={minWidthPx}
      >
        <Icon icon='arrow-down' size='small' />
        {val?.label ? val.label : placeholder}
        <div className='ui-icon ui-small'>
          <components.ValueContainer getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </Button>
    )
  }

  return (
    <Dropdown
      classNamePrefix='status-dropdown'
      items={LEASE_UP_STATUS_OPTIONS}
      value={status}
      placeholder={placeholder}
      onChange={(val) => onChange(val)}
      renderToggle={renderStatusToggle}
      renderOption={renderStatusOption}
      disabled={disabled}
      overrideValue={overrideValue}
    />
  )
}

StatusDropdown.propTypes = {
  disabled: PropTypes.bool,
  expand: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  minWidthPx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small']),
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES)
}

export default StatusDropdown
