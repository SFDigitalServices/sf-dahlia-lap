import React, { useState } from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'

import ContentSection from '../molecules/ContentSection'
import DemographicsInputs from './sections/DemographicsInputs'
import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import PreferencesTable from './sections/PreferencesTable'
import AlertBox from '~/components/molecules/AlertBox'
import LeaseInformationInputs from './sections/LeaseInformationInputs'
import RentalAssistance from './sections/RentalAssistance'
import { withContext } from './context'
import StatusModalWrapper from '~/components/organisms/StatusModalWrapper'

import validate, { touchAllFields } from '~/utils/form/validations'
import ParkingInformationInputs from './sections/ParkingInformationInputs'
import { convertPercentAndCurrency } from '../../utils/form/validations'
import AsymColumnLayout from '../organisms/AsymColumnLayout'
import LeaseUpSidebar from '../molecules/LeaseUpSidebar'

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
    title='Confirmed Preferences and Priorities'
    description='Please allow the applicant 24 hours to provide appropriate preference proof if not previously supplied.'
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
    <ContentSection.Sub title='Confirmed Reserved and Priority Units'>
      <ConfirmedUnits form={form} />
    </ContentSection.Sub>
  </ContentSection>
)

const Income = ({ listingAmiCharts, visited, form }) => (
  <ContentSection title='Income'>
    <ConfirmedHouseholdIncome
      listingAmiCharts={listingAmiCharts}
      visited={visited}
    />
  </ContentSection>
)

const LeaseInformationSection = ({ form, submitting, values, visited }) => (
  <ContentSection title='Lease Information'>
    <ContentSection.Sub title='Unit'>
      <LeaseInformationInputs form={form} visited={visited} />
    </ContentSection.Sub>
    <ContentSection.Sub
      title='Parking'
      description='If the applicant will receive a below market rate parking space, indicate the monthly cost.'
    >
      <ParkingInformationInputs form={form} values={values} visited={visited} />
    </ContentSection.Sub>
    <ContentSection.Sub
      title='Rental Assistance Information'
      description='Includes Vouchers, Subsidies, as well as other forms of Rental Assistance.'
    >
      <RentalAssistance form={form} submitting={submitting} />
    </ContentSection.Sub>
  </ContentSection>
)

const DemographicsSection = () => (
  <ContentSection title='Demographics'>
    <DemographicsInputs />
  </ContentSection>
)

const Sidebar = withContext(
  ({
    store: { statusHistory, loading },
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
)

const SupplementalApplicationContainer = ({ store }) => {
  const [failed, setFailed] = useState(false)

  const validateForm = values => {
    const errors = { lease: {} }
    // only validate lease_start_date when any of the fields is present
    if (!isEmpty(values.lease) && !isEmpty(values.lease.lease_start_date)) {
      errors.lease = { lease_start_date: {} }
      validate.isValidDate(
        values.lease.lease_start_date,
        errors.lease.lease_start_date
      )
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
    handleStatusModalClose,
    handleStatusModalSubmit,
    assignSupplementalAppTouched,
    openAddStatusCommentModal,
    openUpdateStatusModal
  } = store

  const onAddCommentClicked = (form, touched) =>
    !checkForValidationErrors(form, touched) ? openAddStatusCommentModal() : null

  const onChangeStatus = (form, touched, value) =>
    !checkForValidationErrors(form, touched)
      ? openUpdateStatusModal(value)
      : null

  return (
    <Form
      onSubmit={values => onSubmit(convertPercentAndCurrency(values))}
      initialValues={application}
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      render={({
        handleSubmit,
        form,
        touched,
        submitting,
        values,
        visited
      }) => (
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
                  <Income
                    listingAmiCharts={listingAmiCharts}
                    visited={visited}
                    form={form}
                  />
                  <LeaseInformationSection
                    form={form}
                    values={values}
                    submitting={submitting}
                    visited={visited}
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
              onSubmit={submittedValues =>
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
