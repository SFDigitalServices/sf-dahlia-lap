import React from 'react'
import { Select, Text } from 'react-form'
import { buildFieldId } from './utils'

const CertOfPreferenceFields = ({ formApi, i, householdMembers }) => {
  const errors =  formApi.errors && formApi.errors.preferences[i]
  return (
    <div>
      <div>Errors: {JSON.stringify(errors)}</div>
      <div className="small-6 columns">
        <label>Name of COP Holder</label>
        <Select
          field={buildFieldId(i,'naturalKey')}
          options={householdMembers}
          value={buildFieldId(i,'naturalKey')}
        />
      </div>
      <div className="small-6 columns">
        <label>COP Certificate Number</label>
        <Text
          field={buildFieldId(i,'certificate_number')}
        />
      </div>
      <div className="small-12 columns">
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default CertOfPreferenceFields
