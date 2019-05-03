import React from 'react'
import PropTypes from 'prop-types'
import { forEach, some, isObjectLike, isNil, includes } from 'lodash'
// import { Form } from 'react-form'
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
import { Form, Field } from 'react-final-form'


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

const buildHouseholdMemberValidations = (householdMembers) => {
  let householdMemberValidations = {}
  forEach(householdMembers, (member, index) => {
    // If member is empty, do not validate it.
    householdMemberValidations[index] = member === '' ? {} : {
      first_name: validate.isPresent('Please enter a First Name')(member.first_name),
      last_name: validate.isPresent('Please enter a Last Name')(member.last_name),
      date_of_birth: (
        validate.isPresent('Please enter a Date of Birth')(member.date_of_birth) ||
        validate.isValidDate('Please enter a valid Date of Birth')(member.date_of_birth)
      )
    }
  })
  return householdMemberValidations
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
    // console.log(response)
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
      household_members: buildHouseholdMemberValidations(values.household_members),
      application_language: validate.isPresent('Please select a language.')(values.application_language)
    }
    if (listing.is_sale) {
      const checkboxErrorMessage = 'The applicant cannot qualify for the listing unless this is true.'
      validations = {
        is_first_time_homebuyer: validate.isChecked(checkboxErrorMessage)(values.is_first_time_homebuyer),
        has_completed_homebuyer_education: validate.isChecked(checkboxErrorMessage)(values.has_completed_homebuyer_education),
        has_loan_preapproval: validate.isChecked(checkboxErrorMessage)(values.has_loan_preapproval),
        lending_agent: validate.isPresent('Please select a lender.')(values.lending_agent),
        lending_institution: validate.isPresent('Please select a lending institution.')(values.lending_institution),
        ...validations
      }
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
          validate={ values => {
            // TODO: pull this validation out into separate file and fix is present
            const errors = {applicant: {date_of_birth: {}}}
            if (values.applicant && values.applicant.date_of_birth) {
              let DOB = [values.applicant.date_of_birth.year, values.applicant.date_of_birth.month, values.applicant.date_of_birth.day]
              errors.applicant.date_of_birth.all = validate.any(
                validate.isValidDate('Please enter a valid Date of Birth'),
                validate.isOldEnough('The primary applicant must be 18 years of age or older')
              )(DOB)
            } else {
              errors.applicant.date_of_birth.all = 'Not present'
            }
            return errors
          }}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
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
                  {/* <EligibilitySection listing={listing} lendingInstitutions={lendingInstitutions} /> */}
                  <PrimaryApplicantSection form={form} />
                  <AlternateContactSection />
                  {/* <HouseholdMembersSection editValues={application} formApi={formApi} />
                  <ReservedPrioritySection editValues={application} listing={listing} />
                  <PreferencesSection
                    formApi={formApi}
                    listingPreferences={listing.listing_lottery_preferences}
                    editValues={application}
                  />
                  <HouseholdIncomeSection />
                  <DemographicInfoSection defaultValues={application ? application['demographics'] : {}} />
                  <AgreeToTerms /> */}
                </div>
                <div className='button-pager'>
                  <div className='button-pager_row primary'>
                    {/* <button className='primary radius margin-right save-btn' type='submit' onClick={() => this.saveSubmitType('Save', formApi)} disabled={loading}>
                      {loading ? 'Saving…' : 'Save'}
                    </button>
                    <button className='primary radius' type='submit' onClick={() => this.saveSubmitType('SaveAndNew', formApi)} disabled={loading}>
                      Save and New
                    </button> */}
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
