import React from 'react'
import { Text } from 'react-form'
import AddressForm from './AddressForm'
import { MultiDateField } from '~/utils/form/Field'

const HouseholdMemberForm = ({ i, formApi }) => {
  return (
    <div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-3 columns'>
            <label>First Name</label>
            <Text field={`household_members.${i}.first_name`} />
          </div>
          <div className='small-2 columns'>
            <label>Middle Name</label>
            <Text field={`household_members.${i}.middle_name`} />
          </div>
          <div className='small-3 columns'>
            <label>Last Name</label>
            <Text field={`household_members.${i}.last_name`} />
          </div>
          <div className='small-4 columns form-date-of-birth'>
            <MultiDateField
              id='date_of_birth'
              field={`household_members.${i}.date_of_birth`}
              formApi={formApi}
              label='Date of Birth'
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
    </div>
  )
}

export default HouseholdMemberForm
