import React from 'react'
import { Form } from 'react-form';
import { isEmpty } from 'lodash'

import ContentSection from '../molecules/ContentSection'
import DemographicsInputs from './sections/DemographicsInputs'
import StatusList from './sections/StatusList'
import StatusUpdateForm from './sections/StatusUpdateForm'

//TODO: refactor. this is a placeholder
const StatusUpdateSection = () => (
  <div className="app-inner inset-wide padding-bottom-none margin-top">
    <StatusUpdateForm />
  </div>
)

const LeaseInformationSection = ({statusHistory}) => (
  <ContentSection title="Lease Information">
    <ContentSection.Sub title="Demographics">
      <DemographicsInputs />
    </ContentSection.Sub>
    {!isEmpty(statusHistory) &&
      (
        <ContentSection.Sub title="Status History" border={false}>
          <StatusList items={statusHistory} onAddCommnent={()=>alert('add comment')}/>
        </ContentSection.Sub>
      )
    }
  </ContentSection>
)

const ButtonPager = () => (
  <div className="button-pager">
    <div className="button-pager_row align-buttons-left primary inset-wide">
      <button className="button dropdown-button has-icon--right text-align-left small is-approved small has-status-width" href="#" aria-expanded="false">
        <span className="ui-icon ui-small" aria-hidden="true">
          <svg>
            <use xlinkHref="#i-arrow-down"></use>
          </svg>
        </span>
        Approved
      </button>
      <ul className="dropdown-menu" role="listbox" aria-hidden="true" aria-activedescendant="" tabIndex="-1" style={{display: "none"}}>
        <li className="dropdown-menu_item" role="option" aria-selected="false"><a href="#">This is a link</a></li>
        <li className="dropdown-menu_item" role="option" aria-selected="false"><a href="#">This is another</a></li>
        <li className="dropdown-menu_item is-selected" role="option" aria-selected="true"><a href="#">Yet another</a></li>
      </ul>
      <button className="button primary small" type="submit">Save</button>
    </div>
  </div>
)

class SupplementalApplicationContainer extends React.Component {
  render() {
    const { statusHistory, formFields, onSubmit } = this.props
    return (
        <Form onSubmit={onSubmit} defaultValues={formFields}	>
          {formApi => (
            <form onSubmit={formApi.submitForm} style={{margin:'0px'}}>
              <StatusUpdateSection/>
              <ContentSection title="Current Contact Information"/>
              <LeaseInformationSection statusHistory={statusHistory} />
              <div className="padding-bottom--2x margin-bottom--2x"></div>
              <ButtonPager/>
            </form>
          )}
        </Form>
    )
  }
}

export default SupplementalApplicationContainer
