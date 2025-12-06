import React, { useState } from 'react'

import Button from 'components/atoms/Button'
import AlertBox from 'components/molecules/AlertBox'
import FormGrid from 'components/molecules/FormGrid'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'
import { leaseCreated } from 'components/supplemental_application/actions/leaseActionCreators'
import {
  updateSavedPreference,
  preferenceAlertCloseClicked
} from 'components/supplemental_application/actions/preferenceActionCreators'
import {
  closeSuppAppStatusModal,
  closeSuppAppStatusModalAlert,
  openSuppAppAddCommentModal,
  openSuppAppUpdateStatusModal,
  submitSuppAppStatusModal
} from 'components/supplemental_application/actions/statusModalActionCreators'
import { hasLease } from 'components/supplemental_application/utils/leaseSectionStates'
import {
  getApplicationMembers,
  getPrefProofCutoff
} from 'components/supplemental_application/utils/supplementalApplicationUtils'
import { useAppContext } from 'utils/customHooks'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import { touchAllFields, convertPercentAndCurrency } from 'utils/form/validations'

import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import DemographicsInputs from './sections/DemographicsInputs'
import Lease from './sections/Lease'
import PreferencesTable from './sections/PreferencesTable'
import ContentSection from '../molecules/ContentSection'
import LeaseUpSidebar from '../molecules/lease_up_sidebar/LeaseUpSidebar'
import AsymColumnLayout from '../organisms/AsymColumnLayout'

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
        <p>
          Complete this section first.{' '}
          <b>You must confirm claimed preferences before sending out a post-lottery letter.</b>{' '}
          Please allow the applicant 24 hours to provide appropriate preference proof if not
          previously supplied.
        </p>
        <div>
          Their document must include:
          <ul className='bullet-list'>
            <li>Their name</li>
            <li>The address where they live or work in San Francisco</li>
            <li>
              A date on or after {getPrefProofCutoff(application.application_submitted_date)} (45
              days before they submitted their application)
            </li>
          </ul>
        </div>
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
        form={form}
        visited={visited}
      />
    </ContentSection.Sub>
    <ContentSection.Sub
      title='Application Signature'
      description={
        <>
          Complete this section by filling in the date of the applicant’s supplemental application
          once it has been received. Be sure to enter the date from the application itself, not the
          date on which you received it.
        </>
      }
    >
      <FormGrid.Row>
        <FormGrid.Item>
          <MultiDateField
            form={form}
            formName='supp_app_signed_date'
            fieldName='supp_app_signed_date'
            id='supp_app_signed_date'
            label='Application Signature Date'
          />
        </FormGrid.Item>
      </FormGrid.Row>
    </ContentSection.Sub>
    <ContentSection.Sub title='Household Reserved and Priority Units'>
      <ConfirmedUnits
        form={form}
        showHCBSUnitsCheckbox={application.listing.custom_listing_type === 'HCBS Units'}
      />
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
    description='Complete this section when a household has gone through income qualification. You must complete this section even if the household is over or under income eligibility.'
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

const SupplementalApplicationContainer = ({
  handleSubmit,
  form,
  touched,
  values,
  visited,
  listingId
}) => {
  const [failed, setFailed] = useState(false)
  const [
    {
      supplementalApplicationData: { supplemental: state }
    },
    dispatch
  ] = useAppContext()

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
      <form onSubmit={handleSubmit} style={{ margin: '0px' }} id='shortForm' noValidate role='form'>
        <AsymColumnLayout.Container>
          <AsymColumnLayout.MainContent>
            <ConfirmedPreferencesSection
              application={state.application}
              applicationMembers={getApplicationMembers(state.application)}
              fileBaseUrl={state.fileBaseUrl}
              onSave={(preferenceIndexToUpdate, preferenceIndexToClose, formApplicationValues) =>
                updateSavedPreference(
                  dispatch,
                  preferenceIndexToUpdate,
                  preferenceIndexToClose,
                  formApplicationValues
                )
              }
              onDismissError={() => preferenceAlertCloseClicked(dispatch)}
              confirmedPreferencesFailed={state.confirmedPreferencesFailed}
              form={form}
            />
            <Income listingAmiCharts={state.listingAmiCharts} visited={visited} form={form} />
            <DemographicsSection />
            <LeaseSection
              form={form}
              values={values}
              showLeaseSection={hasLease(state.leaseSectionState)}
              onCreateLeaseClick={() => leaseCreated(dispatch)}
            />
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
        submitButton={state.statusModal.isInAddCommentMode ? 'Save' : 'Update'}
        subStatus={state.statusModal.substatus}
        title={state.statusModal.isInAddCommentMode ? 'Add New Comment' : 'Update Status'}
        listingId={listingId}
      />
    </>
  )
}

export default SupplementalApplicationContainer
