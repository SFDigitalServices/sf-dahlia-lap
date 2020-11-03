import React from 'react'

import { SelectField } from 'utils/form/final_form/Field'
import validate from 'utils/form/validations'

import formOptions from './formOptions'

const { applicationLanguageOptions } = formOptions

const ApplicationLanguageSection = ({ editValues }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <div className='small-4 columns'>
          <SelectField
            label='Language Submitted In'
            blockNote='(required)'
            fieldName='application_language'
            id='application_language'
            options={applicationLanguageOptions}
            validation={validate.isPresent('Please select a language.')}
          />
        </div>
      </div>
    </div>
  )
}

export default ApplicationLanguageSection
