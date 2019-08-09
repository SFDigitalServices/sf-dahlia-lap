import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CheckboxField, SelectField } from '~/utils/form/final_form/Field'
import { map, each, some } from 'lodash'
import validate from '~/utils/form/validations'

const checkboxErrorMessage = 'The applicant cannot qualify for the listing unless this is true.'

const EligibilitySection = ({ listing, lendingInstitutions, form }) => {
  const [lenders, setLenders] = useState([])

  const loadOnMount = () => {
    let mappedLenders = []

    if (form.getState().values.lending_agent) {
      each(lendingInstitutions, (agents, institution) => {
        if (some(agents, { 'Id': form.getState().values.lending_agent })) {
          mappedLenders = map(agents, (lender) => ({ label: `${lender.FirstName} ${lender.LastName}`, value: lender.Id }))
          form.change('lending_institution', institution)
        }
      })
    }

    setLenders(mappedLenders)
  }
  // With the empty array passed as the second argument
  // this useEffect call acts like a componentDidMount call
  useEffect(() => {
    loadOnMount()
  }, [])

  const handleSelectInstitution = (event) => {
    const mappedLenders = map(lendingInstitutions[event.target.value], (lender) => ({label: `${lender.FirstName} ${lender.LastName}`, value: lender.Id}))
    // reset lending_agent select
    form.change('lending_agent', null)
    setLenders(mappedLenders)
  }

  return listing.is_sale ? (
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
        <div className='form-group'>
          <div className='small-12 columns'>
            <CheckboxField
              id='is_first_time_homebuyer'
              label='Not owned property in last three years'
              blockNote='(required)'
              fieldName='is_first_time_homebuyer'
              ariaLabelledby='prereqs'
              validation={validate.isChecked(checkboxErrorMessage)}
            />
          </div>
          <div className='small-12 columns'>
            <CheckboxField
              id='has_completed_homebuyer_education'
              label={`Completed homebuyers' education`}
              blockNote='(required)'
              fieldName='has_completed_homebuyer_education'
              ariaLabelledby='prereqs'
              validation={validate.isChecked(checkboxErrorMessage)}
            />
          </div>
          <div className='small-12 columns margin-bottom'>
            <CheckboxField
              id='has_loan_preapproval'
              label='A loan pre-approval letter from a MOHCD-approved lender'
              blockNote='(required)'
              fieldName='has_loan_preapproval'
              ariaLabelledby='prereqs'
              validation={validate.isChecked(checkboxErrorMessage)}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='form-group'>
          <div className='small-6 columns'>
            <SelectField
              label='Name of Lending Institution'
              blockNote='(required)'
              id='lending_institution'
              fieldName='lending_institution'
              options={map(lendingInstitutions, (_, key) => ({label: key, value: key}))}
              onChange={handleSelectInstitution}
              validation={validate.isPresent('Please select a lending institution.')}
            />
          </div>
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
        </div>
      </div>
    </div>
  ) : null
}

EligibilitySection.propTypes = {
  listing: PropTypes.object.isRequired,
  lendingInstitutions: PropTypes.object.isRequired
}

export default EligibilitySection
