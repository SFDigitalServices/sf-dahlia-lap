import React from 'react'
import AddressForm from './AddressForm'
import { maxLengthMap } from 'utils/formUtils'
import formOptions from 'components/applications/application_form/formOptions'
import { InputField, SelectField } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import validate from 'utils/form/validations'

const { relationshipOptions } = formOptions

const HouseholdMemberForm = ({ i, form }) => {
  return (
    <div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-3 columns'>
            <InputField
              id={`household_members_${i}_first_name`}
              label='First Name'
              fieldName={`household_members[${i}].first_name`}
              blockNote='(required)'
              maxLength={maxLengthMap.first_name}
              validation={validate.isPresent('Please enter a First Name')}
            />
          </div>
          <div className='small-2 columns'>
            <InputField
              id={`household_members_${i}_middle_name`}
              label='Middle Name'
              fieldName={`household_members[${i}].middle_name`}
              maxLength={maxLengthMap.middle_name}
            />
          </div>
          <div className='small-3 columns'>
            <InputField
              id={`household_members_${i}_last_name`}
              label='Last Name'
              fieldName={`household_members[${i}].last_name`}
              blockNote='(required)'
              maxLength={maxLengthMap.last_name}
              validation={validate.isPresent('Please enter a Last Name')}
            />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              form={form}
              fieldName={`household_members[${i}].date_of_birth`}
              id={`household_members_${i}_date_of_birth`}
              index={i}
              formName='household_members'
              label='Date of Birth'
              blockNote='(required)'
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-12 columns'>
          <AddressForm fieldName={`household_members[${i}]`} />
        </div>
      </div>
      <div className='row'>
        <div className='small-6 columns'>
          <SelectField
            label='Relationship to Applicant'
            fieldName={`household_members[${i}].relationship_to_applicant`}
            id={`household_members_${i}_relationship_to_applicant`}
            options={relationshipOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
