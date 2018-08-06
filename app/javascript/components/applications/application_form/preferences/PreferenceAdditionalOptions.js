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
  const preference = find(listingPreferences, { id: listingPreferenceID })
  const propsFields = {i, householdMembers}
  
  if (preference) {
    switch (preference.lottery_preference.name) {
      case 'Certificate of Preference (COP)':
        return <CertOfPreferenceFields {...propsFields} />
      case 'Neighborhood Resident Housing Preference (NRHP)':
        return <NeighborhoodResidentFields {...propsFields} />
      case 'Displaced Tenant Housing Preference (DTHP)':
        return <DisplacedFields {...propsFields} />
      case 'Live or Work in San Francisco Preference':
        return <LiveWorkFields {...propsFields} />
      case 'Anti-Displacement Housing Preference (ADHP)':
        return <AntiDisplacementFields {...propsFields} />
      case 'Rent Burdened / Assisted Housing Preference':
        return <RentBurdenedAssistedHousingFields {...propsFields} />
      case 'Alice Griffith Housing Development Resident':
        return <AliceGriffithFields {...propsFields} />
      default:
        return <DefaultPreferenceFields {...propsFields}  />
    }
  } else {
    return null
  }
}

export default PreferenceAdditionalOptions
