import React from 'react'
import { Select } from 'react-form'
import formOptions from './formOptions'

const {
  application_language_options
} = formOptions


const ApplicationLanguageSection = ({ formApi, editValues }) => {
  return (
    <div className="border-bottom margin-bottom--2x">
      <div className="row">
        <div className="small-4 columns">
          <label>Language Submitted In</label>
          <Select field="applicationLanguage" options={application_language_options} />
        </div>
      </div>
    </div>
  )
}

export default ApplicationLanguageSection

