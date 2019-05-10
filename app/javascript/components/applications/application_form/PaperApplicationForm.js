import React from 'react'
import PropTypes from 'prop-types'
import ApplicationLanguageSection from './ApplicationLanguageSection'
import EligibilitySection from './EligibilitySection'
import PrimaryApplicantSection from './PrimaryApplicantSection'
import AlternateContactSection from './AlternateContactSection'
import HouseholdMembersSection from './HouseholdMembersSection'
import PreferencesSection from './preferences/PreferencesSection'
import ReservedPrioritySection from './ReservedPrioritySection'
import HouseholdIncomeSection from './HouseholdIncomeSection'
import DemographicInfoSection from './DemographicInfoSection'
import AgreeToTerms from './AgreeToTerms'
import AlertBox from '~/components/molecules/AlertBox'
import validate from '~/utils/form/validations'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'

class PaperApplicationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      submittedValues: {},
      submitType: ''
    }
  }

  submitShortForm = async (submittedValues) => {
    const { listing, application, onSubmit, editPage } = this.props
    const { submitType } = this.state

    this.setState({ submittedValues, loading: true, failed: false })

    const response = await onSubmit(submitType, submittedValues, application, listing, editPage)
    if (response === false) {
      this.setState({ loading: false, failed: true })
    }
  }

  saveSubmitType = (type) => {
    this.setState({submitType: type})
  }

  // TODO validation for annual_income
  // validateError = (values) => {
  //   const { listing } = this.props
  //   let validations = {
  //     annual_income: validate.isValidCurrency('Please enter a valid dollar amount.')(values.annual_income),
  //   }
  //   return validations
  // }

  validateForm = (values) => {
    const errors = {applicant: {date_of_birth: {}}}
    validate.isValidDOB(values.applicant, errors.applicant)
    if (values.alternate_contact && !isEmpty(values.alternate_contact)) {
      errors.alternate_contact = {}
      errors.alternate_contact.first_name = validate.isPresent('Please enter a First Name.')(values.alternate_contact.first_name)
      errors.alternate_contact.last_name = validate.isPresent('Please enter a Last Name.')(values.alternate_contact.last_name)
      errors.alternate_contact.email = validate.isValidEmail('Please enter a valid Email')(values.alternate_contact.email)
    }
    return errors
  }

  render () {
    const { listing, application, lendingInstitutions } = this.props
    const { loading, failed } = this.state
    return (
      <div>
        <Form
          onSubmit={this.submitShortForm}
          initialValues={application}
          validate={this.validateForm}
          mutators={{
            ...arrayMutators
          }}
          render={({ handleSubmit, form }) => (
            <form onSubmit={handleSubmit} id='shortForm' noValidate>
              <div className='app-card form-card medium-centered'>
                <div className='app-inner inset'>
                  { failed && (
                    <AlertBox
                      invert
                      onCloseClick={() => this.setState({failed: false})}
                      message='Please resolve any errors before saving the application.' />
                  )}
                  <ApplicationLanguageSection />
                  <EligibilitySection listing={listing} lendingInstitutions={lendingInstitutions} form={form} />
                  <PrimaryApplicantSection form={form} />
                  <AlternateContactSection />
                  <HouseholdMembersSection editValues={application} form={form} />
                  <ReservedPrioritySection listing={listing} />
                  <PreferencesSection
                    form={form}
                    listingPreferences={listing.listing_lottery_preferences}
                    editValues={application}
                  />
                  <HouseholdIncomeSection />
                  <DemographicInfoSection />
                  <AgreeToTerms />
                </div>
                <div className='button-pager'>
                  <div className='button-pager_row primary'>
                    <button className='primary radius margin-right save-btn' type='submit' onClick={() => this.saveSubmitType('Save')} disabled={loading}>
                      {loading ? 'Saving…' : 'Save'}
                    </button>
                    <button className='primary radius' type='submit' onClick={() => this.saveSubmitType('SaveAndNew')} disabled={loading}>
                      Save and New
                    </button>
                  </div>
                  <div className='button-pager_row primary'>
                    <a className='primary radius' href='/listings'>Cancel</a>
                  </div>
                </div>
              </div>
            </form>
          )}
        />
      </div>
    )
  }
}

PaperApplicationForm.propTypes = {
  listing: PropTypes.object.isRequired,
  lendingInstitutions: PropTypes.object.isRequired
}

export default PaperApplicationForm
