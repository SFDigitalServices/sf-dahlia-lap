import React from 'react'
import formOptions from './formOptions'
import { NestedForm, Form, Select, Text } from 'react-form'

let {
  gender_options,
  sexual_orientation_options,
  sex_at_birth_options,
  race_options,
  ethnicity_options,
} = formOptions

const DemographicInfoSection = ({editPage}) => {
  return (
    <NestedForm field="demographics">
      <Form>
        { formApi => (
          <div className="border-bottom margin-bottom--2x">
            <h3>Demographic Information</h3>
            <div className="row">
              <div className="small-3 columns">
                <label>Gender</label>
                <Select field="gender" options={gender_options} />
              </div>
              <div className="small-3 columns">
                <label>Gender Specify (if not listed)</label>
                <Text field="genderOther" />
              </div>
              <div className="small-3 columns">
                <label>Sexual Orientation</label>
                <Select field="sexualOrientation" options={sexual_orientation_options} />
              </div>
              <div className="small-3 columns">
                <label>Sexual Orientation (if not listed)</label>
                <Text field="sexualOrientationOther" />
              </div>
            </div>
            <div className="row">
              <div className="small-4 columns">
                <label>Sex at birth</label>
                <Select field="sexAtBirth" options={sex_at_birth_options} />
              </div>
              <div className="small-4 columns">
                <label>Race</label>
                <Select field="race" options={race_options} />
              </div>
              <div className="small-4 columns">
                <label>Ethnicity</label>
                <Select field="ethnicity" options={ethnicity_options} />
              </div>
            </div>
          </div>
        )}
      </Form>
    </NestedForm>
  )
}

export default DemographicInfoSection
