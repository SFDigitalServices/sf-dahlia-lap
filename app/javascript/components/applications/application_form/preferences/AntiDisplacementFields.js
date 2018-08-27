import React from 'react'
import formOptions from '../formOptions'
import { buildFieldId } from './utils'
import { Field } from '~/utils/form/Field'

const {
  preference_proof_options_nrhp
} = formOptions

const AntiDisplacementFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <Field.Select
          label="Household Member with Proof"
          blockNote="(required)"
          field={buildFieldId(i,'naturalKey')}
          options={householdMembers}
        />
        <Field.Select
          label="Type of Proof"
          blockNote="(required)"
          field={buildFieldId(i,'preferenceProof')}
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

export default AntiDisplacementFields
