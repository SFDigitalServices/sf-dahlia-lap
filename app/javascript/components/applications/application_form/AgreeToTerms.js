import React from 'react'
import { CheckboxField } from '~/utils/form/final_form/Field'

const AgreeToTerms = () => (
  <div className='checkbox-group' role='group'>
    <div className='form-item' >
      <div className='checkbox'>
        <CheckboxField
          fieldName='terms_acknowledged'
          id='agreeToTerms'
          label='Signature on Terms of Agreement' />
      </div>
    </div>
  </div>
)

export default AgreeToTerms
