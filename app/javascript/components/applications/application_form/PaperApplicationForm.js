import React from 'react'
import PropTypes from 'prop-types'
import { forEach, some, isObjectLike, isNil, includes } from 'lodash'
import { Form } from 'react-form'
import ApplicationLanguageSection from './ApplicationLanguageSection'
import PrimaryApplicantSection from './PrimaryApplicantSection'
import AlternateContactSection from './AlternateContactSection'
import HouseholdMembersSection from './HouseholdMembersSection'
import PreferencesSection from './preferences/PreferencesSection'
import ReservedPrioritySection from './ReservedPrioritySection'
import HouseholdIncomeSection from './HouseholdIncomeSection'
import DemographicInfoSection from './DemographicInfoSection'
import AgreeToTerms from './AgreeToTerms'
import AlertBox from '~/components/molecules/AlertBox'

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

const validateError = (values) => {
  return {
    preferences: buildPrefValidations(values.preferences)
  }
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
    await onSubmit(submitType, submittedValues, application, listing, editPage)
    this.setState({ loading: false })
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

  saveSubmitType = (type, formApi) => {
    const failed = this.hasErrors(formApi.errors)
    this.setState({submitType: type, failed})
    if (failed) { window.scrollTo(0, 0) }
  }

  render () {
    const { listing, application, editPage } = this.props
    const { loading, failed } = this.state
    return (
      <div>
        <Form onSubmit={this.submitShortForm} defaultValues={application} validateError={validateError}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id='shortForm'>
              <div className='app-card form-card medium-centered'>
                <div className='app-inner inset'>
                  <AlertBox
                    invert
                    dismiss={!failed}
                    onCloseClick={() => this.setState({failed: false})}
                    message='Please resolve any errors before saving the application.' />
                  <ApplicationLanguageSection editValues={application} formApi={formApi} />
                  <PrimaryApplicantSection editValues={application} formApi={formApi} />
                  <AlternateContactSection editValues={application} />
                  <HouseholdMembersSection editValues={application} formApi={formApi} />
                  <ReservedPrioritySection editValues={application} listing={listing} />
                  <PreferencesSection
                    formApi={formApi}
                    listingPreferences={listing.listing_lottery_preferences}
                    editValues={application}
                  />
                  <HouseholdIncomeSection />
                  {!editPage && <DemographicInfoSection />}
                  <AgreeToTerms />
                </div>
                <div className='button-pager'>
                  <div className='button-pager_row primary'>
                    <button className='primary radius margin-right save-btn' type='submit' onClick={() => this.saveSubmitType('Save', formApi)} disabled={loading}>
                      Save
                    </button>
                    <button className='primary radius' type='submit' onClick={() => this.saveSubmitType('SaveAndNew', formApi)} disabled={loading}>
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
        </Form>
      </div>
    )
  }
}

PaperApplicationForm.propTypes = {
  listing: PropTypes.object.isRequired
}

export default PaperApplicationForm
