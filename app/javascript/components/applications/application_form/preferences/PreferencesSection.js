import React from 'react'
import { forEach, isEmpty, cloneDeep } from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference, getFullHousehold } from './utils'

const allPreferencesSelected = (form, listingPreferences) => {
  if (form.getState().values && !isEmpty(form.getState().values.preferences) && listingPreferences) {
    return form.getState().values.preferences.length === listingPreferences.length
  }
}

const hasHouseholdMembers = (form) => {
  let hasPrimaryApplicant = !isEmpty(form.getState().values) && form.getState().valid && !isEmpty(form.getState().values.applicant) && form.getState().values.applicant.first_name
  let hasHouseholdMembers = !isEmpty(form.getState().values) && !isEmpty(form.getState().values.household_members)
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (form, listingPreferences) => {
  return (allPreferencesSelected(form, listingPreferences) || !hasHouseholdMembers(form))
}

class PreferencesSection extends React.Component {
  componentDidMount () {
    const { form, editValues } = this.props

    let autofillPreferences = []

    if (!isEmpty(editValues) && editValues.preferences) {
      forEach(editValues.preferences, (preference) => {
        if (!isEmpty(preference.application_member)) {
          let editPreference = preference
          editPreference['naturalKey'] = naturalKeyFromPreference(preference)
          autofillPreferences.push(editPreference)
        }
      })
      form.change('preferences', autofillPreferences)
    }
  }

  addPreference = () => {
    const { form } = this.props
    if (form.getState().values.preferences) {
      let preferences = cloneDeep(form.getState().values.preferences)
      preferences.push('')
      form.change('preferences', preferences)
    } else {
      form.change('preferences', [''])
    }
  }

  render () {
    const { form, listingPreferences } = this.props
    const fullHousehold = getFullHousehold(form.getState().values)
    const preferences = form.getState().values.preferences

    return (
      <div className='border-bottom margin-bottom--2x'>
        <h3>Preferences</h3>
        {
          !isEmpty(preferences) && preferences.map((pref, i) => (
            <div className='border-bottom margin-bottom--2x' key={i}>
              <PreferenceForm {...{i, pref, form, listingPreferences, fullHousehold}} />
            </div>
          ))
        }

        <div className='row'>
          <div className='form-group'>
            <div className='small-4 columns'>
              <button
                onClick={this.addPreference}
                disabled={disableAddPreference(form, listingPreferences)}
                type='button'
                className='mb-4 mr-4 btn btn-success'
                id='add-preference-button'>
                  + Add Preference
              </button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default PreferencesSection
