import React from 'react'

import formOptions from 'components/applications/application_form/formOptions'
import { buildFieldId } from 'components/applications/application_form/preferences/utils'
import FormGrid from 'components/molecules/FormGrid'
import { SelectField } from 'utils/form/final_form/Field'

import { FormItem, Comment, statusOptions } from './utils'

const { labelize } = formOptions

export const AssistedHousingPanel = ({
  preferenceIndex,
  preference,
  applicationMembersOptions
}) => {
  return (
    <>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>Assisted Housing Preference</div>
        </FormItem>
        <FormItem>
          <SelectField
            label='Name on Lease'
            fieldName={buildFieldId(preferenceIndex, 'application_member_id')}
            options={labelize(applicationMembersOptions, { disableEmpty: true })}
          />
        </FormItem>
        <FormItem>
          <SelectField
            label='Status'
            fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
            options={labelize(statusOptions, { disableEmpty: true })}
            className='preference-status-select'
          />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>
              Do not give this preference unless applicant has provided a lease. If the person who
              lives in assisted housing is not the primary applicant, their address must have been
              provided at the time of the original application.
            </Comment>
          </div>
        </div>
      </FormGrid.Row>
    </>
  )
}

export default AssistedHousingPanel
