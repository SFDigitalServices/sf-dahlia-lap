import React from 'react'
import { isEmpty, values, forEach, size } from 'lodash'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import { mailingAddressFieldMap } from './utils'
import validate from '~/utils/form/validations'
import { Field } from '~/utils/form/Field'
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
    last_name: validateFirstLastName(formValues, formValues.last_name, 'Last Name')
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
    <NestedForm field='alternate_contact'>
      <Form defaultValues={autofillValues} validateError={validateError}>
        { formApi => (
          <div className='border-bottom margin-bottom--2x'>
            <div className='row'>
              <h3>Alternate Contact</h3>
            </div>
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <Field.Text
                    id='alt_first_name'
                    label='First Name'
                    field='first_name'
                    errorMessage={(label, error) => error}
                    maxLength={maxLengthMap['first_name']}
                  />
                </div>
                <div className='small-4 columns'>
                  <Field.Text
                    id='alt_middle_name'
                    label='Middle Name'
                    field='middle_name'
                    maxLength={maxLengthMap['middle_name']}
                  />
                </div>
                <div className='small-4 columns'>
                  <Field.Text
                    id='alt_last_name'
                    label='Last Name'
                    field='last_name'
                    errorMessage={(label, error) => error}
                    maxLength={maxLengthMap['last_name']}
                  />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='small-4 columns'>
                <label>Alternate Contact Type</label>
                <Select field='alternate_contact_type' options={alternateContactOptions} />
              </div>
              <div className='small-4 columns'>
                <label>Alternate Contact Type Other</label>
                <Text field='alternate_contact_type_other' maxLength={maxLengthMap['alternate_contact_type_other']} />
              </div>
              <div className='small-4 columns'>
                <label>Agency (if applicable)</label>
                <Text field='agency_name' maxLength={maxLengthMap['agency_name']} />
              </div>
            </div>
            <div className='row'>
              <div className='small-4 columns'>
                <Field.Text
                  id='email'
                  label='Email'
                  field='email'
                  errorMessage={(label, error) => error}
                  maxLength={maxLengthMap['email']}
                />
              </div>
              <div className='small-4 columns'>
                <label>Phone</label>
                <Text field='phone' maxLength={maxLengthMap['phone']} />
              </div>
              <div className='small-4 columns'>
                <label>Phone Type</label>
                <Select field='phone_type' options={phoneTypeOptions} />
              </div>
            </div>
            <AddressForm title='Mailing Address' memberType='alternateContact' fieldMap={mailingAddressFieldMap} />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default AlternateContactSection
