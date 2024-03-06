import React from 'react'

import formOptions from 'components/applications/application_form/formOptions'
import { buildFieldId } from 'components/applications/application_form/preferences/utils'
import FormGrid from 'components/molecules/FormGrid'
import { SelectField } from 'utils/form/final_form/Field'

import { FormItem, Comment, statusOptions } from './utils'

const { labelize } = formOptions
const { preferenceProofOptionsVeteran } = formOptions

export const LayeredPreferencePanel = ({ preferenceIndex, applicationMembersOptions }) => {
  return (
    <>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>{'Veteran status'}</div>
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'application_member_id')}
            options={labelize(applicationMembersOptions, { disableEmpty: true })}
            label='HH Member on Proof'
          />
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'veteran_type_of_proof')}
            options={preferenceProofOptionsVeteran}
            label='Type of Proof'
          />
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
            options={labelize(statusOptions, { disableEmpty: true })}
            label='Status'
          />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>
              {
                'Please check to make sure that a document proving Veteran status is provided. If no proof document is provided, do not confirm this preference.'
              }
            </Comment>
          </div>
        </div>
      </FormGrid.Row>
    </>
  )
}

export default LayeredPreferencePanel
