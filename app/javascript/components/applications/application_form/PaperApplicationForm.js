import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-form'
import PrimaryApplicantSection from './PrimaryApplicantSection'
import AlternateContactSection from './AlternateContactSection'
import HouseholdMembersSection from './HouseholdMembersSection'
import PreferencesSection from './preferences/PreferencesSection'
import ReservedPrioritySection from './ReservedPrioritySection'
import HouseholdIncomeSection from './HouseholdIncomeSection'
import DemographicInfoSection from './DemographicInfoSection'
import AgreeToTerms from './AgreeToTerms'

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

    this.setState({ submittedValues, loading: true })
    await onSubmit(submitType, submittedValues, application, listing)
    this.setState({ loading: false })
  }

  saveSubmitType = (type) => {
    this.setState({submitType: type})
  }

  render() {
    const { loading } = this.state
    const { listing, application, editPage } = this.props

    return (
      <div>
        <Form onSubmit={this.submitShortForm} defaultValues={application}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="shortForm">
              <div className="app-card form-card medium-centered">
              <div className="app-inner inset">
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
                    <button className="primary radius margin-right save-btn" type="submit" onClick={() => this.saveSubmitType('Save')} disabled={loading}>
                      Save
                    </button>
                    <button className="primary radius" type="submit" onClick={() => this.saveSubmitType('SaveAndNew')}  disabled={loading}>
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
