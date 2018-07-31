import React from 'react'
import classNames from 'classnames'
import { Text } from 'react-form'
import AddressForm from './AddressForm'

const HouseholdMemberForm = ({ i }) => {
  return (
    <div>
      <div className="row">
        <div className="form-group">
          <div className="small-3 columns">
            <label>First Name</label>
            <Text field={`householdMembers.${i}.firstName`} />
          </div>
          <div className="small-3 columns">
            <label>Middle Name</label>
            <Text field={`householdMembers.${i}.middleName`} />
          </div>
          <div className="small-3 columns">
            <label>Last Name</label>
            <Text field={`householdMembers.${i}.lastName`} />
          </div>
          <div className="small-3 columns">
            <label>Date of Birth</label>
            <Text
              field={`householdMembers.${i}.DOB`}
              type="date" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="small-12 columns">
          <AddressForm
            memberType="householdMember"
            nestedField={`householdMembers.${i}`}  />
        </div>
      </div>
    </div>
  )
}

export default HouseholdMemberForm
