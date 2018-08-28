import React from 'react'
import { Text } from 'react-form'
import AddressForm from './AddressForm'

const HouseholdMemberForm = ({ i }) => {
  return (
    <div>
      <div className="row">
        <div className="form-group">
          <div className="small-3 columns">
            <label>First Name</label>
            <Text field={`household_members.${i}.first_name`} />
          </div>
          <div className="small-3 columns">
            <label>Middle Name</label>
            <Text field={`household_members.${i}.middle_name`} />
          </div>
          <div className="small-3 columns">
            <label>Last Name</label>
            <Text field={`household_members.${i}.last_name`} />
          </div>
          <div className="small-3 columns">
              <label>Date of Birth</label>
            <Text
              field={`household_members.${i}.date_of_birth`}
              type="date"
              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
              placeholder="YYYY-MM-DD" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="small-12 columns">
          <AddressForm
            memberType="householdMember"
            nestedField={`household_members.${i}`}  />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
