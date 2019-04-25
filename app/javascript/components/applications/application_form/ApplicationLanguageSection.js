import React from 'react'
import formOptions from './formOptions'
import { Field } from '~/utils/form/Field'

const {
  applicationLanguageOptions
} = formOptions

const ApplicationLanguageSection = ({ formApi, editValues }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <div className='small-4 columns'>
          <Field.Select
            label='Language Submitted In'
            blockNote='(required)'
            id='application_language'
            field='application_language'
            errorMessage={(_, error) => error}
            options={applicationLanguageOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default ApplicationLanguageSection
