import React from 'react'
import { Select, Text } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId, memberNameFromPref } from '~/components/applications/application_form/preferences/utils'

const {
  preference_proof_options_default
} = formOptions

export const Custom = ({ preferenceIndex, preference, application }) => {
  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          {preference.preference_name}
        </div>
      </FormItem>
      <FormItem label="HH Member on Proof">
        {/*
          TODO: Add ability for users to change application member on pref.
          For now, we just show the current app member in a read-only field.
        */}
        <input value={memberNameFromPref(preference)} disabled="true"/>
      </FormItem>
      <FormItem label="Type of Proof">
        <Select field={buildFieldId(preferenceIndex,'type_of_proof')} options={preference_proof_options_default}/>
      </FormItem>
      <FormItem label="Status">
        {/*
          TODO: Add ability for users to change status on pref.
          For now, we just show the current status in a read-only field.
        */}
        <Text field={buildFieldId(preferenceIndex, 'post_lottery_validation')} disabled="true"/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column padding-bottom">
          <Comment>
            Please check to make sure that a document proving the preference address is provided.
            If no proof document is provided, do not confirm this preference.
          </Comment>
        </div>
      </div>
    </FormGrid.Row>
  </React.Fragment>)
}

export default Custom
