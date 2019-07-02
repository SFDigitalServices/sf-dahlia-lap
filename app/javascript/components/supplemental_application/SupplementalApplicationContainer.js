import React from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'
import ScrollableAnchor from 'react-scrollable-anchor'

import ContentSection from '../molecules/ContentSection'
import DemographicsInputs from './sections/DemographicsInputs'
import StatusList from './sections/StatusList'
import StatusUpdate from '~/components/organisms/StatusUpdate'
import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import PreferencesTable from './sections/PreferencesTable'
import AlertBox from '~/components/molecules/AlertBox'
import StatusDropdown from '~/components/molecules/StatusDropdown'
import LeaseInformationInputs from './sections/LeaseInformationInputs'
import RentalAssistance from './sections/RentalAssistance'
import { withContext } from './context'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'
import validate from '~/utils/form/validations'

const StatusUpdateSection = withContext(({ store, formIsValid }) => {
  const { statusHistory, openUpdateStatusModal, openAddStatusCommentModal, loading } = store
  let recentStatusUpdate = statusHistory && statusHistory[0] ? statusHistory[0] : {status: null, comment: null, date: null}

  return (
    <ContentSection.Content paddingBottomNone marginTop>
      <StatusUpdate
        status={recentStatusUpdate.status}
        substatus={recentStatusUpdate.substatus}
        comment={recentStatusUpdate.comment}
        date={recentStatusUpdate.date}
        onStatusDropdownChange={() => formIsValid() ? openUpdateStatusModal() : null}
        onAddCommentClick={() => formIsValid() ? openAddStatusCommentModal() : null}
        statusHistoryAnchor='#status-history-section'
        loading={loading}
      />
    </ContentSection.Content>
  )
})

const ConfirmedPreferencesSection = ({ application, applicationMembers, fileBaseUrl, onSave, confirmedPreferencesFailed, onDismissError, form }) => {
  return (
    <ContentSection
      title='Confirmed Preferences'
      description='Please allow the applicant 24 hours to provide appropriate preference proof if not previously supplied.'>
      <ContentSection.Content>
        { confirmedPreferencesFailed && (
          <AlertBox
            invert
            onCloseClick={onDismissError}
            message="We weren't able to save your updates. Please try again." />
        )}
        <PreferencesTable
          application={application}
          applicationMembers={applicationMembers}
          onSave={onSave}
          fileBaseUrl={fileBaseUrl}
          onPanelClose={onDismissError}
          form={form}
        />
      </ContentSection.Content>
    </ContentSection>
  )
}

const ConfirmedHousehold = ({ amis, amiCharts, form }) => {
  return (
    <ContentSection title='Confirmed Household'>
      <ContentSection.Sub title='Confirmed Reserved and Priority Units'>
        <ConfirmedUnits />
      </ContentSection.Sub>
      <ContentSection.Sub title='Confirmed Household Income'>
        <ConfirmedHouseholdIncome amis={amis} amiCharts={amiCharts} form={form} />
      </ContentSection.Sub>
    </ContentSection>
  )
}

const LeaseInformationSection = ({form}) => {
  return (
    <ContentSection title='Lease Information'>
      <ContentSection.Content borderBottom>
        <LeaseInformationInputs form={form} />
      </ContentSection.Content>
    </ContentSection>
  )
}

const RentalAssistanceSection = ({form}) => {
  return (
    <ContentSection.Sub
      title='Rental Assistance Information'
      description='Includes Vouchers, Subsidies, as well as other forms of Rental Assistance.'>
      <RentalAssistance form={form} />
    </ContentSection.Sub>
  )
}

const DemographicsSection = () => {
  return (
    <ContentSection.Sub title='Demographics'>
      <DemographicsInputs />
    </ContentSection.Sub>
  )
}

const StatusHistorySection = withContext(({ store, formIsValid }) => {
  const { statusHistory, openAddStatusCommentModal, loading } = store

  return !isEmpty(statusHistory) && (
    <ContentSection.Sub title='Status History' borderBottom={false}>
      <StatusList
        items={statusHistory}
        onAddComment={() => formIsValid() ? openAddStatusCommentModal() : null}
        commentDisabled={loading}
      />
    </ContentSection.Sub>
  )
})

class SupplementalApplicationContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      failed: false
    }
  }

  validateForm = (values) => {
    const errors = {lease: {}}
    // only validate lease_start_date when any of the fields is present
    if (!isEmpty(values.lease) && !isEmpty(values.lease.lease_start_date)) {
      errors.lease = {lease_start_date: {}}
      validate.isValidDate(values.lease.lease_start_date, errors.lease.lease_start_date)
    }
    return errors
  }

  checkForValidationErrors = (form) => {
    const failed = form.getState().invalid
    this.setState({failed: failed})
    if (failed) {
      window.scrollTo(0, 0)
    }
    return failed
  }

  render () {
    const { failed } = this.state
    const { store } = this.props
    const {
      application,
      applicationMembers,
      fileBaseUrl,
      onSavePreference,
      confirmedPreferencesFailed,
      onDismissError,
      amis,
      amiCharts,
      loading,
      onSubmit,
      statusModal,
      handleStatusModalClose,
      handleStatusModalSubmit,
      assignSupplementalAppTouched,
      openUpdateStatusModal
    } = store

    return (

      <Form
        onSubmit={onSubmit}
        initialValues={application}
        validate={this.validateForm}
        mutators={{
          ...arrayMutators
        }}
        render={({ handleSubmit, form }) => (
          <React.Fragment>
            { failed && (
              <AlertBox
                invert
                onCloseClick={() => this.setState({failed: false})}
                message='Please resolve any errors before saving the application.' />
            )}
            <form onSubmit={handleSubmit} onChange={assignSupplementalAppTouched} style={{ margin: '0px' }} id='shortForm' noValidate>
              <StatusUpdateSection formIsValid={() => !this.checkForValidationErrors(form)} />
              <ConfirmedPreferencesSection
                application={application}
                applicationMembers={applicationMembers}
                fileBaseUrl={fileBaseUrl}
                onSave={onSavePreference}
                onDismissError={onDismissError}
                confirmedPreferencesFailed={confirmedPreferencesFailed}
                form={form}
              />
              <ConfirmedHousehold amis={amis} form={form} amiCharts={amiCharts} />
              <LeaseInformationSection form={form} />
              <RentalAssistanceSection form={form} />
              <DemographicsSection />
              <ScrollableAnchor id={'status-history-section'}>
                <div>
                  <StatusHistorySection formIsValid={() => !this.checkForValidationErrors(form)} />
                </div
                ></ScrollableAnchor>
              <div className='padding-bottom--2x margin-bottom--2x' />
              <div className='button-pager'>
                <div className='button-pager_row align-buttons-left primary inset-wide'>
                  <StatusDropdown
                    status={application.processing_status}
                    onChange={() => !this.checkForValidationErrors(form) ? openUpdateStatusModal() : null}
                    buttonClasses={['small', 'has-status-width']}
                    wrapperClasses={['dropdown-inline']}
                    menuClasses={['dropdown-menu-bottom']}
                    disabled={loading}
                  />
                  <button
                    className='button primary small save-btn'
                    type='submit'
                    id='save-supplemental-application'
                    disabled={loading}
                    onClick={() => this.checkForValidationErrors(form)}>
                    {loading ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
            <StatusModalWrapper
              {...statusModal}
              onClose={handleStatusModalClose}
              onSubmit={(submittedValues) => handleStatusModalSubmit(submittedValues, form.getState().values)}
            />
          </React.Fragment>
        )}
      />
    )
  }
}

export default withContext(SupplementalApplicationContainer)
