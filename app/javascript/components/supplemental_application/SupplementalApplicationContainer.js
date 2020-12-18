import React, { useContext, useState } from 'react'

import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'
import { Form } from 'react-final-form'

import Alerts from 'components/Alerts'
import Button from 'components/atoms/Button'
import AlertBox from 'components/molecules/AlertBox'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { NO_LEASE_STATE } from 'context/actionCreators/applicationDetailsActionHelpers'
import { AppContext } from 'context/Provider'
import { getApplicationMembers } from 'utils/applicationDetailsUtils'
import validate, { touchAllFields, convertPercentAndCurrency } from 'utils/form/validations'

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

const SupplementalApplicationContainer = () => {
  const [failed, setFailed] = useState(false)
  const [
    {
      applicationDetailsData: { supplemental: state }
    },
    actions
  ] = useContext(AppContext)

  const validateForm = (values) => {
    const errors = { lease: {} }
    // only validate lease_start_date when any of the fields is present
    if (!isEmpty(values.lease) && !isEmpty(values.lease.lease_start_date)) {
      const dateErrors = validate.isValidDate(values.lease.lease_start_date, {})

      // only set any error fields if there were actually any date errors.
      if (dateErrors?.all || dateErrors?.day || dateErrors?.month || dateErrors?.year) {
        errors.lease.lease_start_date = dateErrors
      }
    }
    return errors
  }

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
      ? actions.openSuppAppAddCommentModal(state.statusHistory)
      : null

  const onChangeStatus = (form, touched, value) =>
    !checkForValidationErrors(form, touched) ? actions.openSuppAppUpdateStatusModal(value) : null

  const handleSaveApplication = async (formApplication) => {
    const { application: prevApplication, leaseSectionState } = state

    actions
      .updateSupplementalApplication(leaseSectionState, formApplication, prevApplication)
      .catch((e) => {
        console.error(e)
        Alerts.error()
      })
  }

  return (
    <Form
      onSubmit={(values) => handleSaveApplication(convertPercentAndCurrency(values))}
      initialValues={state.application}
      // Keep dirty on reinitialize ensures the whole form doesn't refresh
      // when only a piece of it is saved (eg. when the lease is saved)
      keepDirtyOnReinitialize
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      render={({ handleSubmit, form, touched, values, visited }) => (
        <>
          {failed && (
            <AlertBox
              invert
              onCloseClick={() => setFailed(false)}
              message='Please resolve any errors before saving the application.'
            />
          )}
          <form
            onSubmit={handleSubmit}
            onChange={() => actions.supplementalAppTouched(true)}
            style={{ margin: '0px' }}
            id='shortForm'
            noValidate
          >
            <AsymColumnLayout.Container>
              <AsymColumnLayout.MainContent>
                <ConfirmedPreferencesSection
                  application={state.application}
                  applicationMembers={getApplicationMembers(state.application)}
                  fileBaseUrl={state.fileBaseUrl}
                  onSave={actions.updateSavedPreference}
                  onDismissError={() => actions.preferencesFailedChanged(false)}
                  confirmedPreferencesFailed={state.confirmedPreferencesFailed}
                  form={form}
                />
                <Income listingAmiCharts={state.listingAmiCharts} visited={visited} form={form} />
                <LeaseSection
                  form={form}
                  values={values}
                  showLeaseSection={state.leaseSectionState !== NO_LEASE_STATE}
                  onCreateLeaseClick={actions.leaseCreated}
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
            onAlertCloseClick={actions.closeSuppAppStatusModalAlert}
            onClose={actions.closeSuppAppStatusModal}
            onSubmit={(submittedValues) => {
              const { application: prevApplication, leaseSectionState } = state
              return actions.submitSuppAppStatusModal(
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
      )}
    />
  )
}

export default SupplementalApplicationContainer
