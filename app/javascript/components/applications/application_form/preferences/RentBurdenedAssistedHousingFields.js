import React from 'react'
import { buildFieldId } from './utils'
import { SelectField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'

const individualPreferenceOptions = [
  {value: 'Assisted Housing', label: 'Assisted Housing'},
  {value: 'Rent Burdened', label: 'Rent Burdened'}
]

const RentBurdenedAssistedHousingFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          label='Name on Lease'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'naturalKey')}
          options={householdMembers}
          validation={validate.isPresent('Name on Lease is required')}
        />
      </div>
      <div className='small-6 columns'>
        <SelectField
          label='Individual Preference'
          blockNote='(required)'
          fieldName={buildFieldId(i, 'individual_preference')}
          options={individualPreferenceOptions}
          validation={validate.isPresent('Individual Preference is required')}
        />
      </div>
      <div className='small-12 columns'>
        <p>Do not give this preference unless applicant has provided a lease.</p>
        <p>If the person who lives in assisted housing is not the primary applicant, enter their address in the Household Members table above.</p>
      </div>
    </div>
  )
}

export default RentBurdenedAssistedHousingFields
