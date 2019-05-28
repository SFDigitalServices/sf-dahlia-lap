import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'
import { isEmpty } from 'lodash'
import { FieldArray } from 'react-final-form-arrays'
import validate from '~/utils/form/validations'

const memberValidate = (values) => {
  if (!values || !values.length) return
  const membersErrors = []
  values.forEach(value => {
    if (!isEmpty(value)) {
      const memberError = {date_of_birth: {}}
      validate.isValidDate(value.date_of_birth, memberError.date_of_birth, {errorMessage: 'Please enter a Date of Birth'})
      memberError.first_name = validate.isPresent('Please enter a First Name')(value.first_name)
      memberError.last_name = validate.isPresent('Please enter a Last Name')(value.last_name)
      membersErrors.push(memberError)
    }
  })

  return membersErrors
}

const HouseholdMembersSection = ({ form }) => {
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Household Members</h3>
      </div>
      <FieldArray name='household_members' validate={memberValidate}>
        {({ fields }) =>
          <React.Fragment>
            { fields.map((name, i) => {
              return (
                <div key={name}>
                  <HouseholdMemberForm form={form} i={i} />
                  <button
                    onClick={() => fields.remove(i)}
                    type='button'
                    className='mb-4 btn btn-danger'>
                      Remove
                  </button>
                </div>
              )
            })}
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <button
                    onClick={() => form.mutators.push('household_members', {})}
                    type='button'
                    className='mb-4 mr-4 btn btn-success'
                    id='add-additional-member'>
                      + Additional Member
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </FieldArray>
    </div>
  )
}

export default HouseholdMembersSection
