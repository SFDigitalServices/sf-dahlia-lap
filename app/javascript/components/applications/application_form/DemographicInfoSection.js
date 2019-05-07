import React from 'react'
import formOptions from './formOptions'
import { SelectField, FieldWrapper, } from '~/utils/form/final_form/Field'
// import { NestedForm, Form, Select, Text } from 'react-form'
import { maxLengthMap } from '~/utils/formUtils'

let {
  genderOptions,
  sexualOrientationOptions,
  raceOptions,
  ethnicityOptions
} = formOptions

const DemographicInfoSection = ({ defaultValues }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Demographic Information</h3>
      <div className='row'>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.ethnicity'
            label='Ethnicity'
            options={ethnicityOptions} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.race'
            label='Race'
            options={raceOptions} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.gender'
            label='Gender'
            options={genderOptions} />
        </div>
        <div className='small-6 columns'>
          <FieldWrapper
            fieldName='demographics.gender_other'
            label='Gender Specify (if not listed)'
            type='text'
            maxLength={maxLengthMap['gender_other']}
          />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.sexual_orientation'
            label='Sexual Orientation'
            options={sexualOrientationOptions}
          />
        </div>
        <div className='small-6 columns'>
          <FieldWrapper
            type='text'
            fieldName='demographics.sexual_orientation_other'
            label='Sexual Orientation (if not listed)'
            maxLength={maxLengthMap['sexual_orientation_other']}
          />
        </div>
      </div>
      <div className='row' />
    </div>
  )
}

export default DemographicInfoSection
