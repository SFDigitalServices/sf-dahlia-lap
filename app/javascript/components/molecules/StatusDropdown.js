import React from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import classNames from 'classnames'

import { LEASE_UP_STATUS_OPTIONS, LEASE_UP_STATUS_VALUES } from '~/utils/statusUtils'
import Dropdown from '../molecules/Dropdown'

const renderStatusOption = ({ value, label, style }) => {
  let liClassName = 'dropdown-menu_item'
  // if (selected) { liClassName += ' is-selected' }
  if (style) { classNames(liClassName, style) }
  return (
    <li className={liClassName}>
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
        className={classNames(buttonClasses.concat(val?.style || 'tertiary'))}
        type='button'
        disabled={disabled}>
        <span className='ui-icon ui-small'>
          <svg>
            <use xlinkHref='#i-arrow-down' />
          </svg>
        </span>
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
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small']),
  expand: PropTypes.bool
}

StatusDropdown.defaultProps = {
  status: null,
  placeholder: 'Status',
  size: null,
  expand: false
}

export default StatusDropdown
