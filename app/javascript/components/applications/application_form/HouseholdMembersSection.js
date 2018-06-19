import React from 'react'
import { forEach } from 'lodash'
import HouseholdMemberForm from './HouseholdMemberForm'

import soqlToApiMappers from '~/components/soqlToApiMappers'

const HouseholdMembersSection = ({ formApi, editValues }) => {
  let autofillHouseholdMembers = []
  if (editValues && editValues.household_members && !formApi.values.householdMembers) {
    forEach(editValues.household_members, (member) => {
      let editMember = soqlToApiMappers.mapHouseholdMembers(member)
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
