import React from 'react'
import { Form } from 'react-form';
import { isEmpty } from 'lodash'

import ContentSection from '../molecules/ContentSection'
import Loading from '../molecules/Loading'
import DemographicsInputs from './sections/DemographicsInputs'
import StatusList from './sections/StatusList'
import StatusUpdateForm from './sections/StatusUpdateForm'
import ConfirmedUnits from './sections/ConfirmedUnits'
import PreferencesTable from './sections/PreferencesTable'

const StatusUpdateSection = () => (
  <ContentSection.Content paddingBottomNone marginTop>
    <StatusUpdateForm />
  </ContentSection.Content>
)

const LeaseInformationSection = ({ statusHistory }) => (
  <ContentSection title="Lease Information">
    <ContentSection.Sub title="Demographics">
      <DemographicsInputs/>
    </ContentSection.Sub>
    {!isEmpty(statusHistory) &&(
        <ContentSection.Sub title="Status History" borderBottom={false}>
          <StatusList items={statusHistory} onAddCommnent={() => alert('add comment')}/>
        </ContentSection.Sub>
      )
    }
  </ContentSection>
)

const ConfirmedHoushold = () => {
  return (
    <ContentSection title="Confirmed Household">
      <ContentSection.Sub title="Confirmed Reserved and Priority Units">
        <ConfirmedUnits />
      </ContentSection.Sub>
    </ContentSection>
  )
}

const ConfirmedPreferencesSection = ({application, fileBaseUrl, onSave}) => {
  return (
    <ContentSection
      title="Confirmed Preferences"
      description="Please allow the applicant 24 hours to provide appropriate preference proof if not previously supplied.">
      <ContentSection.Content>
        <PreferencesTable
          application={application}
          onSave={onSave}
          fileBaseUrl={fileBaseUrl}
        />
      </ContentSection.Content>
    </ContentSection>
  )
}

const ButtonPager = ({ disabled }) => (
  <div className="button-pager">
    <div className="button-pager_row align-buttons-left primary inset-wide">
      <button className="button dropdown-button has-icon--right text-align-left small is-approved small has-status-width" href="#" aria-expanded="false" disabled={disabled}>
        <span className="ui-icon ui-small" aria-hidden="true">
          <svg>
            <use xlinkHref="#i-arrow-down"></use>
          </svg>
        </span>
        Approved
      </button>
      <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant="" tabIndex={0} style={{display: "none"}}>
        <li className="dropdown-menu_item" role="option" aria-selected="false"><a href="/some/valid/uri">This is a link</a></li>
        <li className="dropdown-menu_item" role="option" aria-selected="false"><a href="/some/valid/uri">This is another</a></li>
        <li className="dropdown-menu_item is-selected" role="option" aria-selected="true"><a href="/some/valid/uri">Yet another</a></li>
      </ul>
      <button className="button primary small save-btn" type="submit" disabled={disabled}>Save</button>
    </div>
  </div>
)

class SupplementalApplicationContainer extends React.Component {
  state = {
    loading: false
  }

  handleOnSubmit = (value) => {
    this.setState({loading: true})
    this.props.onSubmit(value).then(() => {
      this.setState({loading: false})
    })
  }

  render() {
    const { statusHistory, application, fileBaseUrl, onSavePreference } = this.props
    const { loading } = this.state

    return (
      <Loading isLoading={loading}>
        <Form onSubmit={this.handleOnSubmit} defaultValues={application}>
          {formApi => (
            <form onSubmit={formApi.submitForm} style={{ margin:'0px' }}>
              <StatusUpdateSection/>
              <ContentSection title="Current Contact Information"/>
              <ConfirmedPreferencesSection
                application={application}
                fileBaseUrl={fileBaseUrl}
                onSave={onSavePreference}
              />
              <ConfirmedHoushold />
              <LeaseInformationSection statusHistory={statusHistory} />
              <div className="padding-bottom--2x margin-bottom--2x"></div>
              <ButtonPager disabled={loading}/>
            </form>
          )}
        </Form>
      </Loading>
    )
  }
}

export default SupplementalApplicationContainer
