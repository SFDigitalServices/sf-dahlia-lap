import React from 'react'
import AddressForm from './AddressForm'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from '~/components/applications/application_form/formOptions'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'

const {
  relationshipOptions
} = formOptions

const HouseholdMemberForm = ({name, index}) => {
  console.log('name', name, 'index', index)
  return (
    <div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-3 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_first_name`}
              label='First Name'
              fieldName={`${name}.first_name`}
              blockNote='(required)'
              errorMessage={(label, error) => error}
              maxLength={maxLengthMap['first_name']}
            />
          </div>
          <div className='small-2 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_middle_name`}
              label='Middle Name'
              fieldName={`${name}.middle_name`}
              maxLength={maxLengthMap['middle_name']}
            />
          </div>
          <div className='small-3 columns'>
            <FieldWrapper
              type='text'
              id={`household_members_${index}_last_name`}
              label='Last Name'
              fieldName={`${name}.last_name`}
              blockNote='(required)'
              errorMessage={(label, error) => error}
              maxLength={maxLengthMap['last_name']}
            />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              form={form}
              fieldName={`${name}.date_of_birth`}
              label='Date of Birth'
              blockNote='(required)'
              validation={validate.any(
                validate.isPresent('Please enter a Date of Birth'),
                validate.isValidDate('Please enter a valid Date of Birth'),
              )}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='small-12 columns'>
          {/*<AddressForm
            memberType='householdMember'
            nestedField={`household_members`} />*/}
        </div>
      </div>
      <div className='row'>
        <div className='small-6 columns'>
          <SelectField
            label='Relationship to Applicant'
            fieldName={`${name}.relationship_to_applicant`}
            id={`household_members_${index}_relationship_to_applicant`}
            options={relationshipOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
