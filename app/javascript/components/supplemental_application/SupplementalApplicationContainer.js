import React, { useState } from 'react'
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

import validate, { touchAllFields } from '~/utils/form/validations'
import ParkingInformationInputs from './sections/ParkingInformationInputs'
import { convertPercentAndCurrency } from '../../utils/form/validations'
import AsymColumnLayout from '../organisms/AsymColumnLayout'

const StatusUpdateSection = withContext(({ store, formIsValid }) => {
  const {
    statusHistory,
    openUpdateStatusModal,
    openAddStatusCommentModal,
    loading
  } = store
  let recentStatusUpdate =
    statusHistory && statusHistory[0]
      ? statusHistory[0]
      : { status: null, comment: null, date: null }

  return (
    <ContentSection.Content paddingBottomNone marginTop>
      <StatusUpdate
        status={recentStatusUpdate.status}
        substatus={recentStatusUpdate.substatus}
        comment={recentStatusUpdate.comment}
        date={recentStatusUpdate.date}
        onStatusDropdownChange={value =>
          formIsValid() ? openUpdateStatusModal(value) : null
        }
        onAddCommentClick={() =>
          formIsValid() ? openAddStatusCommentModal() : null
        }
        statusHistoryAnchor='#status-history-section'
        loading={loading}
      />
    </ContentSection.Content>
  )
})

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
    title='Confirmed Preferences'
    description='Please allow the applicant 24 hours to provide appropriate preference proof if not previously supplied.'
  >
    <ContentSection.Content>
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
    </ContentSection.Content>
  </ContentSection>
)

const ConfirmedHousehold = ({ listingAmiCharts, visited }) => (
  <ContentSection title='Confirmed Household'>
    <ContentSection.Sub title='Confirmed Reserved and Priority Units'>
      <ConfirmedUnits />
    </ContentSection.Sub>
    <ContentSection.Sub title='Confirmed Household Income'>
      <ConfirmedHouseholdIncome
        listingAmiCharts={listingAmiCharts}
        visited={visited}
      />
    </ContentSection.Sub>
  </ContentSection>
)

const LeaseInformationSection = ({ form, values, visited }) => (
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
  </ContentSection>
)

const RentalAssistanceSection = ({ form, submitting, visited }) => (
  <ContentSection.Sub
    title='Rental Assistance Information'
    description='Includes Vouchers, Subsidies, as well as other forms of Rental Assistance.'
  >
    <RentalAssistance form={form} submitting={submitting} />
  </ContentSection.Sub>
)

const DemographicsSection = () => (
  <ContentSection.Sub title='Demographics'>
    <DemographicsInputs />
  </ContentSection.Sub>
)

const StatusHistorySection = withContext(
  ({
    store: { statusHistory, openAddStatusCommentModal, loading },
    formIsValid
  }) => {
    return (
      !isEmpty(statusHistory) && (
        <ContentSection.Sub title='Status History' borderBottom={false}>
          <StatusList
            items={statusHistory}
            onAddComment={() =>
              formIsValid() ? openAddStatusCommentModal() : null
            }
            commentDisabled={loading}
          />
        </ContentSection.Sub>
      )
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
              <StatusUpdateSection
                formIsValid={() => !checkForValidationErrors(form, touched)}
              />
              <div className='padding-bottom--2x margin-bottom--2x' />
              <ScrollableAnchor id={'status-history-section'}>
                <div>
                  <StatusHistorySection formIsValid={() => !checkForValidationErrors(form, touched)} />
                </div>
              </ScrollableAnchor>
              <div className='button-pager'>
                <div className='button-pager_row align-buttons-left primary inset-wide'>
                  <StatusDropdown
                    status={application.processing_status}
                    onChange={value =>
                      !checkForValidationErrors(form, touched)
                        ? openUpdateStatusModal(value)
                        : null
                    }
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
                    onClick={() => checkForValidationErrors(form, touched)}
                  >
                    {loading ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
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
                  <ConfirmedHousehold
                    listingAmiCharts={listingAmiCharts}
                    visited={visited}
                  />
                  <LeaseInformationSection
                    form={form}
                    values={values}
                    visited={visited}
                  />
                  <RentalAssistanceSection
                    form={form}
                    submitting={submitting}
                    visited={visited}
                  />
                  <DemographicsSection />
                </AsymColumnLayout.MainContent>
                <AsymColumnLayout.Sidebar>
                  <h1>Status sidebar placeholder</h1>
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
