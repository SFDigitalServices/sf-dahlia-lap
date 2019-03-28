import React from 'react'
import formOptions from './formOptions'
import { NestedForm, Form, Select, Text } from 'react-form'
import { maxLengthMap } from '~/utils/formUtils'

let {
  genderOptions,
  sexualOrientationOptions,
  raceOptions,
  ethnicityOptions
} = formOptions

const DemographicInfoSection = ({ defaultValues }) => {
  return (
    <NestedForm field='demographics'>
      <Form defaultValues={defaultValues}>
        { formApi => (
          <div className='border-bottom margin-bottom--2x'>
            <h3>Demographic Information</h3>
            <div className='row'>
              <div className='small-6 columns'>
                <label>Ethnicity</label>
                <Select field='ethnicity' options={ethnicityOptions} />
              </div>
              <div className='small-6 columns'>
                <label>Race</label>
                <Select field='race' options={raceOptions} />
              </div>
              <div className='small-6 columns'>
                <label>Gender</label>
                <Select field='gender' options={genderOptions} />
              </div>
              <div className='small-6 columns'>
                <label>Gender Specify (if not listed)</label>
                <Text field='gender_other' maxLength={maxLengthMap['gender_other']} />
              </div>
              <div className='small-6 columns'>
                <label>Sexual Orientation</label>
                <Select field='sexual_orientation' options={sexualOrientationOptions} />
              </div>
              <div className='small-6 columns'>
                <label>Sexual Orientation (if not listed)</label>
                <Text field='sexual_orientation_other' maxLength={maxLengthMap['sexual_orientation_other']} />
              </div>
            </div>
            <div className='row' />
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default DemographicInfoSection
