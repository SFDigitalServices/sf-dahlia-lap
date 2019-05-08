import React from 'react'
import { FieldWrapper } from '~/utils/form/final_form/Field'
import { isEmpty } from 'lodash'
import { maxLengthMap } from '~/utils/formUtils'

const buildField = ( memberType, name, fieldMap, fieldKey) => {
  // to do: refactor this to use props
  if (memberType === 'primaryApplicant') {
    return `applicant.${fieldMap[fieldKey]}`
  } else if (!isEmpty(name)) {
    return `${name}.${fieldMap[fieldKey]}`
  } else if (memberType === 'alternateContact') {
    return `alternate_contact.${fieldMap[fieldKey]}`
  }
}

const AddressForm = ({ title, memberType, name, fieldMap }) => {
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
              fieldName={buildField(memberType, name, fieldMap, 'address')}
              maxLength={maxLengthMap['address']}
            />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='City'
              fieldName={buildField(memberType, name, fieldMap, 'city')}
              maxLength={maxLengthMap['city']}
              />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='State'
              fieldName={buildField(memberType, name, fieldMap, 'state')}
              maxLength={maxLengthMap['state']}
              />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='Zip'
              fieldName={buildField(memberType, name, fieldMap, 'zip')}
              maxLength={maxLengthMap['zip']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
