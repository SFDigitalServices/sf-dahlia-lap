import React from 'react'
import PropTypes from 'prop-types'
import { forEach, some, isObjectLike, isNil, includes, last } from 'lodash'
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

const fieldRequiredMsg = 'is required'

const preferenceRequiredFields = {
  individual_preference: ['RB_AHP', 'L_W'],
  type_of_proof: ['NRHP', 'L_W', 'AG'],
  street: ['AG'],
  city: ['AG'],
  state: ['AG'],
  zip_code: ['AG']
}

const preferenceRequiresField = (prefName, fieldName) => {
  if (fieldName === 'naturalKey') {
    return true
  } else {
    return includes(preferenceRequiredFields[fieldName], prefName)
  }
}

// In react-form v2, a validation value of null indicates no
// error, and a validation value of anything other than null
// indicates an error.
const getPrefFieldValidation = (pref, fieldName) => {
  if (preferenceRequiresField(pref.recordtype_developername, fieldName)) {
    return pref[fieldName] ? null : fieldRequiredMsg
  } else {
    return null
  }
}

const buildPrefValidations = (prefs) => {
  let prefValidations = {}
  forEach(prefs, (pref, index) => {
    prefValidations[index] = {
      naturalKey: getPrefFieldValidation(pref, 'naturalKey'),
      individual_preference: getPrefFieldValidation(pref, 'individual_preference'),
      type_of_proof: getPrefFieldValidation(pref, 'type_of_proof'),
      street: getPrefFieldValidation(pref, 'street'),
      city: getPrefFieldValidation(pref, 'city'),
      state: getPrefFieldValidation(pref, 'state'),
      zip_code: getPrefFieldValidation(pref, 'zip_code')
    }
  })
  return prefValidations
}

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

  hasErrors = (errors) => {
    return some(errors, (value, key) => {
      if (isObjectLike(value)) {
        return this.hasErrors(value)
      } else {
        return !isNil(value)
      }
    })
  }

  // saveSubmitType = (type, formApi) => {
  //   const failed = this.hasErrors(formApi.errors)
  //   this.setState({submitType: type, failed})
  //   if (failed) { window.scrollTo(0, 0) }
  // }

  saveSubmitType = (type) => {
    // const failed = this.hasErrors(formApi.errors)
    this.setState({submitType: type})
    // if (failed) { window.scrollTo(0, 0) }
  }

  validateError = (values) => {
    const { listing } = this.props
    let validations = {
      preferences: buildPrefValidations(values.preferences),
      annual_income: validate.isValidCurrency('Please enter a valid dollar amount.')(values.annual_income),
    }
    return validations
  }

  render () {
    const { listing, application, lendingInstitutions } = this.props
    const { loading, failed } = this.state
    return (
      <div>
        <Form
          onSubmit={this.submitShortForm}
          initialValues={application}
          validate={(values) => {
            const errors = {applicant: {date_of_birth: {}}}
            validate.isValidDOB(values.applicant, errors.applicant)
            return errors
          }}
          mutators={{
            ...arrayMutators
          }}
          render={({
            handleSubmit,
            mutators: { push, pop },
            form,
            submitting,
            pristine,
            values }) => (
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
