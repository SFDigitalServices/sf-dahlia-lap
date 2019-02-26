import React from 'react'
import { Select } from 'react-form'

import formUtils from '~/utils/formUtils'
import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment, SelectStatus } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId } from '~/components/applications/application_form/preferences/utils'

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

  updatePrefProofOptions = (individualPrefName) => {
    this.setState(prevState => {
      return {
        prefProofTypeOptions: getLWPrefProofTypeOptions(individualPrefName)
      }
    })
    // Reset the preference proof if the individual preference updates
    this.props.formApi.setValue(`preferences[${this.props.preferenceIndex}].lw_type_of_proof`, null)
    // Type of proof needs to be null if lw_type_of_proof is null, otherwise it will overwrite the value.
    this.props.formApi.setValue(`preferences[${this.props.preferenceIndex}].type_of_proof`, null)
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
          <FormItem label='Individual Preference Name'>
            <Select
              field={buildFieldId(preferenceIndex, 'individual_preference')}
              options={individualPreferenceOptions}
              className='individual-preference-select'
              onChange={this.updatePrefProofOptions} />
          </FormItem>
          <FormItem label='HH Member on Proof'>
            <Select field={buildFieldId(preferenceIndex, 'application_member_id')} options={applicationMembersOptions} placeholder='Select One' />
          </FormItem>
          <FormItem label='Type of Proof'>
            <Select
              field={buildFieldId(preferenceIndex, 'lw_type_of_proof')}
              options={this.state.prefProofTypeOptions}
              className='type-of-proof-select' />
          </FormItem>
        </FormGrid.Row>
        <FormGrid.Row expand={false}>
          <FormItem label='Status'>
            <SelectStatus
              preferenceIndex={preferenceIndex}
              className={'preference-status-select'} />
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
