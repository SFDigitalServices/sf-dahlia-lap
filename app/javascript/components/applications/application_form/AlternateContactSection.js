import React from 'react'

import { InputField, SelectField } from 'utils/form/final_form/Field'
import { maxLengthMap } from 'utils/formUtils'

import AddressForm from './AddressForm'
import formOptions from './formOptions'
import { mailingAddressFieldMap } from './utils'

const { alternateContactOptions, phoneTypeOptions } = formOptions

const AlternateContactSection = () => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Alternate Contact</h3>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-4 columns'>
            <InputField
              id='alt_first_name'
              label='First Name'
              fieldName='alternate_contact.first_name'
              maxLength={maxLengthMap.first_name}
            />
          </div>
          <div className='small-4 columns'>
            <InputField
              id='alt_middle_name'
              label='Middle Name'
              fieldName='alternate_contact.middle_name'
              maxLength={maxLengthMap.middle_name}
            />
          </div>
          <div className='small-4 columns'>
            <InputField
              id='alt_last_name'
              label='Last Name'
              fieldName='alternate_contact.last_name'
              maxLength={maxLengthMap.last_name}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <SelectField
            fieldName='alternate_contact.alternate_contact_type'
            label='Alternate Contact Type'
            options={alternateContactOptions}
          />
        </div>
        <div className='small-4 columns'>
          <label>Alternate Contact Type Other</label>
          <InputField
            fieldName='alternate_contact.alternate_contact_type_other'
            maxLength={maxLengthMap.alternate_contact_type_other}
          />
        </div>
        <div className='small-4 columns'>
          <label>Agency (if applicable)</label>
          <InputField
            fieldName='alternate_contact.agency_name'
            maxLength={maxLengthMap.agency_name}
          />
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <InputField
            id='email'
            label='Email'
            fieldName='alternate_contact.email'
            maxLength={maxLengthMap.email}
          />
        </div>
        <div className='small-4 columns'>
          <InputField
            label='Phone'
            fieldName='alternate_contact.phone'
            maxLength={maxLengthMap.phone}
          />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='alternate_contact.phone_type'
            label='Phone Type'
            options={phoneTypeOptions}
          />
        </div>
      </div>
      <AddressForm
        title='Mailing Address'
        fieldName='alternate_contact'
        addressFieldMap={mailingAddressFieldMap}
      />
    </div>
  )
}

export default AlternateContactSection
