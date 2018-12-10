import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'
import { isEmpty } from 'lodash'

const HouseholdMembersSection = ({ formApi, editValues }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Household Members</h3>
      </div>
      { !isEmpty(formApi.values.household_members) && formApi.values.household_members.map((member, i) => (
        <div className='border-bottom margin-bottom--2x' key={i}>
          <HouseholdMemberForm i={i} formApi={formApi} />
          <div className='row'>
            <div className='form-group'>
              <div className='small-4 columns'>
                <button
                  onClick={() => formApi.removeValue('household_members', i)}
                  type='button'
                  className='mb-4 btn btn-danger'>
                    Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='row'>
        <div className='form-group'>
          <div className='small-4 columns'>
            <button
              onClick={() => formApi.addValue('household_members', '')}
              type='button'
              className='mb-4 mr-4 btn btn-success'
              id='add-additional-member'>
                + Additional Member
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HouseholdMembersSection
