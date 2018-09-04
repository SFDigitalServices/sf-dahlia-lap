import React from 'react'
import formOptions from '../formOptions'
import { buildFieldId } from './utils'
import { Field } from '~/utils/form/Field'

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

const LiveWorkFields = ({ i, householdMembers, shortFormPreference }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <Field.Select
          label='Household Member with Proof'
          blockNote='(required)'
          field={buildFieldId(i, 'naturalKey')}
          options={householdMembers}
        />
      </div>
      <div className='small-6 columns'>
        <Field.Select
          label='Individual Preference'
          blockNote='(required)'
          field={buildFieldId(i, 'individual_preference')}
          options={individualPreferenceOptions}
        />
      </div>
      <div className='small-6 columns'>
        <Field.Select
          label='Type of Proof'
          blockNote='(required)'
          field={buildFieldId(i, 'type_of_proof')}
          options={getProofTypes(shortFormPreference.individual_preference)}
        />
      </div>
      <div className='small-12 columns'>
        <p>Please check to make sure that a document proving the preference address was attached to the application. If no proof document was attached, do not select this preference.</p>
      </div>
    </div>
  )
}

export default LiveWorkFields
