import React from 'react'
import formOptions from './formOptions'
import { SelectField, InputField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import validate from '~/utils/form/validations'

let {
  genderOptions,
  sexualOrientationOptions,
  raceOptions,
  ethnicityOptions
} = formOptions

const DemographicInfoSection = ({ values: { demographics } }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Demographic Information</h3>
      <div className='row'>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.ethnicity'
            label='Ethnicity'
            options={ethnicityOptions}
            validation={validate.isPresent('Ethnicity is required')} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.race'
            label='Race'
            options={raceOptions}
            validation={validate.isPresent('Race is required')} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.gender'
            label='Gender'
            options={genderOptions}
            validation={!demographics || (demographics && !demographics.gender_other) ? validate.isPresent('Gender is required') : ''} />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.gender_other'
            label='Gender Specify (if not listed)'
            maxLength={maxLengthMap['gender_other']}
            validation={!demographics || (demographics && !demographics.gender) ? validate.isPresent('Gender is required') : ''} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.sexual_orientation'
            label='Sexual Orientation'
            options={sexualOrientationOptions}
            validation={!demographics || (demographics && !demographics.sexual_orientation_other) ? validate.isPresent('Sexual Orientation is required') : ''} />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.sexual_orientation_other'
            label='Sexual Orientation (if not listed)'
            maxLength={maxLengthMap['sexual_orientation_other']}
            validation={!demographics || (demographics && !demographics.sexual_orientation) ? validate.isPresent('Sexual Orientation is required') : ''} />
        </div>
      </div>
      <div className='row' />
    </div>
  )
}

export default DemographicInfoSection
