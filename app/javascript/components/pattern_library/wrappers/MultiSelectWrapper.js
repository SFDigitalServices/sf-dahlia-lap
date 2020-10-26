import React, { useState } from 'react'
import MultiSelect from '~/components/molecules/MultiSelect'
import PropTypes from 'prop-types'

const MultiSelectWrapper = ({ items = [], disabled = false }) => {
  const [selectedItems, setSelectedItems] = useState([])

  return (
    <MultiSelect
      items={items}
      disabled={disabled}
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
  disabled: PropTypes.bool
}

export default MultiSelectWrapper
