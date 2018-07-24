import React from 'react'
import { Select } from 'react-form'
import formOptions from '../formOptions'
import { buildFieldId } from './utils'

const {
  preference_proof_options_nrhp
} = formOptions

const NeighborhoodResidentFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Household Member with Proof</label>
        <Select
          field={buildFieldId(i,'naturalKey')}
          options={householdMembers}
        />
        <label>Type of Proof</label>
        <Select
          field={buildFieldId(i,'type_of_proof')}
          options={preference_proof_options_nrhp}
        />
      </div>
      <div className="small-12 columns">
        <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
        <p>If the HH member name on the proof is not the primary applicant, you must enter their residence address in the Household Members table above. MOHCD will verify that their address qualifies for this preference.</p>
      </div>
    </div>
  )
}

export default NeighborhoodResidentFields
