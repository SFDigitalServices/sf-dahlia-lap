import React from 'react'
import { Select } from 'react-form'
import { find, map, omitBy } from 'lodash'

import PreferenceAdditionalOptions from './PreferenceAdditionalOptions'
import { recordTypeMap, typeOfProofValues } from './values'
import { FIELD_NAME, buildFieldId } from './utils'


const setRecordTypeDevName = (i, formApi, matched) => {
  console.log('setRecordTypeDevName...')
  if (!!matched && matched.Lottery_Preference) {
    let prefName = matched.Lottery_Preference.Name
    console.log('setRecordTypeDevName:' + recordTypeMap[prefName])
    formApi.values.shortFormPreferences[i].recordTypeDevName = recordTypeMap[prefName] || 'Custom'
  }
}

const findSelectedPreference = (i, formApi, listingPreferences, selectedPreference) => {
  let selected = formApi.values.shortFormPreferences[i] || {}
  console.log(selected)
  let matched = find(listingPreferences, pref => pref.Id == selected.listingPreferenceID)
  setRecordTypeDevName(i, formApi, matched)
  return selected
}

// omit any listingPreferences that are already selected, excluding the current one
const findPreferencesNotSelected = (formApi, listingPreferences, selectedPreference) => {
  return omitBy(listingPreferences, (listingPref) => {
    let isSelected = find(formApi.values.shortFormPreferences, { listingPreferenceID: listingPref.Id })
    return (isSelected && isSelected !== selectedPreference)
  })
}

const buildListingPreferencesOptions = (preferencesNotSelected) => {
  return map(preferencesNotSelected, (listingPref) => {
    return {
      value: listingPref.Id,
      label: listingPref.Lottery_Preference.Name
    }
  })
}

const buildHouseholdMembersOptions = (fullHousehold) => {
  return map(fullHousehold, (member) => {
    return {
      value: `${member.firstName},${member.lastName},${member.DOB}`,
      label: `${member.firstName} ${member.lastName}`
    }
  })
}

const PreferenceForm = ({ i, formApi, listingPreferences, fullHousehold }) => {
  const selectedPreference = findSelectedPreference(i, formApi, listingPreferences)
  const preferencesNotSelected = findPreferencesNotSelected(formApi, listingPreferences, selectedPreference)

  const listingPreferencesOptions = buildListingPreferencesOptions(preferencesNotSelected)
  const householdMembersOptions = buildHouseholdMembersOptions(fullHousehold)

  return (
    <div>
      <div className="row">
        <div className="form-group">
          <div className='row'>
            <div className="small-6 columns">
              <label>Preference</label>
              <Select
                field={buildFieldId(i, 'listingPreferenceID')}
                options={listingPreferencesOptions}
                value={buildFieldId(i,'listingPreferenceID')}
              />
            </div>
            <div className="small-offset-6 columns"/>
          </div>

          <PreferenceAdditionalOptions
            i={i}
            listingPreferenceID={selectedPreference.listingPreferenceID}
            listingPreferences={listingPreferences}
            householdMembers={householdMembersOptions} />

          <div className="row">
            <div className="small-4 columns">
              <button
                onClick={() => formApi.removeValue(FIELD_NAME, i)}
                type="button"
                className="mb-4 btn btn-danger">
                  Remove
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PreferenceForm
