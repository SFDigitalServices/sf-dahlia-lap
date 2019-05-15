import React from 'react'
import { FieldWrapper } from '~/utils/form/final_form/Field'
import { isEmpty } from 'lodash'
import { maxLengthMap } from '~/utils/formUtils'

const buildField = (fieldName, fieldMap, fieldKey) => {
  return `${fieldName}.${fieldMap[fieldKey]}`
}

const AddressForm = ({ title, fieldName, fieldMap }) => {
  if (isEmpty(fieldMap)) {
    fieldMap = {
      address: 'street',
      city: 'city',
      state: 'state',
      zip: 'zip_code'
    }
  }

  return (
    <div>
      <div className='row'>
        <h4>{title}</h4>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='Street Address'
              fieldName={buildField(fieldName, fieldMap, 'address')}
              maxLength={maxLengthMap['address']}
            />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='City'
              fieldName={buildField(fieldName, fieldMap, 'city')}
              maxLength={maxLengthMap['city']}
            />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='State'
              fieldName={buildField(fieldName, fieldMap, 'state')}
              maxLength={maxLengthMap['state']}
            />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='Zip'
              fieldName={buildField(fieldName, fieldMap, 'zip')}
              maxLength={maxLengthMap['zip']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
