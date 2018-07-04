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
  let preference = find(listingPreferences, { id: listingPreferenceID })

  const fieldProps = {i, householdMembers}

  if (preference) {
    switch (preference.lottery_preference.name) {
      case 'Certificate of Preference (COP)':
        return <CertOfPreferenceFields {...fieldProps} />
      case 'Neighborhood Resident Housing Preference (NRHP)':
        return <NeighborhoodResidentFields {...fieldProps} />
      case 'Displaced Tenant Housing Preference (DTHP)':
        return <DisplacedFields {...fieldProps} />
      case 'Live or Work in San Francisco Preference':
        return <LiveWorkFields {...fieldProps} />
      case 'Anti-Displacement Housing Preference (ADHP)':
        return <AntiDisplacementFields {...fieldProps} />
      case 'Rent Burdened / Assisted Housing Preference':
        return <RentBurdenedAssistedHousingFields {...fieldProps} />
      case 'Alice Griffith Housing Development Resident':
        return <AliceGriffithFields {...fieldProps} />
      default:
        return <DefaultPreferenceFields {...fieldProps} />
    }
  } else {
    return null
  }
}

export default PreferenceAdditionalOptions
