import React from 'react'
import { find } from 'lodash'
import Select from 'react-select'
import PropTypes from 'prop-types'
import { COLORS } from '~/components/atoms/colors'

const Dropdown = ({
  items,
  value,
  disabled,
  onChange,
  renderToggle,
  renderOption
}) => {
  let selectedItem = find(items, { value })

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: 0,
      backgroundColor: (state.isSelected && COLORS.primaryTint) || (state.isFocused && COLORS.vapor)
    })
  }

  return (
    <Select
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
  placeholder: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  renderToggle: PropTypes.func.isRequired,
  renderOption: PropTypes.func.isRequired
}

Dropdown.defaultProps = {
  disabled: false
}
export default Dropdown
