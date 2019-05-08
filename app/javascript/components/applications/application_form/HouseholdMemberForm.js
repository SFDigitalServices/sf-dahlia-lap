import React from 'react'
import AddressForm from './AddressForm'
import { maxLengthMap } from '~/utils/formUtils'
import formOptions from '~/components/applications/application_form/formOptions'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'
import validate from '~/utils/form/validations'

const {
  relationshipOptions
} = formOptions

const HouseholdMemberForm = ({name, index, form}) => {
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
              validation={validate.isPresent('Please enter a First Name')}
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
              maxLength={maxLengthMap['last_name']}
              validation={validate.isPresent('Please enter a Last Name')}
            />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              form={form}
              fieldName={`${name}.date_of_birth`}
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
          <AddressForm name={name} />
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
