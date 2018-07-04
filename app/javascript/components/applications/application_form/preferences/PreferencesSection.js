import React from 'react'
import { concat, pickBy, forEach, filter} from 'lodash'
import PreferenceForm from './PreferenceForm'
import { naturalKeyFromPreference } from './utils'

// import domainToApi from '~/components/mappers/domainToApi'

const allPreferencesSelected = (formApi, listingPreferences) => {
  if (formApi.values && formApi.values.lottery_preference && listingPreferences) {
    return formApi.values.lottery_preference.length === listingPreferences.length
  }
}

const hasHouseholdMembers = (formApi) => {
  let hasPrimaryApplicant = formApi.values.applicant && formApi.values.applicant.first_name
  let hasHouseholdMembers = formApi.values.household_members && formApi.values.household_members.length
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (formApi, listingPreferences) => {
  const a = (allPreferencesSelected(formApi, listingPreferences) || !hasHouseholdMembers(formApi))

  // console.log('disabled', a)
  return a
}

const getFullHousehold = (application) => {
  const { household_members, applicant } = application
  const fullHousehold = concat([applicant], household_members || [])
  return  pickBy(fullHousehold, m => (
    // can only select someone for preference if they have name + DOB
    m && m.first_name && m.last_name && m.date_of_birth
  ))
}

const PreferencesSection = ({ formApi, listingPreferences, editValues }) => {
  console.log('listingPreferences', listingPreferences)
  // let autofillPreferences = []
  // if (editValues && editValues.preferences && !formApi.values.shortFormPreferences) {
  //   forEach(editValues.preferences, (preference) => {
  //     if (preference.application_member) {
  //       let editPreference = domainToApi.mapPreference(preference)
  //       editPreference["naturalKey"] = naturalKeyFromPreference(preference)
  //       autofillPreferences.push(editPreference)
  //     }
  //   })
  //
  //   formApi.values.shortFormPreferences = autofillPreferences
  // }
  // console.log('formApi.values.preferences',formApi.values.preferences)
  // console.log('editValues.preferencess', editValues.preferences)
  let autofillPreferences = []
  forEach(editValues.preferences, (preference) => {
    if (preference.application_member) {
      // let editPreference = domainToApi.mapPreference(preference)
      let editPreference = preference
      // console.log('preference', preference)
      editPreference["naturalKey"] = naturalKeyFromPreference(preference)
      autofillPreferences.push(editPreference)
    }
  })
  formApi.values.preferences = autofillPreferences


  const fullHousehold = getFullHousehold(formApi.values)
  // const preferences = filter(formApi.values.preferences, (pref)=> (
  //   pref.receives_preference || pref === ''
  // ))
  const preferences = autofillPreferences

  // console.log(formApi.values.preferences)
  // console.log('preferences',preferences)

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

export default PreferencesSection
