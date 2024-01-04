import React from 'react'

import formOptions from 'components/applications/application_form/formOptions'
import { buildFieldId } from 'components/applications/application_form/preferences/utils'
import FormGrid from 'components/molecules/FormGrid'
import { SelectField } from 'utils/form/final_form/Field'

import { FormItem, Comment, statusOptions, isVeteran } from './utils'

const { labelize } = formOptions
const { preferenceProofOptionsDefault, preferenceProofOptionsVeteran } = formOptions

const typeOfProofFieldName = (preference_name, preferenceIndex) => {
  const field = isVeteran(preference_name) ? 'veteran_type_of_proof' : 'type_of_proof'
  return buildFieldId(preferenceIndex, field)
}

const comments = {
  NON_VETERAN:
    'Please check to make sure that a document proving the preference address is provided. If no proof document is provided, do not confirm this preference.',
  VETERAN:
    'Please check to make sure that a document proving Veteran status is provided. If no proof document is provided, do not confirm this preference.'
}

export const Custom = ({ preferenceIndex, preference, applicationMembersOptions }) => {
  const isPrefVeteran = isVeteran(preference.preference_name)
  return (
    <>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>
            {isPrefVeteran ? 'Veteran status' : preference.preference_name}
          </div>
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
            fieldName={typeOfProofFieldName(preference.preference_name, preferenceIndex)}
            options={isPrefVeteran ? preferenceProofOptionsVeteran : preferenceProofOptionsDefault}
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
            <Comment>{isPrefVeteran ? comments.VETERAN : comments.NON_VETERAN}</Comment>
          </div>
        </div>
      </FormGrid.Row>
    </>
  )
}

export default Custom
