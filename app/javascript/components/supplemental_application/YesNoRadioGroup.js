import React from 'react'
import { RadioGroup, Radio } from 'react-form'
import classNames from 'classnames'

const YesNoRadioGroup = ({ field, uniqId, trueValue = 'true', trueLabel = 'Yes', falseValue = 'false', falseLabel = 'No', inputClassName, className }) => {
  const divClassName = classNames(className, 'radio-group-inline')
  return (
    <div className={divClassName}>
      <RadioGroup field={field}>
        {(group) => (
          <React.Fragment>
            <p className='radio-inline'>
              <Radio group={group} value={trueValue} id={`${field}-${uniqId}-yes`} className={inputClassName} />
              <label className='radio-inline_label' htmlFor={`${field}-${uniqId}-yes`}>{trueLabel}</label>
            </p>
            <p className='radio-inline'>
              <Radio group={group} value={falseValue} id={`${field}-${uniqId}-no`} className={inputClassName} />
              <label className='radio-inline_label' htmlFor={`${field}-${uniqId}-no`}>{falseLabel}</label>
            </p>
          </React.Fragment>
        )}
      </RadioGroup>
    </div>
  )
}

export default YesNoRadioGroup
