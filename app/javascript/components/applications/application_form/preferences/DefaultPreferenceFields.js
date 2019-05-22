import React from 'react'
import { buildFieldId } from './utils'
import { SelectField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'

const DefaultPreferenceFields = ({ householdMembers, i }) => {
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
      </div>
      <div className='small-12 columns' />
    </div>
  )
}

export default DefaultPreferenceFields
