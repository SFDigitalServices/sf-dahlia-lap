import React from 'react'
import { BlockNote } from '~/utils/form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import { FieldWrapper } from '~/utils/form/final_form/Field'


export const MultiDateField = ({ form, fieldName, label, blockNote }) => {

  const error = form.getState &&
    form.getState().errors[fieldName.split('.')[0]] &&
    form.getState().errors[fieldName.split('.')[0]]['date_of_birth'] &&
    form.getState().errors[fieldName.split('.')[0]]['date_of_birth']['all']
  console.log('fieldName', fieldName)
  console.log('form state', form.getState())
  return (
    <div className={(error && 'error') || ''}>
      <label className='form-label' htmlFor={fieldName}>
        {`${label} `}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      <div className='form-group-month'>
        <FieldWrapper
          type='text'
          fieldName={`${fieldName}.month`}
          placeholder='MM'
          pattern='\d*'
          maxLength={maxLengthMap['month']} />
      </div>
      <div className='form-group-day'>
        <FieldWrapper
          type='text'
          fieldName={`${fieldName}.day`}
          placeholder='DD'
          pattern='\d*'
          maxLength={maxLengthMap['day']} />
      </div>
      <div className='form-group-year'>
        <FieldWrapper
          type='text'
          fieldName={`${fieldName}.year`}
          placeholder='YYYY'
          pattern='\d*'
          maxLength={maxLengthMap['year']} />
      </div>
      <div className='d-inline-block'>
        { error && <span className='small error'>{error}</span> }
      </div>
    </div>
  )
}
