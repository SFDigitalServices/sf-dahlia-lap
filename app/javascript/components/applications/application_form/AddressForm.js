import React from 'react'
import { Text } from 'react-form'
import { isEmpty } from 'lodash'
import { maxLengthMap } from './utils'

const buildField = (memberType, nestedField, fieldMap, fieldKey) => {
  // to do: refactor this to use props
  if (memberType === 'primaryApplicant') {
    return fieldMap[fieldKey]
  } else if (memberType === 'householdMember') {
    return `${nestedField}.${fieldMap[fieldKey]}`
  } else if (memberType === 'alternateContact') {
    return fieldMap[fieldKey]
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
            <label>Street Address</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'address')} maxLength={maxLengthMap['address']} />
          </div>
          <div className='small-6 columns'>
            <label>City</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'city')} maxLength={maxLengthMap['city']} />
          </div>
          <div className='small-6 columns'>
            <label>State</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'state')} maxLength={maxLengthMap['state']} />
          </div>
          <div className='small-6 columns'>
            <label>Zip</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'zip')} maxLength={maxLengthMap['zip']} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
