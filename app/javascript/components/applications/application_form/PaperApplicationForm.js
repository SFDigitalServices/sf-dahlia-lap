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
import { includes, isEmpty, map } from 'lodash'
import { getFullHousehold, naturalKeyFromMember } from './preferences/utils.js'

class PaperApplicationForm extends React.Component {
  state = {
    loading: false,
    submittedValues: {},
    submitType: '',
    genderSpecifyRequired: false,
    orientationOtherRequired: false
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

  saveSubmitType = (type, form) => {
    const failed = form.getState().invalid
    this.setState({submitType: type, failed: failed})
    if (failed) { window.scrollTo(0, 0) }
  }

  checkNotListed = (demographics, key) => {
    if (demographics && demographics[key] && demographics[key].toLowerCase() === 'not listed' && !demographics[`${key}_other`]) {
      return true
    }
    return false
  }

  validateForm = (values) => {
    const errors = {applicant: {date_of_birth: {}}}
    // applicant needs to be initialized for date validation to run on 'required'
    if (!values.applicant) values.applicant = {}
    validate.isValidDate(values.applicant.date_of_birth, errors.applicant.date_of_birth, {errorMessage: 'Please enter a Date of Birth', isPrimaryApplicant: true})
    if (values.alternate_contact && !isEmpty(values.alternate_contact)) {
      errors.alternate_contact = {}
      errors.alternate_contact.first_name = validate.isPresent('Please enter a First Name')(values.alternate_contact.first_name)
      errors.alternate_contact.last_name = validate.isPresent('Please enter a Last Name')(values.alternate_contact.last_name)
      errors.alternate_contact.email = validate.isValidEmail('Please enter a valid Email')(values.alternate_contact.email)
    }

    // Secondary preference application member validation: Check if selected app member value is still a valid natural key.
    if (values.preferences) {
      const naturalKeys = map(getFullHousehold(values), (member) => naturalKeyFromMember(member))
      errors.preferences = []
      values.preferences.map(
        (pref, i) => {
          errors.preferences = errors.preferences.concat({})
          if (pref.naturalKey && !includes(naturalKeys, pref.naturalKey)) {
            errors.preferences[i].naturalKey = 'This field is required'
          }
        }
      )
    }

    // Demographics section
    if (values.demographics) {
      const { demographics } = values
      errors.demographics = {}

      const isGenderSpecifyRequired = this.checkNotListed(demographics, 'gender')
      const isOrientationOtherRequired = this.checkNotListed(demographics, 'sexual_orientation')
      errors.demographics.gender_other = isGenderSpecifyRequired ? 'Gender is required' : undefined
      errors.demographics.sexual_orientation_other = isOrientationOtherRequired ? 'Sexual Orientation is required' : undefined
      this.setState({ genderSpecifyRequired: isGenderSpecifyRequired, orientationOtherRequired: isOrientationOtherRequired })
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
          render={({ handleSubmit, form, values }) => (
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
                  <DemographicInfoSection
                    values={values}
                    genderSpecifyRequired={this.state.genderSpecifyRequired}
                    orientationOtherRequired={this.state.orientationOtherRequired}
                  />
                  <AgreeToTerms />
                </div>
                <div className='button-pager'>
                  <div className='button-pager_row primary'>
                    <button className='primary radius margin-right save-btn' type='submit' onClick={() => this.saveSubmitType('Save', form)} disabled={loading}>
                      {loading ? 'Saving…' : 'Save'}
                    </button>
                    <button className='primary radius' type='submit' onClick={() => this.saveSubmitType('SaveAndNew', form)} disabled={loading}>
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
