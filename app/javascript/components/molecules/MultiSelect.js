import React from 'react'

import PropTypes from 'prop-types'
import Select from 'react-select'

const HEIGHT_NORMAL = 'normal'
const HEIGHT_SMALL = 'small'

const getStyleOverrides = (controlHeight) => {
  let controlHeightPx
  switch (controlHeight) {
    case HEIGHT_SMALL:
      controlHeightPx = '38px'
      break
    case HEIGHT_NORMAL:
    default:
      controlHeightPx = '45px'
      break
  }

  return {
    control: (base, _) => ({
      ...base,
      minHeight: controlHeightPx
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
  height = HEIGHT_NORMAL,
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
        styles={getStyleOverrides(height)}
        onChange={(values) => onChange(values)}
        options={options}
        value={selectedValues}
      />
    </div>
  )
}

const SelectItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelect.propTypes = {
  input: PropTypes.object,
  options: PropTypes.arrayOf(SelectItemShape),
  height: PropTypes.oneOf([HEIGHT_NORMAL, HEIGHT_SMALL]),
  disabled: PropTypes.bool,
  value: PropTypes.arrayOf(SelectItemShape),
  onChange: PropTypes.func
}

export default MultiSelect
