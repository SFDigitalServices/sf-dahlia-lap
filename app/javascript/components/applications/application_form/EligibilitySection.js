import React from 'react'
import PropTypes from 'prop-types'
import { CheckboxField, SelectField } from '~/utils/form/final_form/Field'
import { map, each, some } from 'lodash'
import validate from '~/utils/form/validations'

class EligibilitySection extends React.Component {
  constructor (props) {
    super(props)
    const { lendingInstitutions, form } = props
    let lenders = []

    if (form.getState().values.lending_agent) {
      each(lendingInstitutions, (agents, institution) => {
        if (some(agents, { 'Id': form.getState().values.lending_agent })) {
          lenders = map(agents, (lender) => ({ label: `${lender.FirstName} ${lender.LastName}`, value: lender.Id }))
          form.change('lending_institution', institution)
        }
      })
    }
    this.state = {
      lenders: lenders
    }
  }

  checkboxErrorMessage = 'The applicant cannot qualify for the listing unless this is true.'

  isFirstTimeHomebuyerMarkup = () => {
    return (
      <div className='small-12 columns'>
        <CheckboxField
          id='is_first_time_homebuyer'
          label='Not owned property in last three years'
          blockNote='(required)'
          fieldName='is_first_time_homebuyer'
          ariaLabelledby='prereqs'
          validation={validate.isChecked(this.checkboxErrorMessage)}
        />
      </div>
    )
  }

  completedHomebuyersEducationMarkup = () => {
    return (
      <div className='small-12 columns'>
        <CheckboxField
          id='has_completed_homebuyer_education'
          label={`Completed homebuyers' education`}
          blockNote='(required)'
          fieldName='has_completed_homebuyer_education'
          ariaLabelledby='prereqs'
          validation={validate.isChecked(this.checkboxErrorMessage)}
        />
      </div>
    )
  }

  loanPreapprovalMarkup = () => {
    return (
      <div className='small-12 columns margin-bottom'>
        <CheckboxField
          id='has_loan_preapproval'
          label='A loan pre-approval letter from a MOHCD-approved lender'
          blockNote='(required)'
          fieldName='has_loan_preapproval'
          ariaLabelledby='prereqs'
          validation={validate.isChecked(this.checkboxErrorMessage)}
        />
      </div>
    )
  }

  handleSelectInstitution = (event) => {
    const { lendingInstitutions, form } = this.props
    const lenders = map(lendingInstitutions[event.target.value], (lender) => ({label: `${lender.FirstName} ${lender.LastName}`, value: lender.Id}))
    // reset lending_agent select
    form.change('lending_agent', null)
    this.setState({lenders: lenders})
  }

  lendingInstitutionMarkup = (lendingInstitutions) => {
    const institutionOptions = map(lendingInstitutions, (_, key) => ({label: key, value: key}))
    return (
      <div className='small-6 columns'>
        <SelectField
          label='Name of Lending Institution'
          blockNote='(required)'
          id='lending_institution'
          fieldName='lending_institution'
          options={institutionOptions}
          onChange={this.handleSelectInstitution}
          validation={validate.isPresent('Please select a lending institution.')}
        />
      </div>
    )
  }

  lenderMarkup = (lenders) => {
    return (
      <div className='small-6 columns margin-bottom--2x'>
        <SelectField
          label='Name of Lender'
          blockNote='(required)'
          id='lending_agent'
          fieldName='lending_agent'
          options={lenders}
          validation={validate.isPresent('Please select a lender.')}
        />
      </div>
    )
  }

  checkboxesMarkup = () => {
    return (
      <div className='form-group'>
        {this.isFirstTimeHomebuyerMarkup()}
        {this.completedHomebuyersEducationMarkup()}
        {this.loanPreapprovalMarkup()}
      </div>
    )
  }

  lenderSelectsMarkup = () => {
    const { lendingInstitutions } = this.props
    const { lenders } = this.state
    return (
      <div className='form-group'>
        {this.lendingInstitutionMarkup(lendingInstitutions)}
        {this.lenderMarkup(lenders)}
      </div>
    )
  }

  render () {
    const { listing } = this.props
    if (listing.is_sale) {
      return (
        <div className='border-bottom margin-bottom--2x'>
          <div className='row'>
            <h3>Eligibility Information</h3>
          </div>
          <div className='row'>
            <div className='form-group'>
              <div className='columns'>
                <strong className='t-small c-steel' id='prereqs'>The applicant has&hellip;</strong>
              </div>
            </div>
            {this.checkboxesMarkup()}
          </div>
          <div className='row'>
            {this.lenderSelectsMarkup()}
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}

EligibilitySection.propTypes = {
  listing: PropTypes.object.isRequired,
  lendingInstitutions: PropTypes.object.isRequired
}

export default EligibilitySection
