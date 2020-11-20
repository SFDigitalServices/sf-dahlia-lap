import React, { useState } from 'react'

import UnlabeledCheckbox from 'components/atoms/UnlabeledCheckbox'

const UnlabeledCheckboxWrapper = () => {
  const [checked, setChecked] = useState(false)

  return (
    <div className='form-group'>
      <UnlabeledCheckbox
        id={'checkbox-wrapper'}
        checked={checked}
        onClick={() => setChecked(!checked)}
      />
    </div>
  )
}

export default UnlabeledCheckboxWrapper
