import React, { useState } from 'react'

import formOptions from 'components/applications/application_form/formOptions'
import { buildFieldId } from 'components/applications/application_form/preferences/utils'
import FormGrid from 'components/molecules/FormGrid'
import { SelectField } from 'utils/form/final_form/Field'
import formUtils from 'utils/formUtils'

import { FormItem, Comment, statusOptions } from './utils'

const { labelize } = formOptions

const { preferenceProofOptionsLiveSf, preferenceProofOptionsWorkInSf } = formOptions

const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

const getLWPrefProofTypeOptions = (individualPrefName) => {
  if (individualPrefName === 'Live in SF') {
    return preferenceProofOptionsLiveSf
  } else {
    return preferenceProofOptionsWorkInSf
  }
}

const LiveOrWorkInSanFranciscoPanel = ({
  form,
  preference,
  preferenceIndex,
  applicationMembersOptions
}) => {
  const getFormPreferenceOrNull = () => form.getState().values?.preferences?.[preferenceIndex]

  const [prefProofTypeOptions, setProofTypeOptions] = useState(
    getLWPrefProofTypeOptions(
      getFormPreferenceOrNull()?.individual_preference ?? preference.individual_preference
    )
  )

  const updatePrefProofOptions = (event) => {
    // This is a SyntheticEvent. We can access event.target.value without persisting the event
    event.persist()
    setProofTypeOptions(getLWPrefProofTypeOptions(event.target.value))
    // Reset the preference proof if the individual preference updates
    form.change(`preferences[${preferenceIndex}].lw_type_of_proof`, null)
    // Type of proof needs to be null if lw_type_of_proof is null, otherwise it will overwrite the value.
    form.change(`preferences[${preferenceIndex}].type_of_proof`, null)
  }

  return (
    <>
      <FormGrid.Row expand={false}>
        <FormItem label='Preference Name'>
          <div className='text-value'>Live or Work in San Francisco Preference</div>
        </FormItem>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'individual_preference')}
            options={labelize(individualPreferenceOptions, { disableEmpty: true })}
            label='Individual Preference Name'
            className='individual-preference-select'
            onChange={updatePrefProofOptions}
          />
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
            fieldName={buildFieldId(preferenceIndex, 'lw_type_of_proof')}
            options={prefProofTypeOptions}
            label='Type of Proof'
            className='type-of-proof-select'
          />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <FormItem>
          <SelectField
            fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
            options={labelize(statusOptions, { disableEmpty: true })}
            label='Status'
            className='preference-status-select'
          />
        </FormItem>
      </FormGrid.Row>
      <FormGrid.Row expand={false}>
        <div className='form-group'>
          <div className='form-grid_item large-12 column padding-bottom'>
            <Comment>
              Please check to make sure that a document proving the preference address is provided.
              If no proof document is provided, do not confirm this preference.
            </Comment>
          </div>
        </div>
      </FormGrid.Row>
    </>
  )
}

export default LiveOrWorkInSanFranciscoPanel
