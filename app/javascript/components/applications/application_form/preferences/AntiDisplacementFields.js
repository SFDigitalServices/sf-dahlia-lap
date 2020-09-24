import React from 'react'
import formOptions from '../formOptions'
import { buildFieldId } from './utils'
import { SelectField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'

const { preferenceProofOptionsNrhp } = formOptions

const AntiDisplacementFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          label='Household Member with Proof'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'naturalKey')}
          options={householdMembers}
          validation={validate.isPresent('Household Member with Proof is required')}
        />
        <SelectField
          label='Type of Proof'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'type_of_proof')}
          options={preferenceProofOptionsNrhp}
          validation={validate.isPresent('Type of Proof is required')}
        />
      </div>
      <div className='small-12 columns'>
        <p>
          Please check to make sure that a document proving the preference address was attached to
          the application. If no proof document was attached, do not select this preference.
        </p>
        <p>
          If the HH member name on the proof is not the primary applicant, you must enter their
          residence address in the Household Members table above. MOHCD will verify that their
          address qualifies for this preference.
        </p>
      </div>
    </div>
  )
}

export default AntiDisplacementFields
