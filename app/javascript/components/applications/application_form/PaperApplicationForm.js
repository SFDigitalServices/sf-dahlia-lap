import React from 'react'
import PropTypes from 'prop-types'
import { forEach, isEmpty, omit, merge, each, some, isObjectLike, isNil, includes } from 'lodash'
import { Form } from 'react-form'

import apiService from '~/apiService'
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
import domainToApi from '~/components/mappers/domainToApi'

const fieldRequiredMsg = 'is required'

const preferenceRequiredFields = {
  individualPreference: ['RB_AHP', 'L_W'],
  preferenceProof: ['NRHP','L_W', 'AG'],
  address: ['AG'],
  city: ['AG'],
  state: ['AG'],
  zipCode: ['AG'],
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
  if (preferenceRequiresField(pref.recordTypeDevName, fieldName)) {
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
      individualPreference: getPrefFieldValidation(pref, 'individualPreference'),
      preferenceProof: getPrefFieldValidation(pref, 'preferenceProof'),
      address: getPrefFieldValidation(pref, 'address'),
      city: getPrefFieldValidation(pref, 'city'),
      state: getPrefFieldValidation(pref, 'state'),
      zipCode: getPrefFieldValidation(pref, 'zipCode'),
    }
  })
  return prefValidations
}

const validateError = (values) => {
  return {
    shortFormPreferences: buildPrefValidations(values.shortFormPreferences)
  }
}

class PaperApplicationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      submittedValues: {},
      submitType: ''
    }
  }

  submitFormTest = (submittedValues) => {
    this.setState({ submittedValues })
  }

  removeEmptyData = (applicationData) => {
    let fieldMap = ['alternateContact', 'adaPrioritiesSelected', 'demographics']
    forEach(fieldMap, (field) => {
      if (isEmpty(applicationData[field])) {
        applicationData = omit(applicationData, field)
      }
    })
    return applicationData
  }

  assignDemographicData = (applicationData) => {
    merge(applicationData.primaryApplicant, applicationData.demographics)
    return applicationData
  }

  formatPickList = (listData) => {
    let resultStr = "";
    each(listData, (value, key) => {
      if (value) {
        resultStr += key + ";";
      }
    })
    return resultStr;
  }

  formatAdaPriorities = (appData) => {
    let selected = appData.adaPrioritiesSelected
    appData.adaPrioritiesSelected = this.formatPickList(selected)
    return appData
  }

  submitShortForm = async (submittedValues) => {
    const { editPage } = this.props

    this.setState({ submittedValues, loading: true, failed: false })
    let applicationData = submittedValues
    applicationData.listingID = this.props.listing.id
    applicationData = this.assignDemographicData(applicationData)
    applicationData = this.removeEmptyData(applicationData)
    applicationData = this.formatAdaPriorities(applicationData)

    if (this.props.application) {
      applicationData["id"] = this.props.application.id
      applicationData["applicationSubmissionType"] = this.props.application.application_submission_type
    }

    let response = await apiService.submitApplication(applicationData)
    if (response === false) {
      alert('There was an error on submit. Please check values and try again.')
    }

    this.setState({ loading: false })

    if (response) {
      if (this.state.submitType === 'Save') {
        const showAddBtn  = editPage ? '' : '?showAddBtn=true'
        window.location.href = '/applications/' + response.application.id + showAddBtn
      }
      else {
        window.location.href = '/listings/' + this.props.listing.id + '/applications/new'
      }
    }
  }

  hasErrors = (errors) => {
      return some(errors, (value, key) => {
        if (isObjectLike(value)){
          return this.hasErrors(value)
        } else {
          return !isNil(value)
        }
      })
    }

  saveSubmitType = (type, formApi) => {
    const failed = this.hasErrors(formApi.errors)

    this.setState({submitType: type, failed })
    if (failed)
      window.scrollTo(0, 0)
  }

  render() {
    const { listing, application, editPage } = this.props
    const { failed } = this.state

    let autofillValues = {}
    if (application)
      autofillValues = domainToApi.mapApplication(application)

    return (
      <div>
        <Form onSubmit={this.submitShortForm} defaultValues={autofillValues} validateError={validateError}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="shortForm">
              <div className="app-card form-card medium-centered">
              <div className="app-inner inset">
                  <AlertBox
                   invert
                   dismiss={!failed}
                   onCloseClick={() => this.setState({failed: false})}
                   message="Please resolve any errors before saving the application." />
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
                  {!editPage &&
                      <DemographicInfoSection />
                  }
                  <AgreeToTerms/>
                </div>
                <div className="button-pager">
                  <div className="button-pager_row primary">
                    <button className="primary radius margin-right" type="submit" onClick={() => this.saveSubmitType('Save', formApi)} disabled={this.state.loading}>
                      Save
                    </button>
                    <button className="primary radius" type="submit" onClick={() => this.saveSubmitType('SaveAndNew', formApi)}  disabled={this.state.loading}>
                      Save and New
                    </button>
                  </div>
                  <div className="button-pager_row primary">
                    <a className="primary radius" href="/listings">Cancel</a>
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
  listing: PropTypes.object.isRequired,
}

export default PaperApplicationForm
