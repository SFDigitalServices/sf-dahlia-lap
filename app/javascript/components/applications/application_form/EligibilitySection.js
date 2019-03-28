import React from 'react'
import { Field } from '~/utils/form/Field'
const EligibilitySection = ({listing}) => {
  const isFirstTimeHomebuyerMarkup = () => {
    return (
      <div className='small-12 columns'>
        <Field.Checkbox
          id='is_first_time_homebuyer'
          label='Not owned property in last three years'
          blockNote='(required)'
          field='is_first_time_homebuyer'
          labelLast={'true'} />
      </div>
    )
  }

  const completedHomebuyersEducationMarkup = () => {
    return (
      <div className='small-12 columns'>
        <Field.Checkbox
          id='has_completed_homebuyer_education'
          label={`Completed homebuyers' education`}
          blockNote='(required)'
          field='has_completed_homebuyer_education'
          labelLast={'true'} />
      </div>
    )
  }

  const loanPreapprovalMarkup = () => {
    return (
      <div className='small-12 columns margin-bottom--2x'>
        <Field.Checkbox
          id='has_loan_preapproval'
          label='A loan pre-approval letter from a MOHCD-approved lender'
          blockNote='(required)'
          field='has_loan_preapproval'
          labelLast={'true'} />
      </div>
    )
  }

  if (listing.is_sale) {
    return (
      <div className='border-bottom margin-bottom--2x'>
        <div className='row'>
          <h3>Eligibility Information</h3>
        </div>
        <div className='row'>
          <div className='form-group'>
            {isFirstTimeHomebuyerMarkup()}
            {completedHomebuyersEducationMarkup()}
            {loanPreapprovalMarkup()}
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default EligibilitySection
