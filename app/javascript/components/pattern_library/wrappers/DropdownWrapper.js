import React, { useState } from 'react'

import Dropdown from '~/components/molecules/Dropdown'

const DropdownWrapper = ({ items }) => {
  const [dropdown1Value, setDropdown1] = useState(null)
  const [dropdown2Value, setDropdown2] = useState(null)

  const onChangeDropdown1 = (value, label) => {
    setDropdown1(value)
  }

  const onChangeDropdown2 = (values) => {
    setDropdown2(values)
  }

  return (
    <div>
      <h3>Single select</h3>
      <div>
        Value: {dropdown1Value}
        <Dropdown
          prompt='Select option'
          value={dropdown1Value}
          onChange={onChangeDropdown1}
          items={items}
        />
      </div>
      <h3>Multiple select</h3>
      <div>
        Values: {dropdown2Value}
        <Dropdown
          prompt='Select option'
          multiple
          value={dropdown2Value}
          onChange={onChangeDropdown2}
          items={items}
        />
      </div>
    </div>
  )
}

export default DropdownWrapper
