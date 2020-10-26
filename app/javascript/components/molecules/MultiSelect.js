import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

const MultiSelect = ({
  items = [],
  selectedItems = [],
  disabled = false,
  onChangeValues = () => {}
}) => (
  <Select
    isDisabled={disabled}
    isClearable
    isSearchable
    isMulti
    onChange={(values) => onChangeValues(values)}
    value={selectedItems}
    options={items}
  />
)

const SelectItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelect.propTypes = {
  items: PropTypes.arrayOf(SelectItemShape),
  disabled: PropTypes.bool,
  selectedItems: PropTypes.arrayOf(SelectItemShape),
  onChange: PropTypes.func
}

export default MultiSelect
