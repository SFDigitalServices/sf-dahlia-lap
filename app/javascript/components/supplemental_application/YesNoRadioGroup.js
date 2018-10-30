import React from 'react'
import { RadioGroup, Radio } from 'react-form'

const YesNoRadioGroup = ({ field, uniqId, trueValue = 'true', trueLabel = 'Yes', falseValue = 'false', falseLabel = 'No', className }) => {
  return (
    <div className='radio-group-inline'>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p className='radio-inline'>
              <Radio group={group} value={trueValue} id={`${field}-${uniqId}-yes`} className={className} />
              <label className='radio-inline_label' htmlFor={`${field}-${uniqId}-yes`}>{trueLabel}</label>
            </p>
            <p className='radio-inline'>
              <Radio group={group} value={falseValue} id={`${field}-${uniqId}-no`} className={className} />
              <label className='radio-inline_label' htmlFor={`${field}-${uniqId}-no`}>{falseLabel}</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

export default YesNoRadioGroup
