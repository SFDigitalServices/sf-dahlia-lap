import React from 'react'
import AddressForm from './AddressForm'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from '~/components/applications/application_form/formOptions'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'

const {
  relationshipOptions
} = formOptions

const HouseholdMemberForm = ({fieldName, index, form}) => {
  return (
    <div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-3 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_first_name`}
              label='First Name'
              fieldName={`${fieldName}.first_name`}
              blockNote='(required)'
              maxLength={maxLengthMap['first_name']}
            />
          </div>
          <div className='small-2 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_middle_name`}
              label='Middle Name'
              fieldName={`${fieldName}.middle_name`}
              maxLength={maxLengthMap['middle_name']}
            />
          </div>
          <div className='small-3 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_last_name`}
              label='Last Name'
              fieldName={`${fieldName}.last_name`}
              blockNote='(required)'
              maxLength={maxLengthMap['last_name']}
            />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              form={form}
              fieldName={`${fieldName}.date_of_birth`}
              id={`household_members_${index}_date_of_birth`}
              index={index}
              formName='household_members'
              label='Date of Birth'
              blockNote='(required)'
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-12 columns'>
          <AddressForm fieldName={fieldName} />
        </div>
      </div>
      <div className='row'>
        <div className='small-6 columns'>
          <SelectField
            label='Relationship to Applicant'
            fieldName={`${fieldName}.relationship_to_applicant`}
            id={`household_members_${index}_relationship_to_applicant`}
            options={relationshipOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
