import React from 'react'
import { forEach, isEmpty } from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference, getFullHousehold } from './utils'

const allPreferencesSelected = (formApi, listingPreferences) => {
  if (formApi.values && !isEmpty(formApi.values.preferences) && listingPreferences) {
    return formApi.values.preferences.length === listingPreferences.length
  }
}

const hasHouseholdMembers = (formApi) => {
  let hasPrimaryApplicant = formApi.values.applicant.first_name
  let hasHouseholdMembers = formApi.values.household_members.length
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (formApi, listingPreferences) => {
  return (allPreferencesSelected(formApi, listingPreferences) || !hasHouseholdMembers(formApi))
}

class PreferencesSection extends React.Component {
  componentDidMount () {
    const { formApi, editValues } = this.props

    let autofillPreferences = []

    if (!isEmpty(editValues.preferences)) {
      forEach(editValues.preferences, (preference) => {
        if (!isEmpty(preference.application_member)) {
          let editPreference = preference
          editPreference['naturalKey'] = naturalKeyFromPreference(preference)
          autofillPreferences.push(editPreference)
        }
      })
      formApi.values.preferences = autofillPreferences
    }
  }

  render () {
    const { formApi, listingPreferences } = this.props
    const fullHousehold = getFullHousehold(formApi.values)
    const preferences = formApi.values.preferences

    return (
      <div className='border-bottom margin-bottom--2x'>
        <h3>Preferences</h3>
        {
          !isEmpty(preferences) && preferences.map((pref, i) => (
            <div className='border-bottom margin-bottom--2x' key={i}>
              <PreferenceForm {...{i, pref, formApi, listingPreferences, fullHousehold}} />
            </div>
          ))
        }

        <div className='row'>
          <div className='form-group'>
            <div className='small-4 columns'>
              <button
                onClick={() => formApi.addValue('preferences', '')}
                disabled={disableAddPreference(formApi, listingPreferences)}
                type='button'
                className='mb-4 mr-4 btn btn-success'>
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
