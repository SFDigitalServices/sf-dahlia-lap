import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'

let fieldMapper = {
  Date_of_Birth: 'DOB',
  First_Name: 'firstName',
  Last_Name: 'lastName',
  Middle_Name: 'middleName',
  Street: 'address',
  City: 'city',
  State: 'state',
  Zip_Code: 'zip',
}


const HouseholdMembersSection = ({ formApi, editValues }) => {
  let autofillHouseholdMembers = []
  if (editValues && editValues.household_members && !formApi.values.householdMembers) {
    _.forEach(editValues.household_members, (member) => {
      let editMember = {}
      _.forEach(fieldMapper, (shortFormField, salesforceField) => {
        editMember[shortFormField] = member[salesforceField]
      })
      autofillHouseholdMembers.push(editMember)
    })
    formApi.values.householdMembers = autofillHouseholdMembers
  }

  return (
    <div className="border-bottom margin-bottom--2x">
      <div className="row">
        <h3>Household Members</h3>
      </div>
      { formApi.values.householdMembers && formApi.values.householdMembers.map( ( member, i ) => (
        <div className="border-bottom margin-bottom--2x" key={i}>
          <HouseholdMemberForm i={i}/>
          <div className="row">
            <div className="form-group">
              <div className="small-4 columns">
                <button
                  onClick={() => formApi.removeValue("householdMembers", i)}
                  type="button"
                  className="mb-4 btn btn-danger">
                    Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="row">
        <div className="form-group">
          <div className="small-4 columns">
            <button
              onClick={() => formApi.addValue('householdMembers', '')}
              type="button"
              className="mb-4 mr-4 btn btn-success">
                + Additional Member
            </button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default HouseholdMembersSection
