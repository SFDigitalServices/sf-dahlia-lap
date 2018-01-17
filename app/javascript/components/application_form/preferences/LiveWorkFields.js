import React from 'react'
import { Select } from 'react-form'
import formOptions from '../formOptions'

const {
  preference_proof_options_default
} = formOptions

const LiveWorkFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Household Member with Proof</label>
        <Select
          field={`shortFormPreferences.${i}.naturalKey`}
          options={householdMembers}
        />
      </div>
      <div className="small-6 columns">
        <label>Individual Preference</label>
        <Select
          field={`shortFormPreferences.${i}.liveOrWork`}
          options={[{value: 'Live in SF', label: 'Live in SF'},
            {value: 'Work in SF', label: 'Work in SF'}]}
        />
      </div>
      <div className="small-6 columns">
        <label>Type of Proof</label>
        <Select
          field={`shortFormPreferences.${i}.preferenceProof`}
          options={preference_proof_options_default}
        />
      </div>
      <div className="small-12 columns">
        <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
      </div>
    </div>
  )
}

export default LiveWorkFields
