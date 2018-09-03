import React from 'react'
import { buildFieldId } from './utils'
import { Field } from '~/utils/form/Field'

const individualPreferenceOptions = [
  {value: 'Assisted Housing', label: 'Assisted Housing'},
  {value: 'Rent Burdened', label: 'Rent Burdened'}
]

const RentBurdenedAssistedHousingFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <Field.Select
          label='Name on Lease'
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
      <div className='small-12 columns'>
        <p>Do not give this preference unless applicant has provided a lease.</p>
        <p>If the person who lives in assisted housing is not the primary applicant, enter their address in the Household Members table above.</p>
      </div>
    </div>
  )
}

export default RentBurdenedAssistedHousingFields
