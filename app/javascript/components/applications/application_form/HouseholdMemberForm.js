import React from 'react'
import AddressForm from './AddressForm'
import { Field } from '~/utils/form/Field'
import { MultiDateField } from '~/utils/form/MultiDateField'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from '~/components/applications/application_form/formOptions'

const {
  relationshipOptions
} = formOptions

const HouseholdMemberForm = ({ i, formApi }) => {
  return (
    <div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-3 columns'>
            <Field.Text
              id={`household_members_${i}_first_name`}
              label='First Name'
              field={`household_members.${i}.first_name`}
              blockNote='(required)'
              errorMessage={(label, error) => error}
              maxLength={maxLengthMap['first_name']}
            />
          </div>
          <div className='small-2 columns'>
            <Field.Text
              id={`household_members_${i}_middle_name`}
              label='Middle Name'
              field={`household_members.${i}.middle_name`}
              maxLength={maxLengthMap['middle_name']}
            />
          </div>
          <div className='small-3 columns'>
            <Field.Text
              id={`household_members_${i}_last_name`}
              label='Last Name'
              field={`household_members.${i}.last_name`}
              blockNote='(required)'
              errorMessage={(label, error) => error}
              maxLength={maxLengthMap['last_name']}
            />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              id={`household_members_${i}_date_of_birth`}
              field={`household_members.${i}.date_of_birth`}
              formApi={formApi}
              label='Date of Birth'
              blockNote='(required)'
              errorMessage={(label, error) => error}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-12 columns'>
          <AddressForm
            memberType='householdMember'
            nestedField={`household_members.${i}`} />
        </div>
      </div>
      <div className='row'>
        <div className='small-6 columns'>
          <Field.Select
            label='Relationship to Applicant'
            field={`household_members.${i}.relationship_to_applicant`}
            id={`household_members_${i}_relationship_to_applicant`}
            options={relationshipOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
