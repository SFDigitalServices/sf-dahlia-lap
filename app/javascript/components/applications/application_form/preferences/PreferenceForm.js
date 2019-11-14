import React from 'react'
import { SelectField } from '~/utils/form/final_form/Field'
import { find, map, omitBy, sortBy, cloneDeep } from 'lodash'
import Row from '~/components/atoms/Row'
import Column from '~/components/atoms/Column'
import FormGroup from '~/components/atoms/FormGroup'

import PreferenceAdditionalOptions from './PreferenceAdditionalOptions'
import { recordTypeMap } from './values'
import { FIELD_NAME, buildHouseholdMembersOptions } from './utils'

const setRecordTypeDevName = (i, form, matched) => {
  if (!!matched && matched.lottery_preference) {
    const prefName = matched.lottery_preference.name
    form.getState().values.preferences[i].recordtype_developername = recordTypeMap[prefName] || 'Custom'
  }
}

const findSelectedPreference = (i, form, listingPreferences) => {
  let selected = form.getState().values.preferences[i] || {}
  let matched = find(listingPreferences, pref => pref.id === selected.listing_preference_id)
  setRecordTypeDevName(i, form, matched)
  return selected
}

// omit any listingPreferences that are already selected, excluding the current one
const findPreferencesNotSelected = (form, listingPreferences, selectedPreference) => {
  return omitBy(listingPreferences, (listingPref) => {
    let isSelected = find(form.getState().values.preferences, { listing_preference_id: listingPref.id })
    return (isSelected && isSelected !== selectedPreference)
  })
}

const buildListingPreferencesOptions = (preferencesNotSelected) => {
  const listingPrefOptions = map(preferencesNotSelected, (listingPref) => {
    return {
      value: listingPref.id,
      label: listingPref.lottery_preference.name,
      order: listingPref.order
    }
  })
  return sortBy(listingPrefOptions, opt => opt.order)
}

const removePreference = (form, i) => {
  let preferences = cloneDeep(form.getState().values[FIELD_NAME])
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
    for (const field in form.getState().dirtyFields) {
      if (field.startsWith('preference')) {
        form.resetFieldState(field)
      }
    }
    // Keep the new listing preference id, but clear all other state.
    form.change(`preferences[${i}]`, {'listing_preference_id': target})
  }
}

const PreferenceForm = ({ i, name, form, listingPreferences, fullHousehold }) => {
  const selectedPreference = findSelectedPreference(i, form, listingPreferences)
  const preferencesNotSelected = findPreferencesNotSelected(form, listingPreferences, selectedPreference)
  const listingPreferencesOptions = buildListingPreferencesOptions(preferencesNotSelected)
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
          listingPreferenceID={selectedPreference.listing_preference_id}
          listingPreferences={listingPreferences}
          individualPreference={selectedPreference.individual_preference}
          householdMembers={householdMembersOptions}
        />
      </Row>
      <Row>
        <Column span={4}>
          <button
            onClick={() => removePreference(form, i)}
            type='button'
            className='mb-4 btn btn-danger'>
              Remove
          </button>
        </Column>
      </Row>
    </FormGroup>
  )
}

export default PreferenceForm
