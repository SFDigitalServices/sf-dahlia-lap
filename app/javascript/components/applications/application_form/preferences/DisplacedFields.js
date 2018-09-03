import React from 'react'
import { buildFieldId } from './utils'
import { Field } from '~/utils/form/Field'

const DisplacedFields = ({ formApi, householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <Field.Select
          field={buildFieldId(i, 'naturalKey')}
          label='Person Who Claimed'
          blockNote='(required)'
          options={householdMembers}
        />
      </div>
      <div className='small-6 columns'>
        <Field.Text
          field={buildFieldId(i, 'certificate_number')}
          label='DTHP Certificate Number'
        />
      </div>
      <div className='small-12 columns'>
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default DisplacedFields
