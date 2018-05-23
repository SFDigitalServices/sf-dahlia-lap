import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'

const {
  alternate_contact_options,
  phone_type_options,
} = formOptions

// To do: possibly refactor to massage these values to be purely camelcase
// issue: they don't map out one-to-one e.g. Agency_Name vs agency
let fieldMapper = {
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Alternate_Contact_Type: 'alternateContactType',
  Alternate_Contact_Type_Other: 'alternateContactTypeOther',
  Agency_Name: 'agency',
  Email: 'email',
  Phone: 'phone',
  Phone_Type: 'phoneType'
}

const AlternateContactSection = ({editValues}) => {
  let autofillValues = {}
  if (editValues && editValues.Alternate_Contact) {
    _.forEach(fieldMapper, (shortFormField, salesforceField) => {
      autofillValues[shortFormField] = editValues.Alternate_Contact[salesforceField]
    })
  }
  return (
    <NestedForm field="alternateContact">
      <Form defaultValues={autofillValues}>
        { formApi => (
          <div className="border-bottom margin-bottom--2x">
            <div className="row">
              <h3>Alternate Contact</h3>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="small-4 columns">
                  <label>First Name</label>
                  <Text field="firstName" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middleName" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name</label>
                  <Text field="lastName" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <label>Alternate Contact Type</label>
                <Select field="alternateContactType" options={alternate_contact_options} />
              </div>
              <div className="small-4 columns">
                <label>Alternate Contact Type Other</label>
                <Text field="alternateContactTypeOther" />
              </div>
              <div className="small-4 columns">
                <label>Agency (if applicable)</label>
                <Text field="agency" />
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <label>Email</label>
                <Text field="email" />
              </div>
              <div className="small-4 columns">
                <label>Phone</label>
                <Text field="phone" />
              </div>
              <div className="small-4 columns">
                <label>Phone Type</label>
                <Select field="phoneType" options={phone_type_options} />
              </div>
            </div>
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default AlternateContactSection
