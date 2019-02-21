import React from 'react'
import { Select } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment, SelectStatus } from './utils'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'

export const AssistedHousingPanel = ({ preferenceIndex, preference, applicationMembersOptions }) => {
  return (
    <React.Fragment>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>
          Assisted Housing Preference
          </div>
        </FormItem>
        <FormItem label='Name on Lease'>
          <Select field={buildFieldId(preferenceIndex, 'application_member_id')} options={applicationMembersOptions} placeholder='Select One' />
        </FormItem>
        <FormItem label='Status'>
          <SelectStatus
            preferenceIndex={preferenceIndex}
            className='preference-status-select' />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>
              Do not give this preference unless applicant has provided a lease.
              If the person who lives in assisted housing is not the primary applicant,
              their address must have been provided at the time of the original application.
            </Comment>
          </div>
        </div>
      </FormGrid.Row>
    </React.Fragment>
  )
}

export default AssistedHousingPanel
