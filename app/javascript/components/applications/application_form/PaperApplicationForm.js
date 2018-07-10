import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Form } from 'react-form'
import apiService from '~/apiService'
import PrimaryApplicantSection from './PrimaryApplicantSection'
import AlternateContactSection from './AlternateContactSection'
import HouseholdMembersSection from './HouseholdMembersSection'
import PreferencesSection from './preferences/PreferencesSection'
import ReservedPrioritySection from './ReservedPrioritySection'
import HouseholdIncomeSection from './HouseholdIncomeSection'
import DemographicInfoSection from './DemographicInfoSection'
import AgreeToTerms from './AgreeToTerms'

import domainToApi from '~/components/mappers/domainToApi'

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
    let oldAppData = applicationData
    let fieldMap = ['alternateContact', 'adaPrioritiesSelected', 'demographics']
    _.forEach(fieldMap, (field) => {
      if (_.isEmpty(applicationData[field])) {
        applicationData = _.omit(applicationData, field)
      }
    })
    return applicationData
  }

  assignDemographicData = (applicationData) => {
    _.merge(applicationData.primaryApplicant, applicationData.demographics)
    return applicationData
  }

  formatPickList = (listData) => {
    let resultStr = "";
    _.each(listData, (value, key) => {
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
    this.setState({ submittedValues })
    this.setState({ loading: true })
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
    if (this.state.submitType === 'Save') {
      window.location.href = '/applications/' + response.application.id
    }
    else {
      window.location.href = '/listings/' + this.props.listing.id + '/applications/new'
    }
  }

  saveSubmitType = (type) => {
    this.setState({submitType: type})
  }

  render() {
    let { listing, application, editPage } = this.props
    let autofillValues = {}
    if (application)
      autofillValues = domainToApi.mapApplication(application)

    return (
      <div>
        <Form onSubmit={this.submitShortForm} defaultValues={autofillValues}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="shortForm">
              <div className="app-card form-card medium-centered">
              <div className="app-inner inset">
                  <PrimaryApplicantSection editValues={application} formApi={formApi} />
                  <AlternateContactSection editValues={application} />
                  <HouseholdMembersSection editValues={application} formApi={formApi}  />
                  <ReservedPrioritySection editValues={application} listing={listing}/>
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
                    <button className="primary radius margin-right" type="submit" onClick={() => this.saveSubmitType('Save')} disabled={this.state.loading}>
                      Save
                    </button>
                    <button className="primary radius" type="submit" onClick={() => this.saveSubmitType('SaveAndNew')}  disabled={this.state.loading}>
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
