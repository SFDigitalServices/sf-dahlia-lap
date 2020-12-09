import React from 'react'

import PropTypes from 'prop-types'
import Select from 'react-select'

const getStyle = () => {
  return {
    control: (base, _) => ({
      ...base,
      minHeight: '45px'
    }),
    multiValue: (base, _) => ({
      ...base,
      maxWidth: '90%'
    })
  }
}

const MultiSelect = ({
  input = null,
  options = [],
  value = [],
  disabled = false,
  onChange = () => {}
}) => {
  let selectedValues
  if (value && value[0] && !value[0].value) {
    selectedValues = options.filter((option) => value.includes(option.value))
  } else {
    selectedValues = value
  }
  return (
    <div className='input-custom-height'>
      <Select
        {...input}
        isDisabled={disabled}
        isClearable
        isSearchable
        isMulti
        styles={getStyle()}
        onChange={(values) => onChange(values)}
        options={options}
        value={selectedValues}
      />
    </div>
  )
}

const MultiSelectItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelect.propTypes = {
  input: PropTypes.object,
  options: PropTypes.arrayOf(MultiSelectItemShape),
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(MultiSelectItemShape),
    PropTypes.arrayOf(PropTypes.string)
  ]),
  onChange: PropTypes.func
}

export { MultiSelect as default, MultiSelectItemShape }
