import React from 'react'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import validate from '~/utils/form/validations'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'
import { mailingAddressFieldMap } from './utils'
import { maxLengthMap } from '~/utils/formUtils'

let { phoneTypeOptions } = formOptions

const PrimaryApplicantSection = ({form}) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Primary Applicant</h3>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              fieldName='applicant.first_name'
              label='First Name'
              blockNote='(required)'
              validation={validate.isPresent('Please enter a First Name')}
              maxLength={maxLengthMap['first_name']}
            />
          </div>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              fieldName='applicant.middle_name'
              label='Middle Name'
              maxLength={maxLengthMap['middle_name']}
            />
          </div>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              fieldName='applicant.last_name'
              label='Last Name'
              blockNote='(required)'
              validation={validate.isPresent('Please enter a Last Name')}
              maxLength={maxLengthMap['last_name']}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            label='Email'
            fieldName='applicant.email'
            maxLength={maxLengthMap['email']}
          />
        </div>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            fieldName='applicant.phone'
            label='Primary Phone Number'
            maxLength={maxLengthMap['phone']} />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='applicant.phone_type'
            label='Primary Phone Number- Type'
            options={phoneTypeOptions} />
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns form-date-of-birth'>
          <MultiDateField
            form={form}
            fieldName='applicant.date_of_birth'
            label='Date of Birth'
            blockNote='(required)'
          />
        </div>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            label='Second Phone Number'
            fieldName='applicant.second_phone'
            maxLength={maxLengthMap['phone']} />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='applicant.second_phone_type'
            label='Second Phone Number- Type'
            options={phoneTypeOptions} />
        </div>
      </div>
      <AddressForm
        title='Home Address'
        memberType='primaryApplicant'
      />
      <AddressForm
        title='Mailing Address'
        memberType='primaryApplicant'
        fieldMap={mailingAddressFieldMap}
      />
    </div>
  )
}

export default PrimaryApplicantSection
