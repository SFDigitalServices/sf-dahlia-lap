import React, { useContext, useState } from 'react'

import Button from 'components/atoms/Button'
import AlertBox from 'components/molecules/AlertBox'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import {
  closeSuppAppStatusModal,
  closeSuppAppStatusModalAlert,
  leaseCreated,
  openSuppAppAddCommentModal,
  openSuppAppUpdateStatusModal,
  preferencesFailedChanged,
  submitSuppAppStatusModal,
  updateSavedPreference
} from 'context/actionCreators/application_details/applicationDetailsActionCreators'
import { NO_LEASE_STATE } from 'context/actionCreators/application_details/leaseUiStates'
import { AppContext } from 'context/Provider'
import { getApplicationMembers } from 'utils/applicationDetailsUtils'
import { touchAllFields, convertPercentAndCurrency } from 'utils/form/validations'

import ContentSection from '../molecules/ContentSection'
import LeaseUpSidebar from '../molecules/lease_up_sidebar/LeaseUpSidebar'
import AsymColumnLayout from '../organisms/AsymColumnLayout'
import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import DemographicsInputs from './sections/DemographicsInputs'
import Lease from './sections/Lease'
import PreferencesTable from './sections/PreferencesTable'

const ConfirmedPreferencesSection = ({
  application,
  applicationMembers,
  fileBaseUrl,
  onSave,
  confirmedPreferencesFailed,
  onDismissError,
  form,
  visited
}) => (
  <ContentSection
    title='Preferences and Priorities'
    description={
      <>
        Complete this section first.{' '}
        <b>You must confirm claimed preferences before sending out a post-lottery letter.</b> Please
        allow the applicant 24 hours to provide appropriate preference proof if not previously
        supplied.
      </>
    }
  >
    <ContentSection.Sub title='Confirmed Preferences'>
      {confirmedPreferencesFailed && (
        <AlertBox
          invert
          onCloseClick={onDismissError}
          message="We weren't able to save your updates. Please try again."
        />
      )}
      <PreferencesTable
        application={application}
        applicationMembers={applicationMembers}
        onSave={onSave}
        fileBaseUrl={fileBaseUrl}
        onPanelClose={onDismissError}
        form={form}
        visited={visited}
      />
    </ContentSection.Sub>
    <ContentSection.Sub title='Household Reserved and Priority Units'>
      <ConfirmedUnits form={form} />
    </ContentSection.Sub>
  </ContentSection>
)

const Income = ({ listingAmiCharts, visited, form }) => (
  <ContentSection
    title='Income'
    description='Complete this section after MOHCD has confirmed the household’s income eligibility. You must complete this section even if the household is over or under income eligibility.'
  >
    <ConfirmedHouseholdIncome listingAmiCharts={listingAmiCharts} visited={visited} />
  </ContentSection>
)

const LeaseSection = ({ form, values, onCreateLeaseClick, showLeaseSection }) => (
  <ContentSection
    title='Lease'
    description={
      !showLeaseSection &&
      'Complete this section when a unit is chosen and the lease is signed. If the household receives recurring rental assistance, remember to subtract this from the unit’s rent when calculating Tenant Contribution.'
    }
  >
    {showLeaseSection ? (
      <Lease form={form} values={values} />
    ) : (
      <Button id='create-lease' text='Create Lease' small onClick={onCreateLeaseClick} />
    )}
  </ContentSection>
)

const DemographicsSection = () => (
  <ContentSection
    title='Demographics'
    description='Finish up by completing this section once a lease is signed. This information is required to track dependents, seniors, and minors in households that have obtained housing through MOHCD programs.'
  >
    <DemographicsInputs />
  </ContentSection>
)

const Sidebar = ({
  statusHistory,
  loading,
  onChangeStatus,
  onAddCommentClicked,
  onSaveClicked
}) => {
  return (
    <div className='sticky-sidebar-large-up'>
      <LeaseUpSidebar
        statusItems={statusHistory}
        isLoading={loading}
        onChangeStatus={onChangeStatus}
        onAddCommentClicked={onAddCommentClicked}
        onSaveClicked={onSaveClicked}
      />
    </div>
  )
}

const SupplementalApplicationContainer = ({ handleSubmit, form, touched, values, visited }) => {
  const [failed, setFailed] = useState(false)
  const [
    {
      applicationDetailsData: { supplemental: state }
    },
    dispatch
  ] = useContext(AppContext)

  const checkForValidationErrors = (form, touched) => {
    touchAllFields(form, touched)
    const failed = form.getState().invalid
    setFailed(failed)
    if (failed) {
      window.scrollTo(0, 0)
    }
    return failed
  }

  const handleAddCommentClicked = (form, touched) =>
    !checkForValidationErrors(form, touched)
      ? openSuppAppAddCommentModal(dispatch, state.statusHistory)
      : null

  const onChangeStatus = (form, touched, value) =>
    !checkForValidationErrors(form, touched) ? openSuppAppUpdateStatusModal(dispatch, value) : null

  return (
    <>
      {failed && (
        <AlertBox
          invert
          onCloseClick={() => setFailed(false)}
          message='Please resolve any errors before saving the application.'
        />
      )}
      <form onSubmit={handleSubmit} style={{ margin: '0px' }} id='shortForm' noValidate>
        <AsymColumnLayout.Container>
          <AsymColumnLayout.MainContent>
            <ConfirmedPreferencesSection
              application={state.application}
              applicationMembers={getApplicationMembers(state.application)}
              fileBaseUrl={state.fileBaseUrl}
              onSave={(preferenceIndex, formApplicationValues) =>
                updateSavedPreference(dispatch, preferenceIndex, formApplicationValues)
              }
              onDismissError={() => preferencesFailedChanged(dispatch, false)}
              confirmedPreferencesFailed={state.confirmedPreferencesFailed}
              form={form}
            />
            <Income listingAmiCharts={state.listingAmiCharts} visited={visited} form={form} />
            <LeaseSection
              form={form}
              values={values}
              showLeaseSection={state.leaseSectionState !== NO_LEASE_STATE}
              onCreateLeaseClick={() => leaseCreated(dispatch)}
            />
            <DemographicsSection />
          </AsymColumnLayout.MainContent>
          <AsymColumnLayout.Sidebar>
            <Sidebar
              statusHistory={state.statusHistory}
              loading={state.loading}
              onAddCommentClicked={() => handleAddCommentClicked(form, touched)}
              onChangeStatus={(value) => onChangeStatus(form, touched, value)}
              onSaveClicked={() => checkForValidationErrors(form, touched)}
            />
          </AsymColumnLayout.Sidebar>
        </AsymColumnLayout.Container>
      </form>
      <StatusModalWrapper
        alertMsg={state.statusModal.alertMsg}
        isOpen={state.statusModal.isOpen}
        loading={state.statusModal.loading}
        onAlertCloseClick={() => closeSuppAppStatusModalAlert(dispatch)}
        onClose={() => closeSuppAppStatusModal(dispatch)}
        onSubmit={(submittedValues) => {
          const { application: prevApplication, leaseSectionState } = state
          return submitSuppAppStatusModal(
            dispatch,
            submittedValues,
            convertPercentAndCurrency(form.getState().values),
            prevApplication,
            leaseSectionState
          )
        }}
        showAlert={state.statusModal.showAlert}
        status={state.statusModal.status}
        submitButton={state.statusModal.submitButton}
        subStatus={state.statusModal.substatus}
        title={state.statusModal.header}
      />
    </>
  )
}

export default SupplementalApplicationContainer
