import React from 'react'
import { Form } from 'react-form'
import { isEmpty } from 'lodash'
import ScrollableAnchor from 'react-scrollable-anchor'

import ContentSection from '../molecules/ContentSection'
import Loading from '../molecules/Loading'
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

const StatusUpdateSection = withContext(({ store }) => {
  const { statusHistory, openUpdateStatusModal, openAddStatusCommentModal } = store
  let recentStatusUpdate = statusHistory && statusHistory[0] ? statusHistory[0] : {status: null, comment: null, date: null}
  return (
    <ContentSection.Content paddingBottomNone marginTop>
      <StatusUpdate
        status={recentStatusUpdate.status}
        comment={recentStatusUpdate.comment}
        date={recentStatusUpdate.date}
        onStatusDropdownChange={openUpdateStatusModal}
        onAddCommentClick={openAddStatusCommentModal}
        statusHistoryAnchor='#status-history-section' />
    </ContentSection.Content>
  )
})

const ConfirmedPreferencesSection = ({ application, fileBaseUrl, onSave, confirmedPreferencesFailed, onDismissError, formApi }) => {
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
          onSave={onSave}
          fileBaseUrl={fileBaseUrl}
          onPanelClose={onDismissError}
          formApi={formApi}
        />
      </ContentSection.Content>
    </ContentSection>
  )
}

const ConfirmedHousehold = ({ amis, amiCharts, formApi }) => {
  return (
    <ContentSection title='Confirmed Household'>
      <ContentSection.Sub title='Confirmed Reserved and Priority Units'>
        <ConfirmedUnits />
      </ContentSection.Sub>
      <ContentSection.Sub title='Confirmed Household Income'>
        <ConfirmedHouseholdIncome amis={amis} amiCharts={amiCharts} formApi={formApi} />
      </ContentSection.Sub>
    </ContentSection>
  )
}

const LeaseInformationSection = () => {
  return (
    <ContentSection title='Lease Information'>
      <ContentSection.Content borderBottom>
        <LeaseInformationInputs />
      </ContentSection.Content>
      <ContentSection.Sub
        title='Rental Assistance Information'
        description='Includes Vouchers, Subsidies, as well as other forms of Rental Assistance.'>
        <RentalAssistance />
      </ContentSection.Sub>
      <ContentSection.Sub title='Demographics'>
        <DemographicsInputs />
      </ContentSection.Sub>
    </ContentSection>
  )
}

const StatusHistorySection = withContext(({ store }) => {
  const { statusHistory, openAddStatusCommentModal } = store
  return !isEmpty(statusHistory) && (
    <ContentSection.Sub title='Status History' borderBottom={false}>
      <StatusList items={statusHistory} onAddComment={openAddStatusCommentModal} />
    </ContentSection.Sub>
  )
})

const ActionButtons = withContext(({ loading, store }) => {
  const { application, openUpdateStatusModal } = store

  return (
    <div className='button-pager'>
      <div className='button-pager_row align-buttons-left primary inset-wide'>
        <StatusDropdown
          status={application.processing_status}
          onChange={openUpdateStatusModal}
          buttonClasses={['small', 'has-status-width']}
          wrapperClasses={['dropdown-inline']}
          menuClasses={['dropdown-menu-bottom']} />
        <button
          className='button primary small save-btn'
          type='submit'
          disabled={loading}>
          Save
        </button>
      </div>
    </div>)
})

class SupplementalApplicationContainer extends React.Component {
  render () {
    const { store } = this.props
    const {
      application,
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
      handleStatusModalStatusChange,
      handleStatusModalSubmit,
      assignSupplementalAppTouched
    } = store

    return (
      <Loading isLoading={loading}>
        <Form onSubmit={onSubmit} defaultValues={application}>
          {formApi => (
            <React.Fragment>
              <form onSubmit={formApi.submitForm} onChange={assignSupplementalAppTouched} style={{ margin: '0px' }}>
                <StatusUpdateSection />
                <ConfirmedPreferencesSection
                  application={application}
                  fileBaseUrl={fileBaseUrl}
                  onSave={onSavePreference}
                  onDismissError={onDismissError}
                  confirmedPreferencesFailed={confirmedPreferencesFailed}
                  formApi={formApi}
                />
                <ConfirmedHousehold amis={amis} formApi={formApi} amiCharts={amiCharts} />
                <LeaseInformationSection />
                <ScrollableAnchor id={'status-history-section'}><div><StatusHistorySection /></div></ScrollableAnchor>
                <div className='padding-bottom--2x margin-bottom--2x' />
                <ActionButtons loading={loading} />
              </form>
              <StatusModalWrapper
                {...statusModal}
                onClose={handleStatusModalClose}
                onStatusChange={handleStatusModalStatusChange}
                onSubmit={(submittedValues) => handleStatusModalSubmit(submittedValues, formApi.values)}
              />
            </React.Fragment>
          )}
        </Form>
      </Loading>
    )
  }
}

export default withContext(SupplementalApplicationContainer)
