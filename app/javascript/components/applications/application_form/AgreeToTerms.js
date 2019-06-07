import React from 'react'
import { CheckboxField } from '~/utils/form/final_form/Field'
import validate from '~/utils/form/validations'

const AgreeToTerms = () => (
  <div className='checkbox-group' role='group'>
    <div className='form-item' >
      <div className='checkbox'>
        <CheckboxField
          fieldName='terms_acknowledged'
          id='agreeToTerms'
          label='Signature on Terms of Agreement'
          validation={validate.isChecked('Signature on Terms of Agreement is required')} />
      </div>
    </div>
  </div>
)

export default AgreeToTerms
