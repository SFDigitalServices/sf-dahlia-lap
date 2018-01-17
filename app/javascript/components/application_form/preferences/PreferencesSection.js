import React from 'react'
import _ from 'lodash'
import PreferenceForm from './PreferenceForm'

const allPreferencesSelected = (formApi, listingPreferences) => {
  if (formApi.values && formApi.values.shortFormPreferences && listingPreferences) {
    return formApi.values.shortFormPreferences.length == listingPreferences.length
  }
}

const hasHouseholdMembers = (formApi) => {
  let hasPrimaryApplicant = formApi.values.primaryApplicant && formApi.values.primaryApplicant.firstName
  let hasHouseholdMembers = formApi.values.householdMembers && formApi.values.householdMembers.length
  return (hasHouseholdMembers || hasPrimaryApplicant)
}

const disableAddPreference = (formApi, listingPreferences) => {
  return (allPreferencesSelected(formApi, listingPreferences) || !hasHouseholdMembers(formApi))
}

let fieldMapper = {
  Listing_Preference_ID: "listingPreferenceID",
  Individual_preference: "liveOrWork",
  Certificate_Number: "certificateNumber",
  Type_of_proof: "preferenceProof",
  Preference_Name: "preferenceName"
}


const PreferencesSection = ({ formApi, listingPreferences, editValues }) => {
  let autofillPreferences = []
  if (editValues && editValues.preferences && !formApi.values.shortFormPreferences) {
    _.forEach(editValues.preferences, (preference) => {
      if (preference.Application_Member) {
        let editPreference = {}
        _.forEach(preference, (value, key) => {
          editPreference[fieldMapper[key]] = value
        })
        let naturalKey = `${preference["Application_Member.First_Name"]},${preference["Application_Member.Last_Name"]},${preference["Application_Member.Date_of_Birth"]}`
        editPreference["naturalKey"] = naturalKey
        autofillPreferences.push(editPreference)
      }
    })
    formApi.values.shortFormPreferences = autofillPreferences
  }

  let { householdMembers, primaryApplicant } = formApi.values
  let fullHousehold = _.concat([primaryApplicant], householdMembers || [])
  fullHousehold = _.pickBy(fullHousehold, (m) => (
    // can only select someone for preference if they have name + DOB
    m && m.firstName && m.lastName && m.DOB
  ))
  let shortFormPrefValues = formApi.values.shortFormPreferences

  return (
    <div className="border-bottom margin-bottom--2x">
      <h3>Preferences</h3>
      { shortFormPrefValues && shortFormPrefValues.map( ( pref, i ) => (
        <div className="border-bottom margin-bottom--2x" key={i}>
          <PreferenceForm
            {...{i, formApi, listingPreferences, fullHousehold}}
          />
        </div>
      ))}
      <div className="row">
        <div className="form-group">
          <div className="small-4 columns">
            <button
              onClick={() => formApi.addValue('shortFormPreferences', '')}
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
