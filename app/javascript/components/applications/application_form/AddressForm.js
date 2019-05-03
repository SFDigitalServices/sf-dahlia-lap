import React from 'react'
import { FieldWrapper } from '~/utils/form/final_form/Field'
import { isEmpty } from 'lodash'
import { maxLengthMap } from '~/utils/formUtils'

const buildField = (memberType, nestedField, fieldMap, fieldKey) => {
  // to do: refactor this to use props
  if (memberType === 'primaryApplicant') {
    return `applicant.${fieldMap[fieldKey]}`
  } else if (memberType === 'householdMember') {
    return `${nestedField}.${fieldMap[fieldKey]}`
  } else if (memberType === 'alternateContact') {
    return `alternate_contact.${fieldMap[fieldKey]}`
  }
}

const AddressForm = ({ title, memberType, fieldMap, nestedField }) => {
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
              fieldName={buildField(memberType, nestedField, fieldMap, 'address')}
              maxLength={maxLengthMap['address']}
            />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='City'
              fieldName={buildField(memberType, nestedField, fieldMap, 'city')}
              maxLength={maxLengthMap['city']}
              />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='State'
              fieldName={buildField(memberType, nestedField, fieldMap, 'state')}
              maxLength={maxLengthMap['state']}
              />
          </div>
          <div className='small-6 columns'>
            <FieldWrapper
              type='text'
              label='Zip'
              fieldName={buildField(memberType, nestedField, fieldMap, 'zip')}
              maxLength={maxLengthMap['zip']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
