import React from 'react'
import { Select, Text } from 'react-form'

import formUtils from '~/utils/formUtils'
import FormGrid from '~/components/molecules/FormGrid'
import { FormItem, Comment } from './utils'
import formOptions from '~/components/applications/application_form/formOptions'
import { buildFieldId, memberNameFromPref } from '~/components/applications/application_form/preferences/utils'

const {
  preference_proof_options_default,
  preference_proof_options_work_in_sf
} = formOptions

const individualPreferenceOptions = formUtils.toOptions(['Live in SF', 'Work in SF'])

const getLWPrefProofTypeOptions = (individualPrefName) => {
  if (individualPrefName === 'Live in SF') {
    return preference_proof_options_default
  } else {
    return preference_proof_options_work_in_sf
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
  }

  render () {
    const { preferenceIndex, preference } = this.props

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
            {/*
            TODO: Add ability for users to change application member on pref.
            For now, we just show the current app member in a read-only field.
          */}
            <input value={memberNameFromPref(preference)} disabled='true' />
          </FormItem>
          <FormItem label='Type of Proof'>
            <Select field={buildFieldId(preferenceIndex, 'type_of_proof')} options={this.state.prefProofTypeOptions} />
          </FormItem>
        </FormGrid.Row>
        <FormGrid.Row expand={false}>
          <FormItem label='Status'>
            {/*
            TODO: Add ability for users to change status on pref.
            For now, we just show the current status in a read-only field.
          */}
            <Text field={buildFieldId(preferenceIndex, 'post_lottery_validation')} disabled='true' />
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
