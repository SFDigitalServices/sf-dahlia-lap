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
  const validateRelatedField = (validationMessage, relatedField) => {
    if (!demographics || (demographics && !demographics[relatedField])) {
      return validate.isPresent(validationMessage)
    }
    return ''
  }
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
            validation={validateRelatedField('Gender is required', 'gender_other')} />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.gender_other'
            label='Gender Specify (if not listed)'
            maxLength={maxLengthMap['gender_other']}
            validation={validateRelatedField('Gender is required', 'gender')} />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.sexual_orientation'
            label='Sexual Orientation'
            options={sexualOrientationOptions}
            validation={validateRelatedField('Sexual Orientation is required', 'sexual_orientation_other')} />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.sexual_orientation_other'
            label='Sexual Orientation (if not listed)'
            maxLength={maxLengthMap['sexual_orientation_other']}
            validation={validateRelatedField('Sexual Orientation is required', 'sexual_orientation')} />
        </div>
      </div>
      <div className='row' />
    </div>
  )
}

export default DemographicInfoSection
