import React from 'react'
import { SelectField } from '~/utils/form/final_form/Field.js'

import formUtils from '~/utils/formUtils'
import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'
import { statusOptions } from '~/components/supplemental_application/sections/preferences/utils'
const { labelize } = formOptions

const {
  preferenceProofOptionsLiveSf,
  preferenceProofOptionsWorkInSf
} = formOptions

const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

const getLWPrefProofTypeOptions = (individualPrefName) => {
  if (individualPrefName === 'Live in SF') {
    return preferenceProofOptionsLiveSf
  } else {
    return preferenceProofOptionsWorkInSf
  }
}

class LiveOrWorkInSanFranciscoPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      prefProofTypeOptions: getLWPrefProofTypeOptions(this.props.preference.individual_preference)
    }
  }

  updatePrefProofOptions = (event) => {
    event.persist()
    this.setState(prevState => {
      return {
        prefProofTypeOptions: getLWPrefProofTypeOptions(event.target.value)
      }
    })
    // Reset the preference proof if the individual preference updates
    this.props.form.change(`preferences[${this.props.preferenceIndex}].lw_type_of_proof`, null)
    // Type of proof needs to be null if lw_type_of_proof is null, otherwise it will overwrite the value.
    this.props.form.change(`preferences[${this.props.preferenceIndex}].type_of_proof`, null)
  }

  render () {
    const { preferenceIndex, applicationMembersOptions } = this.props

    return (
      <React.Fragment>
        <FormGrid.Row expand={false}>
          <FormItem label='Preference Name'>
            <div className='text-value'>
            Live or Work in San Francisco Preference
            </div>
          </FormItem>
          <FormItem>
            <SelectField
              fieldName={buildFieldId(preferenceIndex, 'individual_preference')}
              options={labelize(individualPreferenceOptions, {disableEmpty: true})}
              label='Individual Preference Name'
              className='individual-preference-select'
              onChange={this.updatePrefProofOptions} />
          </FormItem>
          <FormItem>
            <SelectField
              fieldName={buildFieldId(preferenceIndex, 'application_member_id')}
              options={labelize(applicationMembersOptions, {disableEmpty: true})}
              label='HH Member on Proof' />
          </FormItem>
          <FormItem>
            <SelectField
              fieldName={buildFieldId(preferenceIndex, 'lw_type_of_proof')}
              options={this.state.prefProofTypeOptions}
              label='Type of Proof'
              className='type-of-proof-select' />
          </FormItem>
        </FormGrid.Row>
        <FormGrid.Row expand={false}>
          <FormItem>
            <SelectField
              fieldName={buildFieldId(preferenceIndex, 'post_lottery_validation')}
              options={labelize(statusOptions, {disableEmpty: true})}
              label='Status'
              className='preference-status-select' />
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
      </React.Fragment>)
  }
}

export default LiveOrWorkInSanFranciscoPanel
