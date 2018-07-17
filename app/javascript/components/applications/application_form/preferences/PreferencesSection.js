import React from 'react'
import { concat, pickBy, forEach } from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference } from './utils'

const allPreferencesSelected = (formApi, listingPreferences) => {
  if (formApi.values && formApi.values.preferences && listingPreferences) {
    return formApi.values.preferences.length === listingPreferences.length
  }
}

const hasHouseholdMembers = (formApi) => {
  let hasPrimaryApplicant = formApi.values.applicant && formApi.values.applicant.first_name
  let hasHouseholdMembers = formApi.values.household_members && formApi.values.household_members.length
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (formApi, listingPreferences) => {
  return (allPreferencesSelected(formApi, listingPreferences) || !hasHouseholdMembers(formApi))
}

const getFullHousehold = (application) => {
  const { household_members, applicant } = application
  const fullHousehold = concat([applicant], household_members || [])
  return  pickBy(fullHousehold, m => (
    // can only select someone for preference if they have name + DOB
    m && m.first_name && m.last_name && m.date_of_birth
  ))
}

class PreferencesSection extends React.Component {

  componentDidMount() {
    const { formApi, editValues } = this.props

    let autofillPreferences = []

    if (editValues && editValues.preferences) {
      forEach(editValues.preferences, (preference) => {
        if (preference.application_member) {
          let editPreference = preference
          editPreference["naturalKey"] = naturalKeyFromPreference(preference)
          autofillPreferences.push(editPreference)
        }
      })
      formApi.values.preferences = autofillPreferences
    }
  }

  render() {
    const { formApi, listingPreferences } = this.props
    const fullHousehold = getFullHousehold(formApi.values)
    const preferences = formApi.values.preferences

    return (
      <div className="border-bottom margin-bottom--2x">
        <h3>Preferences</h3>
        {
          preferences && preferences.map(( pref, i ) => (
            <div className="border-bottom margin-bottom--2x" key={i}>
              <PreferenceForm {...{i, formApi, listingPreferences, fullHousehold}} />
            </div>
          ))
        }
        <div className="row">
          <div className="form-group">
            <div className="small-4 columns">
              <button
                onClick={() => formApi.addValue('preferences', '')}
                disabled={ disableAddPreference(formApi, listingPreferences) }
                type="button"
                className="mb-4 mr-4 btn btn-success">
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
