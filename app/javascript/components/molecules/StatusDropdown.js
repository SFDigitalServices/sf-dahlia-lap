import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import classNames from 'classnames'

import { LEASE_UP_STATUS_OPTIONS, LEASE_UP_STATUS_VALUES } from '~/utils/statusUtils'
import Dropdown from '../molecules/Dropdown'
import Icon from '../atoms/Icon'

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
  disabled,
  placeholder,
  size,
  expand
}) => {
  const buttonClasses = [
    'button',
    'dropdown-button',
    'has-icon--right',
    'text-align-left',
    { 'expand': expand },
    { 'tiny': size === 'tiny' },
    { 'small': size === 'small' }
  ]
  const renderStatusToggle = ({ children, getValue, ...props }) => {
    const val = getValue()[0]

    return (
      <button
        className={classNames(buttonClasses.concat(val?.statusClassName || 'tertiary'))}
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
      classNamePrefix='status-dropdown'
      items={LEASE_UP_STATUS_OPTIONS}
      value={status}
      placeholder={placeholder}
      onChange={val => onChange(val)}
      renderToggle={renderStatusToggle}
      renderOption={renderStatusOption}
      disabled={disabled} />
  )
}

StatusDropdown.propTypes = {
  disabled: PropTypes.bool,
  expand: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small']),
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES)
}

StatusDropdown.defaultProps = {
  disabled: false,
  expand: false,
  placeholder: 'Status',
  size: null,
  status: null
}

export default StatusDropdown
