import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-form'
import { some, isObjectLike, isNil } from 'lodash'

import PrimaryApplicantSection from './PrimaryApplicantSection'
import AlternateContactSection from './AlternateContactSection'
import HouseholdMembersSection from './HouseholdMembersSection'
import PreferencesSection from './preferences/PreferencesSection'
import ReservedPrioritySection from './ReservedPrioritySection'
import HouseholdIncomeSection from './HouseholdIncomeSection'
import DemographicInfoSection from './DemographicInfoSection'
import AgreeToTerms from './AgreeToTerms'

import AlertBox from '~/components/molecules/AlertBox'

class PaperApplicationForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      submittedValues: {},
      submitType: ''
    }
  }

  submitShortForm = async (submittedValues) => {
    const { listing, application, onSubmit } = this.props
    const { submitType } = this.state

    if (this.props.application) {
      applicationData["id"] = this.props.application.id
      applicationData["applicationSubmissionType"] = this.props.application.application_submission_type
    }

    this.setState({ submittedValues, loading: true, failed: false })
    await onSubmit(submitType, submittedValues, application, listing)
    this.setState({ loading: false })
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
    this.setState({submitType: type, failed})
    if (failed)
      window.scrollTo(0, 0)
  }

  render() {
    const { loading, failed } = this.state
    const { listing, application, editPage } = this.props

    return (
      <div>
        <Form onSubmit={this.submitShortForm} defaultValues={application}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="shortForm">
              <div className="app-card form-card medium-centered">
              <div className="app-inner inset">
                  <AlertBox
                    invert
                    dismiss={!failed}
                    onCloseClick={() => this.setState({failed: false})}
                    message="Please resolve any errors before saving the application." />

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
                  <AgreeToTerms/>
                </div>
                <div className="button-pager">
                  <div className="button-pager_row primary">
                    <button className="primary radius margin-right save-btn" type="submit" onClick={() => this.saveSubmitType('Save', formApi)} disabled={loading}>
                      Save
                    </button>
                    <button className="primary radius" type="submit" onClick={() => this.saveSubmitType('SaveAndNew', formApi)}  disabled={loading}>
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
