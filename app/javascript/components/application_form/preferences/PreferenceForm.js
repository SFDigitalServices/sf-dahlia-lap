import React from 'react'
import { Select } from 'react-form'
import _ from 'lodash'

import PreferenceAdditionalOptions from './PreferenceAdditionalOptions'
import { recordTypeMap, typeOfProofValues } from './values'
import { FIELD_NAME, buildFieldId } from './utils'

const findSelectedPreference = (i, formApi, listingPreferences) => {
  let selected = formApi.values.shortFormPreferences[i] || {}
  let matched = _.find(listingPreferences, pref => pref.Id == selected.listingPreferenceID)
  if (!!matched && matched.Lottery_Preference) {
    let prefName = matched.Lottery_Preference.Name
    formApi.values.shortFormPreferences[i].recordTypeDevName = recordTypeMap[prefName] || 'Custom'
  }
  return selected
}

const buildListingPreferencesOptions = (i, formApi, listingPreferences) => {
  return _.map(_.omitBy(listingPreferences, (listingPref) => {
    // omit any listingPreferences that are already selected, excluding the current one
    let isSelected = _.find(formApi.values.shortFormPreferences, { listingPreferenceID: listingPref.Id })
    return (isSelected && isSelected !== findSelectedPreference(i, formApi, listingPreferences))
  }), (listingPref) => {
    // format them into form-friendly values
    return { value: listingPref.Id, label: listingPref.Lottery_Preference.Name }
  })
}

const buildHouseholdMembersOptions = (fullHousehold) => {
  return _.map(fullHousehold, (member) => {
    return {
      value: `${member.firstName},${member.lastName},${member.DOB}`,
      label: `${member.firstName} ${member.lastName}`
    }
  })
}

const PreferenceForm = ({ i, formApi, listingPreferences, fullHousehold }) => {
  const listingPreferencesOptions = buildListingPreferencesOptions(i, formApi, listingPreferences)
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
            listingPreferenceID={findSelectedPreference(i, formApi, listingPreferences).listingPreferenceID}
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
