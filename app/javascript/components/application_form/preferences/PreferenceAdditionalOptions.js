import React from 'react'
import { find } from 'lodash'

import CertOfPreferenceFields from './CertOfPreferenceFields'
import DisplacedFields from './DisplacedFields'
import AntiDisplacementFields from './AntiDisplacementFields'
import NeighborhoodResidentFields from './NeighborhoodResidentFields'
import LiveWorkFields from './LiveWorkFields'
import RentBurdenedAssistedHousingFields from './RentBurdenedAssistedHousingFields'
import DefaultPreferenceFields from './DefaultPreferenceFields'
import AliceGriffithFields from './AliceGriffithFields'

const PreferenceAdditionalOptions = ({i, householdMembers, listingPreferences, listingPreferenceID }) => {
  let preference = find(listingPreferences, { Id: listingPreferenceID })

  if (preference) {
    switch (preference.Lottery_Preference.Name) {
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
      case 'Alice Griffith Housing Development Resident':
        return <AliceGriffithFields {...{i, householdMembers}} />
      default:
        return <DefaultPreferenceFields {...{i, householdMembers}}  />
    }
  } else {
    return null
  }
}

export default PreferenceAdditionalOptions
