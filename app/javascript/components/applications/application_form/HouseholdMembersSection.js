import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'
import { last } from 'lodash'
import { FieldArray } from 'react-final-form-arrays'
import validate from '~/utils/form/validations'

const memberValidate = (values) => {
  if (!values || !values.length) return
  const membersErrors = []
  values.forEach(value => {
    if (value) {
      membersErrors.push({date_of_birth: {}})
      validate.isValidDOB(value, last(membersErrors))
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
            { fields.map((name, index) => {
              return (
                <div key={name}>
                  <HouseholdMemberForm form={form} name={name} index={index} />
                  <button
                    onClick={() => fields.remove(index)}
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
