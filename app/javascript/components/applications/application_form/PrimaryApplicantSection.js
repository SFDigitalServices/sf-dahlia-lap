import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import { isEmpty } from 'lodash'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import validate from '~/utils/form/validations'
import { Field } from '~/utils/form/Field'
import { FieldWrapper, SelectField } from '~/utils/form/Field2'
import { MultiDateField } from '~/utils/form/MultiDateField'
import { MultiDateField2 } from '~/utils/form/MultiDateField2'
import { mailingAddressFieldMap } from './utils'
import { maxLengthMap } from '~/utils/formUtils'

let { phoneTypeOptions } = formOptions

const validationMapper = {
  date_of_birth: validate.any(
    validate.isPresent('Please enter a Date of Birth'),
    validate.isValidDate('Please enter a valid Date of Birth'),
    validate.isOldEnough('The primary applicant must be 18 years of age or older')
  ),
  first_name: validate.isPresent('Please enter a First Name'),
  last_name: validate.isPresent('Please enter a Last Name'),
  email: validate.isValidEmail('Please enter a valid Email')
}

const PrimaryApplicantSection = ({form}) => {
  console.log('form', form)
  console.log('form state', form.getState())
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
          <MultiDateField2
            form={form}
            fieldName='applicant.date_of_birth'
            label='Date of Birth'
            blockNote='(required)'
            validation={validate.any(
              validate.isPresent('Please enter a Date of Birth'),
              validate.isValidDate('Please enter a valid Date of Birth'),
              validate.isOldEnough('The primary applicant must be 18 years of age or older')
            )}
          />
        </div>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            label='Second Phone Number'
            fieldName='applicant.second_phone'
            maxLength={maxLengthMap['phone']} />
        </div>
        {/* <div className='small-4 columns'>
          <label>Second Phone Number- Type</label>
          <Select field='second_phone_type' options={phoneTypeOptions} />
        </div> */}
      </div>
      {/* <AddressForm
        title='Home Address'
        memberType='primaryApplicant'
      />
      <AddressForm
        title='Mailing Address'
        memberType='primaryApplicant'
        fieldMap={mailingAddressFieldMap}
      /> */}
    </div>
  )
}

export default PrimaryApplicantSection