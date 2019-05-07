import React from 'react'
import { buildFieldId } from './utils'
import { SelectField } from '~/utils/form/final_form/Field'

const DefaultPreferenceFields = ({ householdMembers, i }) => {
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
      <div className='small-12 columns' />
    </div>
  )
}

export default DefaultPreferenceFields
