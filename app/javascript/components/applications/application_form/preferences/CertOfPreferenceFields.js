import React from 'react'

import { InputField, SelectField } from 'utils/form/final_form/Field'
import validate from 'utils/form/validations'
import { maxLengthMap } from 'utils/formUtils'

import { buildFieldId } from './utils'

const CertOfPreferenceFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          fieldName={buildFieldId(i, 'naturalKey')}
          label='Name of COP Holder'
          blockNote='(required)'
          options={householdMembers}
          validation={validate.isPresent('Name of COP Holder is required')}
        />
      </div>
      <div className='small-6 columns'>
        <InputField
          fieldName={buildFieldId(i, 'certificate_number')}
          label='COP Certificate Number'
          maxLength={maxLengthMap.certificate_number}
        />
      </div>
      <div className='small-12 columns'>
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default CertOfPreferenceFields
