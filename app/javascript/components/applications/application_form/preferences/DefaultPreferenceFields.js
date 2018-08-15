import React from 'react'

import { buildFieldId } from './utils'
import { Field } from '~/utils/form/Field'

const DefaultPreferenceFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className="small-6 columns">
        <label>Household Member with Proof</label>
        <Field.Select
          field={buildFieldId(i,'naturalKey')}
          options={householdMembers}
        />
      </div>
      <div className="small-12 columns"></div>
    </div>
  )
}

export default DefaultPreferenceFields
