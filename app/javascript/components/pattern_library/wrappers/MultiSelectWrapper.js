import React, { useState } from 'react'

import PropTypes from 'prop-types'

import MultiSelect from 'components/molecules/MultiSelect'

const MultiSelectWrapper = ({ items = [], disabled = false, height = undefined }) => {
  const [selectedItems, setSelectedItems] = useState([])

  return (
    <MultiSelect
      items={items}
      disabled={disabled}
      height={height}
      selectedItems={selectedItems}
      onChangeValues={(values) => setSelectedItems(values)}
    />
  )
}

const SelectItemShape = PropTypes.shape({
  value: PropTypes.string,
  label: PropTypes.string
})

MultiSelectWrapper.propTypes = {
  items: PropTypes.arrayOf(SelectItemShape),
  disabled: PropTypes.bool,
  height: PropTypes.oneOf(['normal', 'small'])
}

export default MultiSelectWrapper
