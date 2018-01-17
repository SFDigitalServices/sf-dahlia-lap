import React from 'react'
import { Select, Text } from 'react-form'

const DisplacedFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Person Who Claimed</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
        />
      </div>
      <div className="small-6 columns">
        <label>DTHP Certificate Number</label>
        <Text
          field={`shortFormPreferences.${i}.certificateNumber`}
        />
      </div>
      <div className="small-12 columns">
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default DisplacedFields
