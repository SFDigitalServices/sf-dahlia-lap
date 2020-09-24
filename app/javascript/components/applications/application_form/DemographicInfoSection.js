import React from 'react'
import formOptions from './formOptions'
import { SelectField, InputField } from '~/utils/form/final_form/Field'
import { maxLengthMap } from '~/utils/formUtils'
import validate from '~/utils/form/validations'

const { genderOptions, sexualOrientationOptions, raceOptions, ethnicityOptions } = formOptions

const DemographicInfoSection = ({
  values: { demographics },
  genderSpecifyRequired,
  orientationOtherRequired
}) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <h3>Demographic Information</h3>
      <div className='row flex-row'>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.ethnicity'
            label='Ethnicity'
            options={ethnicityOptions}
            blockNote='(required)'
            validation={validate.isPresent('Ethnicity is required')}
          />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.race'
            label='Race'
            options={raceOptions}
            blockNote='(required)'
            validation={validate.isPresent('Race is required')}
          />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.gender'
            label='Gender'
            options={genderOptions}
            blockNote='(required)'
            validation={validate.isPresent('Gender is required')}
          />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.gender_other'
            label='Gender Specify (if not listed)'
            blockNote={genderSpecifyRequired ? '(required)' : null}
            maxLength={maxLengthMap.gender_other}
          />
        </div>
        <div className='small-6 columns'>
          <SelectField
            fieldName='demographics.sexual_orientation'
            label='Sexual Orientation'
            options={sexualOrientationOptions}
            blockNote='(required)'
            validation={validate.isPresent('Sexual Orientation is required')}
          />
        </div>
        <div className='small-6 columns'>
          <InputField
            fieldName='demographics.sexual_orientation_other'
            label='Sexual Orientation (if not listed)'
            blockNote={orientationOtherRequired ? '(required)' : null}
            maxLength={maxLengthMap.sexual_orientation_other}
          />
        </div>
      </div>
      <div className='row' />
    </div>
  )
}

export default DemographicInfoSection
