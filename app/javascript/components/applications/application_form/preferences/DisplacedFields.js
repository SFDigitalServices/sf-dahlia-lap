import React from 'react'
import { buildFieldId } from './utils'
import { InputField, SelectField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import validate from '~/utils/form/validations'

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
