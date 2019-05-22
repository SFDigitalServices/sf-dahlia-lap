import React from 'react'
import { SelectField } from '~/utils/form/final_form/Field.js'

import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { statusOptions } from '~/components/supplemental_application/sections/preferences/utils'
const { labelize } = formOptions

const {
  preferenceProofOptionsDefault
} = formOptions

export const AntiDisplacementHousingPanel = ({ preferenceIndex, preference, applicationMembersOptions }) => {
  return (
    <React.Fragment>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>
          Anti-Displacement Housing Preference
          </div>
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'application_member_id')}
            options={labelize(applicationMembersOptions, {disableEmpty: true})}
            label='HH Member on Proof' />
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'type_of_proof')}
            options={preferenceProofOptionsDefault}
            label='Type of Proof' />
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
            options={labelize(statusOptions, {disableEmpty: true})}
            label='Status' />
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
