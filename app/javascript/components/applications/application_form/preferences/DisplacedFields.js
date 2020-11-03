import React from 'react'

import { InputField, SelectField } from 'utils/form/final_form/Field'
import validate from 'utils/form/validations'
import { maxLengthMap } from 'utils/formUtils'

import { buildFieldId } from './utils'

const DisplacedFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          fieldName={buildFieldId(i, 'naturalKey')}
          label='Person Who Claimed'
          blockNote='(required)'
          options={householdMembers}
          validation={validate.isPresent('Person Who Claimed is required')}
        />
      </div>
      <div className='small-6 columns'>
        <InputField
          fieldName={buildFieldId(i, 'certificate_number')}
          label='DTHP Certificate Number'
          maxLength={maxLengthMap.certificate_number}
        />
      </div>
      <div className='small-12 columns'>
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default DisplacedFields
