import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'
import { isEmpty } from 'lodash'
import { FieldArray } from 'react-final-form-arrays'
import { Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'



const HouseholdMembersSection = ({ form, editValues }) => {
  console.log('form values',form.getState().values)
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Household Members</h3>
      </div>
      <FieldArray name="household_members">
        {({ fields }) =>
          <React.Fragment>
            { fields.map((name, index) => {
              console.log('name outside', name)
              return (
              <div key={name}>
                <HouseholdMemberForm name={name} index={index} />
              </div>

            )})}
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <button
                    onClick={() => fields.push({'first_name': 'blah'})}
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








    //   { !isEmpty(formApi.values.household_members) && formApi.values.household_members.map((member, i) => (
    //     <div className='border-bottom margin-bottom--2x' key={i}>
    //       <HouseholdMemberForm i={i} formApi={formApi} />
    //       <div className='row'>
    //         <div className='form-group'>
    //           <div className='small-4 columns'>
    //             <button
    //               onClick={() => formApi.removeValue('household_members', i)}
    //               type='button'
    //               className='mb-4 btn btn-danger'>
    //                 Remove
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}

  )
}

export default HouseholdMembersSection
