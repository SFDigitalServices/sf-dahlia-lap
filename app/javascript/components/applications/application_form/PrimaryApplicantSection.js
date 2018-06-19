import React from 'react'
import { Form, NestedForm, Text, Select } from 'react-form'
import DatePickerText from './DatePickerText'
import formOptions from './formOptions'
import AddressForm from './AddressForm'

import soqlToApiMappers from '~/components/soqlToApiMappers'

let { phone_type_options } = formOptions

let mailingAddressFieldMap = {
  address: 'mailingAddress',
  city: 'mailingCity',
  state: 'mailingState',
  zip: 'mailingZip',
}

const PrimaryApplicantSection = ({formApi, editValues }) => {
  let autofillValues = {}
  if (editValues && !formApi.values.primaryApplicant) {
    autofillValues = soqlToApiMappers.mapApplicant(editValues.Applicant)
    formApi.values.primaryApplicant = autofillValues
  }
  return (
    <NestedForm field="primaryApplicant">
      <Form defaultValues={autofillValues}>
        { formApi => (
          <div className="border-bottom margin-bottom--2x">
            <div className="row">
              <h3>Primary Applicant</h3>
            </div>
            <div className="row">
              <div className="form-group">
                <div className="small-4 columns">
                  <label>First Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text required="true" field="firstName" />
                </div>
                <div className="small-4 columns">
                  <label>Middle Name</label>
                  <Text field="middleName" />
                </div>
                <div className="small-4 columns">
                  <label>Last Name <span className="checkbox-block_note no-margin">(required)</span></label>
                  <Text required="true" field="lastName" />
                </div>
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
            <div className="row">
              <div className="small-4 columns">
                <label>DOB <span className="checkbox-block_note no-margin">- YYYY-MM-DD (required)</span></label>
                <DatePickerText
                  required={true}
                  prefilledDate={autofillValues['DOB']}
                  dateFormat="YYYY-MM-DD"
                  showYearDropdown
                  dropdownMode="select"
                  field="DOB" />
              </div>
            </div>

            <AddressForm title="Home Address" memberType="primaryApplicant" />
            <AddressForm title="Mailing Address" memberType="primaryApplicant"  fieldMap={mailingAddressFieldMap} />

          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default PrimaryApplicantSection
