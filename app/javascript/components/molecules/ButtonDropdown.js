import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { components } from 'react-select'

import Button from 'components/atoms/Button'
import StyledIcon from 'components/atoms/StyledIcon'
import Dropdown from 'components/molecules/Dropdown'

export const renderStatusOption = ({ value, label, statusClassName }, { selectValue }) => {
  const isSelected = selectValue[0]?.value === value
  return (
    <li className={classNames('dropdown-menu_item', statusClassName)} aria-selected={isSelected}>
      <a>{label}</a>
    </li>
  )
}

const ButtonDropdown = ({
  buttonClasses = [],
  status,
  onChange,
  overrideValue = false,
  disabled = false,
  placeholder = 'Status',
  size = null,
  expand = false,
  minWidthPx = null,
  tertiary = true,
  // when true, never display the current status in the dropdown toggle,
  // always show the placeholder.
  forceDisplayPlaceholderText = false,
  dataTestId = null,
  options = []
}) => {
  const classes = classNames(buttonClasses, 'button', 'dropdown-button', { expand })

  const renderStatusToggle = ({ children, getValue, ...props }) => {
    const val = forceDisplayPlaceholderText ? null : getValue()[0]

    const padding = size === 'tiny' ? 'tight' : 'normal'

    return (
      <Button
        classes={classNames(classes, val?.statusClassName || (tertiary && 'tertiary'))}
        type='button'
        disabled={disabled}
        minWidthPx={minWidthPx}
        iconRight={<StyledIcon icon='arrow-down' size='small' />}
        text={val?.label ?? placeholder}
        small={size === 'small'}
        tiny={size === 'tiny'}
        paddingHorizontal={padding}
        paddingVertical={padding}
        textAlign='left'
        noBottomMargin
        data-testid={dataTestId}
      >
        <div style={{ width: 0, height: 0 }}>
          <components.ValueContainer data-testid={dataTestId} getValue={getValue} {...props}>
            {children}
          </components.ValueContainer>
        </div>
      </Button>
    )
  }

  return (
    <Dropdown
      classNamePrefix='status-dropdown'
      items={options}
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

ButtonDropdown.propTypes = {
  buttonClasses: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  expand: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  minWidthPx: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small']),
  status: PropTypes.string,
  tertiary: PropTypes.bool
}

export default ButtonDropdown
