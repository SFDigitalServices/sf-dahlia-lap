import React from 'react'
import { Select } from 'react-form'
import { buildFieldId } from './utils'

const RentBurdenedAssistedHousingFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Name on Lease</label>
        <Select
          field={buildFieldId(i,'naturalKey')}
          options={householdMembers}
        />
      </div>
      <div className="small-6 columns">
        <label>Individual Preference</label>
        <Select
          field={buildFieldId(i,'individual_preference')}
          options={[{value: 'Assisted Housing', label: 'Assisted Housing'},
            {value: 'Rent Burdened', label: 'Rent Burdened'}]}
        />
      </div>
      <div className="small-12 columns">
        <p>Do not give this preference unless applicant has provided a lease.</p>
        <p>If the person who lives in assisted housing is not the primary applicant, enter their address in the Household Members table above.</p>
      </div>
    </div>
  )
}

export default RentBurdenedAssistedHousingFields
