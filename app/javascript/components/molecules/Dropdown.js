import React from 'react'

import { find } from 'lodash'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { COLORS } from 'components/atoms/colors'

const Dropdown = ({
  items = [],
  value = null,
  disabled = false,
  onChange,
  renderToggle,
  renderOption,
  classNamePrefix = null
}) => {
  const selectedItem = find(items, { value })

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: 0,
      backgroundColor: (state.isSelected && COLORS.primaryTint) || (state.isFocused && COLORS.vapor)
    }),
    control: () => ({ border: 'none' })
  }

  return (
    <Select
      classNamePrefix={classNamePrefix}
      placeholder={null}
      isDisabled={disabled}
      isClearable={false}
      isSearchable={false}
      className='dropdown'
      onChange={(value) => onChange(value.value)}
      defaultValue={selectedItem}
      styles={customStyles}
      formatOptionLabel={renderOption}
      components={{
        ValueContainer: renderToggle,
        SingleValue: () => null,
        IndicatorsContainer: () => null
      }}
      options={items}
    />
  )
}

Dropdown.propTypes = {
  classNamePrefix: PropTypes.string,
  disabled: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  renderToggle: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired,
  value: PropTypes.string
}

export default Dropdown
