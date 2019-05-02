import React from 'react'
import { BlockNote } from '~/utils/form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import { FieldWrapper } from '~/utils/form/Field2'

export const MultiDateField2 = ({ form, fieldName, label, blockNote }) => {
  // console.log('form', form)
  return (
    // <div className={classNames('form-group', className)}>
    <div>
      <label className='form-label' htmlFor={fieldName}>
        {`${label} `}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      <div className='form-group-month'>
        <FieldWrapper
          // className={classNames(className)}
          type='text'
          fieldName={`${fieldName}.month`}
          placeholder='MM'
          pattern='\d*'
          maxLength={maxLengthMap['month']} />
      </div>
      <div className='form-group-day'>
        <FieldWrapper
          // className={classNames(className)}
          type='text'
          fieldName={`${fieldName}.day`}
          placeholder='DD'
          pattern='\d*'
          maxLength={maxLengthMap['day']} />
      </div>
      <div className='form-group-year'>
        <FieldWrapper
          // className={classNames(className)}
          type='text'
          fieldName={`${fieldName}.year`}
          placeholder='YYYY'
          pattern='\d*'
          maxLength={maxLengthMap['year']} />
      </div>
      {/* <div className='d-inline-block'>
        <FormError formApi={formApi} label={label} fieldName={fieldName} errorMessage={errorMessage} />
      </div> */}
    </div>
  )
}