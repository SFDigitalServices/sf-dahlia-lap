import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import validate from '~/utils/form/validations'
import { Field, MultiDateField } from '~/utils/form/Field'
import { mailingAddressFieldMap } from './utils'

let { phoneTypeOptions } = formOptions

const validateError = validate({
  date_of_birth: validate.any(
    validate.isValidDate('Please enter a valid Date of Birth'),
    validate.isOldEnough('The primary applicant must be 18 years of age or older')
  ),
  first_name: validate.isPresent('Please enter a First Name'),
  last_name: validate.isPresent('Please enter a Last Name')
})

const PrimaryApplicantSection = ({ formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = editValues.applicant
  }
  console.log('PrimaryApplicantSection formAPI', formApi)
  return (
    <NestedForm field='applicant'>
      <Form defaultValues={autofillValues} validateError={validateError} >
        { formApi => (
          <div className='border-bottom margin-bottom--2x'>
            <div className='row'>
              <h3>Primary Applicant</h3>
            </div>
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <Field.Text
                    id='first_name'
                    label='First Name'
                    blockNote='(required)'
                    field='first_name'
                    errorMessage={(label, error) => error}
                  />
                </div>
                <div className='small-4 columns'>
                  <label>Middle Name</label>
                  <Text field='middle_name' />
                </div>
                <div className='small-4 columns'>
                  <Field.Text
                    id='last_name'
                    label='Last Name'
                    blockNote='(required)'
                    field='last_name'
                    errorMessage={(label, error) => error}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='small-4 columns'>
                <label>Email</label>
                <Text field='email' />
              </div>
              <div className='small-4 columns'>
                <label>Phone</label>
                <Text field='phone' />
              </div>
              <div className='small-4 columns'>
                <label>Phone Type</label>
                <Select field='phone_type' options={phoneTypeOptions} />
              </div>
            </div>
            <div className='row'>
              <div className='small-4 columns form-date-of-birth'>
                <MultiDateField
                  id='date_of_birth'
                  field='date_of_birth'
                  formApi={formApi}
                  label='Date of Birth'
                  blockNote='(required)'
                  errorMessage={(label, error) => error}
                />
              </div>
            </div>
            <AddressForm title='Home Address' memberType='primaryApplicant' />
            <AddressForm title='Mailing Address' memberType='primaryApplicant' fieldMap={mailingAddressFieldMap} />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default PrimaryApplicantSection
