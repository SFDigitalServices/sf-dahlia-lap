import React from 'react'
import HouseholdMemberForm from './HouseholdMemberForm'
import { isEmpty } from 'lodash'
import { FieldArray } from 'react-final-form-arrays'
import validate from '~/utils/form/validations'
import { Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { FieldWrapper, SelectField } from '~/utils/form/final_form/Field'

const memberValidate = (values) => {
  if (!values || !values.length) return;
  const errorsArray = []

  values.forEach(value => {
    if (value) {
      const errors = {};
      if (!value.first_name) errors.first_name = "First Name Required";
      errorsArray.push(errors);
    }
  });

  return errorsArray;
}

const HouseholdMembersSection = ({ form, push, pop }) => {
  console.log('form values',form.getState().values)
  return (
    <div className='border-bottom margin-bottom--2x'>
      <div className='row'>
        <h3>Household Members</h3>
      </div>
      <FieldArray name='household_members' validate={memberValidate}>
        {({ fields }) =>
          <React.Fragment>
            { fields.map((name, index) => {
              console.log('name outside', name)
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
            )})}
            <div className='row'>
              <div className='form-group'>
                <div className='small-4 columns'>
                  <button
                    onClick={() => push('household_members', {})}
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
