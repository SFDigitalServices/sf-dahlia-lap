import React from 'react'
import { Select } from 'react-form'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment, SelectStatus } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { map } from 'lodash'

const {
  preferenceProofOptionsDefault
} = formOptions

export const AntiDisplacementHousingPanel = ({ preferenceIndex, preference, applicationMembers }) => {
  const memberOption = (member) => { return { value: member.id, label: `${member.first_name} ${member.last_name}` } }
  let applicationMembersOptions = map(applicationMembers, memberOption)
  return (
    <React.Fragment>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>
          Anti-Displacement Housing Preference
          </div>
        </FormItem>
        <FormItem label='HH Member on Proof'>
          <Select field={buildFieldId(preferenceIndex, 'application_member_id')} options={applicationMembersOptions} placeholder='Select One' />
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

export default AntiDisplacementHousingPanel
