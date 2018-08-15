import React from 'react'
import { Select } from 'react-form'

import FormGrid  from '~/components/molecules/FormGrid'
import { buildHouseholdMembersOptions, buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { FormItem, Comment, statusOptions } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'

const {
  preference_proof_options_default
} = formOptions

export const NeighborhoodResidentHousingPanel = ({ preferenceIndex, applicationMembers }) => {
  const applicationMembersOptions = buildHouseholdMembersOptions(applicationMembers)
  return (
    <React.Fragment>
    <FormGrid.Row expand={false}>
      <FormItem label="Preference Name">
        <div className="text-value">
          Neighborhood Resident Housing Preference (NRHP)
        </div>
      </FormItem>
      <FormItem label="HH Member on Proof">
        <Select field={buildFieldId(preferenceIndex,'naturalKey')} options={applicationMembersOptions}/>
      </FormItem>
      <FormItem label="Type of Proof">
        <Select field={buildFieldId(preferenceIndex,'type_of_proof')} options={preference_proof_options_default}/>
      </FormItem>
      <FormItem label="Status">
        <Select field={buildFieldId(preferenceIndex,'post_lottery_validation')} options={statusOptions}/>
      </FormItem>
    </FormGrid.Row>
    <FormGrid.Row expand={false}>
      <div className='form-group'>
        <div className="form-grid_item large-12 column padding-bottom">
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
