import React from 'react'
import { Select } from 'react-form'

const DefaultPreferenceFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Household Member with Proof</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
        />
      </div>
    </div>
  )
}

export default DefaultPreferenceFields
