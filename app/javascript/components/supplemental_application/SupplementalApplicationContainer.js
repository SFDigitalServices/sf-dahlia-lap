import React, { useState } from 'react'

import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'
import { Form } from 'react-final-form'

import Button from 'components/atoms/Button'
import AlertBox from 'components/molecules/AlertBox'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import validate, { touchAllFields, convertPercentAndCurrency } from 'utils/form/validations'

import ContentSection from '../molecules/ContentSection'
import LeaseUpSidebar from '../molecules/lease_up_sidebar/LeaseUpSidebar'
import AsymColumnLayout from '../organisms/AsymColumnLayout'
import { withContext } from './context'
import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import DemographicsInputs from './sections/DemographicsInputs'
import Lease from './sections/Lease'
import PreferencesTable from './sections/PreferencesTable'
import { NO_LEASE_STATE } from './SupplementalApplicationPage'

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

const Sidebar = withContext(
  ({ store: { statusHistory, loading }, onChangeStatus, onAddCommentClicked, onSaveClicked }) => {
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
)

const SupplementalApplicationContainer = ({ store }) => {
  const [failed, setFailed] = useState(false)

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

  const {
    application,
    applicationMembers,
    fileBaseUrl,
    onSavePreference,
    confirmedPreferencesFailed,
    onDismissError,
    listingAmiCharts,
    onSubmit,
    statusModal,
    handleCreateLeaseClick,
    handleStatusModalClose,
    handleStatusModalSubmit,
    assignSupplementalAppTouched,
    openAddStatusCommentModal,
    openUpdateStatusModal,
    leaseSectionState
  } = store

  const onAddCommentClicked = (form, touched) =>
    !checkForValidationErrors(form, touched) ? openAddStatusCommentModal() : null

  const onChangeStatus = (form, touched, value) =>
    !checkForValidationErrors(form, touched) ? openUpdateStatusModal(value) : null

  return (
    <Form
      onSubmit={(values) => onSubmit(convertPercentAndCurrency(values))}
      initialValues={application}
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
            onChange={assignSupplementalAppTouched}
            style={{ margin: '0px' }}
            id='shortForm'
            noValidate
          >
            <AsymColumnLayout.Container>
              <AsymColumnLayout.MainContent>
                <ConfirmedPreferencesSection
                  application={application}
                  applicationMembers={applicationMembers}
                  fileBaseUrl={fileBaseUrl}
                  onSave={onSavePreference}
                  onDismissError={onDismissError}
                  confirmedPreferencesFailed={confirmedPreferencesFailed}
                  form={form}
                />
                <Income listingAmiCharts={listingAmiCharts} visited={visited} form={form} />
                <LeaseSection
                  form={form}
                  values={values}
                  showLeaseSection={leaseSectionState !== NO_LEASE_STATE}
                  onCreateLeaseClick={handleCreateLeaseClick}
                />
                <DemographicsSection />
              </AsymColumnLayout.MainContent>
              <AsymColumnLayout.Sidebar>
                <Sidebar
                  onAddCommentClicked={() => onAddCommentClicked(form, touched)}
                  onChangeStatus={(value) => onChangeStatus(form, touched, value)}
                  onSaveClicked={() => checkForValidationErrors(form, touched)}
                />
              </AsymColumnLayout.Sidebar>
            </AsymColumnLayout.Container>
          </form>
          <StatusModalWrapper
            {...statusModal}
            onClose={handleStatusModalClose}
            onSubmit={(submittedValues) =>
              handleStatusModalSubmit(
                submittedValues,
                convertPercentAndCurrency(form.getState().values)
              )
            }
          />
        </>
      )}
    />
  )
}

export default withContext(SupplementalApplicationContainer)
