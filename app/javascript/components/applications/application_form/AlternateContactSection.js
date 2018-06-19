import React from 'react'
import { forEach } from 'lodash'
import { Form, NestedForm, Text, Select } from 'react-form'
import formOptions from './formOptions'

import soqlToApiMappers from '~/components/mappers/soqlToApi'

const {
  alternate_contact_options,
  phone_type_options,
} = formOptions

const AlternateContactSection = ({editValues}) => {
  let autofillValues = {}
  if (editValues && editValues.Alternate_Contact) {
    autofillValues = soqlToApiMappers.mapAlternateContact(editValues.Alternate_Contact)
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
