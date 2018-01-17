import React from 'react'
import { Select } from 'react-form'

const CertOfPreferenceFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Name of COP Holder</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
          value={`shortFormPreferences.${i}.naturalKey`}
        />
      </div>
      <div className="small-12 columns">
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default CertOfPreferenceFields
