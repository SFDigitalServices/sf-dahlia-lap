import React from 'react'
import formOptions from '../formOptions'
import { buildFieldId } from './utils'
import { SelectField } from '~/utils/form/final_form/Field'

const {
  preferenceProofOptionsLiveSf,
  preferenceProofOptionsWorkSf
} = formOptions

const getProofTypes = (pref) => {
  if (pref === 'Live in SF') {
    return preferenceProofOptionsLiveSf
  } else if (pref === 'Work in SF') {
    return preferenceProofOptionsWorkSf
  } else {
    return []
  }
}

const individualPreferenceOptions = [
  {value: 'Live in SF', label: 'Live in SF'},
  {value: 'Work in SF', label: 'Work in SF'}
]

const LiveWorkFields = ({ i, householdMembers, selectedPreference }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          label='Household Member with Proof'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'naturalKey')}
          options={householdMembers}
        />
      </div>
      <div className='small-6 columns'>
        <SelectField
          label='Individual Preference'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'individual_preference')}
          options={individualPreferenceOptions}
        />
      </div>
      <div className='small-6 columns'>
        <SelectField
          label='Type of Proof'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'type_of_proof')}
          options={getProofTypes(selectedPreference.individual_preference)}
        />
      </div>
      <div className='small-12 columns'>
        <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
      </div>
    </div>
  )
}

export default LiveWorkFields
