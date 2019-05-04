import React from 'react'
import { isEmpty, values, forEach, size } from 'lodash'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import { mailingAddressFieldMap } from './utils'
import validate from '~/utils/form/validations'
import { maxLengthMap } from '~/utils/formUtils'

const {
  alternateContactOptions,
  phoneTypeOptions
} = formOptions

const validateError = (formValues) => {
  // remove empty string values from alternate contact due to Salesforce validation
  forEach(formValues, (v, k) => {
    if (isEmpty(v)) { delete formValues[k] }
  })
  // delete id if other fields are empty
  if (size(formValues) === 1 && !isEmpty(formValues.id)) { delete formValues.id }

  return {
    first_name: validateFirstLastName(formValues, formValues.first_name, 'First Name'),
    last_name: validateFirstLastName(formValues, formValues.last_name, 'Last Name'),
    email: validate.isValidEmail('Please enter a valid Email')(formValues.email)
  }
}

const validateFirstLastName = (formValues, field, fieldName) => {
  // if there are any filled in alt contact fields, validate for first and last name
  if (!isEmpty(values(formValues).filter(Boolean))) {
    return validate.isPresent(`Please enter a ${fieldName}.`)(field)
  }
}

const AlternateContactSection = ({editValues}) => {
  let autofillValues = {}
  if (!isEmpty(editValues) && editValues.alternate_contact) {
    autofillValues = editValues.alternate_contact
  }
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Alternate Contact</h3>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              id='alt_first_name'
              label='First Name'
              fieldName='alternate_contact.first_name'
              maxLength={maxLengthMap['first_name']}
            />
          </div>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              id='alt_middle_name'
              label='Middle Name'
              fieldName='alternate_contact.middle_name'
              maxLength={maxLengthMap['middle_name']}
            />
          </div>
          <div className='small-4 columns'>
            <FieldWrapper
              type='text'
              id='alt_last_name'
              label='Last Name'
              fieldName='alternate_contact.last_name'
              maxLength={maxLengthMap['last_name']}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <SelectField
            fieldName='alternate_contact.alternate_contact_type'
            label='Alternate Contact Type'
            options={alternateContactOptions} />
        </div>
        <div className='small-4 columns'>
          <label>Alternate Contact Type Other</label>
          <FieldWrapper
            type='text'
            fieldName='alternate_contact.alternate_contact_type_other'
            maxLength={maxLengthMap['alternate_contact_type_other']}
          />
        </div>
        <div className='small-4 columns'>
          <label>Agency (if applicable)</label>
          <FieldWrapper
            type='text'
            fieldName='alternate_contact.agency_name'
            maxLength={maxLengthMap['agency_name']}
          />
        </div>
      </div>
      <div className='row'>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            id='email'
            label='Email'
            fieldName='alternate_contact.email'
            maxLength={maxLengthMap['email']}
          />
        </div>
        <div className='small-4 columns'>
          <FieldWrapper
            type='text'
            label='Phone'
            fieldName='alternate_contact.phone'
            maxLength={maxLengthMap['phone']}
          />
        </div>
        <div className='small-4 columns'>
          <SelectField
            fieldName='alternate_contact.phone_type'
            label='Phone Type'
            options={phoneTypeOptions} />
          {/* <Select field='phone_type' options={phoneTypeOptions} /> */}
        </div>
      </div>
      <AddressForm
        title='Mailing Address'
        memberType='alternateContact'
        fieldMap={mailingAddressFieldMap}
      />
    </div>
  )
}

export default AlternateContactSection
