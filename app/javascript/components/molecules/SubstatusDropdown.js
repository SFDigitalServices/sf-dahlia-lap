import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import { getLeaseUpSubstatusOptions } from 'utils/inviteApplyEmail'

import Icon from '../atoms/Icon'
import Dropdown from '../molecules/Dropdown'

export const renderSubstatusOption = ({ value, label }, { selectValue }) => {
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
  hasError,
  listingId
}) => {
  const buttonClasses = [
    'button',
    'dropdown-button',
    'substatus',
    'has-icon--right',
    'text-align-left',
    { expand },
    { error: hasError }
  ]
  const renderStatusToggle = ({ children, getValue, ...props }) => {
    const val = getValue()[0]

    return (
      <button className={classNames(buttonClasses)} type='button' disabled={disabled}>
        <Icon icon='arrow-down' size='small' />
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
      items={getLeaseUpSubstatusOptions(listingId)[status] || []}
      value={subStatus}
      placeholder={placeholder}
      onChange={(val) => onChange(val, 'subStatus')}
      renderToggle={renderStatusToggle}
      renderOption={renderSubstatusOption}
      disabled={disabled}
    />
  )
}

SubstatusDropdown.propTypes = {
  expand: PropTypes.bool,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  status: PropTypes.string,
  subStatus: PropTypes.string,
  listingId: PropTypes.string
}

SubstatusDropdown.defaultProps = {
  expand: false,
  disabled: false,
  hasError: false,
  placeholder: 'Select one...',
  status: null,
  subStatus: null,
  listingId: null
}

export default SubstatusDropdown
