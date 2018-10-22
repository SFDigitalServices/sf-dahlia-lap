import React from 'react'
import { RadioGroup, Radio } from 'react-form'

const YesNoRadioGroup = ({field}) => {
  return (
    <div className='radio-group-inline'>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p className='radio-inline'>
              <Radio group={group} value={`true`} id={`${field}-yes`} />
              <label className='radio-inline_label' htmlFor={`${field}-yes`}>Yes</label>
            </p>
            <p className='radio-inline'>
              <Radio group={group} value={`false`} id={`${field}-no`} />
              <label className='radio-inline_label' htmlFor={`${field}-no`}>No</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

export default YesNoRadioGroup
