import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '~/utils/form/Field'
import { map } from 'lodash'

class EligibilitySection extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lenders: []
    }
  }

  isFirstTimeHomebuyerMarkup = () => {
    return (
      <div className='small-12 columns'>
        <Field.Checkbox
          id='is_first_time_homebuyer'
          label='Not owned property in last three years'
          blockNote='(required)'
          field='is_first_time_homebuyer'
          errorMessage={(_, error) => error}
          ariaLabelledby='prereqs'
          labelLast={'true'} />
      </div>
    )
  }

  completedHomebuyersEducationMarkup = () => {
    return (
      <div className='small-12 columns'>
        <Field.Checkbox
          id='has_completed_homebuyer_education'
          label={`Completed homebuyers' education`}
          blockNote='(required)'
          field='has_completed_homebuyer_education'
          errorMessage={(_, error) => error}
          ariaLabelledby='prereqs'
          labelLast={'true'} />
      </div>
    )
  }

  loanPreapprovalMarkup = () => {
    return (
      <div className='small-12 columns margin-bottom'>
        <Field.Checkbox
          id='has_loan_preapproval'
          label='A loan pre-approval letter from a MOHCD-approved lender'
          blockNote='(required)'
          field='has_loan_preapproval'
          errorMessage={(_, error) => error}
          ariaLabelledby='prereqs'
          labelLast={'true'} />
      </div>
    )
  }

  handleSelectInstitution = (institution) => {
    const { lendingInstitutions, formApi } = this.props
    const lenders = map(lendingInstitutions[institution], (lender) => ({label: `${lender.FirstName} ${lender.LastName}`, value: lender.Id}))
    // reset lending_agent select
    formApi.setValue('lending_agent', null)
    this.setState({lenders: lenders})
  }

  lendingInstitutionMarkup = (lendingInstitutions) => {
    return (
      <div className='small-6 columns'>
        <Field.Select
          label='Name of Lending Institution'
          blockNote='(required)'
          id='lending_institution'
          field='lending_institution'
          errorMessage={(_, error) => error}
          options={map(lendingInstitutions, (_, key) => ({label: key, value: key}))}
          onChange={this.handleSelectInstitution}
        />
      </div>
    )
  }

  lenderMarkup = (lenders) => {
    return (
      <div className='small-6 columns margin-bottom--2x'>
        <Field.Select
          label='Name of Lender'
          blockNote='(required)'
          id='lending_agent'
          field='lending_agent'
          errorMessage={(_, error) => error}
          options={lenders}
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
