import React from 'react'
import { buildFieldId } from './utils'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'

const CertOfPreferenceFields = ({ householdMembers, i }) => {
  return (
    <div>
      <div className='small-6 columns'>
        <SelectField
          fieldName={buildFieldId(i, 'naturalKey')}
          label='Name of COP Holder'
          blockNote='(required)'
          options={householdMembers}
        />
      </div>
      <div className='small-6 columns'>
        <FieldWrapper
          fieldName={buildFieldId(i, 'certificate_number')}
          label='COP Certificate Number'
          maxLength={maxLengthMap['certificate_number']}
        />
      </div>
      <div className='small-12 columns'>
        <p>MOHCD will verify that the applicant holds a valid certificate. No proof is required.</p>
      </div>
    </div>
  )
}

export default CertOfPreferenceFields
