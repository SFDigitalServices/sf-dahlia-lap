import React from 'react'
import { Select } from 'react-form'
import _ from 'lodash'
import CertOfPreferenceFields from './CertOfPreferenceFields'
import DisplacedFields from './DisplacedFields'
import AntiDisplacementFields from './AntiDisplacementFields'
import NeighborhoodResidentFields from './NeighborhoodResidentFields'
import LiveWorkFields from './LiveWorkFields'
import RentBurdenedAssistedHousingFields from './RentBurdenedAssistedHousingFields'
import DefaultPreferenceFields from './DefaultPreferenceFields'
import { naturalKeyFromMember } from './utils'

let recordTypeMap = {
  'Certificate of Preference (COP)': 'COP',
  'Displaced Tenant Housing Preference (DTHP)': 'DTHP',
  'Live or Work in San Francisco Preference': 'L_W',
  'Neighborhood Resident Housing Preference (NRHP)': 'NRHP',
  "Rent Burdened / Assisted Housing Preference": 'RB_AHP',
  "Anti-Displacement Housing Preference (ADHP)": 'ADHP'
}

const PreferenceForm = ({ i, formApi, listingPreferences, fullHousehold }) => {
  const selectedPreference = () => {
    let selectedPreference = formApi.values.shortFormPreferences[i] || {}
    let matchedPreference = _.find(listingPreferences, (pref) => {
      return pref.id === selectedPreference.listingPreferenceID
    })
    if (!!matchedPreference && matchedPreference.lottery_preference) {
      let prefName = matchedPreference.lottery_preference.name
      formApi.values.shortFormPreferences[i].recordTypeDevName = recordTypeMap[prefName] || 'Custom'
    }
    return selectedPreference
  }
  const listingPreferencesOptions = _.map(_.omitBy(listingPreferences, (listingPref) => {
    // omit any listingPreferences that are already selected, excluding the current one
    let isSelected = _.find(formApi.values.shortFormPreferences, { listingPreferenceID: listingPref.id })
    return (isSelected && isSelected !== selectedPreference())
  }), (listingPref) => {
    // format them into form-friendly values
    return { value: listingPref.id, label: listingPref.lottery_preference.name }
  })
  const householdMembers = _.map(fullHousehold, (member) => {
    let natKey = naturalKeyFromMember(member)
    return { value: natKey, label: `${member.firstName} ${member.lastName}` }
  })

  const preferenceAdditionalOptions = () => {
    let formValue = selectedPreference()
    let preference = _.find(listingPreferences, { id: formValue.listingPreferenceID })
    if (preference) {
      switch (preference.lottery_preference.name) {
        case 'Certificate of Preference (COP)':
          return <CertOfPreferenceFields {...{i, householdMembers}} />
        case 'Neighborhood Resident Housing Preference (NRHP)':
          return <NeighborhoodResidentFields {...{i, householdMembers}} />
        case 'Displaced Tenant Housing Preference (DTHP)':
          return <DisplacedFields {...{i, householdMembers}} />
        case 'Live or Work in San Francisco Preference':
          return <LiveWorkFields {...{i, householdMembers}} />
        case 'Anti-Displacement Housing Preference (ADHP)':
          return <AntiDisplacementFields {...{i, householdMembers}} />
        case 'Rent Burdened / Assisted Housing Preference':
          return <RentBurdenedAssistedHousingFields {...{i, householdMembers}} />
        default:
          return <DefaultPreferenceFields {...{i, householdMembers}}  />
      }
    }
  }

  return (
    <div>
      <div className="row">
        <div className="form-group">
          <div className="small-6 columns">
            <label>Preference</label>
            <Select
              field={`shortFormPreferences.${i}.listingPreferenceID`}
              options={listingPreferencesOptions}
              value={`shortFormPreferences.${i}.listingPreferenceID`}
            />
          </div>

          {preferenceAdditionalOptions()}

        </div>
      </div>

      <div className="row">
        <div className="form-group">
          <div className="small-4 columns">
            <button
              onClick={() => formApi.removeValue("shortFormPreferences", i)}
              type="button"
              className="mb-4 btn btn-danger">
                Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferenceForm
