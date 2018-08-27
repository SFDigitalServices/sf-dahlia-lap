import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'
import AddressForm from './AddressForm'
import { mailingAddressFieldMap } from './utils'

const {
  alternate_contact_options,
  phone_type_options,
} = formOptions

const AlternateContactSection = ({editValues}) => {
  let autofillValues = {}
  if (editValues && editValues.alternate_contact) {
    autofillValues = editValues.alternate_contact
  }
  return (
    <NestedForm field="alternate_contact">
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
                  <Text field="first_name" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middle_name" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name</label>
                  <Text field="last_name" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <label>Alternate Contact Type</label>
                <Select field="alternate_contact_type" options={alternate_contact_options} />
              </div>
              <div className="small-4 columns">
                <label>Alternate Contact Type Other</label>
                <Text field="alternate_contact_type_other" />
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
                <Select field="phone_type" options={phone_type_options} />
              </div>
            </div>
            <AddressForm title="Mailing Address" memberType="alternateContact" fieldMap={mailingAddressFieldMap} />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default AlternateContactSection
