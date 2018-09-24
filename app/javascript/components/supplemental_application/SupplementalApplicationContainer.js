import React from 'react'
import { Form } from 'react-form'
import { isEmpty } from 'lodash'

import ContentSection from '../molecules/ContentSection'
import Loading from '../molecules/Loading'
import DemographicsInputs from './sections/DemographicsInputs'
import StatusList from './sections/StatusList'
import StatusUpdateForm from './sections/StatusUpdateForm'
import ConfirmedHouseholdIncome from './sections/ConfirmedHouseholdIncome'
import ConfirmedUnits from './sections/ConfirmedUnits'
import PreferencesTable from './sections/PreferencesTable'
import AlertBox from '~/components/molecules/AlertBox'
import Dropdown from '~/components/molecules/Dropdown'
import LeaseInformatonInputs from './sections/LeaseInformatonInputs'
import { withContext } from './context'
import { LEASE_UP_STATUS_OPTIONS } from '~/components/lease_ups/leaseUpsHelpers'

const StatusUpdateSection = () => (
  <ContentSection.Content paddingBottomNone marginTop>
    <StatusUpdateForm />
  </ContentSection.Content>
)

const StatusHistorySection = withContext(({ store }) => {
  const { statusHistory, openAddStatusCommentModal } = store
  return !isEmpty(statusHistory) && (
    <ContentSection.Sub title='Status History' borderBottom={false}>
      <StatusList items={statusHistory} onAddCommnent={openAddStatusCommentModal} />
    </ContentSection.Sub>
  )
})

const LeaseInformationSection = () => {
  return (
    <ContentSection title='Lease Information'>
      <ContentSection.Content borderBottom>
        <LeaseInformatonInputs />
      </ContentSection.Content>
      <ContentSection.Sub title='Demographics'>
        <DemographicsInputs />
      </ContentSection.Sub>
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

const ConfirmedPreferencesSection = ({ application, fileBaseUrl, onSave, confirmedPreferencesFailed, onDismissError }) => {
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
        />
      </ContentSection.Content>
    </ContentSection>
  )
}

// <button type='button' className='button dropdown-button has-icon--right text-align-left small is-approved small has-status-width' aria-expanded='false' disabled={disabled}>
//   <span className='ui-icon ui-small' aria-hidden='true'>
//     <svg>
//       <use xlinkHref='#i-arrow-down' />
//     </svg>
//   </span>
//   {application.processing_status}
// </button>
// <ul className='dropdown-menu' role='listbox' aria-hidden='true' aria-activedescendant='' tabIndex={0} style={{display: 'none'}}>
//   <li className='dropdown-menu_item' role='option' aria-selected='false'><a href='/some/valid/uri'>This is a link</a></li>
//   <li className='dropdown-menu_item' role='option' aria-selected='false'><a href='/some/valid/uri'>This is another</a></li>
//   <li className='dropdown-menu_item is-selected' role='option' aria-selected='true'><a href='/some/valid/uri'>Yet another</a></li>
// </ul>

const ButtonPager = withContext(({ store }) => {
  const { application, loading, openUpdateStatusModal } = store
  return (
    <div className='button-pager'>
      <div className='button-pager_row align-buttons-left primary inset-wide'>
        <Dropdown
          items={LEASE_UP_STATUS_OPTIONS}
          value={application.processing_status}
          prompt={application.processing_status}
          buttonClasses={['is-approved small has-status-width']}
          styles={{ display: 'inline-block', position: 'relative' }}
          menuClasses={['form-modal_dropdown-menu']}
          onChange={openUpdateStatusModal}
        />
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
  state = {
    loading: false
  }

  handleOnSubmit = (value) => {
    this.setState({loading: true})
    this.props.store.onSubmit(value).then(() => {
      this.setState({loading: false})
    })
  }

  render () {
    const { store } = this.props
    const {
      application,
      fileBaseUrl,
      onSavePreference,
      confirmedPreferencesFailed,
      onDismissError,
      amis,
      amiCharts
    } = store
    const { loading } = this.state

    return (
      <Loading isLoading={loading}>
        <Form onSubmit={this.handleOnSubmit} defaultValues={application}>
          {formApi => (
            <form onSubmit={formApi.submitForm} style={{ margin: '0px' }}>
              <StatusUpdateSection />
              <ContentSection title='Current Contact Information' />
              <ConfirmedPreferencesSection
                application={application}
                fileBaseUrl={fileBaseUrl}
                onSave={onSavePreference}
                onDismissError={onDismissError}
                confirmedPreferencesFailed={confirmedPreferencesFailed}
              />
              <ConfirmedHousehold amis={amis} formApi={formApi} amiCharts={amiCharts} />
              <LeaseInformationSection />
              <StatusHistorySection />
              <div className='padding-bottom--2x margin-bottom--2x' />
              <ButtonPager />
            </form>
          )}
        </Form>
      </Loading>
    )
  }
}

export default withContext(SupplementalApplicationContainer)
