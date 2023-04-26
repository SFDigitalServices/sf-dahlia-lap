import React from 'react'

import { InputField, SelectField } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import validate from 'utils/form/validations'
import { maxLengthMap } from 'utils/formUtils'

import AddressForm from './AddressForm'
import formOptions from './formOptions'
import { mailingAddressFieldMap } from './utils'

const { phoneTypeOptions } = formOptions

const PrimaryApplicantSection = ({ form }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Primary Applicant</h3>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-4 columns'>
            <InputField
              fieldName='applicant.first_name'
              id='first_name'
              label='First Name'
              blockNote='(required)'
              validation={validate.isPresent('Please enter a First Name')}
              maxLength={maxLengthMap.first_name}
            />
          </div>
          <div className='small-4 columns'>
            <InputField
              fieldName='applicant.middle_name'
              id='middle_name'
              label='Middle Name'
              maxLength={maxLengthMap.middle_name}
            />
          </div>
          <div className='small-4 columns'>
            <InputField
              fieldName='applicant.last_name'
              id='last_name'
              label='Last Name'
              blockNote='(required)'
              validation={validate.isPresent('Please enter a Last Name')}
              maxLength={maxLengthMap.last_name}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <InputField
            type='text'
            label='Email'
            id='email'
            fieldName='applicant.email'
            validation={validate.isValidEmail('Please enter a valid Email')}
            maxLength={maxLengthMap.email}
          />
        </div>
        <div className='small-4 columns'>
          <InputField
            fieldName='applicant.phone'
            id='phone'
            label='Primary Phone Number'
            maxLength={maxLengthMap.phone}
          />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='applicant.phone_type'
            id='phone_type'
            label='Primary Phone Number- Type'
            options={phoneTypeOptions}
          />
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns form-date-of-birth'>
          <MultiDateField
            form={form}
            fieldName='applicant.date_of_birth'
            id='date_of_birth'
            label='Date of Birth'
            blockNote='(required)'
          />
        </div>
        <div className='small-4 columns'>
          <InputField
            label='Second Phone Number'
            fieldName='applicant.second_phone'
            id='second_phone'
            maxLength={maxLengthMap.phone}
          />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='applicant.second_phone_type'
            id='second_phone_type'
            label='Second Phone Number- Type'
            options={phoneTypeOptions}
          />
        </div>
      </div>
      <AddressForm title='Home Address' fieldName='applicant' />
      <AddressForm
        title='Mailing Address'
        fieldName='applicant'
        addressFieldMap={mailingAddressFieldMap}
      />
    </div>
  )
}

export default PrimaryApplicantSection
