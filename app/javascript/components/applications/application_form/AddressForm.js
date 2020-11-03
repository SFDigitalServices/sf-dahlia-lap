import React from 'react'
import { InputField } from 'utils/form/final_form/Field'
import { isEmpty } from 'lodash'
import { maxLengthMap } from 'utils/formUtils'

const buildField = (fieldName, addressFieldMap, addressFieldKey) => {
  return `${fieldName}.${addressFieldMap[addressFieldKey]}`
}

const AddressForm = ({ title, fieldName, addressFieldMap }) => {
  if (isEmpty(addressFieldMap)) {
    addressFieldMap = {
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
            <InputField
              label='Street Address'
              fieldName={buildField(fieldName, addressFieldMap, 'address')}
              maxLength={maxLengthMap.address}
            />
          </div>
          <div className='small-6 columns'>
            <InputField
              label='City'
              fieldName={buildField(fieldName, addressFieldMap, 'city')}
              maxLength={maxLengthMap.city}
            />
          </div>
          <div className='small-6 columns'>
            <InputField
              label='State'
              fieldName={buildField(fieldName, addressFieldMap, 'state')}
              maxLength={maxLengthMap.state}
            />
          </div>
          <div className='small-6 columns'>
            <InputField
              label='Zip'
              fieldName={buildField(fieldName, addressFieldMap, 'zip')}
              maxLength={maxLengthMap.zip}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
