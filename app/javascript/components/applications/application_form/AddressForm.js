import React from 'react'
import { Text } from 'react-form'

const buildField = (memberType, nestedField, fieldMap, fieldKey) => {
  // to do: refactor this to use props
  if (memberType === 'primaryApplicant') {
    return fieldMap[fieldKey]
  } else if (memberType === 'householdMember') {
    return `${nestedField}.${fieldMap[fieldKey]}`
  }
}

const AddressForm = ({ title, memberType, fieldMap, nestedField }) => {
  if (!fieldMap) {
    fieldMap = {
      address: 'address',
      city: 'city',
      state: 'state',
      zip: 'zip',
    }
  }

  return (
    <div>
      <div className="row">
        <h4>{title}</h4>
      </div>
      <div className="row">
        <div className="form-group">
          <div className="small-6 columns">
            <label>Street Address</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'address')} />
          </div>
          <div className="small-6 columns">
            <label>City</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'city')} />
          </div>
          <div className="small-6 columns">
            <label>State</label>
            <Text maxLength="2" field={buildField(memberType, nestedField, fieldMap, 'state')} />
          </div>
          <div className="small-6 columns">
            <label>Zip</label>
            <Text field={buildField(memberType, nestedField, fieldMap, 'zip')} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
