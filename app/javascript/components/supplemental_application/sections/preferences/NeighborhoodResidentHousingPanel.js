import React from 'react'
import { Select } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment, SelectStatus } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId, memberNameFromPref } from '~/components/applications/application_form/preferences/utils'

const {
  preferenceProofOptionsDefault
} = formOptions

export const NeighborhoodResidentHousingPanel = ({ preferenceIndex, preference }) => {
  return (
    <React.Fragment>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>
          Neighborhood Resident Housing Preference (NRHP)
          </div>
        </FormItem>
        <FormItem label='HH Member on Proof'>
          {/*
          TODO: Add ability for users to change application member on pref.
          For now, we just show the current app member in a read-only field.
        */}
          <input value={memberNameFromPref(preference)} disabled='true' />
        </FormItem>
        <FormItem label='Type of Proof'>
          <Select field={buildFieldId(preferenceIndex, 'type_of_proof')} options={preferenceProofOptionsDefault} />
        </FormItem>
        <FormItem label='Status'>
          <SelectStatus preferenceIndex={preferenceIndex} />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>
            Please check to make sure that a document proving the preference address is provided.
            if no proof document is provided, do not confirm this preference.
            </Comment>
            <Comment>
            If the HH member name on the proof is not the primary applicant,
            their residence address must have been provided at time of the original application.
            MOHCD will verify that their address qualifies for this preference.
            </Comment>
          </div>
        </div>
      </FormGrid.Row>
    </React.Fragment>)
}

export default NeighborhoodResidentHousingPanel
