import React from 'react'
import { SelectField } from 'utils/form/final_form/Field'
import { find, map, omitBy, sortBy, cloneDeep } from 'lodash'
import Row from 'components/atoms/Row'
import Column from 'components/atoms/Column'
import FormGroup from 'components/atoms/FormGroup'

import PreferenceAdditionalOptions from './PreferenceAdditionalOptions'
import { recordTypeMap } from './values'
import { FIELD_NAME, buildHouseholdMembersOptions } from './utils'

const buildListingPreferencesOptions = (form, listingPreferences, selectedId) => {
  // Exclude preferences that are already present in application elsewhere
  // The currently selected preference is a valid option
  const preferenceOptions = omitBy(listingPreferences, (listingPref) => {
    const isSelected = find(form.getState().values.preferences, {
      listing_preference_id: listingPref.id
    })
    return isSelected && isSelected.listing_preference_id !== selectedId
  })

  const listingPrefOptions = map(preferenceOptions, (listingPref) => {
    return {
      value: listingPref.id,
      label: listingPref.lottery_preference.name,
      order: listingPref.order
    }
  })
  return sortBy(listingPrefOptions, (opt) => opt.order)
}

const removePreference = (form, i) => {
  const preferences = cloneDeep(form.getState().values[FIELD_NAME])
  preferences.splice(i, 1)
  form.change(FIELD_NAME, preferences)
}

const clearPreference = (form, i, target) => {
  // If user switches to "Select One..." empty the preference state
  if (target === '') {
    form.change(`preferences[${i}]`, {})
  } else {
    // Reset the form state for preference additional options
    // if they've been touched so they don't show errors
    for (const field in form.getState().touched) {
      if (field.startsWith(`preferences.${i}`)) {
        form.resetFieldState(field)
      }
    }
    // Keep the new listing preference id, but clear all other state.
    form.change(`preferences[${i}]`, { listing_preference_id: target })
  }
}

const PreferenceForm = ({ i, name, form, listingPreferences, fullHousehold }) => {
  const selectedId = (form.getState().values.preferences[i] || {}).listing_preference_id
  const selectedPreference = find(listingPreferences, (pref) => pref.id === selectedId)
  const listingPreferencesOptions = buildListingPreferencesOptions(
    form,
    listingPreferences,
    selectedId
  )

  // Set the hidden recordType DeveloperName value
  if (!!selectedPreference && selectedPreference.lottery_preference) {
    const prefName = selectedPreference.lottery_preference.name
    form.change(`preferences[${i}].recordtype_developername`, recordTypeMap[prefName] || 'Custom')
  }
  const householdMembersOptions = buildHouseholdMembersOptions(fullHousehold)

  return (
    <FormGroup>
      <Row>
        <Column span={6}>
          <label>Preference</label>
          <SelectField
            fieldName={`${name}.listing_preference_id`}
            options={listingPreferencesOptions}
            id={`select-paper-preference-${i}`}
            onChange={(event) => clearPreference(form, i, event.target.value)}
          />
        </Column>
        <PreferenceAdditionalOptions
          i={i}
          form={form}
          listingPreference={selectedPreference}
          householdMembers={householdMembersOptions}
        />
      </Row>
      <Row>
        <Column span={4}>
          <button
            onClick={() => removePreference(form, i)}
            type='button'
            className='mb-4 btn btn-danger'
          >
            Remove
          </button>
        </Column>
      </Row>
    </FormGroup>
  )
}

export default PreferenceForm
