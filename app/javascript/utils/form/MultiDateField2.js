import React from 'react'
import { BlockNote } from '~/utils/form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import { FieldWrapper } from '~/utils/form/Field2'

export const MultiDateField2 = ({ form, fieldName, label, blockNote }) => {
  const errors = form.getState().errors.applicant && form.getState().errors.applicant.date_of_birth.all
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
      <div className='d-inline-block'>
        { errors && <span className='error'>{errors}</span> }
      </div>
    </div>
  )
}

// 1. Display error message in multidatefield2 section
// 2. Display error class on the date fields
// 3. Validate with all three validations

        // {/* <FormError formApi={formApi} label={label} fieldName={fieldName} errorMessage={errorMessage} /> */}
