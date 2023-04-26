import React, { useState } from 'react'

import Checkbox from 'components/atoms/Checkbox'

const CheckboxWrapper = () => {
  const [checked, setChecked] = useState(false)

  return (
    <div className='form-group'>
      <Checkbox id={'checkbox-wrapper'} checked={checked} onClick={() => setChecked(!checked)} />
    </div>
  )
}

export default CheckboxWrapper
